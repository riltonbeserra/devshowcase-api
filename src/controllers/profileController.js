import { Profile, Project } from '../models/index.js';

export const createProfile = async (req, res) => {
  try {
    const { name, email, bio } = req.body;

    // Validação manual simples (DTO/Input)
    if (!name || !email) {
      return res.status(400).json({ 
        error: 'Os campos "name" e "email" são obrigatórios.' 
      });
    }

    const existingEmail = await Profile.findOne({ where: { email } });
    if (existingEmail) {
      return res.status(400).json({ 
        error: 'Este e-mail já está cadastrado.' 
      });
    }

    const profile = await Profile.create({ name, email, bio });
    return res.status(201).json(profile);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

export const getProfileById = async (req, res) => {
  try {
    const { id } = req.params;

    const profile = await Profile.findByPk(id, {
      include: [{ model: Project, as: 'projects' }]
    });

    if (!profile) {
      return res.status(404).json({ error: 'Perfil não encontrado.' });
    }

    return res.status(200).json(profile);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};
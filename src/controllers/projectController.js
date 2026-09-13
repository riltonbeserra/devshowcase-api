import { Project, Profile, Technology, Feedback } from '../models/index.js';

export const createProject = async (req, res) => {
  try {
    const { title, description, repoUrl, profileId, technologyIds } = req.body;

    if (!title || !description || !repoUrl || !profileId) {
      return res.status(400).json({
        error: 'Campos obrigatórios: title, description, repoUrl e profileId.'
      });
    }

    // Verifica se o perfil informado existe
    const profile = await Profile.findByPk(profileId);
    if (!profile) {
      return res.status(400).json({ error: 'profileId informado não existe.' });
    }

    const project = await Project.create({
      title,
      description,
      repoUrl,
      profileId
    });

    // Se foram enviadas tecnologias, faz o vínculo N:N na tabela associativa
    if (technologyIds && Array.isArray(technologyIds) && technologyIds.length > 0) {
      await project.setTechnologies(technologyIds);
    }

    // Retorna o projeto já com as tecnologias vinculadas
    const createdProject = await Project.findByPk(project.id, {
      include: [{ model: Technology, as: 'technologies', through: { attributes: [] } }]
    });

    return res.status(201).json(createdProject);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

export const listProjects = async (req, res) => {
  try {
    const projects = await Project.findAll({
      include: [
        { model: Profile, as: 'profile', attributes: ['id', 'name', 'email'] },
        { model: Technology, as: 'technologies', through: { attributes: [] } },
        { model: Feedback, as: 'feedbacks' }
      ]
    });
    return res.status(200).json(projects);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};
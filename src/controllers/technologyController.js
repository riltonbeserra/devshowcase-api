import { Technology } from '../models/index.js';

export const createTechnology = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || name.trim() === '') {
      return res.status(400).json({ 
        error: 'O campo "name" é obrigatório.' 
      });
    }

    const existingTech = await Technology.findOne({ where: { name } });
    if (existingTech) {
      return res.status(400).json({ 
        error: 'Essa tecnologia já está cadastrada.' 
      });
    }

    const technology = await Technology.create({ name });
    return res.status(201).json(technology);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

export const listTechnologies = async (req, res) => {
  try {
    const technologies = await Technology.findAll();
    return res.status(200).json(technologies);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};
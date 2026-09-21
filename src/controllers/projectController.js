import { Op } from 'sequelize';
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
    const { page = 1, limit = 10, technology } = req.query;

    const pageNumber = Math.max(1, parseInt(page, 10));
    const pageSize = Math.max(1, parseInt(limit, 10));
    const offset = (pageNumber - 1) * pageSize;

    // Condição para filtrar por tecnologia caso seja enviada na query
    const technologyWhere = technology
      ? { name: { [Op.like]: `%${technology}%` } }
      : undefined;

    const { count, rows: projects } = await Project.findAndCountAll({
      distinct: true,
      limit: pageSize,
      offset: offset,
      include: [
        { model: Profile, as: 'profile', attributes: ['id', 'name', 'email'] },
        {
          model: Technology,
          as: 'technologies',
          through: { attributes: [] },
          where: technologyWhere,
          required: !!technology
        },
        { model: Feedback, as: 'feedbacks' }
      ]
    });

    return res.status(200).json({
      totalItems: count,
      totalPages: Math.ceil(count / pageSize),
      currentPage: pageNumber,
      projects
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

export const upvoteProject = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await Project.findByPk(id);
    if (!project) {
      return res.status(404).json({ error: 'Projeto não encontrado.' });
    }

    project.upvotes += 1;
    await project.save();

    return res.status(200).json({
      message: 'Upvote registado com sucesso!',
      upvotes: project.upvotes
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

export const addFeedback = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { comment, rating } = req.body;

    // 1. Procura se o projeto existe
    const project = await Project.findByPk(id);
    if (!project) {
      return res.status(404).json({ error: 'Projeto não encontrado.' });
    }

    // 2. Validação simples de entrada
    if (rating === undefined || rating === null) {
      return res.status(400).json({ error: 'O campo "rating" é obrigatório.' });
    }

    // 3. Cria o feedback diretamente pelo modelo Feedback
    // Verifique se a sua chave estrangeira é projectId ou ProjectId; 
    // passando ambas garante compatibilidade imediata com o seu schema
    await Feedback.create({
      comment,
      rating,
      projectId: id,
      ProjectId: id
    });

    // 4. Procura todos os feedbacks deste projeto para calcular a média
    const feedbacks = await Feedback.findAll({
      where: {
        [Op.or]: [
          { projectId: id },
          { ProjectId: id }
        ]
      }
    });

    const sumRatings = feedbacks.reduce((acc, curr) => acc + curr.rating, 0);
    const average = feedbacks.length > 0 ? sumRatings / feedbacks.length : 0;

    // 5. Atualiza a média no projeto
    project.averageRating = parseFloat(average.toFixed(1));
    await project.save();

    return res.status(201).json({
      message: 'Feedback adicionado com sucesso!',
      averageRating: project.averageRating,
      totalFeedbacks: feedbacks.length
    });
  } catch (error) {
    // Encaminha para o middleware global de erros se for erro de validação do Sequelize
    return next(error);
  }
};
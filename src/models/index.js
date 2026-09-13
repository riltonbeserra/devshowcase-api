import { sequelize } from '../config/database.js';
import { Profile } from './Profile.js';
import { Project } from './Project.js';
import { Technology } from './Technology.js';
import { Feedback } from './Feedback.js';

// 1. Profile 1 : N Project
Profile.hasMany(Project, { foreignKey: 'profileId', as: 'projects' });
Project.belongsTo(Profile, { foreignKey: 'profileId', as: 'profile' });

// 2. Project N : N Technology (cria a tabela associativa ProjectTechnologies)
Project.belongsToMany(Technology, { through: 'ProjectTechnologies', as: 'technologies', foreignKey: 'projectId' });
Technology.belongsToMany(Project, { through: 'ProjectTechnologies', as: 'projects', foreignKey: 'technologyId' });

// 3. Project 1 : N Feedback
Project.hasMany(Feedback, { foreignKey: 'projectId', as: 'feedbacks' });
Feedback.belongsTo(Project, { foreignKey: 'projectId', as: 'project' });

export { sequelize, Profile, Project, Technology, Feedback };
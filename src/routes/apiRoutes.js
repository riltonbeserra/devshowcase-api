import { Router } from 'express';
import { createProfile, getProfileById } from '../controllers/profileController.js';
import { createTechnology, listTechnologies } from '../controllers/technologyController.js';
import { 
  createProject, 
  listProjects, 
  upvoteProject, 
  addFeedback 
} from '../controllers/projectController.js';

const router = Router();

// Endpoints de Profile
router.post('/profiles', createProfile);
router.get('/profiles/:id', getProfileById);

// Endpoints de Technology
router.post('/technologies', createTechnology);
router.get('/technologies', listTechnologies);

// Endpoints de Project
router.post('/projects', createProject);
router.get('/projects', listProjects);
router.put('/projects/:id/upvote', upvoteProject);
router.post('/projects/:id/feedbacks', addFeedback);

export default router;
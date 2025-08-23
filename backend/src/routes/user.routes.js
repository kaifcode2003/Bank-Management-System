import { Router } from 'express';
import { authRequired } from '../middleware/auth.js';
import { requireRole } from '../middleware/requireRole.js';
import { listUsers } from '../controllers/user.controller.js';

const router = Router();

router.get('/', authRequired, requireRole('admin'), listUsers);

export default router;
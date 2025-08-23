import { Router } from 'express';
import { body } from 'express-validator';
import { login, register } from '../controllers/auth.controller.js';
import { validate } from '../validation/validate.js';

const router = Router();

router.post(
	'/register',
	[
		body('name').isString().isLength({ min: 2 }),
		body('email').isEmail(),
		body('phone').isString().isLength({ min: 8 }),
		body('password').isStrongPassword({ minLength: 8, minUppercase: 1, minNumbers: 1, minSymbols: 1 }),
	],
	validate,
	register
);

router.post(
	'/login',
	[body('email').isEmail(), body('password').isString().isLength({ min: 8 })],
	validate,
	login
);

export default router;
import { Router, Response, Request } from 'express';
import { UserService } from '../services/userService';
import { authenticate, AuthRequest } from '../middleware/auth';
import { body, validationResult } from 'express-validator';

const router = Router();
const userService = new UserService();

router.post(
  '/register',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 8 }),
    body('firstName').trim().notEmpty(),
    body('lastName').trim().notEmpty(),
    body('role').isIn(['user', 'customer', 'merchant', 'salesperson', 'fundraiser']),
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const user = await userService.createUser(req.body);
      res.status(201).json({ user: { ...user, passwordHash: undefined } });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
);

router.post(
  '/login',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty(),
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { user, token } = await userService.login(req.body);
      res.json({
        user: { ...user, passwordHash: undefined },
        token,
      });
    } catch (error: any) {
      res.status(401).json({ error: error.message });
    }
  }
);

router.get('/me', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const user = await userService.getUserById(req.user!.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ user: { ...user, passwordHash: undefined } });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;


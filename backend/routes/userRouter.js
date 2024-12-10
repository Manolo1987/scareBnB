// userRouter.js
import express from 'express';
import * as user from '../controllers/userController.js';
import { authenticateToken, authorizeRoles } from '../middleware/jwt.js';

const userRouter = express.Router();

userRouter.post('/register', user.register);
userRouter.post('/login', user.login);
userRouter.post('/logout', user.logout);
userRouter.get('/myProfile', authenticateToken, user.getUser);
userRouter.get(
  '/allUsers',
  authenticateToken,
  authorizeRoles('admin'),
  user.getAllUsers
);
userRouter.put('/updateProfile', authenticateToken, user.updateUser);
userRouter.delete('/deleteProfile', authenticateToken, user.deleteUser);

export default userRouter;

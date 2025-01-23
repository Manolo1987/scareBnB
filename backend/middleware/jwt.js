import jwt from 'jsonwebtoken';

export const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '5h',
  });
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    console.error('JWT Verification Error:', error.message);
    throw new Error('Invalid token');
  }
};

export const authenticateToken = async (req, res, next) => {
  try {
    const token = req.cookies?.jwt;

    if (!token) {
      return res.status(401).json({ msg: 'not authorized' });
    }

    const decoded = verifyToken(token);

    req.userId = decoded.userId;
    req.roles = decoded.roles || [];

    next();
  } catch (error) {
    console.error(error);
    res.status(403).json({ msg: 'authentication failed' });
  }
};

export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      const userRoles = Array.isArray(req.roles) ? req.roles : [req.roles];
      // console.log('User Roles:', userRoles);
      // console.log('Allowed Roles:', allowedRoles);

      // check if role is included
      const hasPermission = userRoles.some((role) =>
        allowedRoles.includes(role)
      );
      // console.log('Has permission:', hasPermission);
      if (!hasPermission) {
        return res
          .status(403)
          .json({ msg: 'Access Denied: Insufficient Permissions' });
      }

      next(); // Grant Access
    } catch (error) {
      res.status(500).json({ msg: 'Role could not be authorized.', error });
    }
  };
};

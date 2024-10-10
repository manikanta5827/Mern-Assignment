import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Get token from header
  // console.log('Token', token);
  if (!token) {
    return res.status(403).json({ message: 'No token provided' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.log('failed to verify token', process.env.JWT_SECRET);

      return res.status(400).json({ message: 'Unauthorized' });
    }
    req.userId = decoded.id; // Attach user id to request
    next();
  });
};

export { authMiddleware };

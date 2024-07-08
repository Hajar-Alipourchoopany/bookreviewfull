// auth.js
import jwt from 'jsonwebtoken';
import models from '../model/schema.js';
const { User } = models;
import asyncHandler from '../utils/asyncHandler.js';
import ErrorResponse from '../utils/ErrorResponse.js';


const verifyUser = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return next(new ErrorResponse('Bitte einloggen', 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    if (!req.user) {
      return next(new ErrorResponse('Benutzer nicht gefunden', 404));
    }
    next();
  } catch (err) {
    return next(new ErrorResponse('Nicht berechtigt, auf diese Route zuzugreifen', 401));
  }
});

export default verifyUser;

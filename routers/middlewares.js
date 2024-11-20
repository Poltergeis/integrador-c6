import jwt from 'jsonwebtoken';
import signale from 'signale';
import UserModel from '../models/User.js';

const JWT_SECRET = process.env.JWT_SECRET;

/**
 * Middleware para validar el token JWT y verificar que el usuario existe en la base de datos.
 */
export async function validateToken(req, res, next) {
    try {
        const token = req.cookies.authToken;
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Authorization token is missing'
            });
        }
        
        const decoded = jwt.verify(token, JWT_SECRET);

        const user = await UserModel.findByPk(decoded.userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        req.user = user;

        next();
    } catch (error) {
        signale.error('Token validation error:', error);
        
        return res.status(403).json({
            success: false,
            message: 'Invalid or expired token'
        });
    }
}
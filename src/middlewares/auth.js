import jwt from "jsonwebtoken";

export const auth = (req, res, next) => {
    try {
        const header = req.headers.authorization;
        if (!header) {
            return res.status(401).send({
                status: 'failed',
                message: 'Unauthorized',
            });
        }

        const parts = header.split(' ');
        if (parts.length !== 2 || parts[0] !== 'Bearer') {
            return res.status(401).send({
                status: 'failed',
                message: 'Unauthorized',
            });
        }

        const token = parts[1];
        console.log('Token:', token); // Debugging log

        req.user = jwt.verify(token, process.env.ACCESS_TOKEN_KEY);
        next();
    } catch (err) {
        return res.status(401).send({
            status: 'failed',
            message: 'Unauthorized',
        });
    }
}
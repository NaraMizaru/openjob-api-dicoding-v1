import bcrypt from "bcrypt";
import pool from "../config/database.js";
import {
    generateAccessToken,
    generateRefreshToken,
    verifyRefreshToken,
} from "../utils/tokenManager.js";

const login = async (req, res) => {
    try {
        const {email, password} = req.body;

        const result = await pool.query(
            `SELECT id, email, password, role
             FROM users
             WHERE email = $1`,
            [email]
        );

        if (result.rowCount === 0) {
            return res.status(400).send({
                status: "failed",
                message: "Invalid email or password",
            });
        }

        const user = result.rows[0];

        const passMatch = await bcrypt.compare(password, user.password);

        if (!passMatch) {
            return res.status(400).send({
                status: "failed",
                message: "Invalid email or password",
            });
        }

        const payload = {
            id: user.id,
            role: user.role,
        };

        const accessToken = generateAccessToken(payload);
        const refreshToken = generateRefreshToken(payload);

        await pool.query(
            `INSERT INTO authentications (token)
             VALUES ($1)`,
            [refreshToken]
        );

        return res.status(200).send({
            status: "success",
            data: {
                accessToken,
                refreshToken,
            },
        });
    } catch (err) {
        return res.status(500).send({
            status: "error",
            message: err.message,
        });
    }
};

const refreshAuthentication = async (req, res) => {
    try {
        const {refreshToken} = req.body;

        if (!refreshToken) {
            return res.status(400).send({
                status: "failed",
                message: "Invalid refresh token",
            });
        }

        const result = await pool.query(
            `SELECT token
             FROM authentications
             WHERE token = $1`,
            [refreshToken]
        );

        if (result.rowCount === 0) {
            return res.status(400).send({
                status: "failed",
                message: "Invalid refresh token",
            });
        }

        const decoded = verifyRefreshToken(refreshToken);

        const accessToken = generateAccessToken({
            id: decoded.id,
            role: decoded.role,
        });

        return res.status(200).send({
            status: "success",
            data: {
                accessToken,
            },
        });
    } catch (err) {
        return res.status(400).send({
            status: "failed",
            message: "Invalid refresh token",
        });
    }
};

const logout = async (req, res) => {
    try {
        const {refreshToken} = req.body;

        if (!refreshToken) {
            return res.status(400).send({
                status: "failed",
                message: "Invalid refresh token",
            });
        }

        const result = await pool.query(
            `DELETE
             FROM authentications
             WHERE token = $1 RETURNING token`,
            [refreshToken]
        );

        if (result.rowCount === 0) {
            return res.status(400).send({
                status: "failed",
                message: "Invalid refresh token",
            });
        }

        return res.status(200).send({
            status: "success",
            message: "Logout successful",
        });
    } catch (err) {
        return res.status(500).send({
            status: "error",
            message: err.message,
        });
    }
};

export const authController = {
    login,
    refreshAuthentication,
    logout,
};
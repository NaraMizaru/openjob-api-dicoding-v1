import {isEmail} from "../utils/isEmail.js";
import pool from "../config/database.js";
import {nanoid} from "nanoid";
import bcrypt from "bcrypt";

const register = async (req, res) => {
    try {
        const {name, email, password, role} = req.body;

        if (!isEmail(email)) {
            return res.status(400).send({
                status: "failed",
                message: "invalid email",
            });
        }

        const isDuplicate = await pool.query(
            `SELECT email
             FROM users
             WHERE email = $1`,
            [email]
        );

        if (isDuplicate.rowCount > 0) {
            return res.status(400).send({
                status: "failed",
                message: "email already exists",
            });
        }

        const id = nanoid(16);

        const hashPassword = await bcrypt.hash(password, 10);

        await pool.query(
            `INSERT INTO users (id, name, email, password, role)
             VALUES ($1, $2, $3, $4, $5)`,
            [id, name, email, hashPassword, role]
        );

        return res.status(201).send({
            status: "success",
            message: "user created successfully",
            data: {
                id,
            },
        });
    } catch (err) {
        return res.status(500).send({
            status: "error",
            message: err.message,
        });
    }
};

const getUserById = async (req, res) => {
    try {
        const {id} = req.params;

        const result = await pool.query(
            `SELECT id, name, email
             FROM users
             WHERE id = $1`,
            [id]
        );

        if (result.rowCount === 0) {
            return res.status(404).send({
                status: "failed",
                message: "user not found",
            });
        }

        return res.status(200).send({
            status: "success",
            message: "user retrieved successfully",
            data: result.rows[0],
        });
    } catch (err) {
        return res.status(500).send({
            status: "error",
            message: err.message,
        });
    }
};

export const userController = {
    register,
    getUserById,
}
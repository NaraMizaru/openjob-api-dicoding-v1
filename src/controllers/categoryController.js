import {nanoid} from "nanoid";
import pool from "../config/database.js";

const create = async (req, res) => {
    try {
        const {name} = req.body;

        const id = nanoid(16);

        await pool.query(
            `INSERT INTO categories (id, name)
             VALUES ($1, $2)`,
            [id, name]
        );

        return res.status(201).send({
            status: "success",
            message: "Category created successfully.",
            data: {
                id,
            },
        });
    } catch (err) {
        return res.status(500).send({
            status: "error",
            message: "Error creating category",
        });
    }
};

const findAll = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT id, name
            FROM categories
        `);

        return res.status(200).send({
            status: "success",
            data: {
                categories: result.rows
            }
        });
    } catch (err) {
        return res.status(500).send({
            status: "error",
            message: "Error getting categories",
        });
    }
};

const findOne = async (req, res) => {
    try {
        const {id} = req.params;

        const result = await pool.query(
            `SELECT id, name
             FROM categories
             WHERE id = $1`,
            [id]
        );

        if (result.rowCount === 0) {
            return res.status(404).send({
                status: "failed",
                message: "Category not found",
            });
        }

        return res.status(200).send({
            status: "success",
            data: result.rows[0],
        });
    } catch (err) {
        return res.status(500).send({
            status: "error",
            message: "Error getting category",
        });
    }
};

const update = async (req, res) => {
    try {
        const {id} = req.params;
        const {name} = req.body;

        if (!name) {
            return res.status(400).send({
                status: "failed",
                message: "Invalid request body",
            });
        }

        const result = await pool.query(
            `UPDATE categories
             SET name = $1
             WHERE id = $2 RETURNING id`,
            [name, id]
        );

        if (result.rowCount === 0) {
            return res.status(404).send({
                status: "failed",
                message: "Category not found",
            });
        }

        return res.status(200).send({
            status: "success",
            message: "Category updated successfully.",
            data: {
                id,
            },
        });
    } catch (err) {
        return res.status(500).send({
            status: "error",
            message: "Error updating category",
        });
    }
};

const drop = async (req, res) => {
    try {
        const {id} = req.params;

        const result = await pool.query(
            `DELETE
             FROM categories
             WHERE id = $1 RETURNING id`,
            [id]
        );

        if (result.rowCount === 0) {
            return res.status(404).send({
                status: "failed",
                message: "Category not found",
            });
        }

        return res.status(200).send({
            status: "success",
            message: "Category deleted successfully.",
            data: {
                id,
            },
        });
    } catch (err) {
        return res.status(500).send({
            status: "error",
            message: "Error deleting category",
        });
    }
};

export const categoryController = {
    create,
    findAll,
    findOne,
    update,
    drop,
};
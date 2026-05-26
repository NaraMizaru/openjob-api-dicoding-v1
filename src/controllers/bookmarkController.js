import {nanoid} from "nanoid";
import pool from "../config/database.js";

const create = async (req, res) => {
    try {
        const {jobId} = req.params;
        const user_id = req.user.id;

        const id = nanoid(16);

        await pool.query(
            `INSERT INTO bookmarks (id, job_id, user_id)
             VALUES ($1, $2, $3)`,
            [id, jobId, user_id]
        );

        return res.status(201).send({
            status: "success",
            message: "Bookmark created successfully.",
            data: {
                id,
            },
        });
    } catch (err) {
        return res.status(500).send({
            status: "error",
            message: "Error creating bookmark",
        });
    }
};

const findOne = async (req, res) => {
    try {
        const {jobId, id} = req.params;

        const result = await pool.query(
            `SELECT bookmarks.id,
                    bookmarks.job_id,
                    jobs.title AS job_title,
                    bookmarks.user_id,
                    users.name AS user_name
             FROM bookmarks
                      JOIN jobs ON jobs.id = bookmarks.job_id
                      JOIN users ON users.id = bookmarks.user_id
             WHERE bookmarks.id = $1
               AND bookmarks.job_id = $2`,
            [id, jobId]
        );

        if (result.rowCount === 0) {
            return res.status(404).send({
                status: "failed",
                message: "Bookmark not found",
            });
        }

        return res.status(200).send({
            status: "success",
            data: result.rows[0],
        });
    } catch (err) {
        return res.status(500).send({
            status: "error",
            message: "Error getting bookmark",
        });
    }
};

const findAllByUser = async (req, res) => {
    try {
        const user_id = req.user.id;

        const result = await pool.query(
            `SELECT bookmarks.id,
                    bookmarks.job_id,
                    jobs.title AS job_title
             FROM bookmarks
                      JOIN jobs ON jobs.id = bookmarks.job_id
             WHERE bookmarks.user_id = $1`,
            [user_id]
        );

        return res.status(200).send({
            status: "success",
            data: result.rows,
        });
    } catch (err) {
        return res.status(500).send({
            status: "error",
            message: "Error getting bookmarks",
        });
    }
};

const drop = async (req, res) => {
    try {
        const {jobId} = req.params;
        const user_id = req.user.id;

        const result = await pool.query(
            `DELETE
             FROM bookmarks
             WHERE job_id = $1
               AND user_id = $2 RETURNING id`,
            [jobId, user_id]
        );

        if (result.rowCount === 0) {
            return res.status(404).send({
                status: "failed",
                message: "Bookmark not found",
            });
        }

        return res.status(200).send({
            status: "success",
            message: "Bookmark deleted successfully.",
            data: {
                id: result.rows[0].id,
            },
        });
    } catch (err) {
        return res.status(500).send({
            status: "error",
            message: "Error deleting bookmark",
        });
    }
};

export const bookmarkController = {
    create,
    findOne,
    findAllByUser,
    drop,
};
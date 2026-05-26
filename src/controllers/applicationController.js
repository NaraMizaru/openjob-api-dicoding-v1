import {nanoid} from "nanoid";
import pool from "../config/database.js";

const create = async (req, res) => {
    try {
        const {user_id, job_id, status} = req.body;

        const id = nanoid(16);

        await pool.query(
            `INSERT INTO applications (id, user_id, job_id, status)
             VALUES ($1, $2, $3, $4)`,
            [id, user_id, job_id, status]
        );

        return res.status(201).send({
            status: "success",
            message: "Application created successfully.",
            data: {
                id,
            },
        });
    } catch (err) {
        return res.status(500).send({
            status: "error",
            message: "Error creating application",
        });
    }
};

const findAll = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT applications.id,
                   applications.status,
                   users.id   AS user_id,
                   users.name AS user_name,
                   jobs.id    AS job_id,
                   jobs.title AS job_title
            FROM applications
                     JOIN users ON users.id = applications.user_id
                     JOIN jobs ON jobs.id = applications.job_id
        `);

        return res.status(200).send({
            status: "success",
            data: {
                applications: result.rows
            },
        });
    } catch (err) {
        return res.status(500).send({
            status: "error",
            message: "Error getting applications",
        });
    }
};

const findOne = async (req, res) => {
    try {
        const {id} = req.params;

        const result = await pool.query(
            `SELECT applications.id,
                    applications.status,
                    users.id   AS user_id,
                    users.name AS user_name,
                    jobs.id    AS job_id,
                    jobs.title AS job_title
             FROM applications
                      JOIN users ON users.id = applications.user_id
                      JOIN jobs ON jobs.id = applications.job_id
             WHERE applications.id = $1`,
            [id]
        );

        if (result.rowCount === 0) {
            return res.status(404).send({
                status: "failed",
                message: "Application not found",
            });
        }

        return res.status(200).send({
            status: "success",
            data: result.rows[0],
        });
    } catch (err) {
        return res.status(500).send({
            status: "error",
            message: "Error getting application",
        });
    }
};

const findByUser = async (req, res) => {
    try {
        const {userId} = req.params;

        const result = await pool.query(
            `SELECT applications.id,
                    applications.status,
                    users.id   AS user_id,
                    users.name AS user_name,
                    jobs.id    AS job_id,
                    jobs.title AS job_title
             FROM applications
                      JOIN users ON users.id = applications.user_id
                      JOIN jobs ON jobs.id = applications.job_id
             WHERE applications.user_id = $1`,
            [userId]
        );

        return res.status(200).send({
            status: "success",
            data: {
                applications: result.rows
            },
        });
    } catch (err) {
        return res.status(500).send({
            status: "error",
            message: "Error getting applications by user",
        });
    }
};

const findByJob = async (req, res) => {
    try {
        const {jobId} = req.params;

        const result = await pool.query(
            `SELECT applications.id,
                    applications.status,
                    users.id   AS user_id,
                    users.name AS user_name,
                    jobs.id    AS job_id,
                    jobs.title AS job_title
             FROM applications
                      JOIN users ON users.id = applications.user_id
                      JOIN jobs ON jobs.id = applications.job_id
             WHERE applications.job_id = $1`,
            [jobId]
        );

        return res.status(200).send({
            status: "success",
            data: result.rows,
        });
    } catch (err) {
        return res.status(500).send({
            status: "error",
            message: "Error getting applications by job",
        });
    }
};

const update = async (req, res) => {
    try {
        const {id} = req.params;
        const {status} = req.body;

        if (!status) {
            return res.status(400).send({
                status: "failed",
                message: "Invalid request body",
            });
        }

        const result = await pool.query(
            `UPDATE applications
             SET status = $1
             WHERE id = $2 RETURNING id`,
            [status, id]
        );

        if (result.rowCount === 0) {
            return res.status(404).send({
                status: "failed",
                message: "Application not found",
            });
        }

        return res.status(200).send({
            status: "success",
            message: "Application updated successfully.",
            data: {
                id,
            },
        });
    } catch (err) {
        return res.status(500).send({
            status: "error",
            message: "Error updating application",
        });
    }
};

const drop = async (req, res) => {
    try {
        const {id} = req.params;

        const result = await pool.query(
            `DELETE
             FROM applications
             WHERE id = $1 RETURNING id`,
            [id]
        );

        if (result.rowCount === 0) {
            return res.status(404).send({
                status: "failed",
                message: "Application not found",
            });
        }

        return res.status(200).send({
            status: "success",
            message: "Application deleted successfully.",
            data: {
                id,
            },
        });
    } catch (err) {
        return res.status(500).send({
            status: "error",
            message: "Error deleting application",
        });
    }
};

export const applicationController = {
    create,
    findAll,
    findOne,
    findByUser,
    findByJob,
    update,
    drop,
};
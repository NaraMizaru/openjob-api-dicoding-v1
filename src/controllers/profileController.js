import pool from "../config/database.js";

const getProfile = async (req, res) => {
    try {
        const userId = req.user.id;

        const result = await pool.query(
            `SELECT id, name, email, role
             FROM users
             WHERE id = $1`,
            [userId]
        );

        if (result.rowCount === 0) {
            return res.status(404).send({
                status: "failed",
                message: "User not found",
            });
        }

        return res.status(200).send({
            status: "success",
            data: result.rows[0],
        });
    } catch (err) {
        return res.status(500).send({
            status: "error",
            message: "Error getting profile",
        });
    }
};

const getMyApplications = async (req, res) => {
    try {
        const userId = req.user.id;

        const result = await pool.query(
            `SELECT applications.id,
                    applications.status,
                    jobs.id         AS job_id,
                    jobs.title      AS job_title,
                    companies.id    AS company_id,
                    companies.name  AS company_name,
                    categories.id   AS category_id,
                    categories.name AS category_name
             FROM applications
                      JOIN jobs ON jobs.id = applications.job_id
                      JOIN companies ON companies.id = jobs.company_id
                      JOIN categories ON categories.id = jobs.category_id
             WHERE applications.user_id = $1`,
            [userId]
        );

        return res.status(200).send({
            status: "success",
            data: {
                applications: result.rows,
            },
        });
    } catch (err) {
        return res.status(500).send({
            status: "error",
            message: "Error getting profile applications",
        });
    }
};

const getMyBookmarks = async (req, res) => {
    try {
        const userId = req.user.id;

        const result = await pool.query(
            `SELECT bookmarks.id,
                    jobs.id         AS job_id,
                    jobs.title      AS job_title,
                    companies.id    AS company_id,
                    companies.name  AS company_name,
                    categories.id   AS category_id,
                    categories.name AS category_name
             FROM bookmarks
                      JOIN jobs ON jobs.id = bookmarks.job_id
                      JOIN companies ON companies.id = jobs.company_id
                      JOIN categories ON categories.id = jobs.category_id
             WHERE bookmarks.user_id = $1`,
            [userId]
        );

        return res.status(200).send({
            status: "success",
            data: {
                bookmarks: result.rows,
            },
        });
    } catch (err) {
        return res.status(500).send({
            status: "error",
            message: "Error getting profile bookmarks",
        });
    }
};

export const profileController = {
    getProfile,
    getMyApplications,
    getMyBookmarks,
};
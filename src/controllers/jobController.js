import {nanoid} from "nanoid";
import pool from "../config/database.js";

const create = async (req, res) => {
    try {
        const {
            title,
            company_id,
            category_id,
            job_type,
            salary_min,
            salary_max,
            is_salary_visible,
            status,
            experience_level,
            location_type,
            location_city
        } = req.body;

        const id = nanoid(16);
        await pool.query(
            `INSERT INTO jobs (id, title, company_id, category_id, job_type, salary_min, salary_max, is_salary_visible,
                               status, experience_level, location_type, location_city)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
            [id, title, company_id, category_id, job_type, salary_min, salary_max, is_salary_visible, status, experience_level, location_type, location_city]
        );

        return res.status(201).send({
            status: "success",
            message: "Job created successfully.",
            data: {
                id,
            },
        });
    } catch (err) {
        console.log(err);

        return res.status(500).send({
            status: "error",
            message: "Error creating job",
        });
    }
};

const findAll = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT jobs.id,
                   jobs.title,
                   jobs.company_id,
                   companies.name  AS company_name,
                   jobs.category_id,
                   categories.name AS category_name
            FROM jobs
                     JOIN companies ON companies.id = jobs.company_id
                     JOIN categories ON categories.id = jobs.category_id
        `);

        return res.status(200).send({
            status: "success",
            data: {
                jobs: result.rows
            },
        });
    } catch (err) {
        return res.status(500).send({
            status: "error",
            message: "Error getting jobs",
        });
    }
};

const findOne = async (req, res) => {
    try {
        const {id} = req.params;

        const result = await pool.query(
            `SELECT jobs.id,
                    jobs.title,
                    jobs.company_id,
                    companies.name  AS company_name,
                    jobs.category_id,
                    categories.name AS category_name
             FROM jobs
                      JOIN companies ON companies.id = jobs.company_id
                      JOIN categories ON categories.id = jobs.category_id
             WHERE jobs.id = $1`,
            [id]
        );

        if (result.rowCount === 0) {
            return res.status(404).send({
                status: "failed",
                message: "Job not found",
            });
        }

        return res.status(200).send({
            status: "success",
            data: result.rows[0],
        });
    } catch (err) {
        return res.status(500).send({
            status: "error",
            message: "Error getting job",
        });
    }
};

const findByCompany = async (req, res) => {
    try {
        const {companyId} = req.params;

        const result = await pool.query(
            `SELECT jobs.id,
                    jobs.title,
                    jobs.company_id,
                    companies.name  AS company_name,
                    jobs.category_id,
                    categories.name AS category_name
             FROM jobs
                      JOIN companies ON companies.id = jobs.company_id
                      JOIN categories ON categories.id = jobs.category_id
             WHERE jobs.company_id = $1`,
            [companyId]
        );

        return res.status(200).send({
            status: "success",
            data: {
                jobs: result.rows
            },
        });
    } catch (err) {
        return res.status(500).send({
            status: "error",
            message: "Error getting jobs by company",
        });
    }
};

const findByCategory = async (req, res) => {
    try {
        const {categoryId} = req.params;

        const result = await pool.query(
            `SELECT jobs.id,
                    jobs.title,
                    jobs.company_id,
                    companies.name  AS company_name,
                    jobs.category_id,
                    categories.name AS category_name
             FROM jobs
                      JOIN companies ON companies.id = jobs.company_id
                      JOIN categories ON categories.id = jobs.category_id
             WHERE jobs.category_id = $1`,
            [categoryId]
        );

        return res.status(200).send({
            status: "success",
            data: {
                jobs: result.rows
            },
        });
    } catch (err) {
        return res.status(500).send({
            status: "error",
            message: "Error getting jobs by category",
        });
    }
};

const update = async (req, res) => {
    try {
        const {id} = req.params;

        const {
            title,
            company_id,
            category_id,
            job_type,
            salary_min,
            salary_max,
            is_salary_visible,
            status,
            experience_level,
            location_type,
            location_city,
        } = req.body;

        const result = await pool.query(
            `UPDATE jobs
             SET title             = $1,
                 company_id        = $2,
                 category_id       = $3,
                 job_type          = $4,
                 salary_min        = $5,
                 salary_max        = $6,
                 is_salary_visible = $7,
                 status            = $8,
                 experience_level  = $9,
                 location_type     = $10,
                 location_city     = $11
             WHERE id = $12 RETURNING id`,
            [
                title,
                company_id,
                category_id,
                job_type,
                salary_min,
                salary_max,
                is_salary_visible,
                status,
                experience_level,
                location_type,
                location_city,
                id,
            ]
        );

        if (result.rowCount === 0) {
            return res.status(404).send({
                status: "failed",
                message: "Job not found",
            });
        }

        return res.status(200).send({
            status: "success",
            message: "Job updated successfully.",
            data: {
                id,
            },
        });
    } catch (err) {
        console.log(err);

        return res.status(500).send({
            status: "error",
            message: "Error updating job",
        });
    }
};

const drop = async (req, res) => {
    try {
        const {id} = req.params;

        const result = await pool.query(
            `DELETE
             FROM jobs
             WHERE id = $1 RETURNING id`,
            [id]
        );

        if (result.rowCount === 0) {
            return res.status(404).send({
                status: "failed",
                message: "Job not found",
            });
        }

        return res.status(200).send({
            status: "success",
            message: "Job deleted successfully.",
            data: {
                id,
            },
        });
    } catch (err) {
        return res.status(500).send({
            status: "error",
            message: "Error deleting job",
        });
    }
};

export const jobController = {
    create,
    findAll,
    findOne,
    findByCompany,
    findByCategory,
    update,
    drop,
};
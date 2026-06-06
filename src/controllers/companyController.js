import { nanoid } from "nanoid";
import pool from "../config/database.js";
import redis from "../config/redis.js";

const CACHE_TTL = 3600;

const create = async (req, res) => {
  try {
    const { name, location, description } = req.body;

    const id = nanoid(16);
    await pool.query(
      `INSERT INTO companies (id, name, location, description)
             VALUES ($1, $2, $3, $4)`,
      [id, name, location, description],
    );

    return res.status(201).send({
      status: "success",
      message: "Company created successfully.",
      data: {
        id,
      },
    });
  } catch (err) {
    return res.status(500).send({
      status: "error",
      message: "Error creating company",
    });
  }
};

const findAll = async (req, res) => {
  try {
    const result = await pool.query(`
            SELECT id, name, location, description
            FROM companies
        `);

    return res.status(200).send({
      status: "success",
      data: {
        companies: result.rows,
      },
    });
  } catch (err) {
    return res.status(500).send({
      status: "error",
      message: "Error getting company",
    });
  }
};

const findOne = async (req, res) => {
  try {
    const { id } = req.params;
    const cacheKey = `company:${id}`;

    const cached = await redis.get(cacheKey);
    if (cached) {
      return res
        .status(200)
        .set("X-Data-Source", "cache")
        .send({
          status: "success",
          data: JSON.parse(cached),
        });
    }

    const result = await pool.query(
      `SELECT id, name, location, description
             FROM companies
             WHERE id = $1`,
      [id],
    );

    if (result.rowCount === 0) {
      return res.status(404).send({
        status: "failed",
        message: "Company not found",
      });
    }

    await redis.setex(cacheKey, CACHE_TTL, JSON.stringify(result.rows[0]));

    return res.status(200).set("X-Data-Source", "database").send({
      status: "success",
      data: result.rows[0],
    });
  } catch (err) {
    return res.status(500).send({
      status: "error",
      message: "Error getting company",
    });
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, location, description } = req.body;

    const result = await pool.query(
      `UPDATE companies
             SET name        = $1,
                 location    = $2,
                 description = $3
             WHERE id = $4 RETURNING id`,
      [name, location, description, id],
    );

    if (result.rowCount === 0) {
      return res.status(404).send({
        status: "failed",
        message: "Company not found",
      });
    }

    await redis.del(`company:${id}`);

    return res.status(200).send({
      status: "success",
      message: "Company updated successfully.",
      data: {
        id,
      },
    });
  } catch (err) {
    return res.status(500).send({
      status: "error",
      message: "Error updating company",
    });
  }
};

const drop = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `DELETE
             FROM companies
             WHERE id = $1 RETURNING id`,
      [id],
    );

    if (result.rowCount === 0) {
      return res.status(404).send({
        status: "failed",
        message: "Company not found",
      });
    }

    await redis.del(`company:${id}`);

    return res.status(200).send({
      status: "success",
      message: "Company deleted successfully.",
      data: {
        id,
      },
    });
  } catch (err) {
    return res.status(500).send({
      status: "error",
      message: "Error deleting company",
    });
  }
};

export const companyController = {
  create,
  findAll,
  findOne,
  update,
  drop,
};

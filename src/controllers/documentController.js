import { nanoid } from "nanoid";
import pool from "../config/database.js";
import fs from "fs";
import path from "path";

const upload = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send({
        status: "failed",
        message: "File is required",
      });
    }

    const id = nanoid(16);

    const { originalname, filename, mimetype, size, path } = req.file;

    await pool.query(
      `INSERT INTO documents (id,
                                    original_name,
                                    file_name,
                                    mime_type,
                                    size,
                                    file_path)
             VALUES ($1, $2, $3, $4, $5, $6)`,
      [id, originalname, filename, mimetype, size, path],
    );

    return res.status(201).send({
      status: "success",
      message: "Document uploaded successfully.",
      data: {
        documentId: id,
        filename: filename,
        originalName: originalname,
        size: size
      },
    });
  } catch (err) {
    console.log(err);

    return res.status(500).send({
      status: "error",
      message: "Error uploading document",
    });
  }
};

const findAll = async (req, res) => {
  try {
    const result = await pool.query(`
            SELECT id,
                   original_name,
                   file_name,
                   mime_type, size, file_path
            FROM documents
        `);

    return res.status(200).send({
      status: "success",
      data: {
        documents: result.rows,
      },
    });
  } catch (err) {
    return res.status(500).send({
      status: "error",
      message: "Error getting documents",
    });
  }
};

const findOne = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT id,
                    original_name,
                    file_name,
                    mime_type, size, file_path
             FROM documents
             WHERE id = $1`,
      [id],
    );

    if (result.rowCount === 0) {
      return res.status(404).send({
        status: "failed",
        message: "Document not found",
      });
    }

    return res.status(200).send({
      status: "success",
      data: {
        document: result.rows[0],
      },
    });
  } catch (err) {
    return res.status(500).send({
      status: "error",
      message: "Error getting document",
    });
  }
};

const drop = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `DELETE
             FROM documents
             WHERE id = $1 RETURNING id`,
      [id],
    );

    if (result.rowCount === 0) {
      return res.status(404).send({
        status: "failed",
        message: "Document not found",
      });
    }

    return res.status(200).send({
      status: "success",
      message: "Document deleted successfully.",
      data: {
        id,
      },
    });
  } catch (err) {
    return res.status(500).send({
      status: "error",
      message: "Error deleting document",
    });
  }
};

const serveFile = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT file_path, original_name, mime_type FROM documents WHERE id = $1`,
      [id],
    );

    if (result.rowCount === 0) {
      return res.status(404).send({
        status: "failed",
        message: "Document not found",
      });
    }

    const { file_path, original_name, mime_type } = result.rows[0];

    const absolutePath = path.resolve(file_path);

    if (!fs.existsSync(absolutePath)) {
      return res.status(404).send({
        status: "failed",
        message: "File not found on server",
      });
    }

    res.setHeader("Content-Type", mime_type);
    res.setHeader("Content-Disposition", `inline; filename="${original_name}"`);

    return res.sendFile(absolutePath);
  } catch (err) {
    return res.status(500).send({
      status: "error",
      message: "Error serving document",
    });
  }
};

export const documentController = {
  upload,
  findAll,
  findOne,
  serveFile,
  drop,
};

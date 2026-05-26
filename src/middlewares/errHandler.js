export const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;

    const status = statusCode >= 500 ? "error" : "failed";

    return res.status(statusCode).send({
        status,
        message: err.message || "Internal Server Error",
    });
};
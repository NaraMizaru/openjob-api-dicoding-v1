export const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);

    if (error) {
      return res.status(400).send({
        status: "failed",
        message: error.message,
      });
    }

    next();
  };
};
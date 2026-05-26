import Joi from "joi";

export const applicationSchema = Joi.object({
  user_id: Joi.string().required(),
  job_id: Joi.string().required(),
  status: Joi.string().valid("pending", "reviewed", "accepted", "rejected").required(),
});
import Joi from "joi";

export const applicationSchema = Joi.object({
  user_id: Joi.string().optional(),
  job_id: Joi.string().optional(),
  status: Joi.string().valid("pending", "reviewed", "accepted", "rejected").required(),
});
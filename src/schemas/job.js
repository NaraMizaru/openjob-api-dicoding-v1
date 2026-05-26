import Joi from "joi";

export const jobSchema = Joi.object({
  title: Joi.string().required(),
  company_id: Joi.string().required(),
  category_id: Joi.string().required(),
  description: Joi.string().required(),
  job_type: Joi.string().valid("full-time", "part-time", "contract").required(),
  salary_min: Joi.number().integer().positive().optional(),
  salary_max: Joi.number().integer().positive().optional(),
  is_salary_visible: Joi.boolean().default(false),
  status: Joi.string().valid("open", "close").default("open"),
  experience_level: Joi.string().valid("entry", "mid", "senior").required(),
  location_type: Joi.string().valid("onsite", "remote", "hybrid").required(),
  location_city: Joi.string().max(100).optional(),
});
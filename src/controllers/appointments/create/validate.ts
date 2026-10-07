import Joi from 'joi'

const schema = Joi.object({
  patientId: Joi.string()
    .uuid()
    .required(),

  date: Joi.date()
    .iso()
    .required(),

  time: Joi.string()
    .pattern(/^([01]\d|2[0-3]):[0-5]\d$/)
    .required()
})

const validate = (data: unknown) => {
  return schema.validate(data, {
    convert: false,
    abortEarly: false
  })
}

export { validate }
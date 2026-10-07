import Joi from 'joi'

const schema = Joi.object({
  date: Joi.date()
    .iso(),

  time: Joi.string()
    .pattern(/^([01]\d|2[0-3]):[0-5]\d$/),

  status: Joi.string()
    .valid('SCHEDULED', 'COMPLETED', 'CANCELED')
}).min(1)

const appointmentIdSchema = Joi.string()
  .uuid()
  .required()

const validate = (data: unknown) => {
  return schema.validate(data, {
    convert: false,
    abortEarly: false
  })
}

const validateAppointmentId = (id: unknown) => {
  return appointmentIdSchema.validate(id)
}

export {
  validate,
  validateAppointmentId
}
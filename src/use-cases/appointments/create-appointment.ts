import {
  Appointment,
  CreateAppointmentInput
} from '../../interfaces/appointments'

import { getPatientById } from '../../repositories/patients/get-patient-by-id'
import {
  createAppointment as createAppointmentRepository
} from '../../repositories/appointments/create-appointment'
import { getAppointmentBySchedule } from '../../repositories/appointments/get-appointment-by-schedule'

interface CreateAppointmentResult {
  appointment: Appointment | null
  conflict: boolean
  pastSchedule: boolean
}

const createAppointment = async (
  data: CreateAppointmentInput
): Promise<CreateAppointmentResult> => {
  const patient = await getPatientById(data.patientId)

  if (!patient) {
    return {
      appointment: null,
      conflict: false,
      pastSchedule: false
    }
  }

  const scheduledAt = `${data.date}T${data.time}:00`

  if (new Date(scheduledAt).getTime() <= Date.now()) {
    return {
      appointment: null,
      conflict: false,
      pastSchedule: true
    }
  }

  const scheduleConflict = await getAppointmentBySchedule(
    data.userId,
    scheduledAt
  )

  if (scheduleConflict) {
    return {
      appointment: null,
      conflict: true,
      pastSchedule: false
    }
  }

  const appointment = await createAppointmentRepository({
    userId: data.userId,
    patientId: data.patientId,
    scheduledAt
  })

  if (!appointment) {
    return {
      appointment: null,
      conflict: true,
      pastSchedule: false
    }
  }

  return {
    appointment,
    conflict: false,
    pastSchedule: false
  }
}

export { createAppointment }
import { database } from '../../config/database'

const deleteAppointment = async (
  id: string,
  userId: string
): Promise<boolean> => {
  const result = await database.query(
    `
      UPDATE appointments
      SET
        deleted_at = NOW(),
        updated_at = NOW()
      WHERE id = $1
        AND user_id = $2
        AND deleted_at IS NULL
        AND status <> 'COMPLETED'
    `,
    [
      id,
      userId
    ]
  )

  return result.rowCount === 1
}

export { deleteAppointment }
ALTER TABLE appointments
ADD COLUMN deleted_at TIMESTAMP NULL;

ALTER TABLE consultation_notes
DROP CONSTRAINT fk_consultation_notes_appointment;

ALTER TABLE consultation_notes
ADD CONSTRAINT fk_consultation_notes_appointment
FOREIGN KEY (appointment_id)
REFERENCES appointments(id)
ON DELETE RESTRICT;

ALTER TABLE appointments
DROP CONSTRAINT unique_user_schedule;

CREATE UNIQUE INDEX unique_user_active_schedule
ON appointments(user_id, scheduled_at)
WHERE status <> 'CANCELED' AND deleted_at IS NULL;

ALTER TABLE appointments
ADD CONSTRAINT valid_appointment_status
CHECK (status IN ('SCHEDULED', 'COMPLETED', 'CANCELED'));
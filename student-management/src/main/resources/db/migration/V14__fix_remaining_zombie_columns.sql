ALTER TABLE credit_classes MODIFY COLUMN semester VARCHAR(10) NULL;
ALTER TABLE semester_schedules MODIFY COLUMN day_of_week INT NULL;
ALTER TABLE semester_schedules MODIFY COLUMN start_shift INT NULL;
ALTER TABLE semester_schedules MODIFY COLUMN end_shift INT NULL;

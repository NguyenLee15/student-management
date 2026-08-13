CREATE TABLE import_tasks (
    task_id VARCHAR(36) PRIMARY KEY,
    status VARCHAR(50) NOT NULL,
    total_rows INT DEFAULT 0,
    processed_rows INT DEFAULT 0,
    error_count INT DEFAULT 0,
    error_details TEXT,
    created_at DATETIME,
    completed_at DATETIME
);

package com.student.management.repository;

import com.student.management.entity.ImportTask;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ImportTaskRepository extends JpaRepository<ImportTask, String> {
}

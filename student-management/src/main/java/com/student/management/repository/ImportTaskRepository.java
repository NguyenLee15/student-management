// cSpell:disable
package com.student.management.repository;

import com.student.management.entity.ImportTask;
import org.springframework.data.jpa.repository.JpaRepository;



public interface ImportTaskRepository extends JpaRepository<ImportTask, String> {
}

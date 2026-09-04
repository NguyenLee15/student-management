// cSpell:disable
package com.student.management.repository;

import com.student.management.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;


import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface UserRepository extends JpaRepository<User, Integer> {
    Optional<User> findByUserName(String userName);

    @Query("SELECT u FROM User u WHERE u.userName = :identifier OR u.studentId = :identifier OR u.teacherId = :identifier")
    Optional<User> findByIdentifier(@Param("identifier") String identifier);
}

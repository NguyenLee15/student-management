// cSpell:disable
package com.student.management.config;

import com.student.management.config.seeders.AcademicDataSeeder;
import com.student.management.config.seeders.BaseDataSeeder;
import com.student.management.config.seeders.EnrollmentAndGradeSeeder;
import com.student.management.config.seeders.TuitionAndPaymentSeeder;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final BaseDataSeeder baseDataSeeder;
    private final AcademicDataSeeder academicDataSeeder;
    private final EnrollmentAndGradeSeeder enrollmentAndGradeSeeder;
    private final TuitionAndPaymentSeeder tuitionAndPaymentSeeder;

    @Override
    @Transactional
    public void run(String... args) {
        log.info("Starting EduPortal AI Comprehensive Data Seeding...");
        baseDataSeeder.seedBaseData();
        academicDataSeeder.seedAcademicData();
        enrollmentAndGradeSeeder.seedEnrollmentsAndGrades();
        tuitionAndPaymentSeeder.seedTuitionAndPayments();
        log.info("All demo data initialized successfully across Admin, Teacher, and Student portals!");
    }
}

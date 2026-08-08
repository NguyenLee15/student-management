package com.student.management.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "credit_class_students")
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CreditClassStudent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "credit_class_id", nullable = false)
    private CreditClass creditClass;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;
}


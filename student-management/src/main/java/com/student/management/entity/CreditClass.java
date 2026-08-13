package com.student.management.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.SQLRestriction;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "credit_classes")
@SQLRestriction("deleted = false")
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CreditClass extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "credit_class_id")
    private Long creditClassId;

    @Column(name = "credit_class_name", nullable = false)
    private String creditClassName;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "subject_id", nullable = false)
    private Subject subject;

    @OneToMany(mappedBy = "creditClass", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<CreditClassStudent> creditClassStudents = new ArrayList<>();
}


package com.student.management.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.hibernate.annotations.SQLRestriction;

import java.time.LocalDateTime;

@Entity
@Table(name = "registration_periods")
@SQLRestriction("deleted = false")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(callSuper = false)
public class RegistrationPeriod extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", nullable = false, length = 150)
    @NotBlank(message = "Tên đợt đăng ký là bắt buộc")
    @Size(max = 150, message = "Tên đợt đăng ký không được vượt quá 150 ký tự")
    private String name;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "semester_id", nullable = false)
    @NotNull(message = "Học kỳ là bắt buộc")
    private Semester semester;

    @Column(name = "start_time", nullable = false)
    @NotNull(message = "Thời gian bắt đầu đợt đăng ký là bắt buộc")
    private LocalDateTime startTime;

    @Column(name = "end_time", nullable = false)
    @NotNull(message = "Thời gian kết thúc đợt đăng ký là bắt buộc")
    private LocalDateTime endTime;

    @Column(name = "max_credits_allowed", nullable = false)
    @Min(value = 1, message = "Số tín chỉ tối đa cho phép phải ít nhất là 1")
    @Builder.Default
    private Integer maxCreditsAllowed = 24;

    @Column(name = "active", nullable = false)
    @Builder.Default
    private Boolean active = true;

    public boolean isCurrentlyOpen(LocalDateTime now) {
        if (Boolean.FALSE.equals(active)) {
            return false;
        }
        return !now.isBefore(startTime) && !now.isAfter(endTime);
    }
}

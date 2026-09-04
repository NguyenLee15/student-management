// cSpell:disable
package com.student.management.dto.resp;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ImportTaskResponseDto {
    private String taskId;
    private String status;
    private int totalRows;
    private int processedRows;
    private int errorCount;
    private String errorDetails;
    private LocalDateTime createdAt;
    private LocalDateTime completedAt;
}

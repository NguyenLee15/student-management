package com.student.management.service;

import com.student.management.dto.resp.StudentPortalOverviewDto;
import com.student.management.dto.resp.StudentTimetableEntryDto;

import java.util.List;

public interface StudentPortalService {
    StudentPortalOverviewDto getMyOverview(String studentId);
    List<StudentTimetableEntryDto> getMyTimetable(String studentId, Long semesterId);
}

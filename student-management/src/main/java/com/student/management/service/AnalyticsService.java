// cSpell:disable
package com.student.management.service;

import java.util.Map;
import java.util.List;

public interface AnalyticsService {
    Map<String, Object> getSystemSummary();
    List<Map<String, Object>> getFacultyDistribution();
    Map<String, Object> getGpaDistribution();
    void clearSystemSummaryCache();
}

package com.voto_safe.voto_safe.backend.dto;

import java.util.List;

public record DashboardStatsDTO(
    String adminName,
    long activeElectionsCount,
    long totalUsersCount,
    double voterPercentage,
    List<ElectionSummaryDto> upcomingElections,
    List<ElectionSummaryDto> activeElections
) {}
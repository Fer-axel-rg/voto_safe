package com.voto_safe.voto_safe.backend.dto;

public record ElectionSummaryDto(
    String id,
    String name,
    String type,   // <-- Agregado para que coincida con tu front
    String status,
    String startDate,
    String endDate
) {}
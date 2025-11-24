package com.voto_safe.voto_safe.backend.controller;

import com.voto_safe.voto_safe.backend.dto.StatisticsDtos.ElectionResultsDTO;
import com.voto_safe.voto_safe.backend.service.StatisticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/statistics")
@CrossOrigin(origins = "http://localhost:5173")
public class StatisticsController {

    @Autowired
    private StatisticsService statisticsService;

    @GetMapping("/{electionId}")
    public ResponseEntity<ElectionResultsDTO> getStatistics(@PathVariable String electionId) {
        return ResponseEntity.ok(statisticsService.getResults(electionId));
    }
}
package com.voto_safe.voto_safe.backend.controller;

import com.voto_safe.voto_safe.backend.model.entity.*;
import com.voto_safe.voto_safe.backend.service.ElectionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/elections")
@CrossOrigin(origins = "http://localhost:5173")
public class ElectionController {

    @Autowired
    private ElectionService electionService;

    @GetMapping
    public ResponseEntity<List<Election>> getAllElections() {
        return ResponseEntity.ok(electionService.findAll());
    }

    @PostMapping
    public ResponseEntity<Election> createElection(@RequestBody Election election) {
        return ResponseEntity.ok(electionService.create(election));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteElection(@PathVariable String id) {
        electionService.delete(id);
        return ResponseEntity.noContent().build();
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Election> updateElection(@PathVariable String id, @RequestBody Election election) {
        return ResponseEntity.ok(electionService.update(id, election));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Election> getElectionById(@PathVariable String id) {
        return electionService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
package com.voto_safe.voto_safe.backend.controller;

import com.voto_safe.voto_safe.backend.dto.VoterDto.VoterRowDTO;
import com.voto_safe.voto_safe.backend.dto.VoterDto.VoterStatsDTO;
import com.voto_safe.voto_safe.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/users")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    @Autowired
    private UserService userService;

    // GET /api/v1/users/stats -> Tarjetas de colores
    @GetMapping("/stats")
    public ResponseEntity<VoterStatsDTO> getStats() {
        return ResponseEntity.ok(userService.getStats());
    }

    // GET /api/v1/users?search=kevin -> Tabla filtrable
    @GetMapping
    public ResponseEntity<List<VoterRowDTO>> getUsers(@RequestParam(required = false) String search) {
        return ResponseEntity.ok(userService.getUsers(search));
    }
}
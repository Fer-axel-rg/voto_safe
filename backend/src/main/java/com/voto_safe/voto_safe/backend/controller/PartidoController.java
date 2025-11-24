package com.voto_safe.voto_safe.backend.controller;

import com.voto_safe.voto_safe.backend.model.entity.*;
import com.voto_safe.voto_safe.backend.service.PartidoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/partidos")
@CrossOrigin(origins = "http://localhost:5173")
public class PartidoController {

    @Autowired
    private PartidoService partidoService;

    // GET: Obtener partidos de una elección (?eleccionId=...)
    @GetMapping
    public ResponseEntity<List<Partido>> getPartidos(@RequestParam String eleccionId) {
        return ResponseEntity.ok(partidoService.getPartidosByEleccion(eleccionId));
    }

    // POST: Crear partido en una elección (?eleccionId=...)
    @PostMapping
    public ResponseEntity<Partido> createPartido(@RequestParam String eleccionId, @RequestBody Partido partido) {
        return ResponseEntity.ok(partidoService.createPartido(eleccionId, partido));
    }

    // DELETE: Borrar partido
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePartido(@PathVariable String id) {
        partidoService.deletePartido(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/batch")
    public ResponseEntity<Void> createPartiesBatch(@RequestParam String eleccionId, @RequestBody List<Partido> partidos) {
        partidoService.createPartiesBatch(eleccionId, partidos);
        return ResponseEntity.ok().build();
    }    
}
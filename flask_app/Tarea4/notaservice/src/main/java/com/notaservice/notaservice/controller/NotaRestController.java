package com.notaservice.notaservice.controller;

import com.notaservice.notaservice.service.AvisoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map; 

@RestController

@RequestMapping("/api/avisos") 
public class NotaRestController {

    @Autowired
    private AvisoService avisoService;

   
    @PostMapping("/{avisoId}/evaluar") 
    public ResponseEntity<Map<String, Object>> guardarNota(
       
        @PathVariable Integer avisoId, 
        
        @RequestBody NotaRequest request) { 
        
        Integer nota = request.getNota(); 
        
        
        if (nota == null || avisoId == null || nota < 1 || nota > 7) {
             
            return ResponseEntity.badRequest().body(Map.of("error", "La nota debe ser un numero entero entre 1 y 7."));
        }

        try {
            
            Double nuevoPromedio = avisoService.guardarNota(avisoId, nota); 
            
         
            return ResponseEntity.ok(Map.of("nuevaNotaPromedio", nuevoPromedio));
            
        } catch (RuntimeException e) {
            
            return ResponseEntity.internalServerError().body(Map.of("error", "Error al guardar la nota: " + e.getMessage()));
        }
    }
}
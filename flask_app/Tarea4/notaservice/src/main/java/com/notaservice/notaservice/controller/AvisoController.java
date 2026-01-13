package com.notaservice.notaservice.controller;



import com.notaservice.notaservice.service.AvisoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class AvisoController {

    @Autowired
    private AvisoService avisoService;

    @GetMapping("/evaluar/avisos")
    public String listarAvisos(Model model) {
        model.addAttribute("avisos", avisoService.obtenerAvisosConNotaPromedio());
        return "tarea4"; 
    }
}
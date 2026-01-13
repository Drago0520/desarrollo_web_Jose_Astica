package com.notaservice.notaservice.service; 

import com.notaservice.notaservice.model.Aviso;
import com.notaservice.notaservice.model.Nota;
import com.notaservice.notaservice.repository.AvisoRepository;
import com.notaservice.notaservice.repository.NotaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AvisoService {

    @Autowired
    private AvisoRepository avisoRepository;

    @Autowired
    private NotaRepository notaRepository;

    
    public static class AvisoDTO {
        public Integer id;
        public String fechaPublicacion;
        public String sector;
        public String cantidadTipoEdad;
        public String comunaNombre;
        public String notaPromedio;

        public AvisoDTO(Aviso a, String notaPromedio) {
            this.id = a.getId();
            this.fechaPublicacion = a.getFechaPublicacion() != null ? a.getFechaPublicacion().toLocalDate().toString() : "-";
            this.sector = a.getSector();

            String unidad = a.getUnidadMedida() != null && a.getUnidadMedida().equals("a") ? " años" : (a.getUnidadMedida() != null && a.getUnidadMedida().equals("m") ? " meses" : "");
            this.cantidadTipoEdad = a.getCantidad() + " " + a.getTipo() + " " + a.getEdad() + unidad;

            this.comunaNombre = a.getComuna() != null ? a.getComuna().getNombre() : "N/A";
            this.notaPromedio = notaPromedio;
        }
    }

    public List<AvisoDTO> obtenerAvisosConNotaPromedio() {
        List<Aviso> avisos = avisoRepository.findAll();

        return avisos.stream().map(aviso -> {
            
            double promedio = aviso.getNotas().stream()
                    .mapToInt(Nota::getValor)
                    .average()
                    .orElse(-1.0); 

            String notaPromedioStr;
            if (promedio >= 0) {
                notaPromedioStr = String.format("%.1f", promedio);
            } else {
                notaPromedioStr = "-";
            }

            return new AvisoDTO(aviso, notaPromedioStr);
        }).collect(Collectors.toList());
    }

    
    public Double guardarNota(Integer avisoId, Integer valor) {
        
        Aviso aviso = avisoRepository.findById(avisoId)
                .orElseThrow(() -> new RuntimeException("Aviso no encontrado con ID: " + avisoId));

        
        Nota nuevaNota = new Nota();
        nuevaNota.setValor(valor);
        nuevaNota.setAviso(aviso);
        notaRepository.save(nuevaNota);
        
        
        List<Nota> notasActualizadas = notaRepository.findByAvisoId(avisoId);
        
        
        double nuevoPromedio = notasActualizadas.stream()
                .mapToInt(Nota::getValor)
                .average()
                .orElse(0.0); 

        
        return nuevoPromedio;
    }
}
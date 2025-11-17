package com.notaservice.notaservice.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "aviso_adopcion")
public class Aviso {

    @Id
    private Integer id;

    
    @Column(name = "fecha_ingreso")
    private LocalDateTime fechaPublicacion;
    
   
    private String nombre; 
    private String email;
    private String celular;
    
    @Column(name = "fecha_entrega")
    private LocalDateTime fechaEntrega;
    
    private String descripcion;
   
    private String sector;
    private String tipo;
    private Integer cantidad;
    private Integer edad;

    @Column(name = "unidad_medida")
    private String unidadMedida; 

    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "comuna_id")
    private Comuna comuna;

   
    @OneToMany(mappedBy = "aviso", fetch = FetchType.LAZY)
    private List<Nota> notas;

    

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    public LocalDateTime getFechaPublicacion() { return fechaPublicacion; }
    public void setFechaPublicacion(LocalDateTime fechaPublicacion) { this.fechaPublicacion = fechaPublicacion; }
    public String getSector() { return sector; }
    public void setSector(String sector) { this.sector = sector; }
    public String getTipo() { return tipo; }
    public void setTipo(String tipo) { this.tipo = tipo; }
    public Integer getCantidad() { return cantidad; }
    public void setCantidad(Integer cantidad) { this.cantidad = cantidad; }
    public Integer getEdad() { return edad; }
    public void setEdad(Integer edad) { this.edad = edad; }
    public String getUnidadMedida() { return unidadMedida; }
    public void setUnidadMedida(String unidadMedida) { this.unidadMedida = unidadMedida; }
    public Comuna getComuna() { return comuna; }
    public void setComuna(Comuna comuna) { this.comuna = comuna; }
    public List<Nota> getNotas() { return notas; }
    public void setNotas(List<Nota> notas) { this.notas = notas; }
    
    
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getCelular() { return celular; }
    public void setCelular(String celular) { this.celular = celular; }
    public LocalDateTime getFechaEntrega() { return fechaEntrega; }
    public void setFechaEntrega(LocalDateTime fechaEntrega) { this.fechaEntrega = fechaEntrega; }
    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }
}
package com.notaservice.notaservice.model;
import jakarta.persistence.*;

@Entity
@Table(name = "comuna")
public class Comuna {
    @Id
    private Integer id;
    private String nombre;

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
}
package com.notaservice.notaservice.model;

import jakarta.persistence.*;

@Entity
@Table(name = "nota")
public class Nota {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "nota") 
    private Integer valor;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "aviso_id", nullable = false)
    private Aviso aviso;

    
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    public Integer getValor() { return valor; }
    public void setValor(Integer valor) { this.valor = valor; }
    public Aviso getAviso() { return aviso; }
    public void setAviso(Aviso aviso) { this.aviso = aviso; }
}
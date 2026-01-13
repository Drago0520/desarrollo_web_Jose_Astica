package com.notaservice.notaservice.repository;

import com.notaservice.notaservice.model.Nota;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
public interface NotaRepository extends JpaRepository<Nota, Integer> {
    List<Nota> findByAvisoId(Integer avisoId);
}
package com.notaservice.notaservice.repository;
import com.notaservice.notaservice.model.Aviso;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AvisoRepository extends JpaRepository<Aviso, Integer> {}
package com.powerback.repository;

import com.powerback.entity.Incident;
import com.powerback.entity.IncidentUpdate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IncidentUpdateRepository extends JpaRepository<IncidentUpdate, Long> {
    List<IncidentUpdate> findByIncidentOrderByCreatedAtDesc(Incident incident);
}

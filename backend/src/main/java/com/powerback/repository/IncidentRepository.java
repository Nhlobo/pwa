package com.powerback.repository;

import com.powerback.entity.Incident;
import com.powerback.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface IncidentRepository extends JpaRepository<Incident, Long> {
    List<Incident> findByReporter(User reporter);
    List<Incident> findByAssignedOfficer(User officer);
    List<Incident> findByStatus(Incident.IncidentStatus status);
    List<Incident> findByStatusIn(List<Incident.IncidentStatus> statuses);
    
    @Query("SELECT i FROM Incident i WHERE i.status = :status ORDER BY i.priority DESC, i.createdAt DESC")
    List<Incident> findByStatusOrderByPriorityAndCreatedAt(Incident.IncidentStatus status);
    
    @Query("SELECT i FROM Incident i WHERE i.latitude BETWEEN :minLat AND :maxLat " +
           "AND i.longitude BETWEEN :minLng AND :maxLng")
    List<Incident> findByLocationBounds(Double minLat, Double maxLat, Double minLng, Double maxLng);
    
    @Query("SELECT COUNT(i) FROM Incident i WHERE i.createdAt >= :startDate")
    Long countIncidentsSince(LocalDateTime startDate);
    
    @Query("SELECT i.type, COUNT(i) FROM Incident i GROUP BY i.type")
    List<Object[]> getIncidentCountsByType();
}

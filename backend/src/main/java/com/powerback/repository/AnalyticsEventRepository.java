package com.powerback.repository;

import com.powerback.entity.AnalyticsEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AnalyticsEventRepository extends JpaRepository<AnalyticsEvent, Long> {
    List<AnalyticsEvent> findByEventType(String eventType);
    
    @Query("SELECT a.eventType, COUNT(a) FROM AnalyticsEvent a " +
           "WHERE a.createdAt >= :startDate GROUP BY a.eventType")
    List<Object[]> getEventCountsByTypeSince(LocalDateTime startDate);
    
    @Query("SELECT COUNT(a) FROM AnalyticsEvent a WHERE a.createdAt >= :startDate")
    Long countEventsSince(LocalDateTime startDate);
}

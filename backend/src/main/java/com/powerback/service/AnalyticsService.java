package com.powerback.service;

import com.powerback.entity.AnalyticsEvent;
import com.powerback.entity.User;
import com.powerback.repository.AnalyticsEventRepository;
import com.powerback.repository.IncidentRepository;
import com.powerback.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AnalyticsService {
    
    private final AnalyticsEventRepository analyticsEventRepository;
    private final IncidentRepository incidentRepository;
    private final UserRepository userRepository;
    
    @Transactional
    public void trackEvent(String eventType, String eventData, String userEmail, 
                          String ipAddress, String userAgent) {
        User user = null;
        if (userEmail != null) {
            user = userRepository.findByEmail(userEmail).orElse(null);
        }
        
        AnalyticsEvent event = new AnalyticsEvent();
        event.setUser(user);
        event.setEventType(eventType);
        event.setEventData(eventData);
        event.setIpAddress(ipAddress);
        event.setUserAgent(userAgent);
        
        analyticsEventRepository.save(event);
    }
    
    public Map<String, Object> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        
        LocalDateTime thirtyDaysAgo = LocalDateTime.now().minusDays(30);
        LocalDateTime sevenDaysAgo = LocalDateTime.now().minusDays(7);
        
        stats.put("totalUsers", userRepository.count());
        stats.put("totalIncidents", incidentRepository.count());
        stats.put("incidentsLast30Days", incidentRepository.countIncidentsSince(thirtyDaysAgo));
        stats.put("incidentsLast7Days", incidentRepository.countIncidentsSince(sevenDaysAgo));
        
        List<Object[]> incidentsByType = incidentRepository.getIncidentCountsByType();
        Map<String, Long> typeBreakdown = new HashMap<>();
        for (Object[] row : incidentsByType) {
            typeBreakdown.put(row[0].toString(), (Long) row[1]);
        }
        stats.put("incidentsByType", typeBreakdown);
        
        return stats;
    }
    
    public Map<String, Object> getUserActivityStats(String userEmail) {
        Map<String, Object> stats = new HashMap<>();
        
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        LocalDateTime thirtyDaysAgo = LocalDateTime.now().minusDays(30);
        
        List<Object[]> eventCounts = analyticsEventRepository.getEventCountsByTypeSince(thirtyDaysAgo);
        Map<String, Long> activityBreakdown = new HashMap<>();
        for (Object[] row : eventCounts) {
            activityBreakdown.put(row[0].toString(), (Long) row[1]);
        }
        
        stats.put("activityByType", activityBreakdown);
        stats.put("totalEvents", analyticsEventRepository.countEventsSince(thirtyDaysAgo));
        
        return stats;
    }
}

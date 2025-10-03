package com.powerback.service;

import com.powerback.dto.IncidentRequest;
import com.powerback.dto.IncidentResponse;
import com.powerback.entity.Incident;
import com.powerback.entity.IncidentUpdate;
import com.powerback.entity.User;
import com.powerback.repository.IncidentRepository;
import com.powerback.repository.IncidentUpdateRepository;
import com.powerback.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class IncidentService {
    
    private final IncidentRepository incidentRepository;
    private final IncidentUpdateRepository incidentUpdateRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;
    private final SimpMessagingTemplate messagingTemplate;
    
    @Transactional
    public IncidentResponse createIncident(IncidentRequest request, String userEmail) {
        User reporter = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Incident incident = new Incident();
        incident.setTitle(request.getTitle());
        incident.setDescription(request.getDescription());
        incident.setType(request.getType());
        incident.setLatitude(request.getLatitude());
        incident.setLongitude(request.getLongitude());
        incident.setAddress(request.getAddress());
        incident.setMediaUrls(request.getMediaUrls());
        incident.setReporter(reporter);
        incident.setStatus(Incident.IncidentStatus.PENDING);
        incident.setPriority(determinePriority(request.getType()));
        
        incident = incidentRepository.save(incident);
        
        // Notify police officers about new incident
        notifyPoliceOfficers(incident);
        
        // Send WebSocket update
        messagingTemplate.convertAndSend("/topic/incidents", mapToResponse(incident));
        
        return mapToResponse(incident);
    }
    
    @Transactional
    public IncidentResponse updateIncidentStatus(Long incidentId, Incident.IncidentStatus newStatus, 
                                                 String notes, String userEmail) {
        Incident incident = incidentRepository.findById(incidentId)
                .orElseThrow(() -> new RuntimeException("Incident not found"));
        
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        incident.setStatus(newStatus);
        if (notes != null) {
            incident.setOfficerNotes(notes);
        }
        
        if (newStatus == Incident.IncidentStatus.RESOLVED || newStatus == Incident.IncidentStatus.CLOSED) {
            incident.setResolvedAt(LocalDateTime.now());
        }
        
        incident = incidentRepository.save(incident);
        
        // Create update record
        IncidentUpdate update = new IncidentUpdate();
        update.setIncident(incident);
        update.setUser(user);
        update.setMessage(notes != null ? notes : "Status updated to " + newStatus);
        update.setNewStatus(newStatus);
        incidentUpdateRepository.save(update);
        
        // Notify reporter
        notificationService.notifyIncidentUpdate(incident, user);
        
        // Send WebSocket update
        messagingTemplate.convertAndSend("/topic/incidents/" + incidentId, mapToResponse(incident));
        
        return mapToResponse(incident);
    }
    
    @Transactional
    public IncidentResponse assignIncident(Long incidentId, Long officerId, String userEmail) {
        Incident incident = incidentRepository.findById(incidentId)
                .orElseThrow(() -> new RuntimeException("Incident not found"));
        
        User officer = userRepository.findById(officerId)
                .orElseThrow(() -> new RuntimeException("Officer not found"));
        
        incident.setAssignedOfficer(officer);
        incident.setStatus(Incident.IncidentStatus.ASSIGNED);
        incident = incidentRepository.save(incident);
        
        // Notify assigned officer
        notificationService.notifyIncidentAssignment(incident, officer);
        
        // Send WebSocket update
        messagingTemplate.convertAndSend("/topic/incidents/" + incidentId, mapToResponse(incident));
        
        return mapToResponse(incident);
    }
    
    public List<IncidentResponse> getAllIncidents() {
        return incidentRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
    
    public List<IncidentResponse> getMyIncidents(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        return incidentRepository.findByReporter(user).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
    
    public List<IncidentResponse> getAssignedIncidents(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        return incidentRepository.findByAssignedOfficer(user).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
    
    public List<IncidentResponse> getPendingIncidents() {
        return incidentRepository.findByStatus(Incident.IncidentStatus.PENDING).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
    
    public IncidentResponse getIncidentById(Long id) {
        Incident incident = incidentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Incident not found"));
        return mapToResponse(incident);
    }
    
    private void notifyPoliceOfficers(Incident incident) {
        List<User> policeOfficers = userRepository.findByRole(User.UserRole.POLICE);
        for (User officer : policeOfficers) {
            notificationService.createNotification(
                officer,
                "New Incident Reported",
                incident.getTitle() + " - " + incident.getType(),
                incident.getId()
            );
        }
    }
    
    private Incident.Priority determinePriority(Incident.IncidentType type) {
        return switch (type) {
            case ASSAULT, DOMESTIC_VIOLENCE, FIRE, MEDICAL -> Incident.Priority.HIGH;
            case THEFT, SUSPICIOUS_ACTIVITY -> Incident.Priority.MEDIUM;
            default -> Incident.Priority.LOW;
        };
    }
    
    private IncidentResponse mapToResponse(Incident incident) {
        IncidentResponse response = new IncidentResponse();
        response.setId(incident.getId());
        response.setTitle(incident.getTitle());
        response.setDescription(incident.getDescription());
        response.setType(incident.getType());
        response.setStatus(incident.getStatus());
        response.setPriority(incident.getPriority());
        response.setLatitude(incident.getLatitude());
        response.setLongitude(incident.getLongitude());
        response.setAddress(incident.getAddress());
        response.setMediaUrls(incident.getMediaUrls());
        response.setReporterId(incident.getReporter().getId());
        response.setReporterName(incident.getReporter().getFullName());
        
        if (incident.getAssignedOfficer() != null) {
            response.setAssignedOfficerId(incident.getAssignedOfficer().getId());
            response.setAssignedOfficerName(incident.getAssignedOfficer().getFullName());
        }
        
        response.setOfficerNotes(incident.getOfficerNotes());
        response.setCreatedAt(incident.getCreatedAt());
        response.setUpdatedAt(incident.getUpdatedAt());
        response.setResolvedAt(incident.getResolvedAt());
        
        return response;
    }
}

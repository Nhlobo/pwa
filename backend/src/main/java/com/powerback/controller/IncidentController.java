package com.powerback.controller;

import com.powerback.dto.IncidentRequest;
import com.powerback.dto.IncidentResponse;
import com.powerback.entity.Incident;
import com.powerback.service.IncidentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/incidents")
@RequiredArgsConstructor
public class IncidentController {
    
    private final IncidentService incidentService;
    
    @PostMapping
    public ResponseEntity<IncidentResponse> createIncident(
            @RequestBody IncidentRequest request,
            Authentication authentication) {
        return ResponseEntity.ok(incidentService.createIncident(request, authentication.getName()));
    }
    
    @GetMapping
    public ResponseEntity<List<IncidentResponse>> getAllIncidents() {
        return ResponseEntity.ok(incidentService.getAllIncidents());
    }
    
    @GetMapping("/my")
    public ResponseEntity<List<IncidentResponse>> getMyIncidents(Authentication authentication) {
        return ResponseEntity.ok(incidentService.getMyIncidents(authentication.getName()));
    }
    
    @GetMapping("/assigned")
    public ResponseEntity<List<IncidentResponse>> getAssignedIncidents(Authentication authentication) {
        return ResponseEntity.ok(incidentService.getAssignedIncidents(authentication.getName()));
    }
    
    @GetMapping("/pending")
    public ResponseEntity<List<IncidentResponse>> getPendingIncidents() {
        return ResponseEntity.ok(incidentService.getPendingIncidents());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<IncidentResponse> getIncidentById(@PathVariable Long id) {
        return ResponseEntity.ok(incidentService.getIncidentById(id));
    }
    
    @PutMapping("/{id}/status")
    public ResponseEntity<IncidentResponse> updateStatus(
            @PathVariable Long id,
            @RequestBody Map<String, Object> request,
            Authentication authentication) {
        Incident.IncidentStatus status = Incident.IncidentStatus.valueOf(
                request.get("status").toString()
        );
        String notes = request.get("notes") != null ? request.get("notes").toString() : null;
        
        return ResponseEntity.ok(
                incidentService.updateIncidentStatus(id, status, notes, authentication.getName())
        );
    }
    
    @PutMapping("/{id}/assign")
    public ResponseEntity<IncidentResponse> assignIncident(
            @PathVariable Long id,
            @RequestBody Map<String, Long> request,
            Authentication authentication) {
        return ResponseEntity.ok(
                incidentService.assignIncident(id, request.get("officerId"), authentication.getName())
        );
    }
}

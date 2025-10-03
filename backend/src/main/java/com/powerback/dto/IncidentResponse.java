package com.powerback.dto;

import com.powerback.entity.Incident;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class IncidentResponse {
    private Long id;
    private String title;
    private String description;
    private Incident.IncidentType type;
    private Incident.IncidentStatus status;
    private Incident.Priority priority;
    private Double latitude;
    private Double longitude;
    private String address;
    private Set<String> mediaUrls;
    private Long reporterId;
    private String reporterName;
    private Long assignedOfficerId;
    private String assignedOfficerName;
    private String officerNotes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime resolvedAt;
}

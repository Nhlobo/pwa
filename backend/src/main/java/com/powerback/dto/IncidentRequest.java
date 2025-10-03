package com.powerback.dto;

import com.powerback.entity.Incident;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class IncidentRequest {
    private String title;
    private String description;
    private Incident.IncidentType type;
    private Double latitude;
    private Double longitude;
    private String address;
    private Set<String> mediaUrls;
}

package com.powerback.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "incidents")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Incident {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String title;
    
    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private IncidentType type;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private IncidentStatus status = IncidentStatus.PENDING;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Priority priority = Priority.MEDIUM;
    
    @Column(nullable = false)
    private Double latitude;
    
    @Column(nullable = false)
    private Double longitude;
    
    private String address;
    
    @ElementCollection
    @CollectionTable(name = "incident_media", joinColumns = @JoinColumn(name = "incident_id"))
    @Column(name = "media_url")
    private Set<String> mediaUrls = new HashSet<>();
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reporter_id", nullable = false)
    private User reporter;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_officer_id")
    private User assignedOfficer;
    
    @Column(columnDefinition = "TEXT")
    private String officerNotes;
    
    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedAt;
    
    private LocalDateTime resolvedAt;
    
    @OneToMany(mappedBy = "incident", cascade = CascadeType.ALL)
    private Set<IncidentUpdate> updates = new HashSet<>();
    
    public enum IncidentType {
        THEFT, ASSAULT, VANDALISM, SUSPICIOUS_ACTIVITY, 
        DOMESTIC_VIOLENCE, TRAFFIC, FIRE, MEDICAL, OTHER
    }
    
    public enum IncidentStatus {
        PENDING, ASSIGNED, IN_PROGRESS, RESOLVED, CLOSED, REJECTED
    }
    
    public enum Priority {
        LOW, MEDIUM, HIGH, CRITICAL
    }
}

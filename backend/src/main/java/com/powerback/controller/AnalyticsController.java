package com.powerback.controller;

import com.powerback.service.AnalyticsService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
public class AnalyticsController {
    
    private final AnalyticsService analyticsService;
    
    @PostMapping("/track")
    public ResponseEntity<Void> trackEvent(
            @RequestBody Map<String, String> request,
            Authentication authentication,
            HttpServletRequest httpRequest) {
        analyticsService.trackEvent(
                request.get("eventType"),
                request.get("eventData"),
                authentication != null ? authentication.getName() : null,
                httpRequest.getRemoteAddr(),
                httpRequest.getHeader("User-Agent")
        );
        return ResponseEntity.ok().build();
    }
    
    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        return ResponseEntity.ok(analyticsService.getDashboardStats());
    }
    
    @GetMapping("/user-activity")
    public ResponseEntity<Map<String, Object>> getUserActivity(Authentication authentication) {
        return ResponseEntity.ok(analyticsService.getUserActivityStats(authentication.getName()));
    }
}

package com.powerback.service;

import com.powerback.entity.Incident;
import com.powerback.entity.Notification;
import com.powerback.entity.User;
import com.powerback.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService {
    
    private final NotificationRepository notificationRepository;
    private final SimpMessagingTemplate messagingTemplate;
    private final FirebaseNotificationService firebaseNotificationService;
    
    @Transactional
    public Notification createNotification(User user, String title, String message, Long incidentId) {
        Notification notification = new Notification();
        notification.setUser(user);
        notification.setTitle(title);
        notification.setMessage(message);
        notification.setRelatedIncidentId(incidentId);
        notification.setType(Notification.NotificationType.INCIDENT_CREATED);
        
        notification = notificationRepository.save(notification);
        
        // Send WebSocket notification
        messagingTemplate.convertAndSendToUser(
            user.getEmail(),
            "/queue/notifications",
            notification
        );
        
        // Send push notification if user has FCM token
        if (user.getFcmToken() != null) {
            firebaseNotificationService.sendPushNotification(user.getFcmToken(), title, message);
        }
        
        return notification;
    }
    
    public void notifyIncidentUpdate(Incident incident, User updater) {
        String title = "Incident Updated";
        String message = "Your incident '" + incident.getTitle() + "' has been updated";
        
        Notification notification = new Notification();
        notification.setUser(incident.getReporter());
        notification.setTitle(title);
        notification.setMessage(message);
        notification.setRelatedIncidentId(incident.getId());
        notification.setType(Notification.NotificationType.INCIDENT_UPDATED);
        
        notificationRepository.save(notification);
        
        messagingTemplate.convertAndSendToUser(
            incident.getReporter().getEmail(),
            "/queue/notifications",
            notification
        );
        
        if (incident.getReporter().getFcmToken() != null) {
            firebaseNotificationService.sendPushNotification(
                incident.getReporter().getFcmToken(), title, message
            );
        }
    }
    
    public void notifyIncidentAssignment(Incident incident, User officer) {
        String title = "New Incident Assigned";
        String message = "You have been assigned to: " + incident.getTitle();
        
        Notification notification = new Notification();
        notification.setUser(officer);
        notification.setTitle(title);
        notification.setMessage(message);
        notification.setRelatedIncidentId(incident.getId());
        notification.setType(Notification.NotificationType.INCIDENT_ASSIGNED);
        
        notificationRepository.save(notification);
        
        messagingTemplate.convertAndSendToUser(
            officer.getEmail(),
            "/queue/notifications",
            notification
        );
        
        if (officer.getFcmToken() != null) {
            firebaseNotificationService.sendPushNotification(
                officer.getFcmToken(), title, message
            );
        }
    }
    
    public List<Notification> getUserNotifications(String userEmail) {
        User user = new User();
        user.setEmail(userEmail);
        return notificationRepository.findByUserOrderByCreatedAtDesc(user);
    }
    
    @Transactional
    public void markAsRead(Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        notification.setRead(true);
        notificationRepository.save(notification);
    }
}

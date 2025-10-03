package com.powerback.service;

import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.Message;
import com.google.firebase.messaging.Notification;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class FirebaseNotificationService {
    
    public void sendPushNotification(String fcmToken, String title, String body) {
        try {
            // PLACEHOLDER: Configure Firebase Admin SDK with your service account credentials
            // Initialize Firebase in a @PostConstruct method with:
            // FileInputStream serviceAccount = new FileInputStream("path/to/serviceAccountKey.json");
            // FirebaseOptions options = FirebaseOptions.builder()
            //     .setCredentials(GoogleCredentials.fromStream(serviceAccount))
            //     .build();
            // FirebaseApp.initializeApp(options);
            
            Message message = Message.builder()
                    .setToken(fcmToken)
                    .setNotification(Notification.builder()
                            .setTitle(title)
                            .setBody(body)
                            .build())
                    .build();
            
            String response = FirebaseMessaging.getInstance().send(message);
            log.info("Successfully sent notification: {}", response);
        } catch (Exception e) {
            log.error("Error sending push notification", e);
        }
    }
}

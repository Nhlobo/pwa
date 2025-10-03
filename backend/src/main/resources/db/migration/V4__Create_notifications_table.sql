-- Create notifications table
CREATE TABLE notifications (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('INCIDENT_CREATED', 'INCIDENT_ASSIGNED', 'INCIDENT_UPDATED', 
                                              'INCIDENT_RESOLVED', 'SYSTEM_ALERT', 'COMMUNITY_UPDATE')),
    read BOOLEAN NOT NULL DEFAULT FALSE,
    related_incident_id BIGINT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at);

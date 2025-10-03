-- Create incidents table
CREATE TABLE incidents (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    description TEXT NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('THEFT', 'ASSAULT', 'VANDALISM', 'SUSPICIOUS_ACTIVITY', 
                                              'DOMESTIC_VIOLENCE', 'TRAFFIC', 'FIRE', 'MEDICAL', 'OTHER')),
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'ASSIGNED', 'IN_PROGRESS', 
                                                                     'RESOLVED', 'CLOSED', 'REJECTED')),
    priority VARCHAR(50) NOT NULL DEFAULT 'MEDIUM' CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    address VARCHAR(500),
    reporter_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    assigned_officer_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
    officer_notes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP
);

-- Create incident_media table for storing media URLs
CREATE TABLE incident_media (
    incident_id BIGINT NOT NULL REFERENCES incidents(id) ON DELETE CASCADE,
    media_url VARCHAR(1000) NOT NULL,
    PRIMARY KEY (incident_id, media_url)
);

-- Create indexes for better query performance
CREATE INDEX idx_incidents_reporter ON incidents(reporter_id);
CREATE INDEX idx_incidents_assigned_officer ON incidents(assigned_officer_id);
CREATE INDEX idx_incidents_status ON incidents(status);
CREATE INDEX idx_incidents_type ON incidents(type);
CREATE INDEX idx_incidents_created_at ON incidents(created_at);
CREATE INDEX idx_incidents_location ON incidents(latitude, longitude);

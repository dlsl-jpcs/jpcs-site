CREATE TABLE upcoming_events (
    id SERIAL PRIMARY KEY,
    event_name VARCHAR(255) NOT NULL,
    event_date VARCHAR(255) NOT NULL,
    event_time VARCHAR(255) NOT NULL,
    event_location VARCHAR(255) NOT NULL,
    event_description TEXT NOT NULL,  
    registration_link VARCHAR(255) NOT NULL,
    organization_names VARCHAR(255) NOT NULL,
    facebook_link VARCHAR(255) NOT NULL,
    instagram_link VARCHAR(255) NOT NULL,
);
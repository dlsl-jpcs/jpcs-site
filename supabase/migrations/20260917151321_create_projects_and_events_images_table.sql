CREATE TABLE projects_and_events_images (
    id SERIAL PRIMARY KEY,
    project_id INT NOT NULL REFERENCES projects_and_events(id) ON DELETE CASCADE,
    image_url VARCHAR(255) NOT NULL,
    alt_text VARCHAR(255) NOT NULL,
    display_order INT NOT NULL
);
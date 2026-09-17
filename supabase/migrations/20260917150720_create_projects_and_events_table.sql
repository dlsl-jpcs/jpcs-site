CREATE TABLE projects_and_events (
    id SERIAL PRIMARY KEY,
    project_name VARCHAR(255) NOT NULL,
    project_description TEXT NOT NULL,
    project_date VARCHAR(255) NOT NULL,
    organization_names VARCHAR(255) NOT NULL,
    facebook_link VARCHAR(255) NOT NULL,
    instagram_link VARCHAR(255) NOT NULL
)
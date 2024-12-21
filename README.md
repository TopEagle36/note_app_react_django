# Note App with React, Django, and MySQL - Docker Setup

This repository demonstrates a full-stack application built using React for the frontend, Django for the backend, and MySQL as the database. The project is Dockerized using Docker Compose for easy setup and management.

**Each of the backend (notes_app) and frontend (daily-note) folders contains its own README file with detailed descriptions.!**

## Prerequisites

`Docker`(Docker Engine and Docker Compose).\
`Node.js`.\
`Python`.\
`MySQL`.\
`Git`.\

## Project Structure

`notes_app/` - Backend application using Django.\
`daily-note/` - Frontend application using React.\
`docker-compose.yml` - The Docker Compose configuration file.\
`Dockerfile` (in both notes_app/ and daily-note/) - The Dockerfiles for backend and frontend.

### Clone the repository

```bash
git clone https://github.com/TopEagle36/note_app_react_django.git
cd note_app_react_django
```

### Build and Start Containers

```bash
docker-compose up --build
```

This command will:
- Build Docker images for the frontend (React), backend (Django), and MySQL.
- Start all containers (frontend, backend, db).
- Map ports:
```plaintext
    Frontend: http://localhost:3000
    Backend: http://localhost:8000
    MySQL: localhost:3306
```

### Migrating

- Creating Migrations
```bash
docker-compose exec backend python manage.py makemigrations
```

- Apply Migrations to db
```bash
docker-compose exec backend python manage.py migrate
```

### Running Tests in Docker

```bash
docker-compose exec backend python manage.py test
```

### Stopping the containers

```bash
docker-compose down
```

```base
docker-compose down --volumes
```

### Troubleshooting

- Port already in use: If you get an error about a port already being in use (e.g., port 3000), try stopping the process occupying the port or change the port mapping in docker-compose.yml.\
- Database connection error: Ensure that the MySQL container is fully started before running the backend. You can check container logs using docker-compose logs db.
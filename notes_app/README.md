# Project Overview

This is Django backend part of the note app.
This project was bootstrapped with [Django](https://www.djangoproject.com/start/).

## Assumptions

The backend is built using Django and Django Rest Framework (DRF).\
JWT Authentication is used for managing user sessions.\
A MySQL is used for storing data.\
The application allows users to register, log in, and manage notes, including creating, updating, and deleting them.

## Technical Design & Architecture

`Django`: The backend is built using Django, which handles URL routing, views, and database interaction.
`Django Rest Framework (DRF)`: Used for creating RESTful APIs for handling CRUD operations for notes and user authentication.
`JWT Authentication`: Utilized for secure authentication and session management.
`MySQL`: The database used for storing user data and notes.
`Models`: The backend contains a User model (built using AbstractBaseUser) for user management and a Note model for managing notes.
`Views`: API views are built using DRF's APIView and ModelViewSet to handle auth/note operations.
`Serializers`: Used to convert model instances into JSON format and validate incoming data.
`CORS`: Enabled to allow frontend (React) and backend (Django) to communicate.

## Instructions to Run

### Clone the repository

```bash
git clone https://github.com/TopEagle36/note_app_react_django
cd note_app_react_django/notes_app
```

### Install the dependencies

```bash
pip install -r requirements.txt
```

### Install MySQL.

[Download URL](https://mariadb.org/download/)
**Note: This version of Django requires a MariaDB version higher than 5.**

### Run DB migrate

```bash
python manage.py migrate
```

### Run test

```bash
python manage.py test
```

### Run the server

```bash
python manage.py runserver
```



# Project Overview

This is React frontend part of the note app.
This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Assumptions

The application is built with React, and it uses Material UI for the UI components.\
The application communicates with the backend via API calls using axios.\
JWT Authentication is used for user login and registration.\
The application is designed to allow users to create, update, view, and delete notes with an in-app audio recording attached to them.

## Technical Design & Architecture

`React.js`: Used to build the user interface. Functional components and hooks (`useState`, `useEffect`, `useContext`, etc.) are used for managing state and side effects.\
`State Management`: `AuthContext` is used for managing user authentication state globally.
`Material UI`: Provides the UI components such as `TextField`, `Button`, `Card`, etc., which help to build a responsive and accessible UI.
`Audio Recording`: `react-mic` is used for recording audio and attaching it to notes.
`Axios`: Used for making API requests to the backend.
`Jest`: Used for testing.

## Instructions to Run

### Clone the repository

```bash
git clone https://github.com/TopEagle36/note_app_react_django
cd note_app_react_django/daily-note
```

### Install dependencies

```bash
npm install --force
```
**Note: --force used because react-mic requires to use react@16 but I used the latest React version!**

### Run test

```bash
npm test
```

### Run the development server

```bash
npm start
```
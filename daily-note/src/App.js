import React from 'react';
import {BrowserRouter, Routes, Route} from 'react-router';
import { SnackbarProvider } from 'notistack';
import { AuthProvider } from "./context/AuthContext";
import Header from './components/Header';
import SignUp from './components/auth/SignUp';
import SignIn from './components/auth/SignIn.js';
import Home from './components/Home';
import Notes from './components/notes/Notes.js';
import NoteDetail from './components/notes/NoteDetail.js';
import NoteForm from './components/notes/NoteForm.js';

function App() {
  return (
    <>
      <SnackbarProvider anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}>
        <AuthProvider>
          <BrowserRouter>
            <Header/>
            <Routes>

              <Route path='/' element={<Home/>}/>
              <Route path='/signup' element={<SignUp/>}/>
              <Route path='/signin' element={<SignIn/>}/>
              <Route path= '/notes' element={<Notes/>}/>
              <Route path= '/note/view/:id' element={<NoteDetail/>}/>
              <Route path= '/note/create' element={<NoteForm/>}/>
              <Route path='/note/edit/:id' element={<NoteForm/>}/>
            </Routes>
            
          </BrowserRouter>  
        </AuthProvider>
      </SnackbarProvider>
    </>
    
  );
}

export default App;

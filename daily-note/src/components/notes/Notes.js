import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router';
import axios from 'axios';
import { enqueueSnackbar } from 'notistack';
import { AuthContext } from '../../context/AuthContext';
import { server_uri } from '../../config/constant';

// MUI Components
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Button, IconButton, Paper, Typography, Box, Container, CircularProgress } from '@mui/material';
import { Edit, Delete, Visibility } from '@mui/icons-material';

function Notes() {
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const { getAccessToken } = useContext(AuthContext);
    const navigate = useNavigate();
    const token = getAccessToken();
    // Redirect to login page if no token exists

    if (!token) {
        navigate('/signin');
    }
    useEffect(() => {
        
        const fetchNotes = async () => {
            try {
                const response = await axios.get(`${server_uri}/api/notes/notes/`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setNotes(response.data);
            } catch (err) {
                console.error('Error fetching notes:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchNotes();
    }, [token]);

    const handleSearchChange = (e) => {
        setSearch(e.target.value);
    };

    const handleCreateNote = () => {
        navigate('/note/create'); // Navigate to the Create Note page
    };

    const handleViewNote = (id) => {
        navigate(`/note/view/${id}`); // Navigate to the Note Detail page
    };

    const handleEditNote = (id) => {
        navigate(`/note/edit/${id}`); // Navigate to the Edit Note page
    };

    const handleDeleteNote = async (id) => {
        try {
            const response = await axios.delete(`${server_uri}/api/notes/notes/${id}/`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setNotes(notes.filter((note) => note.id !== id)); // Remove deleted note from the list
            if(response?.status === 204){
                enqueueSnackbar(`Note deleted successfully!`, {variant: 'success'});
            }
        } catch (err) {
            console.error('Error deleting note:', err);
        }
    };

    // Filter notes by search term
    const filteredNotes = notes.filter((note) => 
        note.title.toLowerCase().includes(search.toLowerCase()) || 
        note.description.toLowerCase().includes(search.toLowerCase())
    );

    return loading ? (
        
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}><CircularProgress /></Box>
    ) : (
        <Container sx={{py: 5}}>
            {/* Search and Create New Note Button */}
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <TextField 
                    label="Search Notes" 
                    variant="outlined" 
                    value={search}
                    onChange={handleSearchChange}
                    sx={{ width: 600 }}
                />
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleCreateNote}
                    sx={{ marginLeft: 2 }}
                >
                    Create New Note
                </Button>
            </Box>

            {/* Table */}
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                Title
                            </TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredNotes.map((note) => (
                            <TableRow key={note.id}>
                                <TableCell>{note.title}</TableCell>
                                <TableCell sx={{maxWidth: 1000, width: 500}}>{note.description}</TableCell>
                                <TableCell>
                                    <IconButton
                                        color="primary"
                                        onClick={() => handleViewNote(note.id)}
                                    >
                                        <Visibility />
                                    </IconButton>
                                    <IconButton
                                        color="secondary"
                                        onClick={() => handleEditNote(note.id)}
                                    >
                                        <Edit />
                                    </IconButton>
                                    <IconButton
                                        color="error"
                                        onClick={() => handleDeleteNote(note.id)}
                                    >
                                        <Delete />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
}

export default Notes;

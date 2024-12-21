import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router';
import { ReactMic } from 'react-mic';
import { enqueueSnackbar } from 'notistack';
import { AuthContext } from '../../context/AuthContext';
import { server_uri } from '../../config/constant';

import {
    Box,
    Button,
    TextField,
    Typography,
    Card,
    CardContent,
    CardActions,
    FormControl,
    FormHelperText,
    CircularProgress,
} from '@mui/material';

function NoteForm() {
    const { id } = useParams();
    const { getAccessToken } = useContext(AuthContext);
    const token = getAccessToken();
    const navigate = useNavigate();
    // Redirect to login page if no token exists
    if (!token) {
        navigate('/signin');
    }

    const [note, setNote] = useState({ title: '', description: '' });
    const [isEditing, setIsEditing] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [audioBlob, setAudioBlob] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    // Handle form input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setNote((prevNote) => ({ ...prevNote, [name]: value }));
    };

    const handleStartRecording = () => {
        setError(null); // Reset error before starting
        navigator.mediaDevices.getUserMedia({ audio: true })
            .then(() => setIsRecording(true))
            .catch((err) => {
                console.error('Microphone access error:', err);
                setError('Microphone not found or access denied. Please check your device and permissions.');
            });
    };

    const handleStopRecording = () => setIsRecording(false);

    const handleOnStop = (recordedBlob) => {
        setAudioBlob(recordedBlob.blob);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); // Start the loading spinner

        const formData = new FormData();
        formData.append('title', note.title);
        formData.append('description', note.description);
        if (audioBlob) formData.append('audio_file', new Blob([audioBlob], { type: 'audio/wav' }));

        try {
            let response;
            if (isEditing) {
                response = await axios.put(
                    `${server_uri}/api/notes/notes/${id}/`,
                    formData,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'multipart/form-data',
                        },
                    }
                );
            } else {
                response = await axios.post(
                    `${server_uri}/api/notes/notes/`,
                    formData,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'multipart/form-data',
                        },
                    }
                );
            }
            if (response?.status === 200 || response?.status === 201) {
                enqueueSnackbar("Successfully saved on server!", {variant: 'success'});
                navigate(`/note/view/${response.data.id}`);
            }
        } catch (err) {
            console.error('Error saving note:', err);
            setError('An error occurred while saving the note. Please try again.');
        } finally {
            setLoading(false); // Reset the loading spinner, regardless of success or failure
        }
    };

    useEffect(() => {
        if (id) {
            setIsEditing(true);
            const fetchNote = async () => {
                try {
                    const response = await axios.get(
                        `${server_uri}/api/notes/notes/${id}/`,
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    );
                    setNote(response.data);
                } catch (e) {
                    console.error('Error fetching note:', e);
                    setError('Failed to fetch the note.');
                }
            };
            fetchNote();
        }
    }, [id, token]);

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '92vh',
            }}
        >
            <Card sx={{ maxWidth: 600, width: '100%' }}>
                <CardContent>
                    <Typography variant="h5" component="div" gutterBottom>
                        {isEditing ? 'Edit Note' : 'Create Note'}
                    </Typography>
                    <form onSubmit={handleSubmit}>
                        <FormControl fullWidth margin="normal">
                            <TextField
                                label="Title"
                                variant="outlined"
                                name="title"
                                value={note.title}
                                onChange={handleChange}
                                required
                            />
                        </FormControl>
                        <FormControl fullWidth margin="normal">
                            <TextField
                                label="Description"
                                variant="outlined"
                                name="description"
                                value={note.description}
                                onChange={handleChange}
                                multiline
                                rows={4}
                                required
                            />
                        </FormControl>
                        <FormControl fullWidth margin="normal">
                            <Typography variant="subtitle1" gutterBottom>
                                Audio Recording
                            </Typography>
                            <ReactMic
                                record={isRecording}
                                onStop={handleOnStop}
                                strokeColor="#000000"
                                backgroundColor="#FF4081"
                            />
                            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                                <Button
                                    variant="contained"
                                    onClick={handleStartRecording}
                                    disabled={isRecording}
                                >
                                    Start Recording
                                </Button>
                                <Button
                                    variant="contained"
                                    color="error"
                                    onClick={handleStopRecording}
                                    disabled={!isRecording}
                                >
                                    Stop Recording
                                </Button>
                            </Box>
                            {error && (
                                <FormHelperText error>{error}</FormHelperText>
                            )}
                            {audioBlob && (
                                <audio
                                    controls
                                    src={URL.createObjectURL(audioBlob)}
                                    style={{ marginTop: '1rem', width: '100%' }}
                                ></audio>
                            )}
                        </FormControl>
                        <CardActions sx={{ justifyContent: 'flex-end' }}>
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                disabled={loading}
                            >
                                {loading ? <CircularProgress size={24} /> : (isEditing ? 'Update Note' : 'Create Note')}
                            </Button>
                        </CardActions>
                    </form>
                </CardContent>
            </Card>
        </Box>
    );
}

export default NoteForm;

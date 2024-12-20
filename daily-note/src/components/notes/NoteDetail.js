import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router';
import { AuthContext } from '../../context/AuthContext';
import { server_uri } from '../../config/constant';

import {
    Box,
    Card,
    CardContent,
    Typography,
    CircularProgress,
} from '@mui/material';

function NoteDetail() {
    const { id } = useParams();
    const { getAccessToken } = useContext(AuthContext);
    const token = getAccessToken();
    const navigate = useNavigate();
    // Redirect to login page if no token exists

    if (!token) {
        navigate('/signin');
    }
    const [note, setNote] = useState(null);

    useEffect(() => {
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
            } catch (err) {
                console.error('Error fetching note:', err);
            }
        };
        fetchNote();
    }, [id, token]);

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '92vh',
                backgroundColor: '#f4f6f8',
            }}
        >
            {note ? (
                <Card sx={{ maxWidth: 600, width: '100%', p: 2 }}>
                    <CardContent>
                        <Typography variant="h5" gutterBottom>
                            {note.title}
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            {note.description}
                        </Typography>
                        {note.audio_file && (
                            <Box
                                sx={{
                                    mt: 2,
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}
                            >
                                <audio controls>
                                    <source
                                        src={`${note.audio_file}`}
                                        type="audio/wav"
                                    />
                                </audio>
                            </Box>
                        )}
                    </CardContent>
                </Card>
            ) : (
                <CircularProgress />
            )}
        </Box>
    );
}

export default NoteDetail;

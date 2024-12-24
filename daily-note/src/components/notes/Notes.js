import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router';
import axios from 'axios';
import { enqueueSnackbar } from 'notistack';
import { AuthContext } from '../../context/AuthContext';
import { server_uri } from '../../config/constant';

function Notes() {
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const { getAccessToken } = useContext(AuthContext);
    const navigate = useNavigate();
    const token = getAccessToken();

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
        navigate('/note/create');
    };

    const handleViewNote = (id) => {
        navigate(`/note/view/${id}`);
    };

    const handleEditNote = (id) => {
        navigate(`/note/edit/${id}`);
    };

    const handleDeleteNote = async (id) => {
        try {
            const response = await axios.delete(`${server_uri}/api/notes/notes/${id}/`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setNotes(notes.filter((note) => note.id !== id));
            if (response?.status === 204) {
                enqueueSnackbar(`Note deleted successfully!`, { variant: 'success' });
            }
        } catch (err) {
            console.error('Error deleting note:', err);
        }
    };

    const filteredNotes = notes.filter((note) =>
        note.title.toLowerCase().includes(search.toLowerCase()) ||
        note.description.toLowerCase().includes(search.toLowerCase())
    );

    return loading ? (
        <div>Loading...</div>
    ) : (
        <>
            <style>
                {`
                    .container {
                        padding: 20px;
                    }
                    .header {
                        display: flex;
                        justify-content: space-between;
                        margin-bottom: 20px;
                    }
                    .search-input {
                        width: 60%;
                        padding: 10px;
                        font-size: 16px;
                    }
                    .create-button {
                        padding: 10px 20px;
                        background-color: #007bff;
                        color: #fff;
                        border: none;
                        cursor: pointer;
                    }
                    .table {
                        width: 100%;
                        border-collapse: collapse;
                    }
                    .th, .td {
                        padding: 10px;
                        border: 1px solid #ddd;
                    }
                    .th {
                        background-color: #f4f4f4;
                        text-align: left;
                    }
                    .actions {
                        display: flex;
                        gap: 10px;
                    }
                    .action-button {
                        padding: 5px 10px;
                        border: none;
                        cursor: pointer;
                    }
                    .view-button {
                        background-color: #28a745;
                        color: #fff;
                    }
                    .edit-button {
                        background-color: #ffc107;
                        color: #fff;
                    }
                    .delete-button {
                        background-color: #ff4d4d;
                        color: #fff;
                    }
                `}
            </style>

            {/* React component JSX */}
            <div className="container">
                <div className="header">
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Search Notes"
                        value={search}
                        onChange={handleSearchChange}
                    />
                    <button className="create-button" onClick={handleCreateNote}>
                        Create New Note
                    </button>
                </div>
                <table className="table">
                    <thead>
                        <tr>
                            <th className="th">Title</th>
                            <th className="th">Description</th>
                            <th className="th">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredNotes.map((note) => (
                            <tr key={note.id}>
                                <td className="td">{note.title}</td>
                                <td className="td">{note.description}</td>
                                <td className="td actions">
                                    <button className="action-button view-button" onClick={() => handleViewNote(note.id)}>
                                        View
                                    </button>
                                    <button className="action-button edit-button" onClick={() => handleEditNote(note.id)}>
                                        Edit
                                    </button>
                                    <button className="action-button delete-button" onClick={() => handleDeleteNote(note.id)}>
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}

export default Notes;

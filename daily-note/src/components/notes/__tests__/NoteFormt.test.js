import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import NoteForm from '../NoteForm'; // Importing the NoteForm component
import { AuthProvider } from '../../../context/AuthContext'; // Importing the AuthProvider
import { BrowserRouter } from 'react-router'; // Importing BrowserRouter for routing
import userEvent from '@testing-library/user-event';
import axios from 'axios';

// Mocking axios for API calls in the test
jest.mock('axios');

// Mocking ReactMic component to avoid canvas and audio API issues
jest.mock('react-mic', () => ({
  ReactMic: ({ record, onStop }) => (
    <div>
      <button onClick={() => onStop({ blob: new Blob([''], { type: 'audio/wav' }) })}>
        Stop Recording
      </button>
    </div>
  ),
}));

// Wrapping the NoteForm component with AuthProvider and BrowserRouter
const Wrapper = ({ children }) => (
  <AuthProvider>
    <BrowserRouter>
      {children}
    </BrowserRouter>
  </AuthProvider>
);

test('renders NoteForm component and submits form', async () => {
  // Mocking the API response for form submission
  axios.post.mockResolvedValue({ status: 201, data: { id: 1 } });

  // Render the NoteForm component within the context provider and router
  render(<NoteForm />, { wrapper: Wrapper });

  // Interact with the form fields
  fireEvent.change(screen.getByLabelText(/title/i), { target: { value: 'Test Note' } });
  fireEvent.change(screen.getByLabelText(/description/i), { target: { value: 'This is a test note description.' } });

  // Start the recording (this will be mocked to stop immediately)
  userEvent.click(screen.getByText(/start recording/i));

  // Stop the recording
  userEvent.click(screen.getByText(/stop recording/i));

  // Wait for the form to be submitted (simulate submitting the form)
  userEvent.click(screen.getByRole('button', { name: /create note/i }));

  // Wait for axios mock to resolve and ensure the form submission is handled
  await waitFor(() => expect(axios.post).toHaveBeenCalledTimes(1));

  // Check if the API was called with the correct form data
  expect(axios.post).toHaveBeenCalledWith(
    expect.stringContaining('/api/notes/notes/'),
    expect.objectContaining({
      title: 'Test Note',
      description: 'This is a test note description.',
    }),
    expect.objectContaining({
      headers: expect.objectContaining({
        'Content-Type': 'multipart/form-data',
      }),
    })
  );
});

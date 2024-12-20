// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';

// Polyfill TextEncoder and TextDecoder for Jest
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
global.AudioContext = jest.fn().mockImplementation(() => ({
  // Mock methods of AudioContext that are required
  createAnalyser: jest.fn().mockReturnValue({}),
  createGain: jest.fn(),
  decodeAudioData: jest.fn(),
  close: jest.fn(),
  suspend: jest.fn(),
  resume: jest.fn(),
  // Add more methods if necessary
}));

global.webkitAudioContext = global.AudioContext; // Mock for older browsers if needed
  
// @vitest-environment jsdom
import '@testing-library/jest-dom';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import AdminPage from './components/AdminPage';

describe('Frontend + API Workflow Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
  });

  it('binds the complete form payload and routes to the correct sequential backend APIs', async () => {
    // Intercept Initial Mount GET
    global.fetch.mockResolvedValueOnce({
      json: () => Promise.resolve([]),
    });

    render(<AdminPage />);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    // Intercept the API 2: Create POST request
    global.fetch.mockResolvedValueOnce({
      json: () => Promise.resolve({ book_id: 42 }),
    });

    // Intercept the API 1: Reload completely
    global.fetch.mockResolvedValueOnce({
      json: () => Promise.resolve([{ book_id: 42, book_name: 'Continuous Integration' }]),
    });

    // Populate the Frontend DOM modules
    fireEvent.change(screen.getByPlaceholderText('e.g. The Pragmatic Programmer'), {
      target: { value: 'Continuous Integration' },
    });
    fireEvent.change(screen.getByPlaceholderText('e.g. Andy Hunt'), {
      target: { value: 'Martin Fowler' },
    });
    fireEvent.change(screen.getByPlaceholderText('e.g. Addison-Wesley'), {
      target: { value: 'OReilly' },
    });
    fireEvent.change(screen.getByPlaceholderText('29.99'), { target: { value: '55.00' } });

    // Submit the Form directly from its parent node wrapper to bypass strict HTML5 file `required` loop checks inside JSDOM natively
    const form = screen.getByText('Publish Book').closest('form');
    fireEvent.submit(form);

    // Validate the exact integration interaction with the mocked backend module
    await waitFor(() => {
      const calls = global.fetch.mock.calls;
      // Find the specific API 2 POST execution
      const postCall = calls.find((call) => call[1] && call[1].method === 'POST');
      expect(postCall).toBeTruthy();

      // Ensure the Network integration structured the FormData correctly
      const formData = postCall[1].body;
      expect(formData.get('book_name')).toBe('Continuous Integration');
      expect(formData.get('book_author')).toBe('Martin Fowler');
      expect(formData.get('book_cost')).toBe('55.00');
    });
  });
});

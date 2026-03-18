// @vitest-environment jsdom
import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import UserPage from './components/UserPage';

// Mock the fetch API globally strictly for Unit Testing functions
global.fetch = vi.fn();

describe('UserPage Component Testing', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading state initially by default', () => {
    // Simulate a pending promise network request
    global.fetch.mockImplementation(() => new Promise(() => {}));

    render(<UserPage />);
    expect(screen.getByText(/Loading collection.../i)).toBeInTheDocument();
  });

  it('renders mock books after successful data fetch', async () => {
    const mockBooks = [
      {
        book_id: 1,
        book_name: 'The Pragmatic Programmer',
        book_author: 'Andy & Dave',
        book_cost: 39.99,
        book_publication: 'Addison-Wesley',
        book_link: 'http://example.com',
      },
    ];

    // Fulfill the API request mock
    global.fetch.mockResolvedValue({
      json: () => Promise.resolve(mockBooks),
    });

    render(<UserPage />);

    // Wait for the async component to resolve the render loop
    await waitFor(() => {
      expect(screen.getByText('The Pragmatic Programmer')).toBeInTheDocument();
    });

    expect(screen.getByText(/Andy & Dave/i)).toBeInTheDocument();
    expect(screen.getByText('$39.99')).toBeInTheDocument();
  });
});

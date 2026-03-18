import { useState, useEffect } from 'react';
import { ExternalLink, User, Calendar } from 'lucide-react';

export default function UserPage() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/books`)
      .then((res) => res.json())
      .then((data) => {
        setBooks(data);
        setLoading(false);
      });
  }, []);

  if (loading)
    return <div style={{ fontSize: '1.2rem', fontWeight: 600 }}>Loading collection...</div>;

  return (
    <div>
      <h1 className="page-title">
        Discover <span>Knowledge</span>
      </h1>

      <div className="book-grid">
        {books.map((book, i) => (
          <div key={book.book_id} className="book-card" style={{ animationDelay: `${i * 0.1}s` }}>
            <h2 className="book-title">{book.book_name}</h2>
            <p className="book-author">
              <User size={14} style={{ display: 'inline', marginRight: '4px' }} />
              {book.book_author}
            </p>
            <div className="book-meta">
              <Calendar size={14} /> Published by {book.book_publication}
            </div>

            <div className="book-footer">
              <span className="book-cost">
                ${book.book_cost ? book.book_cost.toFixed(2) : '0.00'}
              </span>
              <a href={book.book_link} target="_blank" rel="noreferrer" className="btn-open">
                Open <ExternalLink size={16} />
              </a>
            </div>
          </div>
        ))}
        {books.length === 0 && (
          <div
            style={{
              gridColumn: '1 / -1',
              textAlign: 'center',
              padding: '3rem',
              color: '#64748b',
              fontSize: '1.2rem',
            }}
          >
            No books available in the library yet.
          </div>
        )}
      </div>
    </div>
  );
}

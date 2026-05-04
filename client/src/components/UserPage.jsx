import { useState, useEffect } from 'react';
import { ExternalLink, User, Calendar, X, AlertCircle } from 'lucide-react';
import { API_BASE_URL } from '../lib/api';

export default function UserPage() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [readingBook, setReadingBook] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/books`)
      .then((res) => res.json())
      .then((data) => {
        setBooks(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const openReader = (book) => {
    setReadingBook(book);
  };

  const closeReader = () => {
    setReadingBook(null);
  };

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
              <button onClick={() => openReader(book)} className="btn-open-reader">
                Read Now <ExternalLink size={16} />
              </button>
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

      {/* Reading Modal Popup Screen */}
      {readingBook && (
        <div className="reader-modal-overlay">
          <div className="reader-modal">
            <div className="reader-modal-header">
              <div>
                <h2>{readingBook.book_name}</h2>
                <p>By {readingBook.book_author}</p>
              </div>
              <button onClick={closeReader} className="btn-close-reader">
                <X size={24} />
              </button>
            </div>
            <div className="reader-modal-content">
              {readingBook.book_link ? (
                <iframe
                  src={readingBook.book_link}
                  title={`Read ${readingBook.book_name}`}
                  className="reader-frame"
                >
                  <p>Your browser doesn&apos;t support iframes.</p>
                </iframe>
              ) : (
                <div className="reader-no-document">
                  <AlertCircle size={48} color="#e11d48" style={{ marginBottom: '1rem' }} />
                  <h3>Document unavailable</h3>
                  <p>
                    This digital asset has not been uploaded to the database yet. Please check back
                    later.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

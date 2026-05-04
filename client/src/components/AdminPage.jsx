import { useState, useEffect, useRef } from 'react';
import { UploadCloud, FileText, Edit2, X, Trash2 } from 'lucide-react';
import { API_BASE_URL } from '../lib/api';

export default function AdminPage() {
  const [books, setBooks] = useState([]);
  const [editingBook, setEditingBook] = useState(null);
  const [formData, setFormData] = useState({
    book_name: '',
    book_author: '',
    book_publication: '',
    book_cost: '',
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const fetchBooks = () => {
    fetch(`${API_BASE_URL}/books`)
      .then((res) => res.json())
      .then((data) => setBooks(data));
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleEdit = (book) => {
    setEditingBook(book);
    setFormData({
      book_name: book.book_name,
      book_author: book.book_author,
      book_publication: book.book_publication,
      book_cost: book.book_cost.toString(),
    });
    setFile(null);
  };

  const cancelEdit = () => {
    setEditingBook(null);
    setFormData({ book_name: '', book_author: '', book_publication: '', book_cost: '' });
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingBook) {
        // API 4: Update Existing Book
        const data = new FormData();
        data.append('book_name', formData.book_name);
        data.append('book_author', formData.book_author);
        data.append('book_publication', formData.book_publication);
        data.append('book_cost', formData.book_cost);

        await fetch(`${API_BASE_URL}/books/${editingBook.book_id}`, {
          method: 'PUT',
          body: data,
        });

        // API 3: Upload Book File (Optional on Edit)
        if (file) {
          const fileData = new FormData();
          fileData.append('book_file', file);
          await fetch(`${API_BASE_URL}/books/${editingBook.book_id}/upload`, {
            method: 'POST',
            body: fileData,
          });
        }
      } else {
        // API 2: Create a New Book
        const data = new FormData();
        data.append('book_name', formData.book_name);
        data.append('book_author', formData.book_author);
        data.append('book_publication', formData.book_publication);
        data.append('book_cost', formData.book_cost);

        const res = await fetch(`${API_BASE_URL}/books`, {
          method: 'POST',
          body: data,
        });

        const newBook = await res.json();

        // API 3: Upload Book File
        if (file) {
          const fileData = new FormData();
          fileData.append('book_file', file);
          await fetch(`${API_BASE_URL}/books/${newBook.book_id}/upload`, {
            method: 'POST',
            body: fileData,
          });
        }
      }

      cancelEdit();
      fetchBooks();
    } catch (err) {
      console.error(err);
      alert('Failed to process book');
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this book?')) return;
    try {
      await fetch(`${API_BASE_URL}/books/${id}`, { method: 'DELETE' });
      fetchBooks();
    } catch (err) {
      console.error(err);
      alert('Failed to delete book');
    }
  };

  return (
    <div>
      <h1 className="page-title">
        Dashboard <span>Overview</span>
      </h1>

      <div className="admin-layout">
        {/* Left Form */}
        <div className="admin-form-card">
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '2rem',
            }}
          >
            <h2 style={{ margin: 0 }}>{editingBook ? 'Edit Book' : 'Add New Book'}</h2>
            {editingBook && (
              <button
                type="button"
                onClick={cancelEdit}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#ef4444',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontWeight: 600,
                }}
              >
                <X size={16} /> Cancel
              </button>
            )}
          </div>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Book Title</label>
              <input
                required
                type="text"
                className="form-input"
                placeholder="e.g. The Pragmatic Programmer"
                value={formData.book_name}
                onChange={(e) => setFormData({ ...formData, book_name: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Author / Writer</label>
              <input
                required
                type="text"
                className="form-input"
                placeholder="e.g. Andy Hunt"
                value={formData.book_author}
                onChange={(e) => setFormData({ ...formData, book_author: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Publication</label>
              <input
                required
                type="text"
                className="form-input"
                placeholder="e.g. Addison-Wesley"
                value={formData.book_publication}
                onChange={(e) => setFormData({ ...formData, book_publication: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Cost / Retail Price ($)</label>
              <input
                required
                type="number"
                step="0.01"
                className="form-input"
                placeholder="29.99"
                value={formData.book_cost}
                onChange={(e) => setFormData({ ...formData, book_cost: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>{editingBook ? 'Upload New PDF (Optional)' : 'Upload PDF Document'}</label>
              <div
                style={{
                  border: '2px dashed #cbd5e1',
                  padding: '2rem',
                  textAlign: 'center',
                  borderRadius: '12px',
                  background: '#f8fafc',
                  cursor: 'pointer',
                  position: 'relative',
                }}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  required={!editingBook}
                  onChange={(e) => setFile(e.target.files[0])}
                  style={{
                    opacity: 0,
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    cursor: 'pointer',
                  }}
                />
                <UploadCloud size={32} color="#94a3b8" style={{ marginBottom: '0.5rem' }} />
                <p style={{ color: '#475569', fontWeight: 500 }}>
                  {file ? file.name : 'Drag & Drop or Click to Browse'}
                </p>
              </div>
            </div>
            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? 'Processing...' : editingBook ? 'Update Book' : 'Publish Book'}
            </button>
          </form>
        </div>

        {/* Right Table */}
        <div className="admin-table-card">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Author</th>
                <th>Price</th>
                <th>Resource</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {books.map((book) => (
                <tr key={book.book_id}>
                  <td>
                    <strong>{book.book_name}</strong>
                  </td>
                  <td>{book.book_author}</td>
                  <td style={{ color: '#10b981', fontWeight: 700 }}>
                    ${book.book_cost ? book.book_cost.toFixed(2) : '0.00'}
                  </td>
                  <td>
                    {book.book_link ? (
                      <a
                        href={book.book_link}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          color: '#3b82f6',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          textDecoration: 'none',
                          fontWeight: 600,
                        }}
                      >
                        <FileText size={16} /> View
                      </a>
                    ) : (
                      <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>No File</span>
                    )}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => handleEdit(book)}
                        style={{
                          background: '#f1f5f9',
                          border: '1px solid #cbd5e1',
                          padding: '0.4rem 0.8rem',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          color: '#475569',
                          fontWeight: 600,
                        }}
                      >
                        <Edit2 size={14} /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(book.book_id)}
                        style={{
                          background: '#fef2f2',
                          border: '1px solid #fecaca',
                          padding: '0.4rem 0.8rem',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          color: '#ef4444',
                          fontWeight: 600,
                        }}
                      >
                        <Trash2 size={14} /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {books.length === 0 && (
                <tr>
                  <td
                    colSpan="5"
                    style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}
                  >
                    Database is currently empty
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

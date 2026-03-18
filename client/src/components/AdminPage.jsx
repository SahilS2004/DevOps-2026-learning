import { useState, useEffect } from 'react';
import { UploadCloud, FileText } from 'lucide-react';

export default function AdminPage() {
  const [books, setBooks] = useState([]);
  const [formData, setFormData] = useState({
    book_name: '', book_author: '', book_publication: '', book_cost: ''
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchBooks = () => {
    fetch(`${import.meta.env.VITE_API_URL}/books`)
      .then(res => res.json())
      .then(data => setBooks(data));
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const data = new FormData();
    data.append('book_name', formData.book_name);
    data.append('book_author', formData.book_author);
    data.append('book_publication', formData.book_publication);
    data.append('book_cost', formData.book_cost);
    if (file) {
      data.append('book_file', file);
    }

    try {
      await fetch(`${import.meta.env.VITE_API_URL}/books`, {
        method: 'POST',
        body: data
      });
      setFormData({ book_name: '', book_author: '', book_publication: '', book_cost: '' });
      setFile(null);
      e.target.reset();
      fetchBooks();
    } catch (err) {
      console.error(err);
      alert('Failed to add book');
    }
    setLoading(false);
  };

  return (
    <div>
      <h1 className="page-title">Dashboard <span>Overview</span></h1>
      
      <div className="admin-layout">
        {/* Left Form */}
        <div className="admin-form-card">
          <h2>Add New Book</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Book Title</label>
              <input required type="text" className="form-input" placeholder="e.g. The Pragmatic Programmer" value={formData.book_name} onChange={e => setFormData({...formData, book_name: e.target.value})} />
            </div>
            <div className="form-group">
              <label>Author / Writer</label>
              <input required type="text" className="form-input" placeholder="e.g. Andy Hunt" value={formData.book_author} onChange={e => setFormData({...formData, book_author: e.target.value})} />
            </div>
            <div className="form-group">
              <label>Publication</label>
              <input required type="text" className="form-input" placeholder="e.g. Addison-Wesley" value={formData.book_publication} onChange={e => setFormData({...formData, book_publication: e.target.value})} />
            </div>
            <div className="form-group">
              <label>Cost / Retail Price ($)</label>
              <input required type="number" step="0.01" className="form-input" placeholder="29.99" value={formData.book_cost} onChange={e => setFormData({...formData, book_cost: e.target.value})} />
            </div>
            <div className="form-group">
              <label>Upload PDF Document</label>
              <div style={{ border: '2px dashed #cbd5e1', padding: '2rem', textAlign: 'center', borderRadius: '12px', background: '#f8fafc', cursor: 'pointer', position: 'relative' }}>
                <input type="file" required onChange={e => setFile(e.target.files[0])} style={{ opacity: 0, position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', cursor: 'pointer' }} />
                <UploadCloud size={32} color="#94a3b8" style={{ marginBottom: '0.5rem' }} />
                <p style={{ color: '#475569', fontWeight: 500 }}>
                  {file ? file.name : "Drag & Drop or Click to Browse"}
                </p>
              </div>
            </div>
            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? 'Processing...' : 'Publish Book'}
            </button>
          </form>
        </div>

        {/* Right Table */}
        <div className="admin-table-card">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Author</th>
                <th>Price</th>
                <th>Resource</th>
              </tr>
            </thead>
            <tbody>
              {books.map(book => (
                <tr key={book.book_id}>
                  <td>#{book.book_id}</td>
                  <td><strong>{book.book_name}</strong></td>
                  <td>{book.book_author}</td>
                  <td style={{ color: '#10b981', fontWeight: 700 }}>${book.book_cost ? book.book_cost.toFixed(2) : '0.00'}</td>
                  <td>
                    <a href={book.book_link} target="_blank" rel="noreferrer" style={{ color: '#3b82f6', display: 'inline-flex', alignItems: 'center', gap: '4px', textDecoration: 'none', fontWeight: 600 }}>
                      <FileText size={16} /> View
                    </a>
                  </td>
                </tr>
              ))}
              {books.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
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

import { useEffect, useState } from 'react';
import { apiFetch } from './api';

export default function ResourceList({ resource, fields }) {
  const [items, setItems] = useState([]);
  const [formData, setFormData] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');

  const load = async () => {
    try {
      const data = await apiFetch(`/${resource}/`);
      setItems(data);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => { load(); }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await apiFetch(`/${resource}/${editingId}/`, {
          method: 'PUT',
          body: JSON.stringify(formData),
        });
      } else {
        await apiFetch(`/${resource}/`, {
          method: 'POST',
          body: JSON.stringify(formData),
        });
      }
      setFormData({});
      setEditingId(null);
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    const values = {};
    fields.forEach((f) => { values[f.name] = item[f.name] || ''; });
    setFormData(values);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete item?')) return;
    try {
      await apiFetch(`/${resource}/${id}/`, { method: 'DELETE' });
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h2>{resource}</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        {fields.map((f) => (
          <div key={f.name}>
            <input
              name={f.name}
              placeholder={f.label}
              value={formData[f.name] || ''}
              onChange={handleChange}
            />
          </div>
        ))}
        <button type="submit">{editingId ? 'Update' : 'Create'}</button>
      </form>
      <table border="1" style={{ marginTop: 20 }}>
        <thead>
          <tr>
            {fields.map((f) => (
              <th key={f.name}>{f.label}</th>
            ))}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              {fields.map((f) => (
                <td key={f.name}>{item[f.name]}</td>
              ))}
              <td>
                <button onClick={() => handleEdit(item)}>Edit</button>
                <button onClick={() => handleDelete(item.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

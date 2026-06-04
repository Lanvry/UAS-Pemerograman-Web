import React, { useState, useEffect } from 'react';

const PoktanModal = ({ isOpen, onClose, onSubmit, initialData, isLoading }) => {
  const [formData, setFormData] = useState({
    nama_poktan: '',
    ketua_poktan: '',
    alamat: '',
    nomer_register: '',
    status: 'aktif'
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({ nama_poktan: '', ketua_poktan: '', alamat: '', nomer_register: '', status: 'aktif' });
    }
  }, [initialData, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 style={{ fontSize: '16px', margin: 0 }}>
            {initialData ? 'Edit Poktan' : 'Tambah Poktan'}
          </h3>
          <button
            type="button"
            className="btn-icon"
            onClick={onClose}
            style={{ fontSize: '18px', color: 'var(--text-muted)' }}
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Nama Poktan</label>
            <input type="text" name="nama_poktan" className="form-input"
              value={formData.nama_poktan} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label className="form-label">Ketua Poktan</label>
            <input type="text" name="ketua_poktan" className="form-input"
              value={formData.ketua_poktan} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label className="form-label">Alamat</label>
            <textarea name="alamat" className="form-input" rows="3"
              value={formData.alamat} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label className="form-label">Nomor Register</label>
            <input type="text" name="nomer_register" className="form-input"
              value={formData.nomer_register} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label className="form-label">Status</label>
            <select name="status" className="form-input"
              value={formData.status} onChange={handleChange}>
              <option value="aktif">Aktif</option>
              <option value="tidak aktif">Tidak Aktif</option>
            </select>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-ghost" onClick={onClose}>
              Batal
            </button>
            <button type="submit" className="btn btn-primary" disabled={isLoading}>
              {isLoading ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PoktanModal;

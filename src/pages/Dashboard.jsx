import React, { useState, useEffect, useContext } from 'react';
import axiosClient from '../api/axiosClient';
import { AuthContext } from '../context/AuthContext';
import PoktanModal from '../components/PoktanModal';
import DeleteConfirmModal from '../components/DeleteConfirmModal';

const Dashboard = () => {
  const { logout } = useContext(AuthContext);
  const [poktans, setPoktans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingData, setEditingData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  // Search & Pagination states
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const fetchPoktans = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosClient.get('/api/poktan');
      if (response.data && response.data.status) {
        setPoktans(response.data.data);
      }
    } catch (err) {
      setError('Gagal memuat data. Coba refresh halaman.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPoktans(); }, []);

  const handleOpenModal = (data = null) => {
    setEditingData(data);
    setIsModalOpen(true);
  };

  const handleSubmitModal = async (formData) => {
    setIsSubmitting(true);
    try {
      if (editingData) {
        await axiosClient.post(`/api/poktan/update/${editingData.id}`, formData);
      } else {
        await axiosClient.post('/api/poktan/store', formData);
      }
      setIsModalOpen(false);
      setEditingData(null);
      fetchPoktans();
    } catch (err) {
      alert('Gagal menyimpan data.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    setIsSubmitting(true);
    try {
      await axiosClient.get(`/api/poktan/delete/${itemToDelete.id}`);
      setDeleteModalOpen(false);
      setItemToDelete(null);
      fetchPoktans();
    } catch (err) {
      alert('Gagal menghapus data.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredPoktans = poktans.filter(p => 
    (p.nama_poktan || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
    (p.ketua_poktan || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.nomer_register || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredPoktans.length / itemsPerPage);
  const paginatedPoktans = filteredPoktans.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      {/* Top Navbar */}
      <nav style={{
        background: 'var(--surface)',
        borderBottom: '1px solid var(--border)',
        padding: '0 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '56px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '20px' }}>🌾</span>
          <span style={{ fontWeight: 600, fontSize: '15px' }}>Sistem Poktan</span>
        </div>
        <button className="btn btn-ghost" onClick={logout} style={{ fontSize: '13px' }}>
          Keluar
        </button>
      </nav>

      {/* Main Content */}
      <main style={{ maxWidth: '1000px', margin: '0 auto', padding: '32px 24px' }}>
        {/* Page Header */}
        <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 style={{ fontSize: '20px', marginBottom: '4px' }}>Kelompok Tani</h1>
            <p style={{ fontSize: '14px' }}>Kelola data kelompok tani yang terdaftar</p>
          </div>
          <button className="btn btn-primary" onClick={() => handleOpenModal()}>
            + Tambah Poktan
          </button>
        </div>

        {/* Search Bar */}
        <div style={{ marginBottom: '16px' }}>
          <input 
            type="text" 
            className="form-input" 
            placeholder="Cari nama, ketua, atau no register..." 
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            style={{ maxWidth: '300px' }}
          />
        </div>

        {/* Table Card */}
        <div className="card">
          {error && (
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
              <div className="alert-error" style={{ margin: 0 }}>{error}</div>
            </div>
          )}

          {loading ? (
            <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)' }}>
              Memuat data...
            </div>
          ) : (
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Nama Poktan</th>
                    <th>Ketua</th>
                    <th>Alamat</th>
                    <th>No. Register</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'right' }}>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPoktans.length === 0 ? (
                    <tr>
                      <td colSpan="7" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                        Data tidak ditemukan
                      </td>
                    </tr>
                  ) : (
                    paginatedPoktans.map((item, index) => (
                      <tr key={item.id}>
                        <td style={{ color: 'var(--text-muted)' }}>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                        <td style={{ fontWeight: 500 }}>{item.nama_poktan}</td>
                        <td>{item.ketua_poktan}</td>
                        <td style={{ color: 'var(--text-muted)', maxWidth: '180px' }}>{item.alamat}</td>
                        <td style={{ fontFamily: 'monospace', fontSize: '13px' }}>{item.nomer_register}</td>
                        <td>
                          <span className={`badge ${item.status?.toLowerCase() === 'aktif' ? 'badge-success' : 'badge-neutral'}`}>
                            {item.status}
                          </span>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <button
                            className="btn-icon"
                            onClick={() => handleOpenModal(item)}
                            title="Edit"
                            style={{ marginRight: '2px' }}
                          >
                            ✏️
                          </button>
                          <button
                            className="btn-icon danger"
                            onClick={() => { setItemToDelete(item); setDeleteModalOpen(true); }}
                            title="Hapus"
                          >
                            🗑️
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination Controls */}
          {!loading && totalPages > 1 && (
            <div style={{ padding: '16px 20px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                Halaman {currentPage} dari {totalPages}
              </span>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button 
                  className="btn btn-ghost" 
                  style={{ padding: '6px 12px' }}
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  Sebelumnya
                </button>
                <button 
                  className="btn btn-ghost" 
                  style={{ padding: '6px 12px' }}
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  Selanjutnya
                </button>
              </div>
            </div>
          )}
        </div>

        <p style={{ marginTop: '12px', fontSize: '12px', color: 'var(--text-light)' }}>
          Total: {poktans.length} kelompok tani terdaftar
        </p>
      </main>

      <PoktanModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingData(null); }}
        onSubmit={handleSubmitModal}
        initialData={editingData}
        isLoading={isSubmitting}
      />

      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        itemName={itemToDelete?.nama_poktan}
        isLoading={isSubmitting}
      />
    </div>
  );
};

export default Dashboard;

import React from 'react';

const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, itemName, isLoading }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '380px' }}>
        <div style={{ textAlign: 'center', padding: '8px 0 20px' }}>
          <div style={{ fontSize: '36px', marginBottom: '12px' }}>🗑️</div>
          <h3 style={{ fontSize: '16px', marginBottom: '8px' }}>Hapus Poktan?</h3>
          <p style={{ fontSize: '14px' }}>
            Anda yakin ingin menghapus <strong style={{ color: 'var(--text)' }}>{itemName}</strong>?<br />
            Data yang dihapus tidak dapat dikembalikan.
          </p>
        </div>

        <div className="modal-actions" style={{ justifyContent: 'center' }}>
          <button className="btn btn-ghost" onClick={onClose}>
            Batal
          </button>
          <button className="btn btn-danger" onClick={onConfirm} disabled={isLoading}>
            {isLoading ? 'Menghapus...' : 'Ya, Hapus'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;

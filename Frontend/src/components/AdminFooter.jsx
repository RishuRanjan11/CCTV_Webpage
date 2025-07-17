import React from 'react';
import './AdminFooter.css';

const AdminFooter = () => {
  return (
    <footer className="admin-footer">
      <p>© {new Date().getFullYear()} CCTV Digital Surveillance</p>
    </footer>
  );
};

export default AdminFooter;

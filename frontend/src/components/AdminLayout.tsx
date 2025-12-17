import React from 'react';
import { Navbar } from './Navbar';
import { AdminSidebar } from './AdminSidebar';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  return (
    <div>
      <Navbar />
      <div className="admin-layout">
        <AdminSidebar />
        <main className="admin-main">
          {children}
        </main>
      </div>
    </div>
  );
};

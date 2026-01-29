import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

export const MainLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="layout">
            <Header onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
            <div className="layout-body">
                <Sidebar
                    isOpen={isSidebarOpen}
                    onClose={() => setIsSidebarOpen(false)}
                />
                <main className="main-content">
                    <div className="container">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

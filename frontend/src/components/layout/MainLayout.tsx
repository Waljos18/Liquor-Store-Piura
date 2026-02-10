import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { useAuth } from '../../context/AuthContext';

export const MainLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const onSessionInvalid = () => {
            logout();
            navigate('/login', { replace: true });
        };
        window.addEventListener('auth:session-invalid', onSessionInvalid);
        return () => window.removeEventListener('auth:session-invalid', onSessionInvalid);
    }, [logout, navigate]);

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

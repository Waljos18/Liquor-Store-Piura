import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Bell, User, LogOut } from 'lucide-react';
import { Button } from '../ui/Button';
import { useAuth } from '../../context/AuthContext';

interface HeaderProps {
    onMenuClick: () => void;
}

export const Header = ({ onMenuClick }: HeaderProps) => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <header className="header">
            <div className="header-left">
                <Button variant="ghost" size="sm" onClick={onMenuClick} className="md:hidden">
                    <Menu size={24} />
                </Button>
                <h1 className="header-title">Licorería Piura</h1>
            </div>

            <div className="header-right">
                <Button variant="ghost" size="sm">
                    <Bell size={20} />
                </Button>
                <div className="user-info">
                    <User size={20} />
                    <span className="user-name">{user?.nombre || user?.username || 'Usuario'}</span>
                </div>
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                    <LogOut size={20} />
                    <span className="hidden md:inline ml-2">Salir</span>
                </Button>
            </div>
        </header>
    );
};

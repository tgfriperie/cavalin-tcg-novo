import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useData } from '../../contexts/DataContext';
import { auth } from '../../services/firebase';

const Sidebar = () => {
    const { user } = useData();
    const navigate = useNavigate();

    const handleLogout = () => {
        if (window.confirm('Tem certeza que deseja sair?')) {
            auth.signOut();
            navigate('/');
        }
    };

    // Função para classe do link (Ativo vs Inativo)
    const linkClass = ({ isActive }) => 
        `flex items-center px-6 py-4 text-gray-300 hover:bg-white/5 hover:text-white transition-colors duration-200 border-l-4 ${
            isActive ? 'border-primary bg-white/5 text-white' : 'border-transparent'
        }`;

    return (
        <aside className="w-64 bg-surface shadow-xl flex flex-col z-20 h-screen fixed left-0 top-0">
            {/* Logo Area */}
            <div className="p-6 flex items-center gap-3 border-b border-white/10">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                    <i className="fa-solid fa-gavel text-white text-lg"></i>
                </div>
                <div>
                    <h1 className="text-xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                        CAVALLIN
                    </h1>
                    <p className="text-xs text-primary tracking-wider font-medium">TCG STORE</p>
                </div>
            </div>

            {/* Menu */}
            <nav className="flex-1 overflow-y-auto py-6 space-y-1">
                <p className="px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Principal</p>
                
                <NavLink to="/dashboard" className={linkClass}>
                    <i className="fa-solid fa-chart-line w-6 text-center mr-3 text-lg"></i>
                    <span className="font-medium">Dashboard</span>
                </NavLink>

                <NavLink to="/auctions" className={linkClass}>
                    <i className="fa-solid fa-gavel w-6 text-center mr-3 text-lg"></i>
                    <span className="font-medium">Leilões</span>
                </NavLink>

                <NavLink to="/inventory" className={linkClass}>
                    <i className="fa-solid fa-box-open w-6 text-center mr-3 text-lg"></i>
                    <span className="font-medium">Estoque</span>
                </NavLink>

                <NavLink to="/clients" className={linkClass}>
                    <i className="fa-solid fa-users w-6 text-center mr-3 text-lg"></i>
                    <span className="font-medium">Clientes</span>
                </NavLink>

                <NavLink to="/financial" className={linkClass}>
                    <i className="fa-solid fa-wallet w-6 text-center mr-3 text-lg"></i>
                    <span className="font-medium">Financeiro</span>
                </NavLink>

                <div className="pt-6">
                    <p className="px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Sistema</p>
                    <NavLink to="/reports" className={linkClass}>
                        <i className="fa-solid fa-file-invoice w-6 text-center mr-3 text-lg"></i>
                        <span className="font-medium">Relatórios</span>
                    </NavLink>
                    <NavLink to="/settings" className={linkClass}>
                        <i className="fa-solid fa-cog w-6 text-center mr-3 text-lg"></i>
                        <span className="font-medium">Configurações</span>
                    </NavLink>
                </div>
            </nav>

            {/* User Footer */}
            <div className="p-4 border-t border-white/10 bg-black/20">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-primary flex items-center justify-center text-white font-bold shadow-lg">
                        {user?.email?.[0].toUpperCase() || 'A'}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">Admin</p>
                        <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                    </div>
                    <button 
                        onClick={handleLogout}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white"
                        title="Sair"
                    >
                        <i className="fa-solid fa-sign-out-alt"></i>
                    </button>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
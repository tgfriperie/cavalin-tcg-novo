import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useData } from '../../contexts/DataContext';
import { auth } from '../../services/firebase';
import { storeConfig } from '../../config/store';

const Sidebar = () => {
    const { user } = useData();
    const navigate = useNavigate();

    const handleLogout = () => {
        if (window.confirm('Tem certeza que deseja sair?')) {
            auth.signOut();
            navigate('/');
        }
    };

    // Função que replica o estilo exato do link ativo
    const getLinkClass = ({ isActive }) => {
        const base = "flex items-center px-6 py-4 cursor-pointer transition-all duration-300 border-l-4 group";
        
        if (isActive) {
            return `${base} border-[#d946ef] bg-gradient-to-r from-[#d946ef]/10 to-transparent text-white`;
        }
        return `${base} border-transparent text-gray-400 hover:text-white hover:bg-white/5`;
    };

    return (
        // Removemos o bg-surface sólido e usamos glass-panel
        <aside className="w-64 glass-panel flex flex-col h-screen fixed left-0 top-0 z-50 border-r border-white/5">
            {/* Header / Logo */}
            <div className="h-24 flex items-center px-8 border-b border-white/5">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center shadow-lg shadow-purple-500/20">
                        <span className="text-xl font-bold text-white">C</span>
                    </div>
                    <div>
                        <h1 className="font-bold text-lg tracking-wider text-white">CAVALLIN</h1>
                        <p className="text-[10px] text-gray-400 uppercase tracking-[0.2em]">TCG Store</p>
                    </div>
                </div>
            </div>

            {/* Menu */}
            <nav className="flex-1 overflow-y-auto py-6">
                <p className="px-8 text-xs font-bold text-gray-500 uppercase mb-4 tracking-wider">Principal</p>
                
                <NavLink to="/dashboard" className={getLinkClass}>
                    {/* Ícone com largura fixa para alinhamento */}
                    <i className="fa-solid fa-chart-pie w-6 text-center mr-3 text-lg group-hover:text-[#d946ef] transition-colors"></i>
                    <span className="font-medium text-sm">Dashboard</span>
                </NavLink>
                
                <NavLink to="/auctions" className={getLinkClass}>
                    <i className="fa-solid fa-gavel w-6 text-center mr-3 text-lg group-hover:text-[#d946ef] transition-colors"></i>
                    <span className="font-medium text-sm">Leilões</span>
                </NavLink>

                <NavLink to="/inventory" className={getLinkClass}>
                    <i className="fa-solid fa-box-open w-6 text-center mr-3 text-lg group-hover:text-[#d946ef] transition-colors"></i>
                    <span className="font-medium text-sm">Estoque</span>
                </NavLink>

                <NavLink to="/financial" className={getLinkClass}>
                    <i className="fa-solid fa-wallet w-6 text-center mr-3 text-lg group-hover:text-[#d946ef] transition-colors"></i>
                    <span className="font-medium text-sm">Financeiro</span>
                </NavLink>

                <p className="px-8 text-xs font-bold text-gray-500 uppercase mt-8 mb-4 tracking-wider">Admin</p>

                <NavLink to="/clients" className={getLinkClass}>
                    <i className="fa-solid fa-users w-6 text-center mr-3 text-lg group-hover:text-[#d946ef] transition-colors"></i>
                    <span className="font-medium text-sm">Clientes</span>
                </NavLink>
            </nav>

            {/* User Footer */}
            <div className="p-4 m-4 rounded-xl bg-gradient-to-br from-white/5 to-transparent border border-white/5">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-primary flex items-center justify-center text-white font-bold text-sm">
                        {user?.email?.[0].toUpperCase() || 'A'}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">Admin</p>
                        <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                    </div>
                    <button onClick={handleLogout} className="text-gray-400 hover:text-red-400 transition-colors">
                        <i className="fa-solid fa-right-from-bracket"></i>
                    </button>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
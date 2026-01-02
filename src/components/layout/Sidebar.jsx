import React from 'react';
import { NavLink } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../../services/firebase';
import { storeConfig } from '../../config/store';

const Sidebar = () => {
    // Função auxiliar para classes de link ativo vs inativo
    const getLinkClass = ({ isActive }) => {
        const baseClass = "flex items-center p-3 rounded-lg transition-colors mb-2";
        const activeClass = "bg-[#D946EF]/10 text-[#D946EF] border-r-4 border-[#D946EF]";
        const inactiveClass = "text-[#D8D2E7] hover:bg-white/5";
        
        return `${baseClass} ${isActive ? activeClass : inactiveClass}`;
    };

    const handleLogout = () => {
        if (window.confirm("Deseja realmente sair?")) {
            signOut(auth);
        }
    };

    return (
        <aside className="w-64 bg-[#28193C]/50 backdrop-blur-xl border-r border-[#D946EF]/20 flex flex-col h-screen sticky top-0">
            {/* Logo */}
            <div className="p-6 flex items-center justify-center border-b border-white/5 mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#D946EF] to-[#A21CAF] flex items-center justify-center font-bold text-white text-xl">
                    C
                </div>
                <span className="ml-3 font-bold text-xl text-[#F1F5F9] tracking-wider">
                    {storeConfig.appName}
                </span>
            </div>

            {/* Navegação */}
            <nav className="flex-1 px-4 overflow-y-auto">
                <p className="text-xs font-bold text-gray-500 uppercase mb-2 px-3">Principal</p>
                
                <NavLink to="/" className={getLinkClass}>
                    <span>📊</span> <span className="ml-3">Dashboard</span>
                </NavLink>
                
                <NavLink to="/auctions" className={getLinkClass}>
                    <span>🔨</span> <span className="ml-3">Leilões</span>
                </NavLink>

                <NavLink to="/inventory" className={getLinkClass}>
                    <span>📦</span> <span className="ml-3">Estoque</span>
                </NavLink>

                <NavLink to="/financial" className={getLinkClass}>
                    <span>💰</span> <span className="ml-3">Financeiro</span>
                </NavLink>

                <p className="text-xs font-bold text-gray-500 uppercase mt-4 mb-2 px-3">Gerenciamento</p>

                <NavLink to="/clients" className={getLinkClass}>
                    <span>👥</span> <span className="ml-3">Clientes</span>
                </NavLink>
                
                <NavLink to="/reports" className={getLinkClass}>
                    <span>📄</span> <span className="ml-3">Relatórios</span>
                </NavLink>
            </nav>

            {/* Logout */}
            <div className="p-4 border-t border-white/5">
                <button 
                    onClick={handleLogout}
                    className="flex items-center w-full p-3 rounded-lg text-[#F43F5E] hover:bg-[#F43F5E]/10 transition-colors"
                >
                    <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                    <span className="font-bold">Sair do Sistema</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
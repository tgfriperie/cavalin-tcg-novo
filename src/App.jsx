import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { DataProvider, useData } from './contexts/DataContext';

// Componentes de Layout e Pages
import Sidebar from './components/layout/Sidebar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Auctions from './pages/Auctions';
import AuctionDetail from './pages/AuctionDetail';
import LiveAuction from './pages/LiveAuction'; // <--- Importação Nova
import Inventory from './pages/Inventory';
import Financial from './pages/Financial';

// Componente de Layout Persistente (Sidebar + Conteúdo)
const MainLayout = () => {
    return (
        <div className="flex min-h-screen bg-[#1A1129] text-[#F1F5F9]">
            <Sidebar />
            <main className="flex-1 p-8 overflow-y-auto h-screen">
                <div className="max-w-7xl mx-auto pb-20">
                    <Outlet /> {/* Onde as páginas serão renderizadas */}
                </div>
            </main>
        </div>
    );
};

// Componente que gerencia rotas e proteção de auth
const AppRoutes = () => {
    const { user, loading } = useData();

    if (loading) {
        // Splash Screen de Carregamento
        return (
            <div className="fixed inset-0 flex flex-col items-center justify-center bg-[#1A1129]">
                <div className="w-16 h-16 border-4 border-[#D946EF] border-t-transparent rounded-full animate-spin mb-4"></div>
                <h1 className="text-xl font-bold text-[#D946EF] animate-pulse">Carregando Sistema...</h1>
            </div>
        );
    }

    if (!user) {
        return <Login />;
    }

    return (
        <Routes>
            <Route path="/" element={<MainLayout />}>
                {/* Redireciona a raiz para o dashboard */}
                <Route index element={<Navigate to="/dashboard" replace />} />
                
                <Route path="dashboard" element={<Dashboard />} />
                
                {/* Rotas de Leilão */}
                <Route path="auctions" element={<Auctions />} />
                <Route path="auctions/:id" element={<AuctionDetail />} />
                <Route path="live/:id" element={<LiveAuction />} /> {/* <--- Rota Ao Vivo */}
                
                <Route path="inventory" element={<Inventory />} />
                <Route path="financial" element={<Financial />} />
                
                {/* Rotas placeholders para páginas que você ainda vai migrar */}
                <Route path="clients" element={<div className="text-center p-10">Página de Clientes em construção</div>} />
                <Route path="reports" element={<div className="text-center p-10">Página de Relatórios em construção</div>} />
            </Route>
        </Routes>
    );
};

// Componente Raiz
function App() {
    return (
        <DataProvider>
            <BrowserRouter>
                <AppRoutes />
            </BrowserRouter>
        </DataProvider>
    );
}

export default App;
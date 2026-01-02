import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../services/firebase';
import { storeConfig } from '../config/store';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await signInWithEmailAndPassword(auth, email, password);
            // O redirecionamento é automático pelo App.jsx quando o user muda
        } catch (err) {
            console.error(err);
            setError('Email ou senha incorretos.');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#1A1129] relative overflow-hidden">
            {/* Elementos de fundo decorativos */}
            <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-[#D946EF] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-[#A21CAF] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

            <Card className="w-full max-w-md z-10 p-8 border-[#D946EF]/30 shadow-[0_0_50px_rgba(217,70,239,0.15)]">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-[#D946EF] mb-2">{storeConfig.appName}</h1>
                    <p className="text-gray-400">Entre para gerenciar seu leilão</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <Input 
                        label="Email"
                        id="email"
                        type="email" 
                        placeholder="admin@cavallintcg.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    
                    <Input 
                        label="Senha"
                        id="password"
                        type="password" 
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    {error && (
                        <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm text-center">
                            {error}
                        </div>
                    )}

                    <Button 
                        type="submit" 
                        variant="gradient" 
                        className="w-full py-3 text-lg shadow-lg shadow-fuchsia-900/20"
                        disabled={loading}
                    >
                        {loading ? 'Entrando...' : 'Acessar Sistema'}
                    </Button>
                </form>
            </Card>
        </div>
    );
};

export default Login;
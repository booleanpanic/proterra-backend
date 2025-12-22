import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';

const AdminLogin = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/auth/login', { username, password });
            localStorage.setItem('adminToken', response.data.token);
            navigate('/admin/dashboard');
        } catch (err) {
            setError('Invalid credentials');
        }
    };

    return (
        <div className="min-h-screen bg-concrete-light flex items-center justify-center">
            <div className="bg-white p-8 shadow-sm max-w-md w-full border border-gray-100">
                <h1 className="text-2xl font-sans font-bold mb-6 text-center">ProTerra Admin</h1>
                {error && <div className="bg-red-50 text-red-500 p-3 mb-4 text-sm">{error}</div>}
                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                        <input
                            type="text"
                            className="w-full border border-gray-300 px-3 py-2 focus:outline-none focus:border-black transition-colors"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input
                            type="password"
                            className="w-full border border-gray-300 px-3 py-2 focus:outline-none focus:border-black transition-colors"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-black text-white py-2 font-bold uppercase tracking-wider hover:bg-gray-800 transition-colors"
                    >
                        Login
                    </button>
                    <div className="text-xs text-center text-gray-400 mt-4">
                        Demo: proterra_admin / 123123
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;

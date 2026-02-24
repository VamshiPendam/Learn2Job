import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Sparkles, ArrowRight, User, Mail, Lock, Loader2, ArrowLeft } from 'lucide-react';

interface LoginProps {
    initialMode?: 'login' | 'signup';
    onBack?: () => void;
}

const Login: React.FC<LoginProps> = ({ initialMode = 'login', onBack }) => {
    const [isLogin, setIsLogin] = useState(initialMode === 'login');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';

        try {
            // Use full URL if running separately, but proxy is better. 
            // Assuming Vite proxy or CORS allows localhost:5000.
            const response = await fetch(`http://localhost:5000${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(
                    isLogin ? { email, password } : { username, email, password }
                ),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || data.error || 'Something went wrong');
            }

            if (isLogin) {
                login(data.token, data.user);
                onBack(); // Go back to landing page, which will now show authenticated app
            } else {
                // After registration, automatically login or ask to login
                // For simplicity, let's just switch to login mode or auto-login if backend returned token (it does not in my code above for register)
                // Wait, my register code returns user info but no token.
                // Let's modify the flow: Register -> Success -> Switch to Login
                setIsLogin(true);
                setError('Registration successful! Please log in.');
                setUsername('');
                setPassword('');
                // Keep email? Maybe.
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#060a0d] flex items-center justify-center p-4">
            {/* Background Ambience */}
            <div className="fixed top-0 right-0 -z-10 w-[800px] h-[800px] bg-[#00f2ea]/5 rounded-full blur-[120px] pointer-events-none translate-x-1/4 -translate-y-1/4"></div>
            <div className="fixed bottom-0 left-0 -z-10 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-[100px] pointer-events-none -translate-x-1/4 translate-y-1/4"></div>

            <div className="w-full max-w-md bg-[#0a0f16] border border-gray-800 rounded-2xl p-8 shadow-2xl relative overflow-hidden backdrop-blur-xl">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#00f2ea] to-purple-500"></div>

                {onBack && (
                    <button
                        onClick={onBack}
                        className="mb-4 flex items-center space-x-2 text-gray-400 hover:text-[#00f2ea] transition-colors group"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        <span className="text-sm font-medium">Back to Home</span>
                    </button>
                )}

                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center p-3 bg-gradient-to-br from-[#00f2ea]/10 to-purple-500/10 rounded-xl mb-4 border border-white/5">
                        <Sparkles className="w-8 h-8 text-[#00f2ea]" />
                    </div>
                    <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                        {isLogin ? 'Welcome Back' : 'Create Account'}
                    </h1>
                    <p className="text-gray-400 mt-2 text-sm">
                        {isLogin ? 'Enter your credentials to access your workspace' : 'Join Learn2Job to start your journey'}
                    </p>
                </div>

                {error && (
                    <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {!isLogin && (
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-gray-500 ml-1">Enter Name</label>
                            <div className="relative group">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-[#00f2ea] transition-colors" />
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full bg-[#131b24] border border-gray-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#00f2ea]/50 focus:ring-1 focus:ring-[#00f2ea]/50 transition-all"
                                    placeholder=""
                                    required
                                />
                            </div>
                        </div>
                    )}

                    <div className="space-y-1">
                        <label className="text-xs font-medium text-gray-500 ml-1">Enter Email Address</label>
                        <div className="relative group">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-[#00f2ea] transition-colors" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-[#131b24] border border-gray-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#00f2ea]/50 focus:ring-1 focus:ring-[#00f2ea]/50 transition-all"
                                placeholder=""
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-medium text-gray-500 ml-1">Enter Password</label>
                        <div className="relative group">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-[#00f2ea] transition-colors" />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-[#131b24] border border-gray-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#00f2ea]/50 focus:ring-1 focus:ring-[#00f2ea]/50 transition-all"
                                placeholder=""
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-gradient-to-r from-[#00f2ea] to-[#00aaff] text-[#060a0d] font-semibold py-3 rounded-xl hover:shadow-[0_0_20px_rgba(0,242,234,0.3)] transition-all duration-300 flex items-center justify-center mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <>
                                {isLogin ? 'Sign In' : 'Create Account'}
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-500">
                        {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
                        <button
                            onClick={() => {
                                setIsLogin(!isLogin);
                                setError('');
                            }}
                            className="text-[#00f2ea] hover:text-[#00aaff] font-medium transition-colors"
                        >
                            {isLogin ? 'Sign up' : 'Sign in'}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;

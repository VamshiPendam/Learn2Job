import React, { useState, useEffect } from 'react';
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
    const [successMessage, setSuccessMessage] = useState('');
    const [isForgot, setIsForgot] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();

    // Handle token from OAuth callback: /login?token=...
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get('token');
        if (token) {
            // Fetch user info then login
            (async () => {
                setIsLoading(true);
                try {
                    const resp = await fetch('/api/auth/me', {
                        headers: { 'x-auth-token': token }
                    });
                    const text = await resp.text();
                    let data: any = {};
                    try { data = text ? JSON.parse(text) : {}; } catch { data = {}; }
                    if (!resp.ok) throw new Error(data?.message || text || resp.statusText || 'OAuth login failed');
                    // data is user
                    login(token, data);
                    // Clean URL to remove token
                    params.delete('token');
                    const newUrl = window.location.pathname + (params.toString() ? `?${params.toString()}` : '');
                    window.history.replaceState({}, document.title, newUrl);
                    onBack?.();
                } catch (err: any) {
                    setError(err.message || 'OAuth login failed');
                } finally {
                    setIsLoading(false);
                }
            })();
        }
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');
        setIsLoading(true);

        const endpoint = isForgot ? '/api/auth/forgot-password' : isLogin ? '/api/auth/login' : '/api/auth/register';

        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(
                    isForgot ? { email } : isLogin ? { email, password } : { username, email, password }
                ),
            });

            // Some endpoints may return an empty body (204) or non-JSON responses.
            // Safely read the response text and try to parse JSON; fall back to empty object.
            const text = await response.text();
            let data: any = {};
            try {
                data = text ? JSON.parse(text) : {};
            } catch (parseErr) {
                data = {};
            }

            if (!response.ok) {
                const message = data?.message || data?.error || text || response.statusText || 'Something went wrong';
                throw new Error(message);
            }

            if (isForgot) {
                if (data?.resetUrl) {
                    // For local testing, instantly transition to the reset screen
                    window.location.href = data.resetUrl;
                } else {
                    setSuccessMessage(data?.message || 'Password reset link sent.');
                }
                return;
            }

            if (isLogin) {
                if (!data || !data.token) {
                    throw new Error('Login failed: no authentication token returned from server');
                }
                login(data.token, data.user);
                onBack?.(); // Go back to landing page, which will now show authenticated app
            } else {
                // After registration, automatically login or ask to login
                // For simplicity, let's just switch to login mode or auto-login if backend returned token (it does not in my code above for register)
                // Wait, my register code returns user info but no token.
                // Let's modify the flow: Register -> Success -> Switch to Login
                setIsLogin(true);
                setSuccessMessage('Registration successful! Please log in.');
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
                    <div className="inline-flex items-center justify-center p-1 rounded-xl mb-4">
                        <img src="/Learn2Job.png" alt="Learn2Job" className="w-20 h-20 md:w-24 md:h-24 object-contain" />
                    </div>
                    <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                        {isForgot ? 'Reset Password' : isLogin ? 'Welcome Back' : 'Create Account'}
                    </h1>
                    <p className="text-gray-400 mt-2 text-sm">
                        {isForgot ? 'Enter your email to receive a password reset link' : isLogin ? 'Enter your credentials to access your workspace' : 'Join Learn2Job to start your journey'}
                    </p>
                </div>

                {error && (
                    <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm text-center">
                        {error}
                    </div>
                )}
                {successMessage && (
                    <div className="mb-6 p-3 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400 text-sm text-center break-all">
                        {successMessage}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {!isLogin && !isForgot && (
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

                    

                    {!isForgot && (
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
                            {isLogin && (
                                <div className="flex justify-end pt-1">
                                    <button type="button" onClick={() => { setIsForgot(true); setError(''); setSuccessMessage(''); }} className="text-xs text-gray-400 hover:text-[#00f2ea] transition-colors">Forgot password?</button>
                                </div>
                            )}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-gradient-to-r from-[#00f2ea] to-[#00aaff] text-[#060a0d] font-semibold py-3 rounded-xl hover:shadow-[0_0_20px_rgba(0,242,234,0.3)] transition-all duration-300 flex items-center justify-center mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <>
                                {isForgot ? 'Send Reset Link' : isLogin ? 'Sign In' : 'Create Account'}
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-6 text-center space-y-4">
                    <div>
                        <p className="text-sm text-gray-500">
                            {isForgot ? "Remembered your password?" : isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
                            <button
                                onClick={() => {
                                    if (isForgot) setIsForgot(false);
                                    else setIsLogin(!isLogin);
                                    setError('');
                                    setSuccessMessage('');
                                }}
                                className="text-[#00f2ea] hover:text-[#00aaff] font-medium transition-colors"
                            >
                                {isForgot ? 'Back to sign in' : isLogin ? 'Sign up' : 'Sign in'}
                            </button>
                        </p>
                    </div>

                    {!isForgot && (
                        <div className="">
                            <p className="text-xs text-gray-400 mb-2">Or continue with</p>
                            <div className="flex items-center justify-center">
                                <button
                                    type="button"
                                    onClick={() => { window.location.href = '/api/auth/google'; }}
                                    className="w-full flex items-center justify-center gap-3 bg-[#0b1116] border border-gray-700 text-white font-semibold py-3 rounded-xl hover:bg-[#0e161b] hover:shadow-[0_0_20px_rgba(0,242,234,0.08)] transition-all duration-200"
                                >
                                    <img src="/google-logo.svg" alt="Google" className="w-5 h-5" />
                                    <span>{isLogin ? 'Sign in with Google' : 'Continue with Google'}</span>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Login;

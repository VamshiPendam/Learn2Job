import React, { useState } from 'react';
import { Lock, Loader2, ArrowRight } from 'lucide-react';

interface ResetPasswordProps {
    token: string;
    onSuccess: () => void;
}

const ResetPassword: React.FC<ResetPasswordProps> = ({ token, onSuccess }) => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');
        setIsLoading(true);

        try {
            const response = await fetch(`/api/auth/reset-password/${token}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ password }),
            });

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

            setSuccessMessage('Password reset successful! You can now log in.');
            setTimeout(() => {
                onSuccess();
            }, 3000);
            
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#060a0d] flex items-center justify-center p-4">
            <div className="fixed top-0 right-0 -z-10 w-[800px] h-[800px] bg-[#00f2ea]/5 rounded-full blur-[120px] pointer-events-none translate-x-1/4 -translate-y-1/4"></div>
            <div className="fixed bottom-0 left-0 -z-10 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-[100px] pointer-events-none -translate-x-1/4 translate-y-1/4"></div>

            <div className="w-full max-w-md bg-[#0a0f16] border border-gray-800 rounded-2xl p-8 shadow-2xl relative overflow-hidden backdrop-blur-xl">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#00f2ea] to-purple-500"></div>

                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center p-1 rounded-xl mb-4">
                        <img src="/Learn2Job.png" alt="Learn2Job" className="w-20 h-20 md:w-24 md:h-24 object-contain" />
                    </div>
                    <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                        Set New Password
                    </h1>
                    <p className="text-gray-400 mt-2 text-sm">
                        Enter a strong new password for your account
                    </p>
                </div>

                {error && (
                    <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm text-center">
                        {error}
                    </div>
                )}
                {successMessage && (
                    <div className="mb-6 p-3 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400 text-sm text-center">
                        {successMessage}
                        <br/><br/>
                        Redirecting to login...
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-xs font-medium text-gray-500 ml-1">New Password</label>
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
                        disabled={isLoading || !!successMessage}
                        className="w-full bg-gradient-to-r from-[#00f2ea] to-[#00aaff] text-[#060a0d] font-semibold py-3 rounded-xl hover:shadow-[0_0_20px_rgba(0,242,234,0.3)] transition-all duration-300 flex items-center justify-center mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <>
                                Reset Password
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </>
                        )}
                    </button>
                    <div className="mt-4 text-center">
                        <button
                            type="button"
                            onClick={onSuccess}
                            className="text-gray-500 hover:text-[#00f2ea] text-sm font-medium transition-colors"
                        >
                            Back to sign in
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;

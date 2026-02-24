import React, { useState } from 'react';
import Login from './Login';
import Logo from '../components/Logo';
import { TrendingUp, Briefcase, Lightbulb, Map, User } from 'lucide-react';

const LandingPage: React.FC = () => {
    const [showAuth, setShowAuth] = useState(false);
    const [authMode, setAuthMode] = useState<'login' | 'signup'>('signup');

    if (showAuth) {
        return <Login initialMode={authMode} onBack={() => setShowAuth(false)} />;
    }

    const features = [
        {
            icon: Map,
            title: 'AI-Powered Roadmaps',
            description: 'Get personalized learning paths tailored to your career goals in AI and tech.',
            color: 'from-[#00f2ea] to-[#00aaff]'
        },
        {
            icon: Lightbulb,
            title: 'Tool Discovery',
            description: 'Discover and explore the best AI tools, frameworks, and platforms for your projects.',
            color: 'from-purple-500 to-pink-500'
        },
        {
            icon: Briefcase,
            title: 'Job Board',
            description: 'Find AI and tech career opportunities from top companies around the world.',
            color: 'from-orange-500 to-red-500'
        },
        {
            icon: TrendingUp,
            title: 'Market Insights',
            description: 'Stay updated with the latest trends, technologies, and insights in the AI industry.',
            color: 'from-green-500 to-emerald-500'
        },
        {
            icon: User,
            title: 'Profile Management',
            description: 'Track your learning progress, achievements, and build your professional AI portfolio.',
            color: 'from-blue-500 to-cyan-500'
        }
    ];

    return (
        <div className="min-h-screen bg-[#060a0d] text-white">
            {/* Background Effects */}
            <div className="fixed top-0 right-0 -z-10 w-[1000px] h-[1000px] bg-[#00f2ea]/5 rounded-full blur-[150px] pointer-events-none translate-x-1/3 -translate-y-1/3"></div>
            <div className="fixed bottom-0 left-0 -z-10 w-[800px] h-[800px] bg-purple-500/5 rounded-full blur-[120px] pointer-events-none -translate-x-1/3 translate-y-1/3"></div>

            {/* Hero Section - Logo Above Text */}
            <section className="min-h-screen w-screen flex flex-col items-center justify-center relative px-6 py-20">
                {/* Logo Section */}
                <div className="w-full max-w-4xl mx-auto mb-12">
                    <Logo size="full" showText={false} className="w-full h-96 mx-auto" />
                </div>

                {/* Text Content Section */}
                <div className="text-center space-y-8 max-w-4xl mx-auto">
                    {/* Main Heading */}
                    <h1 className="text-6xl md:text-8xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white via-[#00f2ea] to-purple-500 leading-tight drop-shadow-2xl">
                        
                    </h1>

                    {/* Tagline */}
                    <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto font-medium drop-shadow-xl backdrop-blur-sm bg-black/20 rounded-lg p-4">
                        Your ultimate platform for career development and job opportunities.
                        <span className="text-[#00f2ea] font-bold"> Learn, Apply, Succeed.</span>
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
                                <button
                                    onClick={() => {
                                        setAuthMode('signup');
                                        setShowAuth(true);
                                    }}
                                    className="group px-8 py-4 bg-gradient-to-r from-[#00f2ea] to-[#00aaff] text-[#060a0d] font-bold rounded-2xl hover:shadow-[0_0_30px_rgba(0,242,234,0.4)] transition-all duration-300 flex items-center space-x-2 text-lg backdrop-blur-sm"
                                >
                                    <span>Get Started</span>
                                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
                                </button>

                                <button
                                    onClick={() => {
                                        setAuthMode('login');
                                        setShowAuth(true);
                                    }}
                                    className="px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold rounded-2xl transition-all duration-300 text-lg backdrop-blur-sm"
                                >
                                    Login
                                </button>
                            </div>
                        </div>
                    </section>

            {/* Features Section */}
            <section className="relative px-6 py-20 bg-gradient-to-b from-transparent to-[#0a0f12]">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
                            Everything You Need to <span className="text-[#00f2ea]">Succeed</span>
                        </h2>
                        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                            Comprehensive tools and resources to accelerate your journey in the AI industry
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="group relative bg-[#0a0f16]/50 backdrop-blur-sm border border-[#1e293b] rounded-3xl p-8 hover:border-[#00f2ea]/30 transition-all duration-300 hover:transform hover:scale-105"
                            >
                                {/* Icon */}
                                <div className={`inline-flex items-center justify-center p-4 bg-gradient-to-br ${feature.color} rounded-2xl mb-6 opacity-90 group-hover:opacity-100 transition-opacity`}>
                                    <feature.icon className="w-8 h-8 text-white" />
                                </div>

                                {/* Content */}
                                <h3 className="text-2xl font-bold text-white mb-3">{feature.title}</h3>
                                <p className="text-gray-400 leading-relaxed">{feature.description}</p>

                                {/* Hover Effect */}
                                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 rounded-3xl transition-opacity pointer-events-none`}></div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Final CTA Section */}
            <section className="relative px-6 py-20">
                <div className="max-w-4xl mx-auto text-center space-y-8">
                    <h2 className="text-4xl md:text-5xl font-black text-white">
                        Ready to Transform Your <span className="text-[#00f2ea]">Career?</span>
                    </h2>
                    <p className="text-gray-400 text-lg">
                        Join thousands of professionals already using Learn2Job to advance their careers
                    </p>
                    <button
                        onClick={() => {
                            setAuthMode('signup');
                            setShowAuth(true);
                        }}
                        className="px-10 py-5 bg-gradient-to-r from-[#00f2ea] to-[#00aaff] text-[#060a0d] font-bold rounded-2xl hover:shadow-[0_0_40px_rgba(0,242,234,0.5)] transition-all duration-300 text-xl"
                    >
                        Start Your Journey Today
                    </button>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-[#1e293b] py-8 text-center text-gray-500 text-sm">
                <p>&copy; 2026 Learn2Job. Empowering the next generation of professionals.</p>
            </footer>
        </div>
    );
};

export default LandingPage;

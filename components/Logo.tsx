import React from 'react';

/**
 * Learn2Job Logo Component
 *
 * A simple logo component featuring:
 * - Plain Learn2Job image without any styling
 * - Multiple size variants (sm, md, lg, xl, full)
 * - Optional text display (default: hidden)
 *
 * Usage:
 * <Logo size="lg" showText={false} className="my-custom-class" />
 * <Logo size="full" showText={false} className="w-full h-full" /> // For full-screen usage
 */
interface LogoProps {
    size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
    showText?: boolean;
    className?: string;
}

const Logo: React.FC<LogoProps> = ({
    size = 'md',
    showText = false,
    className = ''
}) => {
    const sizeClasses = {
        sm: { logo: 'w-8 h-8', text: 'text-xl' },
        md: { logo: 'w-10 h-10', text: 'text-2xl' },
        lg: { logo: 'w-14 h-14', text: 'text-4xl' },
        xl: { logo: 'w-20 h-20', text: 'text-6xl' },
        full: { logo: 'w-full h-full', text: 'text-9xl' }
    };

    const { logo, text } = sizeClasses[size];

    return (
        <div className={`flex items-center gap-3 ${size === 'full' ? 'w-full h-full justify-center' : ''} ${className}`}>
            {/* Logo Image */}
            <div className="relative">
                <img
                    src="/Learn2Job.png"
                    alt="Learn2Job Logo"
                    className={`${logo} relative object-contain`}
                />
            </div>

            {/* Logo Text - Brand name with gradient */}
            {showText && (
                <div className="flex flex-col">
                    <span className={`${text} font-black tracking-tighter leading-none`}>
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-gray-400">
                            Learn
                        </span>
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-400">
                            2
                        </span>
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-gray-400">
                            Job
                        </span>
                    </span>
                </div>
            )}
        </div>
    );
};

export default Logo;
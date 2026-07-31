'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
    Building2,
    Mail,
    Lock,
    Eye,
    EyeOff,
    User,
    Phone,
    ArrowRight,
    ShieldCheck,
    CheckCircle2,
    Sparkles,
    Store,
    Briefcase,
    AlertCircle,
    Check,
    UserCheck,
    HelpCircle,
    LogIn,
    UserPlus
} from 'lucide-react';

export default function AccountPage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');

    // Login Form States
    const [loginEmailOrPhone, setLoginEmailOrPhone] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [showLoginPassword, setShowLoginPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(true);
    const [isLoginLoading, setIsLoginLoading] = useState(false);
    const [loginError, setLoginError] = useState('');
    const [loginSuccess, setLoginSuccess] = useState('');
    const [forgotModalOpen, setForgotModalOpen] = useState(false);
    const [resetEmail, setResetEmail] = useState('');
    const [resetSent, setResetSent] = useState(false);

    // Signup Form States
    const [signupRole, setSignupRole] = useState<'renter' | 'owner'>('renter');
    const [fullName, setFullName] = useState('');
    const [signupEmail, setSignupEmail] = useState('');
    const [signupPhone, setSignupPhone] = useState('');
    const [signupPassword, setSignupPassword] = useState('');
    const [showSignupPassword, setShowSignupPassword] = useState(false);
    const [agreeTerms, setAgreeTerms] = useState(false);
    const [isSignupLoading, setIsSignupLoading] = useState(false);
    const [signupError, setSignupError] = useState('');
    const [signupSuccess, setSignupSuccess] = useState('');

    // Password strength calculator
    const calculatePasswordStrength = (pass: string) => {
        if (!pass) return { score: 0, text: '', color: 'bg-slate-700' };
        let score = 0;
        if (pass.length >= 8) score += 1;
        if (/[A-Z]/.test(pass)) score += 1;
        if (/[0-9]/.test(pass)) score += 1;
        if (/[^A-Za-z0-9]/.test(pass)) score += 1;

        if (score <= 1) return { score, text: 'Weak', color: 'bg-rose-500' };
        if (score === 2 || score === 3) return { score, text: 'Medium', color: 'bg-amber-500' };
        return { score, text: 'Strong', color: 'bg-emerald-500' };
    };

    const strength = calculatePasswordStrength(signupPassword);

    const handleLoginSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoginError('');
        setLoginSuccess('');

        if (!loginEmailOrPhone.trim()) {
            setLoginError('Please enter your email address or phone number');
            return;
        }
        if (!loginPassword) {
            setLoginError('Please enter your password');
            return;
        }

        setIsLoginLoading(true);

        setTimeout(() => {
            setIsLoginLoading(false);
            setLoginSuccess('Authentication successful! Redirecting to marketplace...');
            setTimeout(() => {
                router.push('/');
            }, 1200);
        }, 1000);
    };

    const handleSignupSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSignupError('');
        setSignupSuccess('');

        if (!fullName.trim()) {
            setSignupError('Please enter your full name or business name');
            return;
        }
        if (!signupEmail.trim() || !signupEmail.includes('@')) {
            setSignupError('Please enter a valid email address');
            return;
        }
        if (!signupPhone.trim()) {
            setSignupError('Please enter your phone number (+250 format)');
            return;
        }
        if (signupPassword.length < 6) {
            setSignupError('Password must be at least 6 characters long');
            return;
        }
        if (!agreeTerms) {
            setSignupError('Please accept the Terms of Service & Privacy Policy');
            return;
        }

        setIsSignupLoading(true);

        setTimeout(() => {
            setIsSignupLoading(false);
            setSignupSuccess(`Account created! Welcome to Gutuza ${signupRole === 'owner' ? 'Owner Fleet' : 'Marketplace'}.`);
            setTimeout(() => {
                router.push('/');
            }, 1400);
        }, 1200);
    };

    const handleDemoFill = (roleType: 'renter' | 'owner') => {
        if (roleType === 'renter') {
            setLoginEmailOrPhone('renter@gutuza.rw');
            setLoginPassword('password123');
        } else {
            setLoginEmailOrPhone('owner@kigali-machinery.rw');
            setLoginPassword('ownerpass123');
        }
        setLoginError('');
    };

    const handleForgotPassword = (e: React.FormEvent) => {
        e.preventDefault();
        if (!resetEmail) return;
        setResetSent(true);
        setTimeout(() => {
            setForgotModalOpen(false);
            setResetSent(false);
            setResetEmail('');
            setLoginSuccess('Password reset link sent to your email!');
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-[#0d1412] text-slate-100 flex flex-col justify-between selection:bg-emerald-500 selection:text-white">
            {/* Top Header Bar */}
            <header className="px-6 py-4 border-b border-slate-800/80 flex items-center justify-between max-w-7xl mx-auto w-full bg-[#111a18]">
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-600/30 group-hover:scale-105 transition-transform">
                        <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                        <span className="text-xl font-extrabold tracking-tight text-white">Gutuza</span>
                        <span className="ml-2 text-[10px] font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-500/30 uppercase">
                            Rwanda
                        </span>
                    </div>
                </Link>

                <div className="flex items-center gap-3">
                    <Link
                        href="/"
                        className="px-4 py-2 text-xs font-bold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700 transition-all"
                    >
                        Back to Marketplace
                    </Link>
                </div>
            </header>

            {/* Main Container */}
            <main className=" p-12 items-center">


                {/* Right Column: Tabbed Login / Sign Up Card */}
                <div className="lg:col-span-7 max-w-lg w-full mx-auto">
                    <div className="bg-[#14201c] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative">
                        {/* Top Navigation Tabs */}
                        <div className="flex items-center p-1.5 bg-slate-900/90 rounded-2xl border border-slate-800 mb-6">
                            <button
                                type="button"
                                onClick={() => setActiveTab('login')}
                                className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-bold rounded-xl transition-all ${activeTab === 'login'
                                        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                                        : 'text-slate-400 hover:text-white'
                                    }`}
                            >
                                <LogIn className="w-4 h-4" />
                                <span>Sign In</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => setActiveTab('signup')}
                                className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-bold rounded-xl transition-all ${activeTab === 'signup'
                                        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                                        : 'text-slate-400 hover:text-white'
                                    }`}
                            >
                                <UserPlus className="w-4 h-4" />
                                <span>Create Account</span>
                            </button>
                        </div>

                        {/* TAB 1: LOGIN FORM */}
                        {activeTab === 'login' && (
                            <div>
                                <div className="mb-6">
                                    <h2 className="text-xl font-extrabold text-white">Sign In to Gutuza</h2>
                                    <p className="text-xs text-slate-400 mt-1">
                                        Enter your registered email or phone number to access your account.
                                    </p>
                                </div>



                                {/* Alerts */}
                                {loginError && (
                                    <div className="mb-5 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                        <span>{loginError}</span>
                                    </div>
                                )}
                                {loginSuccess && (
                                    <div className="mb-5 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                                        <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-400" />
                                        <span>{loginSuccess}</span>
                                    </div>
                                )}

                                {/* Social Login Buttons */}
                                <div className="grid grid-cols-2 gap-3 mb-5">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setLoginEmailOrPhone('user.google@gutuza.rw');
                                            setLoginPassword('googlepass123');
                                        }}
                                        className="flex items-center justify-center gap-2 py-2.5 px-3 bg-slate-900 hover:bg-slate-800 border border-slate-700/70 rounded-xl text-xs font-semibold text-slate-200 transition-colors"
                                    >
                                        <svg className="w-4 h-4" viewBox="0 0 24 24">
                                            <path
                                                fill="#EA4335"
                                                d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.4 1 3.5 3.6 1.6 7.4l3.7 2.9C6.2 7.2 8.9 5 12 5z"
                                            />
                                            <path
                                                fill="#4285F4"
                                                d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
                                            />
                                            <path
                                                fill="#FBBC05"
                                                d="M5.3 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.6 7.4C.6 9.4 0 11.6 0 14s.6 4.6 1.6 6.6l3.7-2.9c-.3-.9-.4-1.9-.4-2.9z"
                                            />
                                            <path
                                                fill="#34A853"
                                                d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.1 0-5.8-2.2-6.7-5.3L1.6 16C3.5 19.8 7.4 23 12 23z"
                                            />
                                        </svg>
                                        <span>Google</span>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => {
                                            setLoginEmailOrPhone('+250788123456');
                                            setLoginPassword('momo2026pass');
                                        }}
                                        className="flex items-center justify-center gap-2 py-2.5 px-3 bg-slate-900 hover:bg-slate-800 border border-slate-700/70 rounded-xl text-xs font-semibold text-slate-200 transition-colors"
                                    >
                                        <Phone className="w-4 h-4 text-emerald-400" />
                                        <span>MoMo / Phone</span>
                                    </button>
                                </div>

                                <div className="relative flex items-center justify-center mb-5">
                                    <div className="border-t border-slate-800 w-full" />
                                    <span className="bg-[#14201c] px-3 text-[10px] font-medium text-slate-400 uppercase tracking-wider absolute">
                                        Or Email / Phone
                                    </span>
                                </div>

                                <form onSubmit={handleLoginSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                                            Email Address or Mobile Number
                                        </label>
                                        <div className="relative">
                                            <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                            <input
                                                type="text"
                                                value={loginEmailOrPhone}
                                                onChange={(e) => setLoginEmailOrPhone(e.target.value)}
                                                placeholder="e.g. buyer@gutuza.rw or +250 788 123 456"
                                                className="w-full pl-10 pr-4 py-2.5 bg-slate-900/90 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <div className="flex items-center justify-between mb-1.5">
                                            <label className="block text-xs font-semibold text-slate-300">
                                                Password
                                            </label>
                                            <button
                                                type="button"
                                                onClick={() => setForgotModalOpen(true)}
                                                className="text-[11px] font-semibold text-emerald-400 hover:underline"
                                            >
                                                Forgot Password?
                                            </button>
                                        </div>
                                        <div className="relative">
                                            <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                            <input
                                                type={showLoginPassword ? 'text' : 'password'}
                                                value={loginPassword}
                                                onChange={(e) => setLoginPassword(e.target.value)}
                                                placeholder="Enter your password"
                                                className="w-full pl-10 pr-10 py-2.5 bg-slate-900/90 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowLoginPassword(!showLoginPassword)}
                                                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                                            >
                                                {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between pt-1">
                                        <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300 select-none">
                                            <input
                                                type="checkbox"
                                                checked={rememberMe}
                                                onChange={(e) => setRememberMe(e.target.checked)}
                                                className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-emerald-600 focus:ring-emerald-500"
                                            />
                                            <span>Keep me logged in for 30 days</span>
                                        </label>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isLoginLoading}
                                        className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50 active:scale-[0.99]"
                                    >
                                        {isLoginLoading ? (
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        ) : (
                                            <>
                                                <span>Sign In to Account</span>
                                                <ArrowRight className="w-4 h-4" />
                                            </>
                                        )}
                                    </button>
                                </form>
                            </div>
                        )}

                        {/* TAB 2: SIGN UP FORM */}
                        {activeTab === 'signup' && (
                            <div>
                                <div className="mb-5">
                                    <h2 className="text-xl font-extrabold text-white">Create Your Account</h2>
                                    <p className="text-xs text-slate-400 mt-1">
                                        Join Gutuza as an equipment borrower, renter, or asset owner.
                                    </p>
                                </div>

                                {/* Account Role Selector */}
                                <div className="grid grid-cols-2 gap-3 mb-5">
                                    <button
                                        type="button"
                                        onClick={() => setSignupRole('renter')}
                                        className={`p-3 rounded-2xl border text-left transition-all ${signupRole === 'renter'
                                                ? 'bg-emerald-950/70 border-emerald-500 text-white ring-1 ring-emerald-500/50'
                                                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                                            }`}
                                    >
                                        <div className="flex items-center justify-between mb-1">
                                            <Store className={`w-4 h-4 ${signupRole === 'renter' ? 'text-emerald-400' : 'text-slate-500'}`} />
                                            {signupRole === 'renter' && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                                        </div>
                                        <div className="text-xs font-bold text-white">Renter / Buyer</div>
                                        <div className="text-[10px] text-slate-400 mt-0.5">Looking to hire equipment</div>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setSignupRole('owner')}
                                        className={`p-3 rounded-2xl border text-left transition-all ${signupRole === 'owner'
                                                ? 'bg-emerald-950/70 border-emerald-500 text-white ring-1 ring-emerald-500/50'
                                                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                                            }`}
                                    >
                                        <div className="flex items-center justify-between mb-1">
                                            <Building2 className={`w-4 h-4 ${signupRole === 'owner' ? 'text-emerald-400' : 'text-slate-500'}`} />
                                            {signupRole === 'owner' && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                                        </div>
                                        <div className="text-xs font-bold text-white">Asset / Fleet Owner</div>
                                        <div className="text-[10px] text-slate-400 mt-0.5">List tractors, fleets, & tools</div>
                                    </button>
                                </div>

                                {/* Alerts */}
                                {signupError && (
                                    <div className="mb-5 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                        <span>{signupError}</span>
                                    </div>
                                )}
                                {signupSuccess && (
                                    <div className="mb-5 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                                        <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-400" />
                                        <span>{signupSuccess}</span>
                                    </div>
                                )}

                                <form onSubmit={handleSignupSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                                            Full Name / Business Name
                                        </label>
                                        <div className="relative">
                                            <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                            <input
                                                type="text"
                                                value={fullName}
                                                onChange={(e) => setFullName(e.target.value)}
                                                placeholder="e.g. Divine Umutoni or Kigali Fleet Ltd"
                                                className="w-full pl-10 pr-4 py-2.5 bg-slate-900/90 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                                                Email Address
                                            </label>
                                            <div className="relative">
                                                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                                <input
                                                    type="email"
                                                    value={signupEmail}
                                                    onChange={(e) => setSignupEmail(e.target.value)}
                                                    placeholder="name@example.com"
                                                    className="w-full pl-10 pr-4 py-2.5 bg-slate-900/90 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                                                Phone Number (Rwanda)
                                            </label>
                                            <div className="relative">
                                                <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                                <input
                                                    type="text"
                                                    value={signupPhone}
                                                    onChange={(e) => setSignupPhone(e.target.value)}
                                                    placeholder="+250 78X XXX XXX"
                                                    className="w-full pl-10 pr-4 py-2.5 bg-slate-900/90 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                                            Password
                                        </label>
                                        <div className="relative">
                                            <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                            <input
                                                type={showSignupPassword ? 'text' : 'password'}
                                                value={signupPassword}
                                                onChange={(e) => setSignupPassword(e.target.value)}
                                                placeholder="Create password (min. 6 characters)"
                                                className="w-full pl-10 pr-10 py-2.5 bg-slate-900/90 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowSignupPassword(!showSignupPassword)}
                                                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                                            >
                                                {showSignupPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            </button>
                                        </div>

                                        {/* Password Strength Meter */}
                                        {signupPassword && (
                                            <div className="mt-2 space-y-1">
                                                <div className="flex items-center justify-between text-[10px] text-slate-400">
                                                    <span>Password Strength:</span>
                                                    <span className="font-bold text-white">{strength.text}</span>
                                                </div>
                                                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden flex gap-1">
                                                    <div className={`h-full flex-1 ${strength.score >= 1 ? strength.color : 'bg-slate-700'}`} />
                                                    <div className={`h-full flex-1 ${strength.score >= 2 ? strength.color : 'bg-slate-700'}`} />
                                                    <div className={`h-full flex-1 ${strength.score >= 4 ? strength.color : 'bg-slate-700'}`} />
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="pt-1">
                                        <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-300 select-none">
                                            <input
                                                type="checkbox"
                                                checked={agreeTerms}
                                                onChange={(e) => setAgreeTerms(e.target.checked)}
                                                className="mt-0.5 w-4 h-4 rounded bg-slate-900 border-slate-700 text-emerald-600 focus:ring-emerald-500"
                                            />
                                            <span className="leading-snug text-slate-400">
                                                I agree to Gutuza's <span className="text-emerald-400 font-semibold hover:underline">Terms</span> and <span className="text-emerald-400 font-semibold hover:underline">Privacy Policy</span>.
                                            </span>
                                        </label>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isSignupLoading}
                                        className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50 active:scale-[0.99]"
                                    >
                                        {isSignupLoading ? (
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        ) : (
                                            <>
                                                <span>Register Gutuza Account</span>
                                                <ArrowRight className="w-4 h-4" />
                                            </>
                                        )}
                                    </button>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* Forgot Password Modal */}
            {forgotModalOpen && (
                <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-[#14201c] border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                <HelpCircle className="w-5 h-5 text-emerald-400" />
                                Reset Password
                            </h3>
                            <button
                                onClick={() => setForgotModalOpen(false)}
                                className="text-slate-400 hover:text-white text-sm"
                            >
                                ✕
                            </button>
                        </div>
                        <p className="text-xs text-slate-300">
                            Enter your registered email address or phone number. We'll send an instant reset link.
                        </p>

                        {resetSent ? (
                            <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                                <span>Reset verification code sent! Check your SMS/email.</span>
                            </div>
                        ) : (
                            <form onSubmit={handleForgotPassword} className="space-y-3">
                                <input
                                    type="text"
                                    value={resetEmail}
                                    onChange={(e) => setResetEmail(e.target.value)}
                                    placeholder="Enter email or phone..."
                                    className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    required
                                />
                                <div className="flex justify-end gap-2 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => setForgotModalOpen(false)}
                                        className="px-3 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800 rounded-xl"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl"
                                    >
                                        Send Link
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            )}

            {/* Footer */}
            <footer className="px-6 py-4 border-t border-slate-800/80 text-center text-xs text-slate-500">
                &copy; {new Date().getFullYear()} Gutuza Digital Asset Marketplace Rwanda. All rights reserved.
            </footer>
        </div>
    );
}

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeftRight,
  Calendar,
  Tag,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ArrowLeft,
  Check,
  User,
  Building2,
  Phone,
} from 'lucide-react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import {
  loginWithIdentifier,
  registerWithEmail,
  signInWithGoogle,
} from '@/lib/authServices';

const AssetifyLogo = ({ className = 'w-9 h-9' }: { className?: string }) => (
  <svg viewBox="0 0 95 85" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path fill="#0e8345" d="M 38 6 L 8 78 L 26 78 L 46 28 L 53 28 L 43 6 Z" />
    <path fill="#0e8345" d="M 57 6 L 86 78 L 68 78 L 50 33 L 44 33 L 52 6 Z" />
    <path fill="#2BB673" d="M 26 50 L 39 63 L 80 15 C 83 11 88 12 91 15 C 94 18 94 23 90 26 L 44 78 C 42 80 38 80 35 78 L 18 60 C 15 57 15 52 18 49 C 20 46 24 46 26 50 Z" />
  </svg>
);

interface AuthFormProps {
  mode: 'login' | 'signup';
}

export const AuthForm: React.FC<AuthFormProps> = ({ mode }) => {
  const router = useRouter();
  const isLoginMode = mode === 'login';

  // Form States
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [fullName, setFullName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [signupRole, setSignupRole] = useState<'buyer' | 'seller'>('buyer');
  const [agreeTerms, setAgreeTerms] = useState(false);

  // Status & Feedback States
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);

  // After a successful sign-in/sign-up, hand off to /dashboard, which
  // waits for the profile to hydrate and routes to the right role's page.
  const goToDashboard = () => {
    setTimeout(() => router.push('/dashboard'), 700);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (isLoginMode) {
      if (!loginIdentifier.trim()) {
        setErrorMsg('Please enter your email address or phone number');
        return;
      }
      if (!password) {
        setErrorMsg('Please enter your password');
        return;
      }

      setIsLoading(true);
      try {
        await loginWithIdentifier(loginIdentifier, password);
        setSuccessMsg('Authentication successful! Redirecting...');
        goToDashboard();
      } catch (err: unknown) {
        if (err instanceof Error) {
          setErrorMsg(err.message.replace('Firebase: ', ''));
        } else {
          setErrorMsg('Failed to sign in. Please check your credentials.');
        }
      } finally {
        setIsLoading(false);
      }
    } else {
      if (!fullName.trim()) {
        setErrorMsg('Please enter your full name');
        return;
      }
      if (!signupEmail.trim() || !signupEmail.includes('@')) {
        setErrorMsg('Please enter a valid email address');
        return;
      }
      if (!phoneNumber.trim()) {
        setErrorMsg('Please enter your phone number');
        return;
      }
      if (password.length < 6) {
        setErrorMsg('Password must be at least 6 characters');
        return;
      }
      if (!agreeTerms) {
        setErrorMsg('Please accept the Terms of Service & Privacy Policy');
        return;
      }

      setIsLoading(true);
      try {
        await registerWithEmail({
          fullName: fullName.trim(),
          email: signupEmail.trim().toLowerCase(),
          phoneNumber: phoneNumber.trim().replace(/[\s\-()]/g, ''),
          password,
          role: signupRole,
        });

        setSuccessMsg('Account created successfully! Welcome to Assetify.');
        goToDashboard();
      } catch (err: unknown) {
        if (err instanceof Error) {
          setErrorMsg(err.message.replace('Firebase: ', ''));
        } else {
          setErrorMsg('Failed to create account. Please try again.');
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMsg('');
    setIsLoading(true);
    try {
      await signInWithGoogle(signupRole);
      setSuccessMsg('Signed in with Google! Redirecting...');
      goToDashboard();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMsg(err.message.replace('Firebase: ', ''));
      } else {
        setErrorMsg('Failed to sign in with Google.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail.trim()) return;

    try {
      await sendPasswordResetEmail(auth, resetEmail.trim().toLowerCase());
      setResetSent(true);
      setTimeout(() => {
        setForgotModalOpen(false);
        setResetSent(false);
        setResetEmail('');
        setSuccessMsg('Password reset link sent to your email!');
      }, 1500);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMsg(err.message.replace('Firebase: ', ''));
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col justify-between font-sans selection:bg-[#0e8345] selection:text-white">
      {/* Top Header */}
      <header className="w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <AssetifyLogo className="w-9 h-9 transition-transform group-hover:scale-105" />
          <span className="text-2xl font-black tracking-tight text-slate-900">Assetify</span>
        </Link>

        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-800 hover:text-[#0e8345] transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-slate-700" />
          <span>Back to Home</span>
        </Link>
      </header>

      {/* Main Container */}
      <main className="w-full max-w-7xl mx-auto md:px-20 px-6 py-4 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column: Branding, Slogan & Features */}
        <div className="lg:col-span-6 flex flex-col justify-between pt-4 lg:pt-0">
          <div>
            <h1 className="text-4xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-[1.08] mb-4">
              Find. Swap.<br />
              Rent. Sell.<br />
              <span className="text-[#0e8345]">Assetify.</span>
            </h1>

            <p className="text-slate-500 text-base font-medium mb-10 max-w-md">
              The smartest way to swap, rent, or buy assets near you.
            </p>

            <div className="flex items-center gap-8 flex-wrap sm:flex-nowrap">
              <div className="flex flex-col items-start gap-1">
                <div className="w-12 h-12 rounded-xl bg-[#e6f4ea] text-[#0e8345] flex items-center justify-center mb-1">
                  <ArrowLeftRight className="w-5 h-5" />
                </div>
                <span className="text-sm font-bold text-slate-900 leading-tight">Swap</span>
                <span className="text-xs text-slate-500 leading-tight">easily</span>
              </div>

              <div className="flex flex-col items-start gap-1">
                <div className="w-12 h-12 rounded-xl bg-[#e6f4ea] text-[#0e8345] flex items-center justify-center mb-1">
                  <Calendar className="w-5 h-5" />
                </div>
                <span className="text-sm font-bold text-slate-900 leading-tight">Rent</span>
                <span className="text-xs text-slate-500 leading-tight">flexibly</span>
              </div>

              <div className="flex flex-col items-start gap-1">
                <div className="w-12 h-12 rounded-xl bg-[#e6f4ea] text-[#0e8345] flex items-center justify-center mb-1">
                  <Tag className="w-5 h-5" />
                </div>
                <span className="text-sm font-bold text-slate-900 leading-tight">Buy & Sell</span>
                <span className="text-xs text-slate-500 leading-tight">safely</span>
              </div>

              <div className="flex flex-col items-start gap-1">
                <div className="w-12 h-12 rounded-xl bg-[#e6f4ea] text-[#0e8345] flex items-center justify-center mb-1">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <span className="text-sm font-bold text-slate-900 leading-tight">Trusted</span>
                <span className="text-xs text-slate-500 leading-tight">community</span>
              </div>
            </div>
          </div>

          <div className="relative mt-8 flex items-end justify-center sm:justify-start">
            <div className="absolute -left-3 bottom-10 grid grid-cols-3 gap-2 opacity-25 pointer-events-none">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="w-1.5 h-1.5 rounded-full bg-[#0e8345]" />
              ))}
            </div>

            <div className="relative z-10 w-full max-w-md">
              <img
                src="/assetify_products_podium2.png"
                alt="Assetify Equipment Showcase"
                className="w-full h-auto object-contain drop-shadow-md"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Authentication Card */}
        <div className="lg:col-span-6 flex justify-center lg:justify-end">
          <div className="w-full max-w-md bg-white border border-slate-100 rounded-[28px] shadow-[0_15px_45px_rgba(0,0,0,0.06)] p-7 sm:p-9 relative">
            <div className="mb-6">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                {isLoginMode ? 'Welcome Back 👋' : 'Create Account 👋'}
              </h2>
              <p className="text-sm text-slate-500 mt-1.5 font-medium">
                {isLoginMode
                  ? 'Sign in with your email or registered phone number'
                  : 'Sign up to start renting, swapping, or listing assets'}
              </p>
            </div>

            {errorMsg && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs flex items-center gap-2 font-medium">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}
            {successMsg && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-[#0e8345] text-xs flex items-center gap-2 font-medium">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-[#0e8345]" />
                <span>{successMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5">
              {!isLoginMode && (
                <>
                  {/* Role Selector */}
                  <div className="grid grid-cols-2 gap-2 mb-2">
                    <button
                      type="button"
                      onClick={() => setSignupRole('buyer')}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        signupRole === 'buyer'
                          ? 'bg-[#e6f4ea] border-[#0e8345] text-[#0e8345] font-bold'
                          : 'bg-[#f8fafc] border-slate-200 text-slate-600'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5" />
                          Buyer / Renter
                        </span>
                        {signupRole === 'buyer' && <Check className="w-3.5 h-3.5 text-[#0e8345]" />}
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSignupRole('seller')}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        signupRole === 'seller'
                          ? 'bg-[#e6f4ea] border-[#0e8345] text-[#0e8345] font-bold'
                          : 'bg-[#f8fafc] border-slate-200 text-slate-600'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="flex items-center gap-1.5">
                          <Building2 className="w-3.5 h-3.5" />
                          Seller / Asset Owner
                        </span>
                        {signupRole === 'seller' && <Check className="w-3.5 h-3.5 text-[#0e8345]" />}
                      </div>
                    </button>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <User className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. Jean Doe"
                        className="w-full pl-10 pr-4 py-2.5 bg-[#f8fafc] border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0e8345] focus:bg-white font-medium transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Phone className="w-4 h-4" />
                      </div>
                      <input
                        type="tel"
                        required
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="+250 788 000 000"
                        className="w-full pl-10 pr-4 py-2.5 bg-[#f8fafc] border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0e8345] focus:bg-white font-medium transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input
                        type="email"
                        required
                        value={signupEmail}
                        onChange={(e) => setSignupEmail(e.target.value)}
                        placeholder="name@example.com"
                        className="w-full pl-10 pr-4 py-2.5 bg-[#f8fafc] border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0e8345] focus:bg-white font-medium transition-all"
                      />
                    </div>
                  </div>
                </>
              )}

              {isLoginMode && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Email or Phone Number</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      required
                      value={loginIdentifier}
                      onChange={(e) => setLoginIdentifier(e.target.value)}
                      placeholder="you@example.com or +250..."
                      className="w-full pl-10 pr-4 py-2.5 bg-[#f8fafc] border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0e8345] focus:bg-white font-medium transition-all"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 bg-[#f8fafc] border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0e8345] focus:bg-white font-medium transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {isLoginMode ? (
                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded text-[#0e8345] border-slate-300 focus:ring-[#0e8345] accent-[#0e8345]"
                    />
                    <span className="text-xs font-semibold text-slate-700">Remember me</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setForgotModalOpen(true)}
                    className="text-xs font-semibold text-[#0e8345] hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
              ) : (
                <div className="pt-1">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                      className="w-4 h-4 rounded text-[#0e8345] border-slate-300 focus:ring-[#0e8345] accent-[#0e8345]"
                    />
                    <span className="text-xs font-semibold text-slate-700">
                      I agree to the Terms of Service & Privacy Policy
                    </span>
                  </label>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 bg-[#0e8345] hover:bg-[#0b6b38] active:scale-[0.99] text-white font-bold text-sm rounded-xl shadow-lg shadow-[#0e8345]/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-3"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>{isLoginMode ? 'Sign In' : 'Create Account'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="relative my-4 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <span className="relative bg-white px-3 text-xs text-slate-400 font-medium">Or continue with</span>
            </div>

            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 py-2.5 px-4 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 shadow-sm transition-all active:scale-[0.99] disabled:opacity-50"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.4 1 3.5 3.6 1.6 7.4l3.7 2.9C6.2 7.2 8.9 5 12 5z" />
                <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z" />
                <path fill="#FBBC05" d="M5.3 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.6 7.4C.6 9.4 0 11.6 0 14s.6 4.6 1.6 6.6l3.7-2.9c-.3-.9-.4-1.9-.4-2.9z" />
                <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.1 0-5.8-2.2-6.7-5.3L1.6 16C3.5 19.8 7.4 23 12 23z" />
              </svg>
              <span>Continue with Google</span>
            </button>

            <div className="mt-5 text-center">
              <p className="text-xs sm:text-sm text-slate-500 font-medium">
                {isLoginMode ? "Don't have an account? " : 'Already have an account? '}
                <Link
                  href={isLoginMode ? '/signup' : '/login'}
                  className="font-bold text-[#0e8345] hover:underline ml-0.5"
                >
                  {isLoginMode ? 'Create Account' : 'Sign In'}
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Forgot Password Modal */}
      {forgotModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-100 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-[#0e8345]" />
                Reset Password
              </h3>
              <button
                onClick={() => setForgotModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-slate-600">
              Enter your registered email address. We will send an instant reset link.
            </p>

            {resetSent ? (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-[#0e8345] text-xs flex items-center gap-2 font-medium">
                <CheckCircle2 className="w-4 h-4 text-[#0e8345] flex-shrink-0" />
                <span>Reset link sent! Check your inbox.</span>
              </div>
            ) : (
              <form onSubmit={handleForgotPassword} className="space-y-3">
                <input
                  type="email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-4 py-2.5 bg-[#f8fafc] border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0e8345]"
                  required
                />
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setForgotModalOpen(false)}
                    className="px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-bold bg-[#0e8345] hover:bg-[#0b6b38] text-white rounded-xl shadow transition-colors"
                  >
                    Send Link
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      <footer className="py-6 text-center text-xs text-slate-500 border-t border-slate-100/60 mt-auto">
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4">
          <span>&copy; {new Date().getFullYear()} Assetify. All rights reserved.</span>
          <span className="text-slate-300">|</span>
          <Link href="#" className="hover:text-slate-800 transition-colors">Privacy Policy</Link>
          <span className="text-slate-300">|</span>
          <Link href="#" className="hover:text-slate-800 transition-colors">Terms of Service</Link>
        </div>
      </footer>
    </div>
  );
};

/**
 * Forgot Password Page
 * 3-step flow: Email → Verify OTP → Reset Password
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { authService } from '@/services/auth.service';
import {
  EnvelopeIcon,
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
  KeyIcon,
} from '@heroicons/react/24/outline';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

type Step = 'email' | 'otp' | 'reset' | 'success';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('email');

  // Step 1: Email
  const [email, setEmail] = useState('');
  const [emailLoading, setEmailLoading] = useState(false);

  // Step 2: OTP
  const [otp, setOtp] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);

  // Step 3: Reset Password
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

  // Step 1: Gửi OTP
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailLoading(true);
    try {
      await authService.forgotPassword({ email });
      toast.success(`Mã OTP đã được gửi đến ${email}`);
      setStep('otp');
    } catch (err: any) {
      toast.error(err?.message || 'Có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setEmailLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setOtpLoading(true);
    try {
      const token = await authService.verifyForgotPasswordOtp({ email, otp });
      setResetToken(token);
      toast.success('Xác thực OTP thành công');
      setStep('reset');
    } catch (err: any) {
      toast.error(err?.message || 'OTP không hợp lệ hoặc đã hết hạn.');
    } finally {
      setOtpLoading(false);
    }
  };

  // Step 3: Reset Password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword.length < 6) {
      toast.error('Mật khẩu phải có ít nhất 6 ký tự.');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('Xác nhận mật khẩu không khớp.');
      return;
    }

    setResetLoading(true);
    try {
      await authService.resetPassword({ email, resetToken, newPassword });
      setStep('success');
    } catch (err: any) {
      toast.error(err?.message || 'Không thể đặt lại mật khẩu. Vui lòng thử lại.');
    } finally {
      setResetLoading(false);
    }
  };

  const stepLabels = ['Nhập email', 'Xác thực OTP', 'Mật khẩu mới'];
  const stepIndex = step === 'email' ? 0 : step === 'otp' ? 1 : 2;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-white">
      <Header />
      <main className="flex-grow flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">

            {/* Success State */}
            {step === 'success' ? (
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  <CheckCircleIcon className="w-16 h-16 text-green-500" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Đặt lại mật khẩu thành công!</h1>
                <p className="text-gray-600 text-sm mb-6">
                  Mật khẩu của bạn đã được cập nhật. Hãy đăng nhập lại.
                </p>
                <button
                  onClick={() => router.push('/login')}
                  className="w-full py-3 rounded-lg font-semibold bg-[#FF4F00] text-white hover:bg-[#e64500] transition-colors"
                >
                  Đăng nhập ngay
                </button>
              </div>
            ) : (
              <>
                {/* Icon */}
                <div className="flex justify-center mb-6">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200">
                    <KeyIcon className="w-6 h-6 text-gray-600" />
                  </div>
                </div>

                {/* Title */}
                <h1 className="text-2xl font-bold text-gray-900 text-center mb-1">
                  Quên mật khẩu
                </h1>
                <p className="text-gray-500 text-center text-sm mb-6">
                  {step === 'email' && 'Nhập email để nhận mã OTP'}
                  {step === 'otp' && `Nhập mã OTP đã gửi đến ${email}`}
                  {step === 'reset' && 'Tạo mật khẩu mới cho tài khoản'}
                </p>

                {/* Step Indicator */}
                <div className="flex items-center mb-8">
                  {stepLabels.map((label, i) => (
                    <div key={i} className="flex items-center flex-1">
                      <div className="flex flex-col items-center flex-1">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                            i < stepIndex
                              ? 'bg-green-500 text-white'
                              : i === stepIndex
                              ? 'bg-[#FF4F00] text-white'
                              : 'bg-gray-200 text-gray-400'
                          }`}
                        >
                          {i < stepIndex ? <CheckCircleIcon className="w-5 h-5" /> : i + 1}
                        </div>
                        <span className={`text-xs mt-1 text-center leading-tight ${i === stepIndex ? 'text-[#FF4F00] font-semibold' : 'text-gray-400'}`}>
                          {label}
                        </span>
                      </div>
                      {i < stepLabels.length - 1 && (
                        <div className={`h-0.5 flex-1 mx-1 mb-5 ${i < stepIndex ? 'bg-green-500' : 'bg-gray-200'}`} />
                      )}
                    </div>
                  ))}
                </div>

                {/* Step 1: Email */}
                {step === 'email' && (
                  <form onSubmit={handleSendOtp} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <div className="relative">
                        <EnvelopeIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Nhập email tài khoản"
                          required
                          disabled={emailLoading}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF4F00] transition-all"
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      disabled={emailLoading}
                      className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                        emailLoading ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-[#FF4F00] text-white hover:bg-[#e64500]'
                      }`}
                    >
                      {emailLoading ? 'Đang gửi...' : 'Gửi mã OTP'}
                    </button>
                  </form>
                )}

                {/* Step 2: OTP */}
                {step === 'otp' && (
                  <form onSubmit={handleVerifyOtp} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Mã OTP</label>
                      <input
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        placeholder="Nhập mã 6 chữ số"
                        required
                        maxLength={6}
                        disabled={otpLoading}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF4F00] text-center text-2xl font-mono tracking-widest transition-all"
                      />
                      <p className="text-xs text-gray-500 mt-1">OTP có hiệu lực trong 5 phút</p>
                    </div>
                    <button
                      type="submit"
                      disabled={otpLoading || otp.length < 6}
                      className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                        otpLoading || otp.length < 6
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-[#FF4F00] text-white hover:bg-[#e64500]'
                      }`}
                    >
                      {otpLoading ? 'Đang xác thực...' : 'Xác thực OTP'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep('email')}
                      className="w-full py-2 text-sm text-gray-500 hover:text-[#FF4F00] transition-colors"
                    >
                      Nhập lại email
                    </button>
                  </form>
                )}

                {/* Step 3: Reset Password */}
                {step === 'reset' && (
                  <form onSubmit={handleResetPassword} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Mật khẩu mới</label>
                      <div className="relative">
                        <LockClosedIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type={showNewPassword ? 'text' : 'password'}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Tối thiểu 6 ký tự"
                          required
                          minLength={6}
                          disabled={resetLoading}
                          className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF4F00] transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showNewPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Xác nhận mật khẩu</label>
                      <div className="relative">
                        <LockClosedIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Nhập lại mật khẩu mới"
                          required
                          disabled={resetLoading}
                          className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF4F00] transition-all ${
                            confirmPassword && confirmPassword !== newPassword ? 'border-red-400' : 'border-gray-300'
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showConfirmPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                        </button>
                      </div>
                      {confirmPassword && confirmPassword !== newPassword && (
                        <p className="text-xs text-red-500 mt-1">Mật khẩu không khớp</p>
                      )}
                    </div>
                    <button
                      type="submit"
                      disabled={resetLoading}
                      className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                        resetLoading ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-[#FF4F00] text-white hover:bg-[#e64500]'
                      }`}
                    >
                      {resetLoading ? 'Đang cập nhật...' : 'Đặt lại mật khẩu'}
                    </button>
                  </form>
                )}

                {/* Back to Login */}
                <div className="mt-6 text-center text-sm text-gray-600">
                  <Link href="/login" className="text-[#FF4F00] hover:underline font-medium">
                    Quay lại đăng nhập
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

/**
 * Profile Page
 * Trang quản lý thông tin tài khoản
 */

'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { toast } from 'sonner';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Card from '@/components/ui/Card';
import { useAuth } from '@/hooks/use-auth';
import { userService } from '@/services/user.service';
import { authService } from '@/services/auth.service';
import { reviewService } from '@/services/review.service';
import { useMyReviews } from '@/hooks/use-my-reviews';
import ReviewCard from '@/components/reviews/ReviewCard';
import EditReviewModal from '@/components/reviews/EditReviewModal';
import Pagination from '@/components/reviews/Pagination';
import { HomeIcon, CameraIcon, LockClosedIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { ChevronRightIcon } from '@heroicons/react/24/solid';
import type { UserProfile, UpdateProfileRequest } from '@/types/auth';
import type { Review } from '@/types/api';

export default function ProfilePage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  // My Reviews state
  const [reviewFilters, setReviewFilters] = useState({ page: 1, pageSize: 10 });
  const { reviews, loading: reviewsLoading, error: reviewsError, pagination, refetch: refetchReviews } = useMyReviews(reviewFilters);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);

  // Form state
  const [fullName, setFullName] = useState('');
  const [address, setAddress] = useState('');
  const [note, setNote] = useState('');

  // Change password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordValidationErrors, setPasswordValidationErrors] = useState<Record<string, string>>({});

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login?redirect=/profile');
    }
  }, [isAuthenticated, authLoading, router]);

  // Load profile
  useEffect(() => {
    if (!isAuthenticated) return;

    setIsLoading(true);

    userService
      .getMyProfile()
      .then((profileData) => {
        setProfile(profileData);
        setFullName(profileData.fullName || '');
        setAddress(profileData.address || '');
        setNote(profileData.note || '');
        setAvatarPreview(profileData.avatarUrl);
      })
      .catch((err) => {
        const msg = err instanceof Error ? err.message : 'Không thể tải thông tin tài khoản';
        toast.error(msg);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [isAuthenticated]);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    const errors: Record<string, string> = {};
    if (!currentPassword) errors.currentPassword = 'Vui lòng nhập mật khẩu hiện tại';
    if (!newPassword) errors.newPassword = 'Vui lòng nhập mật khẩu mới';
    else if (newPassword.length < 6) errors.newPassword = 'Mật khẩu phải có ít nhất 6 ký tự';
    if (!confirmPassword) errors.confirmPassword = 'Vui lòng xác nhận mật khẩu mới';
    else if (newPassword !== confirmPassword) errors.confirmPassword = 'Mật khẩu xác nhận không khớp';

    if (Object.keys(errors).length > 0) {
      setPasswordValidationErrors(errors);
      return;
    }
    setPasswordValidationErrors({});
    setIsChangingPassword(true);

    try {
      await authService.changePassword({ currentPassword, newPassword });
      toast.success('Đổi mật khẩu thành công!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      toast.error(err?.message || 'Mật khẩu hiện tại không đúng.');
    } finally {
      setIsChangingPassword(false);
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (fullName && fullName.length > 200) {
      errors.fullName = 'Họ tên không được vượt quá 200 ký tự';
    }
    if (address && address.length > 500) {
      errors.address = 'Địa chỉ không được vượt quá 500 ký tự';
    }
    if (note && note.length > 1000) {
      errors.note = 'Ghi chú không được vượt quá 1000 ký tự';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSaving(true);

    try {
      const updateData: UpdateProfileRequest = {};
      if (fullName !== profile?.fullName) updateData.fullName = fullName || undefined;
      if (address !== profile?.address) updateData.address = address || undefined;
      if (note !== profile?.note) updateData.note = note || undefined;

      const updatedProfile = await userService.updateProfile(updateData);
      setProfile(updatedProfile);
      toast.success('Cập nhật thông tin thành công!');
    } catch (err: any) {
      toast.error(err?.message || 'Có lỗi xảy ra khi cập nhật thông tin. Vui lòng thử lại.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('File phải là hình ảnh');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Kích thước file không được vượt quá 5MB');
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    setIsUploadingAvatar(true);

    userService
      .updateAvatar(file)
      .then((updatedProfile) => {
        setProfile(updatedProfile);
        toast.success('Cập nhật avatar thành công!');
      })
      .catch((err: any) => {
        toast.error(err?.message || 'Không thể upload avatar. Vui lòng thử lại.');
        setAvatarPreview(profile?.avatarUrl || null);
      })
      .finally(() => {
        setIsUploadingAvatar(false);
        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      });
  };

  const handleEditReview = (review: Review) => {
    setEditingReview(review);
  };

  const handleDeleteReview = async (reviewId: number) => {
    const confirmed = window.confirm('Bạn có chắc chắn muốn xóa đánh giá này?');
    if (!confirmed) return;

    setIsDeleting(reviewId);
    try {
      await reviewService.deleteReview(reviewId);
      refetchReviews();
    } catch (err: any) {
      toast.error(err?.message || 'Không thể xóa đánh giá. Vui lòng thử lại.');
    } finally {
      setIsDeleting(null);
    }
  };

  const handleReviewUpdated = () => {
    refetchReviews();
    setEditingReview(null);
  };

  const handleReviewPageChange = (page: number) => {
    setReviewFilters((prev) => ({ ...prev, page }));
  };

  // Show loading or redirect if not ready
  if (authLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow bg-[#F5F5F5] flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF4F00]"></div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-[#F5F5F5]">
        <div className="container mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <nav className="mb-6 flex items-center gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-[#FF4F00] transition-colors flex items-center gap-1">
              <HomeIcon className="w-4 h-4" />
              Trang chủ
            </Link>
            <ChevronRightIcon className="w-4 h-4" />
            <span className="text-gray-900 font-medium">Tài khoản</span>
          </nav>

          {/* Page Header */}
          <div className="mb-6">
            <h1 className="text-3xl md:text-4xl font-bold text-[#333333] mb-2">
              Thông tin tài khoản
            </h1>
            <p className="text-gray-600">Quản lý thông tin cá nhân của bạn</p>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF4F00]"></div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left: Profile Form */}
              <div className="lg:col-span-2">
                <Card>
                  <form onSubmit={handleSaveProfile} className="space-y-6">
                    {/* Avatar Upload */}
                    <div>
                      <label className="block text-sm font-semibold text-[#333333] mb-3">
                        Ảnh đại diện
                      </label>
                      <div className="flex items-center gap-6">
                        <div className="relative">
                          {avatarPreview ? (
                            <Image
                              src={avatarPreview}
                              alt="Avatar"
                              width={120}
                              height={120}
                              className="w-[120px] h-[120px] rounded-full object-cover border-4 border-gray-200"
                            />
                          ) : (
                            <div className="w-[120px] h-[120px] rounded-full bg-gray-200 flex items-center justify-center border-4 border-gray-300">
                              <span className="text-gray-400 text-2xl font-bold">
                                {profile?.fullName?.[0]?.toUpperCase() || profile?.email[0]?.toUpperCase() || 'U'}
                              </span>
                            </div>
                          )}
                          {isUploadingAvatar && (
                            <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                            </div>
                          )}
                        </div>
                        <div>
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            onChange={handleAvatarChange}
                            disabled={isUploadingAvatar}
                            className="hidden"
                          />
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isUploadingAvatar}
                            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <CameraIcon className="w-5 h-5" />
                            {isUploadingAvatar ? 'Đang upload...' : 'Thay đổi avatar'}
                          </button>
                          <p className="text-xs text-gray-500 mt-2">
                            JPEG, PNG, WebP. Tối đa 5MB
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Email (Readonly) */}
                    <div>
                      <label className="block text-sm font-semibold text-[#333333] mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={profile?.email || ''}
                        disabled
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
                      />
                      <p className="text-xs text-gray-500 mt-1">Email không thể thay đổi</p>
                    </div>

                    {/* Full Name */}
                    <div>
                      <label className="block text-sm font-semibold text-[#333333] mb-2">
                        Họ và tên
                      </label>
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => {
                          setFullName(e.target.value);
                          if (validationErrors.fullName) {
                            setValidationErrors((prev) => {
                              const newErrors = { ...prev };
                              delete newErrors.fullName;
                              return newErrors;
                            });
                          }
                        }}
                        placeholder="Nhập họ và tên"
                        maxLength={200}
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF4F00] transition-all ${
                          validationErrors.fullName ? 'border-red-500' : 'border-gray-300'
                        }`}
                        disabled={isSaving}
                      />
                      <div className="flex justify-between items-center mt-1">
                        {validationErrors.fullName && (
                          <p className="text-sm text-red-600">{validationErrors.fullName}</p>
                        )}
                        <p className="text-sm text-gray-500 ml-auto">
                          {fullName.length}/200
                        </p>
                      </div>
                    </div>

                    {/* Address */}
                    <div>
                      <label className="block text-sm font-semibold text-[#333333] mb-2">
                        Địa chỉ
                      </label>
                      <textarea
                        value={address}
                        onChange={(e) => {
                          setAddress(e.target.value);
                          if (validationErrors.address) {
                            setValidationErrors((prev) => {
                              const newErrors = { ...prev };
                              delete newErrors.address;
                              return newErrors;
                            });
                          }
                        }}
                        placeholder="Nhập địa chỉ"
                        rows={3}
                        maxLength={500}
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF4F00] transition-all ${
                          validationErrors.address ? 'border-red-500' : 'border-gray-300'
                        }`}
                        disabled={isSaving}
                      />
                      <div className="flex justify-between items-center mt-1">
                        {validationErrors.address && (
                          <p className="text-sm text-red-600">{validationErrors.address}</p>
                        )}
                        <p className="text-sm text-gray-500 ml-auto">
                          {address.length}/500
                        </p>
                      </div>
                    </div>

                    {/* Note */}
                    <div>
                      <label className="block text-sm font-semibold text-[#333333] mb-2">
                        Ghi chú
                      </label>
                      <textarea
                        value={note}
                        onChange={(e) => {
                          setNote(e.target.value);
                          if (validationErrors.note) {
                            setValidationErrors((prev) => {
                              const newErrors = { ...prev };
                              delete newErrors.note;
                              return newErrors;
                            });
                          }
                        }}
                        placeholder="Ghi chú cá nhân (tùy chọn)"
                        rows={4}
                        maxLength={1000}
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF4F00] transition-all ${
                          validationErrors.note ? 'border-red-500' : 'border-gray-300'
                        }`}
                        disabled={isSaving}
                      />
                      <div className="flex justify-between items-center mt-1">
                        {validationErrors.note && (
                          <p className="text-sm text-red-600">{validationErrors.note}</p>
                        )}
                        <p className="text-sm text-gray-500 ml-auto">
                          {note.length}/1000
                        </p>
                      </div>
                    </div>

                    {/* Save Button */}
                    <button
                      type="submit"
                      disabled={isSaving}
                      className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold transition-colors ${
                        isSaving
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-[#FF4F00] text-white hover:bg-[#e64500]'
                      }`}
                    >
                      {isSaving ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          <span>Đang lưu...</span>
                        </>
                      ) : (
                        'Lưu thông tin'
                      )}
                    </button>
                  </form>
                </Card>
              </div>

              {/* Right: Account Info */}
              <div className="lg:col-span-1">
                <Card>
                  <h2 className="text-xl font-bold text-[#333333] mb-4">Thông tin tài khoản</h2>
                  <div className="space-y-3 text-sm">
                    <div>
                      <p className="text-gray-600 mb-1">Ngày tạo tài khoản</p>
                      <p className="font-semibold text-[#333333]">
                        {profile?.createdAt
                          ? new Date(profile.createdAt).toLocaleDateString('vi-VN', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })
                          : '-'}
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>

            {/* Change Password Section */}
            <div className="mt-6">
              <Card>
                <h2 className="text-xl font-bold text-[#333333] mb-4 flex items-center gap-2">
                  <LockClosedIcon className="w-5 h-5" />
                  Đổi mật khẩu
                </h2>

                <form onSubmit={handleChangePassword} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Current Password */}
                  <div>
                    <label className="block text-sm font-semibold text-[#333333] mb-2">
                      Mật khẩu hiện tại <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <LockClosedIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type={showCurrentPassword ? 'text' : 'password'}
                        value={currentPassword}
                        onChange={(e) => {
                          setCurrentPassword(e.target.value);
                          if (passwordValidationErrors.currentPassword) {
                            setPasswordValidationErrors((prev) => { const n = { ...prev }; delete n.currentPassword; return n; });
                          }
                        }}
                        placeholder="Mật khẩu hiện tại"
                        disabled={isChangingPassword}
                        className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF4F00] transition-all ${passwordValidationErrors.currentPassword ? 'border-red-500' : 'border-gray-300'}`}
                      />
                      <button type="button" onClick={() => setShowCurrentPassword(!showCurrentPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                        {showCurrentPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                      </button>
                    </div>
                    {passwordValidationErrors.currentPassword && <p className="text-sm text-red-600 mt-1">{passwordValidationErrors.currentPassword}</p>}
                  </div>

                  {/* New Password */}
                  <div>
                    <label className="block text-sm font-semibold text-[#333333] mb-2">
                      Mật khẩu mới <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <LockClosedIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        value={newPassword}
                        onChange={(e) => {
                          setNewPassword(e.target.value);
                          if (passwordValidationErrors.newPassword) {
                            setPasswordValidationErrors((prev) => { const n = { ...prev }; delete n.newPassword; return n; });
                          }
                        }}
                        placeholder="Tối thiểu 6 ký tự"
                        disabled={isChangingPassword}
                        className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF4F00] transition-all ${passwordValidationErrors.newPassword ? 'border-red-500' : 'border-gray-300'}`}
                      />
                      <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                        {showNewPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                      </button>
                    </div>
                    {passwordValidationErrors.newPassword && <p className="text-sm text-red-600 mt-1">{passwordValidationErrors.newPassword}</p>}
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-sm font-semibold text-[#333333] mb-2">
                      Xác nhận mật khẩu <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <LockClosedIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => {
                          setConfirmPassword(e.target.value);
                          if (passwordValidationErrors.confirmPassword) {
                            setPasswordValidationErrors((prev) => { const n = { ...prev }; delete n.confirmPassword; return n; });
                          }
                        }}
                        placeholder="Nhập lại mật khẩu mới"
                        disabled={isChangingPassword}
                        className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF4F00] transition-all ${passwordValidationErrors.confirmPassword ? 'border-red-500' : 'border-gray-300'}`}
                      />
                      <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                        {showConfirmPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                      </button>
                    </div>
                    {passwordValidationErrors.confirmPassword && <p className="text-sm text-red-600 mt-1">{passwordValidationErrors.confirmPassword}</p>}
                  </div>

                  {/* Submit — full width on mobile, auto on desktop */}
                  <div className="md:col-span-3 flex justify-end">
                    <button
                      type="submit"
                      disabled={isChangingPassword}
                      className={`flex items-center gap-2 px-8 py-3 rounded-lg font-semibold transition-colors ${
                        isChangingPassword ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-[#FF4F00] text-white hover:bg-[#e64500]'
                      }`}
                    >
                      {isChangingPassword ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                          <span>Đang cập nhật...</span>
                        </>
                      ) : (
                        'Đổi mật khẩu'
                      )}
                    </button>
                  </div>
                </form>
              </Card>
            </div>

            {/* My Reviews Section */}
            <div className="mt-8">
              <Card>
                <h2 className="text-xl font-bold text-[#333333] mb-6">Đánh giá của tôi</h2>

                {reviewsLoading && reviews.length === 0 ? (
                  <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF4F00]"></div>
                  </div>
                ) : reviewsError ? (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
                    <p className="font-semibold">Lỗi khi tải đánh giá</p>
                    <p className="text-sm mt-1">{reviewsError.message}</p>
                  </div>
                ) : reviews.length === 0 ? (
                  <div className="bg-gray-50 rounded-lg p-12 text-center border border-gray-200">
                    <p className="text-gray-500">Bạn chưa có đánh giá nào</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <ReviewCard
                        key={review.id}
                        review={review}
                        onEdit={handleEditReview}
                        onDelete={handleDeleteReview}
                      />
                    ))}

                    {/* Pagination */}
                    {pagination && pagination.totalPages > 1 && (
                      <div className="mt-6">
                        <Pagination
                          currentPage={pagination.page}
                          totalPages={pagination.totalPages}
                          onPageChange={handleReviewPageChange}
                        />
                      </div>
                    )}
                  </div>
                )}
              </Card>
            </div>
            </>
          )}

          {/* Edit Review Modal */}
          <EditReviewModal
            review={editingReview}
            isOpen={editingReview !== null}
            onClose={() => setEditingReview(null)}
            onSuccess={handleReviewUpdated}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
}

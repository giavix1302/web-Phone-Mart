/**
 * Contact Page - Liên hệ
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import {
  HomeIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  ClockIcon,
  ChatBubbleLeftRightIcon,
} from '@heroicons/react/24/outline';
import { ChevronRightIcon } from '@heroicons/react/24/solid';

const contactInfo = [
  {
    icon: MapPinIcon,
    title: 'Địa chỉ',
    lines: ['123 Đường Nguyễn Trãi, Phường Bến Thành', 'Quận 1, TP. Hồ Chí Minh'],
  },
  {
    icon: PhoneIcon,
    title: 'Điện thoại',
    lines: ['Hotline: 1900 1234', 'Di động: 0912 345 678'],
  },
  {
    icon: EnvelopeIcon,
    title: 'Email',
    lines: ['info@phonestore.vn', 'support@phonestore.vn'],
  },
  {
    icon: ClockIcon,
    title: 'Giờ làm việc',
    lines: ['Thứ 2 – Thứ 6: 8:00 – 21:00', 'Thứ 7 – Chủ nhật: 8:00 – 22:00'],
  },
];

const branches = [
  {
    name: 'Chi nhánh Quận 1 (HQ)',
    address: '123 Nguyễn Trãi, P. Bến Thành, Q.1, TP.HCM',
    phone: '028 1234 5678',
    hours: '8:00 – 22:00',
  },
  {
    name: 'Chi nhánh Quận 3',
    address: '456 Võ Văn Tần, P.5, Q.3, TP.HCM',
    phone: '028 2345 6789',
    hours: '8:00 – 21:30',
  },
  {
    name: 'Chi nhánh Bình Thạnh',
    address: '789 Đinh Bộ Lĩnh, P.26, Q. Bình Thạnh, TP.HCM',
    phone: '028 3456 7890',
    hours: '8:00 – 21:30',
  },
  {
    name: 'Chi nhánh Hà Nội',
    address: '12 Phố Huế, P. Hàng Bài, Q. Hoàn Kiếm, Hà Nội',
    phone: '024 1234 5678',
    hours: '8:00 – 21:00',
  },
];

type FormState = {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
};

export default function ContactPage() {
  const [form, setForm] = useState<FormState>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Giả lập gửi form
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1200);
  };

  const isFormValid = form.name.trim() && form.email.trim() && form.message.trim();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-[#F5F5F5]">
        {/* Hero */}
        <section className="bg-[#333333] text-white py-16">
          <div className="container mx-auto px-4">
            <nav className="mb-8 flex items-center gap-2 text-sm text-gray-400">
              <Link href="/" className="hover:text-[#FF4F00] transition-colors flex items-center gap-1">
                <HomeIcon className="w-4 h-4" />
                Trang chủ
              </Link>
              <ChevronRightIcon className="w-4 h-4" />
              <span className="text-white">Liên hệ</span>
            </nav>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Liên hệ <span className="text-[#FF4F00]">với chúng tôi</span>
            </h1>
            <p className="text-gray-300 text-lg max-w-2xl">
              Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn. Hãy để lại thông tin —
              đội ngũ của chúng tôi sẽ phản hồi trong thời gian sớm nhất.
            </p>
          </div>
        </section>

        <div className="container mx-auto px-4 py-12 space-y-12">
          {/* Contact Info Cards */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {contactInfo.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="bg-white rounded-2xl p-6 shadow-sm text-center">
                  <div className="w-12 h-12 bg-[#FF4F00]/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-6 h-6 text-[#FF4F00]" />
                  </div>
                  <h3 className="font-bold text-[#333333] mb-2">{item.title}</h3>
                  {item.lines.map((line, i) => (
                    <p key={i} className="text-gray-500 text-sm">{line}</p>
                  ))}
                </div>
              );
            })}
          </section>

          {/* Form + Map */}
          <section className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Contact Form */}
            <div className="lg:col-span-3 bg-white rounded-2xl p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <ChatBubbleLeftRightIcon className="w-7 h-7 text-[#FF4F00]" />
                <h2 className="text-2xl font-bold text-[#333333]">Gửi tin nhắn</h2>
              </div>

              {submitted ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-[#333333] mb-2">Gửi thành công!</h3>
                  <p className="text-gray-500 mb-6">
                    Cảm ơn bạn đã liên hệ. Chúng tôi sẽ phản hồi trong vòng 24 giờ làm việc.
                  </p>
                  <button
                    onClick={() => { setSubmitted(false); setForm({ name: '', email: '', phone: '', subject: '', message: '' }); }}
                    className="px-6 py-2 bg-[#FF4F00] text-white rounded-lg hover:bg-[#e64500] transition-colors font-semibold"
                  >
                    Gửi tin nhắn khác
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Họ và tên <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Nguyễn Văn A"
                        required
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF4F00] focus:border-transparent text-sm transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Số điện thoại
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="0912 345 678"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF4F00] focus:border-transparent text-sm transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="email@example.com"
                      required
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF4F00] focus:border-transparent text-sm transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Chủ đề
                    </label>
                    <select
                      name="subject"
                      value={form.subject}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF4F00] focus:border-transparent text-sm bg-white transition-all"
                    >
                      <option value="">-- Chọn chủ đề --</option>
                      <option value="product">Tư vấn sản phẩm</option>
                      <option value="order">Tra cứu đơn hàng</option>
                      <option value="warranty">Bảo hành / Sửa chữa</option>
                      <option value="return">Đổi trả hàng</option>
                      <option value="other">Khác</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Nội dung <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      rows={5}
                      required
                      placeholder="Nhập nội dung bạn cần hỗ trợ..."
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF4F00] focus:border-transparent text-sm resize-none transition-all"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={!isFormValid || loading}
                    className="w-full py-3 bg-[#FF4F00] text-white rounded-lg font-bold hover:bg-[#e64500] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                        Đang gửi...
                      </>
                    ) : (
                      'Gửi tin nhắn'
                    )}
                  </button>
                </form>
              )}
            </div>

            {/* Map + Branches */}
            <div className="lg:col-span-2 space-y-6">
              {/* Fake map placeholder */}
              <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
                <div className="bg-gray-200 h-52 flex items-center justify-center relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300" />
                  <div className="relative text-center">
                    <MapPinIcon className="w-10 h-10 text-[#FF4F00] mx-auto mb-2" />
                    <p className="text-gray-600 font-medium text-sm">123 Nguyễn Trãi, Quận 1</p>
                    <p className="text-gray-400 text-xs">TP. Hồ Chí Minh</p>
                  </div>
                </div>
                <div className="p-4">
                  <a
                    href="https://maps.google.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-center text-sm text-[#FF4F00] font-semibold hover:underline"
                  >
                    Xem trên Google Maps →
                  </a>
                </div>
              </div>

              {/* Branches */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h3 className="font-bold text-[#333333] mb-4">Hệ thống chi nhánh</h3>
                <div className="space-y-4">
                  {branches.map((branch) => (
                    <div key={branch.name} className="border-b border-gray-100 last:border-0 pb-4 last:pb-0">
                      <p className="font-semibold text-[#333333] text-sm mb-1">{branch.name}</p>
                      <p className="text-gray-500 text-xs flex items-start gap-1 mb-0.5">
                        <MapPinIcon className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-[#FF4F00]" />
                        {branch.address}
                      </p>
                      <p className="text-gray-500 text-xs flex items-center gap-1 mb-0.5">
                        <PhoneIcon className="w-3.5 h-3.5 flex-shrink-0 text-[#FF4F00]" />
                        {branch.phone}
                      </p>
                      <p className="text-gray-500 text-xs flex items-center gap-1">
                        <ClockIcon className="w-3.5 h-3.5 flex-shrink-0 text-[#FF4F00]" />
                        {branch.hours}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* FAQ Quick */}
          <section className="bg-white rounded-2xl p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-[#333333] mb-6">Câu hỏi thường gặp</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { q: 'Tôi có thể mua hàng online và nhận tại cửa hàng không?', a: 'Có. Bạn có thể đặt hàng online và chọn hình thức nhận tại bất kỳ chi nhánh nào của chúng tôi.' },
                { q: 'Chính sách bảo hành sản phẩm như thế nào?', a: 'Tất cả sản phẩm được bảo hành chính hãng từ 12 đến 24 tháng tùy theo nhà sản xuất.' },
                { q: 'Tôi có thể đổi trả hàng trong bao lâu?', a: 'Chúng tôi hỗ trợ đổi trả trong vòng 30 ngày nếu sản phẩm có lỗi từ nhà sản xuất, còn nguyên tem hộp.' },
                { q: 'Phone Store có giao hàng toàn quốc không?', a: 'Có. Chúng tôi giao hàng toàn quốc qua các đơn vị vận chuyển uy tín, thường trong 24–48 giờ.' },
              ].map((faq) => (
                <div key={faq.q} className="bg-[#F5F5F5] rounded-xl p-5">
                  <p className="font-semibold text-[#333333] text-sm mb-2">{faq.q}</p>
                  <p className="text-gray-500 text-sm leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}

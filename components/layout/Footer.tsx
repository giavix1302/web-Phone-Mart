/**
 * Footer Component
 * Footer với thông tin cửa hàng, liên kết, chính sách và mạng xã hội
 */

'use client';

import Link from 'next/link';
import {
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
} from '@heroicons/react/24/outline';

// Note: Heroicons không có Facebook, Zalo, Instagram icons
// Có thể sử dụng SVG custom hoặc thư viện khác cho social icons
// Tạm thời giữ emoji hoặc có thể thay bằng SVG paths

const footerLinks = {
  store: {
    title: 'Thông tin cửa hàng',
    links: [
      { label: 'Địa chỉ: 123 Đường ABC, Quận XYZ, TP.HCM', href: '#', icon: MapPinIcon },
      { label: 'Hotline: 1900 1234', href: 'tel:19001234', icon: PhoneIcon },
      { label: 'Email: info@phonestore.com', href: 'mailto:info@phonestore.com', icon: EnvelopeIcon },
    ],
  },
  quickLinks: {
    title: 'Liên kết nhanh',
    links: [
      { label: 'Trang chủ', href: '/' },
      { label: 'Sản phẩm', href: '/products' },
      { label: 'Giới thiệu', href: '/about' },
      { label: 'Liên hệ', href: '/contact' },
    ],
  },
  policies: {
    title: 'Chính sách',
    links: [
      { label: 'Chính sách bảo hành', href: '/warranty' },
      { label: 'Chính sách đổi trả', href: '/return' },
      { label: 'Chính sách vận chuyển', href: '/shipping' },
      { label: 'Chính sách bảo mật', href: '/privacy' },
    ],
  },
};

const socialLinks = [
  { name: 'Facebook', icon: '📘', href: '#' },
  { name: 'Zalo', icon: '💬', href: '#' },
  { name: 'Instagram', icon: '📷', href: '#' },
];

export default function Footer() {
  return (
    <footer className="bg-[#333333] text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Store Info */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-[#FF4F00]">Phone Store</h3>
            <p className="text-gray-300 mb-4">
              Cửa hàng điện thoại uy tín, chất lượng với giá cả hợp lý nhất thị trường.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="w-10 h-10 bg-white/10 hover:bg-[#FF4F00] rounded-full flex items-center justify-center transition-colors duration-200"
                  aria-label={social.name}
                >
                  <span className="text-xl">{social.icon}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Store Details */}
          <div>
            <h4 className="text-lg font-semibold mb-4">{footerLinks.store.title}</h4>
            <ul className="space-y-3">
              {footerLinks.store.links.map((link, index) => {
                const Icon = link.icon;
                return (
                  <li key={index} className="flex items-start space-x-2">
                    {Icon && <Icon className="w-5 h-5 text-[#FF4F00] mt-0.5 flex-shrink-0" />}
                    {link.href === '#' ? (
                      <span className="text-gray-300">{link.label}</span>
                    ) : (
                      <Link href={link.href} className="text-gray-300 hover:text-[#FF4F00] transition-colors">
                        {link.label}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">{footerLinks.quickLinks.title}</h4>
            <ul className="space-y-2">
              {footerLinks.quickLinks.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-gray-300 hover:text-[#FF4F00] transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Policies */}
          <div>
            <h4 className="text-lg font-semibold mb-4">{footerLinks.policies.title}</h4>
            <ul className="space-y-2">
              {footerLinks.policies.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-gray-300 hover:text-[#FF4F00] transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-600 pt-8 text-center">
          <p className="text-gray-300">
            © {new Date().getFullYear()} Phone Store. Tất cả quyền được bảo lưu.
          </p>
        </div>
      </div>
    </footer>
  );
}

/**
 * Brand Section Component
 * Hiển thị các thương hiệu điện thoại nổi bật
 */

'use client';

import Link from 'next/link';

const brands = [
  { id: 1, name: 'Apple', logo: '🍎', slug: 'apple' },
  { id: 2, name: 'Samsung', logo: '📱', slug: 'samsung' },
  { id: 3, name: 'Xiaomi', logo: '📲', slug: 'xiaomi' },
  { id: 4, name: 'Oppo', logo: '📞', slug: 'oppo' },
  { id: 5, name: 'Vivo', logo: '📟', slug: 'vivo' },
  { id: 6, name: 'Realme', logo: '📠', slug: 'realme' },
];

export default function BrandSection() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#333333] mb-4">
            Sản phẩm theo hãng
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Khám phá điện thoại từ các thương hiệu hàng đầu thế giới
          </p>
        </div>

        <div className="grid grid-cols-3 md:grid-cols-6 gap-6 md:gap-8">
          {brands.map((brand) => (
            <Link
              key={brand.id}
              href={`/products?brand=${brand.slug}`}
              className="group flex flex-col items-center justify-center p-6 bg-[#F5F5F5] rounded-2xl hover:bg-[#FF4F00] transition-all duration-300 transform hover:scale-110 hover:shadow-lg"
            >
              <div className="text-5xl md:text-6xl mb-3 group-hover:scale-110 transition-transform duration-300">
                {brand.logo}
              </div>
              <h3 className="text-sm md:text-base font-semibold text-[#333333] group-hover:text-white transition-colors duration-300 text-center">
                {brand.name}
              </h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

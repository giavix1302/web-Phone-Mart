/**
 * Category Section Component
 * Hiển thị các danh mục sản phẩm dạng grid card
 */

'use client';

import Link from 'next/link';
import { ArrowRightIcon } from '@heroicons/react/24/outline';

const categories = [
  {
    id: 1,
    name: 'Điện thoại cao cấp',
    description: 'Flagship với công nghệ tiên tiến nhất',
    icon: '💎',
    image: '/images/category-premium.jpg',
    link: '/products?category=premium',
    color: 'from-purple-500 to-pink-500',
  },
  {
    id: 2,
    name: 'Điện thoại tầm trung',
    description: 'Cân bằng giữa hiệu năng và giá cả',
    icon: '⚡',
    image: '/images/category-midrange.jpg',
    link: '/products?category=midrange',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    id: 3,
    name: 'Điện thoại giá rẻ',
    description: 'Chất lượng tốt với mức giá hợp lý',
    icon: '💰',
    image: '/images/category-budget.jpg',
    link: '/products?category=budget',
    color: 'from-green-500 to-emerald-500',
  },
  {
    id: 4,
    name: 'Phụ kiện',
    description: 'Tai nghe, sạc, ốp lưng và nhiều hơn nữa',
    icon: '🎧',
    image: '/images/category-accessories.jpg',
    link: '/products?category=accessories',
    color: 'from-orange-500 to-red-500',
  },
];

export default function CategorySection() {
  return (
    <section className="py-16 bg-[#F5F5F5]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#333333] mb-4">
            Danh mục sản phẩm
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Tìm kiếm sản phẩm phù hợp với nhu cầu của bạn
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={category.link}
              className="group relative bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
            >
              {/* Image/Icon Background */}
              <div className={`h-48 bg-gradient-to-br ${category.color} flex items-center justify-center relative overflow-hidden`}>
                <div className="text-8xl opacity-30 group-hover:scale-110 transition-transform duration-300">
                  {category.icon}
                </div>
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="text-4xl mb-3">{category.icon}</div>
                <h3 className="text-xl font-bold text-[#333333] mb-2 group-hover:text-[#FF4F00] transition-colors">
                  {category.name}
                </h3>
                <p className="text-gray-600 text-sm">{category.description}</p>
                
                {/* Arrow */}
                <div className="mt-4 flex items-center text-[#FF4F00] font-semibold group-hover:translate-x-2 transition-transform duration-300">
                  <span className="text-sm">Xem thêm</span>
                  <ArrowRightIcon className="w-5 h-5 ml-2" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

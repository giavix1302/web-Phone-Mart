/**
 * About Page - Về chúng tôi
 */

import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import {
  HomeIcon,
  CheckBadgeIcon,
  TruckIcon,
  ShieldCheckIcon,
  StarIcon,
  UserGroupIcon,
  BuildingStorefrontIcon,
  PhoneIcon,
} from '@heroicons/react/24/outline';
import { ChevronRightIcon } from '@heroicons/react/24/solid';

const stats = [
  { value: '10+', label: 'Năm kinh nghiệm', icon: BuildingStorefrontIcon },
  { value: '50.000+', label: 'Khách hàng tin tưởng', icon: UserGroupIcon },
  { value: '200+', label: 'Dòng sản phẩm', icon: PhoneIcon },
  { value: '4.8/5', label: 'Đánh giá trung bình', icon: StarIcon },
];

const values = [
  {
    icon: CheckBadgeIcon,
    title: 'Chính hãng 100%',
    description:
      'Tất cả sản phẩm tại Phone Store đều được nhập khẩu chính thức từ nhà sản xuất, có đầy đủ tem nhập khẩu, hóa đơn và chứng từ hợp lệ.',
  },
  {
    icon: ShieldCheckIcon,
    title: 'Bảo hành uy tín',
    description:
      'Chúng tôi cung cấp dịch vụ bảo hành chính hãng lên đến 24 tháng, hỗ trợ đổi trả trong 30 ngày nếu sản phẩm có lỗi từ nhà sản xuất.',
  },
  {
    icon: TruckIcon,
    title: 'Giao hàng nhanh chóng',
    description:
      'Hệ thống giao hàng toàn quốc trong vòng 24–48 giờ. Giao hàng miễn phí cho đơn hàng từ 2 triệu đồng trở lên.',
  },
  {
    icon: UserGroupIcon,
    title: 'Hỗ trợ tận tâm',
    description:
      'Đội ngũ tư vấn viên chuyên nghiệp sẵn sàng hỗ trợ 24/7 qua hotline, chat trực tuyến và email để giải đáp mọi thắc mắc của bạn.',
  },
];

const team = [
  {
    name: 'Nguyễn Văn An',
    role: 'Giám đốc điều hành',
    description: '15 năm kinh nghiệm trong lĩnh vực phân phối thiết bị di động tại Việt Nam.',
    avatar: 'NA',
  },
  {
    name: 'Trần Thị Bình',
    role: 'Giám đốc kinh doanh',
    description: 'Chuyên gia với 10 năm xây dựng chiến lược phát triển thị trường bán lẻ công nghệ.',
    avatar: 'TB',
  },
  {
    name: 'Lê Quốc Cường',
    role: 'Trưởng phòng kỹ thuật',
    description: 'Kỹ sư điện tử viễn thông, 8 năm kinh nghiệm trong bảo hành và sửa chữa thiết bị.',
    avatar: 'LC',
  },
  {
    name: 'Phạm Minh Dương',
    role: 'Trưởng phòng chăm sóc KH',
    description: 'Chuyên gia dịch vụ khách hàng với triết lý "khách hàng luôn là trung tâm".',
    avatar: 'PD',
  },
];

const milestones = [
  { year: '2014', event: 'Thành lập Phone Store với cửa hàng đầu tiên tại Quận 1, TP.HCM' },
  { year: '2016', event: 'Mở rộng lên 5 chi nhánh tại các quận trung tâm TP.HCM' },
  { year: '2018', event: 'Ra mắt website bán hàng online, phục vụ khách hàng toàn quốc' },
  { year: '2020', event: 'Vượt mốc 20.000 khách hàng thân thiết, nhận giải thưởng "Doanh nghiệp uy tín 2020"' },
  { year: '2022', event: 'Mở rộng hệ thống lên 15 chi nhánh toàn quốc, ký kết đối tác phân phối chính thức với Samsung và Apple' },
  { year: '2024', event: 'Nâng cấp hệ thống thương mại điện tử, phục vụ hơn 50.000 khách hàng' },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-[#F5F5F5]">
        {/* Hero Section */}
        <section className="bg-[#333333] text-white py-20">
          <div className="container mx-auto px-4">
            {/* Breadcrumb */}
            <nav className="mb-8 flex items-center gap-2 text-sm text-gray-400">
              <Link href="/" className="hover:text-[#FF4F00] transition-colors flex items-center gap-1">
                <HomeIcon className="w-4 h-4" />
                Trang chủ
              </Link>
              <ChevronRightIcon className="w-4 h-4" />
              <span className="text-white">Về chúng tôi</span>
            </nav>

            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Về <span className="text-[#FF4F00]">Phone Store</span>
              </h1>
              <p className="text-xl text-gray-300 leading-relaxed">
                Hơn 10 năm đồng hành cùng người Việt trong hành trình trải nghiệm công nghệ —
                Phone Store tự hào là đơn vị phân phối điện thoại chính hãng uy tín hàng đầu tại Việt Nam.
              </p>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-12 space-y-16">
          {/* Stats */}
          <section>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <div key={stat.label} className="bg-white rounded-2xl p-6 text-center shadow-sm">
                    <Icon className="w-10 h-10 text-[#FF4F00] mx-auto mb-3" />
                    <div className="text-3xl font-bold text-[#333333] mb-1">{stat.value}</div>
                    <div className="text-gray-500 text-sm">{stat.label}</div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Story */}
          <section className="bg-white rounded-2xl p-8 md:p-12 shadow-sm">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold text-[#333333] mb-6">
                Câu chuyện của chúng tôi
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  Phone Store được thành lập năm 2014 bởi nhóm những người trẻ đam mê công nghệ
                  với sứ mệnh mang đến cho người Việt những sản phẩm điện thoại chính hãng,
                  chất lượng cao với giá cả minh bạch và dịch vụ hậu mãi tốt nhất.
                </p>
                <p>
                  Xuất phát điểm chỉ là một cửa hàng nhỏ tại Quận 1, TP.HCM, chúng tôi đã không
                  ngừng nỗ lực và phát triển để trở thành hệ thống bán lẻ điện thoại với hơn 15 chi nhánh
                  trên toàn quốc. Triết lý kinh doanh của chúng tôi rất đơn giản: <em>khách hàng hài lòng
                  là thành công của chúng tôi.</em>
                </p>
                <p>
                  Với đội ngũ hơn 200 nhân viên được đào tạo bài bản, am hiểu sản phẩm và tận tâm
                  phục vụ, Phone Store cam kết mang lại trải nghiệm mua sắm thoải mái, nhanh chóng
                  và đáng tin cậy cho mọi khách hàng.
                </p>
              </div>
            </div>
          </section>

          {/* Core Values */}
          <section>
            <h2 className="text-3xl font-bold text-[#333333] mb-8 text-center">
              Giá trị cốt lõi
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {values.map((value) => {
                const Icon = value.icon;
                return (
                  <div key={value.title} className="bg-white rounded-2xl p-6 shadow-sm flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-[#FF4F00]/10 rounded-xl flex items-center justify-center">
                      <Icon className="w-6 h-6 text-[#FF4F00]" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-[#333333] mb-2">{value.title}</h3>
                      <p className="text-gray-600 text-sm leading-relaxed">{value.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Timeline */}
          <section className="bg-white rounded-2xl p-8 md:p-12 shadow-sm">
            <h2 className="text-3xl font-bold text-[#333333] mb-10 text-center">
              Hành trình phát triển
            </h2>
            <div className="relative">
              <div className="absolute left-[72px] top-0 bottom-0 w-0.5 bg-gray-200 hidden md:block" />
              <div className="space-y-8">
                {milestones.map((item) => (
                  <div key={item.year} className="flex gap-6 items-start">
                    <div className="flex-shrink-0 w-[72px] text-right">
                      <span className="inline-block bg-[#FF4F00] text-white text-sm font-bold px-3 py-1 rounded-full">
                        {item.year}
                      </span>
                    </div>
                    <div className="flex-shrink-0 hidden md:flex w-4 h-4 mt-1 bg-white border-2 border-[#FF4F00] rounded-full relative z-10" />
                    <p className="text-gray-600 leading-relaxed pt-0.5">{item.event}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Team */}
          <section>
            <h2 className="text-3xl font-bold text-[#333333] mb-8 text-center">
              Đội ngũ lãnh đạo
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {team.map((member) => (
                <div key={member.name} className="bg-white rounded-2xl p-6 text-center shadow-sm">
                  <div className="w-20 h-20 bg-[#FF4F00] rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white text-xl font-bold">{member.avatar}</span>
                  </div>
                  <h3 className="font-bold text-[#333333] mb-1">{member.name}</h3>
                  <p className="text-[#FF4F00] text-sm font-medium mb-3">{member.role}</p>
                  <p className="text-gray-500 text-sm leading-relaxed">{member.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* CTA */}
          <section className="bg-[#FF4F00] rounded-2xl p-10 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">Bắt đầu mua sắm ngay hôm nay</h2>
            <p className="text-white/80 mb-8 max-w-xl mx-auto">
              Khám phá hàng trăm mẫu điện thoại chính hãng với giá tốt nhất thị trường.
              Giao hàng toàn quốc — bảo hành tận tâm.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/products"
                className="px-8 py-3 bg-white text-[#FF4F00] rounded-xl font-bold hover:bg-gray-100 transition-colors"
              >
                Xem sản phẩm
              </Link>
              <Link
                href="/contact"
                className="px-8 py-3 border-2 border-white text-white rounded-xl font-bold hover:bg-white/10 transition-colors"
              >
                Liên hệ chúng tôi
              </Link>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}

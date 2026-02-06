import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/home/HeroSection';
import BrandSection from '@/components/home/BrandSection';
import CategorySection from '@/components/home/CategorySection';
import ReviewSection from '@/components/home/ReviewSection';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <HeroSection />
        <BrandSection />
        <CategorySection />
        <ReviewSection />
      </main>
      <Footer />
    </div>
  );
}


import { MainLayout } from "@/components/layout/main-layout";
import { HeroSection } from "@/components/home/hero-section";
import { CategoriesSection } from "@/components/home/categories-section";
import { FeaturedProducts } from "@/components/home/featured-products";
import { CollectionsBanner } from "@/components/home/collections-banner";
import { NewArrivals } from "@/components/home/new-arrivals";
import { WhyChooseUs } from "@/components/home/why-choose-us";
import { Newsletter } from "@/components/home/newsletter";

export default function Index() {
  return (
    <MainLayout>
      <HeroSection />
      <CategoriesSection />
      <FeaturedProducts />
      <CollectionsBanner />
      <NewArrivals />
      <WhyChooseUs />
      <Newsletter />
    </MainLayout>
  );
}

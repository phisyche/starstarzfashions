
import { MainLayout } from "@/components/layout/main-layout";
import { JumbotronSlider } from "@/components/home/jumbotron-slider";
import { CategoryButtons } from "@/components/home/category-buttons";
import { CategoriesSection } from "@/components/home/categories-section";
import { LatestProducts } from "@/components/home/latest-products";
import { FeaturedProducts } from "@/components/home/featured-products";
import { BestSellers } from "@/components/home/best-sellers";
import { CollectionsBanner } from "@/components/home/collections-banner";
import { WhyChooseUs } from "@/components/home/why-choose-us";
import { Newsletter } from "@/components/home/newsletter";

export default function Index() {
  return (
    <MainLayout>
      <JumbotronSlider />
      <CategoryButtons />
      <LatestProducts />
      <CategoriesSection />
      <FeaturedProducts />
      <BestSellers />
      <CollectionsBanner />
      <WhyChooseUs />
      <Newsletter />
    </MainLayout>
  );
}

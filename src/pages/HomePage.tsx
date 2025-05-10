
import React from 'react';
import { MainLayout } from '@/components/layout/main-layout';
import { HeroSection } from '@/components/home/hero-section';
import { FeaturedProducts } from '@/components/home/featured-products';
import { CategoriesSection } from '@/components/home/categories-section';
import { WhyChooseUs } from '@/components/home/why-choose-us';
import { NewArrivals } from '@/components/home/new-arrivals';
import { Newsletter } from '@/components/home/newsletter';

export default function HomePage() {
  return (
    <MainLayout>
      <HeroSection />
      <FeaturedProducts />
      <CategoriesSection />
      <NewArrivals />
      <WhyChooseUs />
      <Newsletter />
    </MainLayout>
  );
}

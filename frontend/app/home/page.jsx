import React from 'react'
import HeroSection from './components/HomeHeroSection'
import CategoriesSection from './components/HomeCategorySection'
import FeaturedProducts from './components/HomeFeaturedProducts'
import TopStores from './components/HomeTopStores'
import CallToActionSection from './components/HomeCTASection'
import TestimonialsSection from './components/HomeTestimonials'

function page() {
  return (
    <div className="w-full bg-white">
      <HeroSection />
      <CategoriesSection />
      <FeaturedProducts />
      <TopStores />
      <TestimonialsSection />
      <CallToActionSection />
    </div>
  )
}

export default page
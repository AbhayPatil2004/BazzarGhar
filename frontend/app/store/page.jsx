import React from 'react'
// import SearchBar from './components/HomeSearchBar'
import HeroSection from './components/HomeHeroSection'
import CategoriesSection from './components/HomeCategorySection'
import TopSellersPage from './components/Top-Seller'

function page() {
  return (
    
    <div>
      {/* <SearchBar></SearchBar> */}
      {/* <StoreFilters></StoreFilters> */}
      <HeroSection></HeroSection>
      <CategoriesSection></CategoriesSection>
      <TopSellersPage></TopSellersPage>
    </div>
  )
}

export default page
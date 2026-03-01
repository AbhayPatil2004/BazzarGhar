import React from 'react'
// import SearchBar from './components/HomeSearchBar'
import HeroSection from './components/HomeHeroSection'
import CategoriesSection from './components/HomeCategorySection'
import TopSellersPage from './components/Top-Seller'
import NewlyOpenedStores from './components/Newly-Opned'
import StoresOfMyCity from './components/My-City'
import FeaturedStores from './components/featured'

function page() {
  return (
    
    <div>
      {/* <SearchBar></SearchBar> */}
      {/* <StoreFilters></StoreFilters> */}
      <HeroSection></HeroSection>
      <CategoriesSection></CategoriesSection>
      <TopSellersPage></TopSellersPage>
      <FeaturedStores></FeaturedStores>
      <NewlyOpenedStores></NewlyOpenedStores>
      <StoresOfMyCity></StoresOfMyCity>

    </div>
  )
}

export default page
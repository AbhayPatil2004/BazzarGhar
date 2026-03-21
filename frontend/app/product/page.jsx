import React from 'react'
import ProductHeroWithSearchOnly from './components/Header'
import CategorySection from './components/category'

function page() {
  return (
    <div>
      <ProductHeroWithSearchOnly></ProductHeroWithSearchOnly>
      <CategorySection></CategorySection>
    </div>
  )
}

export default page
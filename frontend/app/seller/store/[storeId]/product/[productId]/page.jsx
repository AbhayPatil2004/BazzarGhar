import React from 'react'

import ProductDashboardHeader from './components/ProductHeader'
import ProductDetailsPage from './components/ProductDetails'

function page() {
  return (
    <div>
        <ProductDashboardHeader></ProductDashboardHeader>
        <ProductDetailsPage></ProductDetailsPage>
    </div>
  )
}

export default page
import React from 'react'
import StoreDetailsPage from './components/StoreDetail'

async function page({ params }) {
    const resolvedParams = await params;
    const id = resolvedParams.id;

    return (

    <StoreDetailsPage id = { id } />
  )
}

export default page
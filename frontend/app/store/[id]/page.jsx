import React from 'react'
import StoreDetailsPage from './components/StoreDetail'
import OwnerStores from './components/OwnerStores';

async function page({ params }) {
    const resolvedParams = await params;
    const id = resolvedParams.id;

    return (

    <div>
      <StoreDetailsPage id = { id } />
      <OwnerStores></OwnerStores>
      <div>
        Hello World
      </div>
    </div>
  )
}

export default page
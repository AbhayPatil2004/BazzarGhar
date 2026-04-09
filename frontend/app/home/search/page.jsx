"use client"

import React, { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'

function SearchContent() {
    const searchParms = useSearchParams()
    const query = searchParms.get("search")
    console.log(query)
    return <div>Search Page {query}</div>
}

function page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchContent />
    </Suspense>
  )
}

export default page
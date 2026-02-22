"use client"

import React from 'react'
import { useSearchParams } from 'next/navigation'


function page() {

    const searchParms = useSearchParams()

    const query = searchParms.get("search")

    console.log(query)

  return (
    <div>Search Page {query}</div>
  )
}

export default page
"use client";

import SearchWithHistory from "./Search";
import { useAuth } from "../../context/Authcontext";
// import { useAuth } from "@/context/Authcontext";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export default function StoreSearch() {
  const { user, token } = useAuth();

  return (
    // StoreSearch.jsx
    // StoreSearch.jsx
<SearchWithHistory
  user={user}
  token={token}
  apiBase={API_BASE}
  placeholder="Search local stores..."
  redirectPath="/store/stores"
  fetchEndpoint="/store/searchhistory"
  saveEndpoint="/store/savesearchhistory"
  queryParam="search"
  historyKey="storeSearches"
/>
  );
}
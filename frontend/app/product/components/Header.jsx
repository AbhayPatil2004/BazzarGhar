"use client";

import SearchWithHistory from "../../store/components/Search";
import { useAuth } from "../../context/Authcontext";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export default function ProductSearch() {
    const { user, token } = useAuth();

    return (
        // ProductSearch.jsx
        // ProductSearch.jsx
        <SearchWithHistory
            user={user}
            token={token}
            apiBase={API_BASE}
            placeholder="Search products..."
            redirectPath="/product/products"
            fetchEndpoint="/product/searchhistory"
            saveEndpoint="/product/savesearchhistory"
            queryParam="search"
            historyKey="productSearches"
        />
    );
}
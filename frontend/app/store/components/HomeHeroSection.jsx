"use client";

import { useAuth } from "../../context/Authcontext";
import SearchWithHistory from "./Search";

export default function StoresHeroWithSearchOnly() {
  const { user, token } = useAuth();

  const API_BASE = process.env.NEXT_PUBLIC_API_URL;

  return (
    <section className="w-full bg-gradient-to-br from-blue-50 to-white py-6">
      <div className="max-w-7xl mx-auto px-4 md:px-8">

        <SearchWithHistory
          user={user}
          token={token}
          apiBase={API_BASE}
          placeholder="Search stores..."
          redirectPath="/store/stores"
          fetchEndpoint="/store/searchhistory"
          saveEndpoint="/store/savesearchhistory"
          queryParam="search"
        />

      </div>
    </section>
  );
}
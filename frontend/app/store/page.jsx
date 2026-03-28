import React from 'react'
import HeroSection from './components/HomeHeroSection'
import CategoriesSection from './components/HomeCategorySection'
import TopSellersPage from './components/Top-Seller'
import NewlyOpenedStores from './components/Newly-Opned'
import StoresOfMyCity from './components/My-City'
import FeaturedStores from './components/featured'
import StoresPage from './components/AllStores'

function page() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] font-sans overflow-x-hidden">

      {/* ── HERO ── Full-bleed */}
      <section className="w-full">
        <HeroSection />
      </section>

      {/* ── TOP SELLERS ── Dark charcoal with gold accents */}
      <section className="w-full bg-[#111111] py-16 sm:py-20 px-4 sm:px-8 lg:px-14 relative overflow-hidden">
        {/* Radial glow */}
        <div className="absolute top-0 left-0 w-80 h-80 bg-yellow-500 opacity-[0.04] rounded-full blur-3xl pointer-events-none" />
        {/* Top border accent */}
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-yellow-500/40 to-transparent" />

        <div className="w-full">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <span className="text-yellow-400 text-[10px] font-bold uppercase tracking-[0.25em] block mb-2">
                ★ Rankings
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-none tracking-tight">
                Top Sellers
              </h2>
            </div>
            <button className="self-start sm:self-auto group flex items-center gap-2 text-sm text-yellow-400 font-semibold border border-yellow-400/30 hover:border-yellow-400 px-4 py-2 rounded-full transition-all duration-300 hover:bg-yellow-400/10">
              View all
              <span className="group-hover:translate-x-1 transition-transform duration-200">→</span>
            </button>
          </div>
          <TopSellersPage />
        </div>

        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </section>

      {/* ── FEATURED STORES ── Rich cream with terracotta warmth */}
      <section className="w-full bg-[#faf7f2] py-16 sm:py-20 px-4 sm:px-8 lg:px-14 relative overflow-hidden">
        {/* Decorative concentric rings */}
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full border border-orange-200/60 pointer-events-none" />
        <div className="absolute -top-20 -right-20 w-[350px] h-[350px] rounded-full border border-orange-200/40 pointer-events-none" />
        <div className="absolute top-1/2 right-0 -translate-y-1/2 w-96 h-96 bg-orange-300 opacity-10 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full relative">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-[2px] bg-orange-500" />
                <span className="text-orange-500 text-[10px] font-bold uppercase tracking-[0.25em]">
                  Curated for you
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#1a1208] leading-none tracking-tight">
                Featured
                <span className="block text-orange-500 italic font-light">Stores</span>
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <span className="hidden sm:inline-block text-xs font-semibold uppercase tracking-widest text-orange-600 bg-orange-100 border border-orange-200 px-3 py-1.5 rounded-full">
                ✦ Handpicked
              </span>
              <button className="group flex items-center gap-2 text-sm text-[#1a1208] font-semibold border border-[#1a1208]/20 hover:border-orange-500 hover:text-orange-500 px-4 py-2 rounded-full transition-all duration-300">
                View all
                <span className="group-hover:translate-x-1 transition-transform duration-200">→</span>
              </button>
            </div>
          </div>
          <FeaturedStores />
        </div>
      </section>

      {/* ── NEWLY OPENED ── Stark white with bold emerald accents */}
      <section className="w-full bg-white py-16 sm:py-20 px-4 sm:px-8 lg:px-14 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1 h-full bg-gradient-to-b from-emerald-400/0 via-emerald-400/30 to-emerald-400/0 pointer-events-none" />
        <div className="absolute top-0 left-0 w-full h-px bg-gray-100 pointer-events-none" />

        <div className="w-full">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div className="flex items-start gap-5">
              <div className="hidden lg:block w-0.5 h-16 bg-emerald-400 mt-1 shrink-0" />
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="relative flex h-2.5 w-2.5 shrink-0">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                  </span>
                  <span className="text-emerald-600 text-[10px] font-bold uppercase tracking-[0.25em]">
                    Just arrived
                  </span>
                </div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0d1a0f] leading-none tracking-tight">
                  Newly
                  <span className="ml-3 text-emerald-500">Opened</span>
                </h2>
              </div>
            </div>
            <button className="self-start sm:self-auto group flex items-center gap-2 text-sm text-emerald-700 font-semibold border border-emerald-200 hover:border-emerald-500 hover:bg-emerald-50 px-4 py-2 rounded-full transition-all duration-300">
              View all
              <span className="group-hover:translate-x-1 transition-transform duration-200">→</span>
            </button>
          </div>
          <NewlyOpenedStores />
        </div>
      </section>

      {/* ── STORES OF MY CITY ── Deep navy with city-grid texture */}
      <section className="w-full bg-[#05081a] text-white py-16 sm:py-20 px-4 sm:px-8 lg:px-14 relative overflow-hidden">
        {/* Dot grid */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(99,102,241,0.15) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-600 opacity-[0.07] rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 right-0 w-72 h-72 bg-violet-500 opacity-[0.08] rounded-full blur-2xl pointer-events-none" />
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-indigo-400/40 to-transparent" />

        <div className="w-full relative">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">📍</span>
                <span className="text-indigo-400 text-[10px] font-bold uppercase tracking-[0.25em]">
                  Local picks
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-none tracking-tight">
                Stores in
                <span className="block bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
                  Your City
                </span>
              </h2>
            </div>
            <button className="self-start sm:self-auto group flex items-center gap-2 text-sm text-indigo-300 font-semibold border border-indigo-400/30 hover:border-indigo-400 hover:bg-indigo-400/10 px-4 py-2 rounded-full transition-all duration-300">
              View all
              <span className="group-hover:translate-x-1 transition-transform duration-200">→</span>
            </button>
          </div>
          <StoresOfMyCity />
        </div>

        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-indigo-400/20 to-transparent" />
      </section>

      {/* ── ALL STORES ── Stone/linen with modern browse feel */}
      <section className="w-full bg-[#f5f4f0] py-16 sm:py-20 px-4 sm:px-8 lg:px-14 relative overflow-hidden">
        <div className="absolute top-0 left-4 sm:left-8 lg:left-14 right-4 sm:right-8 lg:right-14 h-px bg-gray-300/60 pointer-events-none" />

        <div className="w-full">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400 block mb-3">
                — Explore everything
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#111] leading-none tracking-tight">
                All Stores
              </h2>
            </div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <button className="text-xs font-semibold uppercase tracking-wider text-gray-600 bg-white border border-gray-200 hover:border-gray-400 px-4 py-2 rounded-full transition-all duration-200 shadow-sm hover:shadow">
                ⊞ Filter
              </button>
              <button className="text-xs font-semibold uppercase tracking-wider text-gray-600 bg-white border border-gray-200 hover:border-gray-400 px-4 py-2 rounded-full transition-all duration-200 shadow-sm hover:shadow">
                ↕ Sort
              </button>
              <span className="hidden sm:inline text-gray-300">|</span>
              <span className="text-sm text-gray-400 hidden sm:inline">Browse the full catalogue</span>
            </div>
          </div>
          <StoresPage />
        </div>
      </section>

    </div>
  )
}

export default page

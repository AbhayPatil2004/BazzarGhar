export default function HeroSection() {
  return (
    <section className="w-full bg-gradient-to-br from-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-14 md:py-20">
        
        <div className="w-full text-center md:text-left space-y-4">
          
          {/* <h1 className="w-full text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-gray-900">
            Discover Amazing <span className="text-blue-600">Stores</span>
            <br className="hidden sm:block" />
            & Trending <span className="text-blue-600">Products</span>
          </h1> */}

          <h1 className="w-full text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold leading-tight text-gray-900">
  Discover Amazing <span className="text-blue-600">Stores</span> & 
  <span className="text-blue-600"> Products</span>
</h1>

          <p className="text-gray-600 text-base md:text-lg max-w-2xl">
            Explore trusted local stores and shop high-quality products all in one place.
          </p>

        </div>

      </div>
    </section>
  );
}
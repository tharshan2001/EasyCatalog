export default function AboutPage() {
  return (
    <div className="min-h-screen bg-stone-100 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-sm border border-stone-200 p-8">
          <h1 className="text-3xl font-bold text-stone-800 mb-4">About Us</h1>
          <p className="text-stone-600 mb-4">
            Welcome to EasyCatalog - your premier destination for home appliances.
          </p>
          <p className="text-stone-600 mb-4">
            We specialize in providing high-quality kitchen appliances, laundry equipment, 
            cleaning tools, climate control systems, and cooking essentials.
          </p>
          <p className="text-stone-600">
            Our mission is to make your shopping experience easy and convenient 
            with our carefully curated product catalog.
          </p>
        </div>
      </div>
    </div>
  );
}

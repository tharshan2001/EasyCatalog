export default function ContactPage() {
  return (
    <div className="min-h-screen bg-stone-100 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-sm border border-stone-200 p-8">
          <h1 className="text-3xl font-bold text-stone-800 mb-4">Contact Us</h1>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-stone-800 mb-1">Email</h3>
              <p className="text-stone-600">contact@easycatalog.com</p>
            </div>
            
            <div>
              <h3 className="font-medium text-stone-800 mb-1">Phone</h3>
              <p className="text-stone-600">+94 123 456 789</p>
            </div>
            
            <div>
              <h3 className="font-medium text-stone-800 mb-1">Address</h3>
              <p className="text-stone-600">
                123 Main Street,<br />
                Colombo 07,<br />
                Sri Lanka
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
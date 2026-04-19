export default function ContactPage() {
  return (
    <div className="section">
      <div className="container">
        <div className="card">
          <h1 className="title-lg mb-4">Contact Us</h1>
          
          <div style={{ display: 'grid', gap: '24px' }}>
            <div>
              <h3 className="title-md mb-1">Email</h3>
              <p className="body">contact@easycatalog.com</p>
            </div>
            
            <div>
              <h3 className="title-md mb-1">Phone</h3>
              <p className="body">+94 123 456 789</p>
            </div>
            
            <div>
              <h3 className="title-md mb-1">Address</h3>
              <p className="body">
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
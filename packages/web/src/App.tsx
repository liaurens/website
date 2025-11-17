import { useState, useEffect } from 'react';

function App() {
  const [apiMessage, setApiMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Test API connection
    fetch('/api/hello')
      .then((res) => res.json())
      .then((data) => {
        setApiMessage(data.message);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error connecting to API:', err);
        setApiMessage('Failed to connect to API');
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-primary text-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold">🎯 Coaching Platform</h1>
          <p className="text-blue-100 mt-2">Your streamlined booking and invoicing solution</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Welcome Card */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Welcome to Your Coaching Platform! 👋
            </h2>
            <p className="text-gray-600 mb-6">
              This is the beginning of your coaching management system. The project structure
              is set up and ready for development!
            </p>

            {/* API Status */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-700 mb-2">API Connection Status:</h3>
              {loading ? (
                <p className="text-gray-500">Connecting to API...</p>
              ) : (
                <div className="flex items-center gap-2">
                  <span className={`inline-block w-3 h-3 rounded-full ${apiMessage.includes('Failed') ? 'bg-danger' : 'bg-success'}`} />
                  <p className="text-gray-700">{apiMessage}</p>
                </div>
              )}
            </div>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-2 gap-6">
            <FeatureCard
              icon="📅"
              title="Client Booking"
              description="Easy-to-use booking interface for clients to schedule sessions"
              status="Coming Soon"
            />
            <FeatureCard
              icon="📱"
              title="iPhone Dashboard"
              description="Mobile-first coach dashboard for managing bookings on the go"
              status="Coming Soon"
            />
            <FeatureCard
              icon="📄"
              title="Invoice Generation"
              description="Automatic PDF invoice generation and email delivery"
              status="Coming Soon"
            />
            <FeatureCard
              icon="✉️"
              title="Email Notifications"
              description="Automated reminders and confirmations for clients and coaches"
              status="Coming Soon"
            />
          </div>

          {/* Next Steps */}
          <div className="mt-8 bg-blue-50 border-l-4 border-primary rounded-lg p-6">
            <h3 className="font-bold text-gray-800 mb-3">🚀 Next Steps:</h3>
            <ul className="space-y-2 text-gray-700">
              <li>✅ Project structure created</li>
              <li>✅ Frontend and backend connected</li>
              <li>⏳ Set up database (PostgreSQL)</li>
              <li>⏳ Build booking API endpoints</li>
              <li>⏳ Create booking calendar UI</li>
            </ul>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-300 mt-16">
        <div className="container mx-auto px-4 py-6 text-center">
          <p>Coaching Platform v0.1.0 - Built with React + TypeScript + Express</p>
        </div>
      </footer>
    </div>
  );
}

// Feature Card Component
interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
  status: string;
}

function FeatureCard({ icon, title, description, status }: FeatureCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="text-4xl mb-3">{icon}</div>
      <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600 mb-4">{description}</p>
      <span className="inline-block bg-warning text-white text-sm px-3 py-1 rounded-full">
        {status}
      </span>
    </div>
  );
}

export default App;

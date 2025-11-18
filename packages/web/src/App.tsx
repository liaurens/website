import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { BookingPage } from './pages/BookingPage';
import { Button } from './components/common/Button';

function HomePage() {
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
              Book your coaching session in just a few clicks. Select a date and time that works best for you.
            </p>

            {/* API Status */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
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

            <Link to="/book">
              <Button size="lg" fullWidth>
                Book a Session Now →
              </Button>
            </Link>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-2 gap-6">
            <FeatureCard
              icon="📅"
              title="Easy Booking"
              description="View available time slots and book your session instantly"
              status="Available Now"
              statusColor="success"
            />
            <FeatureCard
              icon="📱"
              title="Mobile Friendly"
              description="Book from any device - desktop, tablet, or phone"
              status="Available Now"
              statusColor="success"
            />
            <FeatureCard
              icon="✉️"
              title="Email Confirmations"
              description="Receive confirmation and reminder emails for your sessions"
              status="Coming Soon"
              statusColor="warning"
            />
            <FeatureCard
              icon="📄"
              title="Session History"
              description="View your past and upcoming coaching sessions"
              status="Coming Soon"
              statusColor="warning"
            />
          </div>

          {/* Info Section */}
          <div className="mt-8 bg-blue-50 border-l-4 border-primary rounded-lg p-6">
            <h3 className="font-bold text-gray-800 mb-3">How It Works:</h3>
            <ol className="space-y-2 text-gray-700">
              <li>1. Click "Book a Session Now" above</li>
              <li>2. Select your preferred date and time</li>
              <li>3. Enter your contact information</li>
              <li>4. Submit your booking request</li>
              <li>5. Receive confirmation email once approved</li>
            </ol>
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
  statusColor: 'success' | 'warning';
}

function FeatureCard({ icon, title, description, status, statusColor }: FeatureCardProps) {
  const statusColors = {
    success: 'bg-success',
    warning: 'bg-warning',
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="text-4xl mb-3">{icon}</div>
      <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600 mb-4">{description}</p>
      <span className={`inline-block ${statusColors[statusColor]} text-white text-sm px-3 py-1 rounded-full`}>
        {status}
      </span>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/book" element={<BookingPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

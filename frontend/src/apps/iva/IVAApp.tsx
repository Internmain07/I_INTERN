import React from 'react';
import ChatWidget from './components/ChatWidget';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Main Content - Demo Page */}
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4" style={{ fontFamily: 'Quicksand, sans-serif' }}>
            I-Intern Dashboard
          </h1>
          <p className="text-lg text-gray-600" style={{ fontFamily: 'Manrope, sans-serif' }}>
            Welcome to your internship journey. Need help? Check out our assistant in the bottom-right corner!
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-3" style={{ fontFamily: 'Quicksand, sans-serif' }}>
              My Applications
            </h3>
            <p className="text-gray-600" style={{ fontFamily: 'Manrope, sans-serif' }}>
              Track your internship applications and their current status.
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-3" style={{ fontFamily: 'Quicksand, sans-serif' }}>
              Resume Builder
            </h3>
            <p className="text-gray-600" style={{ fontFamily: 'Manrope, sans-serif' }}>
              Create and optimize your resume with our guided tools.
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-3" style={{ fontFamily: 'Quicksand, sans-serif' }}>
              Find Internships
            </h3>
            <p className="text-gray-600" style={{ fontFamily: 'Manrope, sans-serif' }}>
              Browse available internship opportunities that match your profile.
            </p>
          </div>
        </div>
      </div>
      
      {/* Chat Widget */}
      <ChatWidget />
    </div>
  );
}

export default App;



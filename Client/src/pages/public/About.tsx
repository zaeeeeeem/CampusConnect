import { Link } from 'react-router-dom';

export const About = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-indigo-700 pb-32">
        <nav className="bg-transparent">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <Link to="/" className="text-white font-bold text-xl">
                CampusConnect
              </Link>
              <div className="flex gap-4">
                <Link
                  to="/login"
                  className="text-white hover:text-indigo-200 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-white text-indigo-700 px-4 py-2 rounded-lg hover:bg-indigo-50 transition-colors"
                >
                  Sign up
                </Link>
              </div>
            </div>
          </div>
        </nav>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h1 className="text-4xl font-bold text-white">About CampusConnect</h1>
          <p className="mt-2 text-xl text-indigo-200">
            Connecting students, clubs, and events on campus
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 pb-16">
        <div className="bg-white shadow-xl rounded-2xl p-8 md:p-12">
          <div className="prose prose-lg max-w-none">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
            <p className="text-gray-600 mb-6">
              CampusConnect was created to bridge the gap between students, clubs, and campus events.
              We believe that every student deserves easy access to the vibrant campus life that
              universities have to offer.
            </p>

            <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-12">What We Offer</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">For Students</h3>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>Discover and register for campus events</li>
                  <li>Join clubs and societies</li>
                  <li>Earn certificates for participation</li>
                  <li>Stay updated with notifications</li>
                  <li>Provide feedback on events</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">For Club Admins</h3>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>Manage club information and members</li>
                  <li>Create and organize events</li>
                  <li>Generate certificates for participants</li>
                  <li>Send notifications to members</li>
                  <li>View feedback and analytics</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">For Faculty</h3>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>View all campus events</li>
                  <li>Explore clubs and societies</li>
                  <li>Support student activities</li>
                  <li>Stay informed about campus life</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">For Administrators</h3>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>Manage users and permissions</li>
                  <li>Oversee all clubs and events</li>
                  <li>Monitor platform activity</li>
                  <li>Send campus-wide announcements</li>
                  <li>Access comprehensive analytics</li>
                </ul>
              </div>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-12">Our Vision</h2>
            <p className="text-gray-600 mb-6">
              We envision a campus where every student is connected, engaged, and empowered to make
              the most of their university experience. Through technology, we're making it easier
              than ever to participate in campus life, build meaningful connections, and create
              lasting memories.
            </p>

            <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-12">Get Started</h2>
            <p className="text-gray-600 mb-6">
              Ready to join CampusConnect? Sign up today and start exploring all that your campus
              has to offer!
            </p>

            <div className="flex gap-4 mt-8">
              <Link
                to="/register"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Create Account
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center px-6 py-3 border border-indigo-600 text-base font-medium rounded-lg text-indigo-600 bg-white hover:bg-indigo-50"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-50">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 md:flex md:items-center md:justify-between lg:px-8">
          <div className="flex justify-center space-x-6 md:order-2">
            <Link to="/" className="text-gray-400 hover:text-gray-500">
              Home
            </Link>
          </div>
          <div className="mt-8 md:mt-0 md:order-1">
            <p className="text-center text-base text-gray-400">
              &copy; 2024 CampusConnect. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

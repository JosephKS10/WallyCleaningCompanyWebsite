import React from 'react';

const Footer = () => {

  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4">Wally Cleaning</h3>
            <p>Professional cleaning services for homes and businesses</p>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            {/* Add links here */}
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Contact Info</h3>
            {/* Add contact info here */}
          </div>
        </div>
        <div className="text-center mt-8 pt-4 border-t border-gray-700">
          <p>&copy; 2023 Wally Cleaning Company. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
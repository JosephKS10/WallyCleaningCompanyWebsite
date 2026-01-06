import React from 'react';
import { Link } from 'react-router-dom';
import NAP from '../NAP/NAP';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4">FBI Facility Solutions</h3>
            <p className="mb-4">
              Professional commercial cleaning services in Melbourne since 2002. 
              Family-owned and committed to excellence.
            </p>
            <NAP variant="footer" />
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">Our Services</h3>
            <ul className="space-y-2">
              <li><Link to="/#services" className="hover:text-red-500 transition">Commercial Cleaning</Link></li>
              <li><Link to="/#services" className="hover:text-red-500 transition">Industrial Cleaning</Link></li>
              <li><Link to="/#services" className="hover:text-red-500 transition">Aged Care Cleaning</Link></li>
              <li><Link to="/#services" className="hover:text-red-500 transition">Childcare Cleaning</Link></li>
              <li><Link to="/#services" className="hover:text-red-500 transition">Office Cleaning</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="hover:text-red-500 transition">Home</Link></li>
              <li><Link to="/our-team" className="hover:text-red-500 transition">Our Team</Link></li>
              <li><Link to="/apply" className="hover:text-red-500 transition">Careers</Link></li>
              <li><Link to="/#contact" className="hover:text-red-500 transition">Contact Us</Link></li>
              <li><a href="tel:1300424066" className="hover:text-red-500 transition">Get a Quote</a></li>
            </ul>
          </div>
        </div>
        
        <div className="text-center mt-8 pt-4 border-t border-gray-700">
          <p className="mb-2">
            &copy; {new Date().getFullYear()} FBI Facility Solutions. All rights reserved.
          </p>
          <p className="text-sm text-gray-400">
            Commercial Cleaning Melbourne | Office Cleaning Chadstone | Industrial Cleaning Services
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
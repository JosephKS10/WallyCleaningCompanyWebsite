import React from 'react';
import { Link } from 'react-router-dom';
import NAP from '../NAP/NAP';

const Footer = () => {
  return (
    <footer className="bg-[#1A2B3C] text-white py-8">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4">SuperPro Services</h3>
            <p className="mb-4 text-gray-300">
              Professional commercial cleaning services in Melbourne since 2002. 
              Family-owned and committed to excellence.
            </p>
            <NAP variant="footer" />
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">Our Services</h3>
            <ul className="space-y-2 text-gray-300">
              <li><Link to="/#services" className="hover:text-[#22A82A] transition duration-300">Commercial Cleaning</Link></li>
              <li><Link to="/#services" className="hover:text-[#22A82A] transition duration-300">Industrial Cleaning</Link></li>
              <li><Link to="/#services" className="hover:text-[#22A82A] transition duration-300">Aged Care Cleaning</Link></li>
              <li><Link to="/#services" className="hover:text-[#22A82A] transition duration-300">Childcare Cleaning</Link></li>
              <li><Link to="/#services" className="hover:text-[#22A82A] transition duration-300">Office Cleaning</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-300">
              <li><Link to="/" className="hover:text-[#22A82A] transition duration-300">Home</Link></li>
              <li><Link to="/our-team" className="hover:text-[#22A82A] transition duration-300">Our Team</Link></li>
              <li><Link to="/apply" className="hover:text-[#22A82A] transition duration-300">Careers</Link></li>
              <li><Link to="/#contact" className="hover:text-[#22A82A] transition duration-300">Contact Us</Link></li>
              <li><a href="tel:1300424066" className="hover:text-[#22A82A] transition duration-300">Get a Quote</a></li>
            </ul>
          </div>
        </div>
        
        <div className="text-center mt-8 pt-4 border-t border-gray-600">
          <p className="mb-2 text-gray-300">
            &copy; {new Date().getFullYear()} SuperPro Services. All rights reserved.
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
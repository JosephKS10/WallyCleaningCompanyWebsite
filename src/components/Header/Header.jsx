import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HiMenu, HiX } from 'react-icons/hi';
import './Header.css';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [quoteForm, setQuoteForm] = useState({
    name: '',
    phone: '',
    email: '',
    services: ''
  });
  const navigate = useNavigate();
  const scrollToServices = () => {
    const servicesSection = document.getElementById('services');
    servicesSection?.scrollIntoView({ behavior: 'smooth' });
    setIsMenuOpen(false);
  };

  const scrollToContact = () => {
    const contactSection = document.getElementById('contact');
    contactSection?.scrollIntoView({ behavior: 'smooth' });
    setIsMenuOpen(false);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setIsMenuOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setQuoteForm({
      ...quoteForm,
      [name]: value
    });
  };

  const handleQuoteSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    console.log('Quote form submitted:', quoteForm);
    alert('Thank you for your inquiry. We will get back to you soon with a quote!');
    setQuoteForm({
      name: '',
      phone: '',
      email: '',
      services: ''
    });
    setIsModalOpen(false);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <header className="header">
      <nav className="header-nav">
        <div className="header-container">
          <div className="header-logo">
            <Link to="/">
              <img src="/logo.png" alt="Wally Cleaning Logo" className="header-logo-img" onClick={scrollToTop}/>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="header-desktop-nav">
            <Link to="/" className="header-nav-link">
              <button onClick={scrollToTop} className="header-nav-btn">
                Home
              </button>
            </Link>
            <Link to="/#services" className="header-nav-link">
              <button onClick={scrollToServices} className="header-nav-btn">
                Our Solutions
              </button>
            </Link>
            <Link to="/apply" className="header-nav-link">
              Careers
            </Link>
            <Link 
              to="/our-team" 
              className="header-nav-link"
              onClick={() => setIsMenuOpen(false)}
            >
              Our Team
            </Link>
            <Link to="/#contact" className="header-nav-link">
              <button onClick={scrollToContact} className="header-nav-btn">
                Contact Us
              </button>
            </Link>
          </div>

          {/* Get a Quote Button (Desktop) */}
          <div className="header-quote-btn-container">
            <button className="header-cleaner-login-btn" onClick={() => navigate('/cleaner-login')}>
              Cleaner Login
            </button>
            <button className="header-quote-btn" onClick={openModal}>
              Get a Quote
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="header-mobile-btn">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <HiX size={34} /> : <HiMenu size={34} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="header-mobile-nav">
            <Link 
              to="/" 
              className="mobile-nav-link"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/#services" 
              onClick={() => {
                scrollToServices();
                setIsMenuOpen(false);
              }}
              className="mobile-nav-link"
            >
              Our Solutions
            </Link>
            <Link 
              to="/apply" 
              className="mobile-nav-link"
              onClick={() => setIsMenuOpen(false)}
            >
              Careers
            </Link>
            <Link 
              to="/our-team" 
              className="mobile-nav-link"
              onClick={() => setIsMenuOpen(false)}
            >
              Our Team
            </Link>
            <Link 
              to="/#contact" 
              className="mobile-nav-link"
              onClick={() => {
                scrollToContact();
                setIsMenuOpen(false);
              }}
            >
              Contact Us
            </Link>
             <button className="header-cleaner-login-btn" onClick={() => navigate('/cleaner-login')}>
              Cleaner Login
            </button>
            <button className="mobile-quote-btn" onClick={openModal}>
              Get a Quote
            </button>
          </div>
        )}
      </nav>

      {/* Quote Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>×</button>
            <h2 className="modal-title">Get a Quote</h2>
            <p className="modal-subtitle">Fill out the form and we'll get back to you with a quote</p>
            <form className="modal-form" onSubmit={handleQuoteSubmit}>
              <div className="form-group">
                <input
                  type="text"
                  name="name"
                  value={quoteForm.name}
                  onChange={handleInputChange}
                  placeholder="Your Name"
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="tel"
                  name="phone"
                  value={quoteForm.phone}
                  onChange={handleInputChange}
                  placeholder="Your Phone"
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="email"
                  name="email"
                  value={quoteForm.email}
                  onChange={handleInputChange}
                  placeholder="Your Email"
                  required
                />
              </div>
              <div className="form-group">
                <textarea
                  name="services"
                  value={quoteForm.services}
                  onChange={handleInputChange}
                  placeholder="Description of services needed"
                  rows="4"
                  required
                ></textarea>
              </div>
              <button type="submit" className="modal-submit-btn">Request Quote</button>
            </form>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
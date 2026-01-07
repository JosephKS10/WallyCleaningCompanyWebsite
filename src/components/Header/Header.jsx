import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HiMenu, HiX } from 'react-icons/hi';
import { sendQuoteEmail } from "../../utils/emailApi";
import './Header.css';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  const [isCleanerAuthenticated, setIsCleanerAuthenticated] = useState(false);
  const [quoteForm, setQuoteForm] = useState({
    name: '',
    phone: '',
    email: '',
    services: ''
  });
  const navigate = useNavigate();

  // Check if cleaner is authenticated on component mount and when storage changes
  useEffect(() => {
    const checkAuthStatus = () => {
      const token = localStorage.getItem('cleaner_token');
      const tokenExpiry = localStorage.getItem('cleaner_token_expiry');
      
      if (token && tokenExpiry) {
        // Check if token is expired
        if (new Date().getTime() > parseInt(tokenExpiry)) {
          // Token expired, clear storage
          localStorage.removeItem('cleaner_token');
          localStorage.removeItem('cleaner_data');
          localStorage.removeItem('cleaner_token_expiry');
          setIsCleanerAuthenticated(false);
        } else {
          setIsCleanerAuthenticated(true);
        }
      } else {
        setIsCleanerAuthenticated(false);
      }
    };

    // Initial check
    checkAuthStatus();

    // Listen for storage changes (for logout from other tabs)
    const handleStorageChange = (e) => {
      if (e.key === 'cleaner_token' || e.key === 'cleaner_token_expiry') {
        checkAuthStatus();
      }
    };

    // Listen for auth events from CleanerAuthContext
    const handleAuthChange = () => {
      checkAuthStatus();
    };

    // Add event listeners
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('cleaner-auth-change', handleAuthChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('cleaner-auth-change', handleAuthChange);
    };
  }, []);

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

  const handleQuoteSubmit = async(e) => {
    e.preventDefault();

    if (isSubmitting) return;

    setIsSubmitting(true);
    try { 
      await sendQuoteEmail(quoteForm);

      setShowThankYou(true);

      setQuoteForm({
        name: '',
        phone: '',
        email: '',
        services: ''
      });

      setIsModalOpen(false);
    } catch (error) {
      alert(error.message || "Failed to send quote request.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleCleanerButtonClick = () => {
    if (isCleanerAuthenticated) {
      navigate('/cleaner/dashboard');
    } else {
      navigate('/cleaner/login');
    }
    setIsMenuOpen(false);
  };

  return (
    <header className="header">
      <nav className="header-nav">
        <div className="header-container">
          <div className="header-logo">
            <Link to="/">
              <img src="/logo.png" alt="FBI Facility Solutions" className="header-logo-img" onClick={scrollToTop}/>
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
            <button 
              className="header-cleaner-login-btn" 
              onClick={handleCleanerButtonClick}
            >
              {isCleanerAuthenticated ? 'Dashboard' : 'Cleaner Login'}
            </button>
            {isCleanerAuthenticated || <button className="header-quote-btn" onClick={openModal}>
              Get a Quote
            </button>}
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
            <button 
              className="header-cleaner-login-btn" 
              onClick={handleCleanerButtonClick}
            >
              {isCleanerAuthenticated ? 'Dashboard' : 'Cleaner Login'}
            </button>
            {isCleanerAuthenticated || <button className="mobile-quote-btn" onClick={openModal}>
              Get a Quote
            </button>}
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
              <button type="submit" className="modal-submit-btn" disabled={isSubmitting}>{isSubmitting ? (
                <span className="btn-loader" aria-label="Sending"></span>
              ) : (
                "Request Quote"
              )}</button>
            </form>
          </div>
        </div>
      )}

      {showThankYou && (
        <div className="thank-you-overlay">
          <div className="thank-you-modal" role="dialog" aria-modal="true">
            <h2>Thank You! 🎉</h2>
            <p>
              Your quote request has been received.  
              Our team will contact you shortly.
            </p>
            <button onClick={() => setShowThankYou(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
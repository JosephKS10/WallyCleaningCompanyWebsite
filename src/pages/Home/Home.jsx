import { useState, useEffect } from 'react';
import { useLocation } from "react-router-dom";
import './Home.css';

const Home = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: '',
    phone: '',
    email: '',
    services: ''
  });
  const location = useLocation();
  
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  useEffect(() => {
    if (location.hash === "#services") {
      const section = document.getElementById("services");
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
    }
    if(location.hash === "#contact") {
      const section = document.getElementById("contact");
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location]);

  // Client logos (random placeholder logos)
  const clientLogos = [
    "https://logo.clearbit.com/google.com",
    "https://logo.clearbit.com/microsoft.com",
    "https://logo.clearbit.com/apple.com",
    "https://logo.clearbit.com/amazon.com",
    "https://logo.clearbit.com/facebook.com",
    "https://logo.clearbit.com/netflix.com",
    "https://logo.clearbit.com/ibm.com",
    "https://logo.clearbit.com/intel.com"
  ];

  // Services data
  const services = [
    {
      id: 1,
      title: "Commercial Cleaning",
      content: "Single to multi-level offices buildings, Common Areas cleaning, Strata cleaning.",
      image: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 2,
      title: "Industrial Cleaning",
      content: "Warehouses, Factories, Manufacturing/ Production Plants, Distribution centres.",
      image: "https://images.unsplash.com/photo-1517673132405-a56a62b97caf?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 3,
      title: "Specialized Cleaning",
      content: "Steam cleaning (carpet & furniture), Window cleaning (internal & external), Polishing, High Pressure cleaning, Spring (detail) cleaning.",
      image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 4,
      title: "Education Cleaning",
      content: "Pre-Schools, Child Care, Primary Schools, Secondary Schools, Colleges & Universities.",
      image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 5,
      title: "Retail Cleaning",
      content: "Standalone Department Stores, Shopping Centres, Supermarkets, Car Dealerships.",
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 6,
      title: "Hospitality Cleaning",
      content: "Restaurants, Fast Food outlets, Hotels, Bars & Clubs.",
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 7,
      title: "Consumable Products",
      content: "Supply of consumable products (Toilet paper, hand towel, soap etc.) at competitive prices.",
      image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 8,
      title: "Hygiene Services",
      content: "Engagement and Management of all Hygiene Services.",
      image: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 9,
      title: "Waste Management",
      content: "Engagement and Management of all Waste Services.",
      image: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 10,
      title: "Pest Control",
      content: "Engagement and Management of all Pest Control Services.",
      image: "https://images.unsplash.com/photo-1569336415964-5f6bee9a2973?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 11,
      title: "Grounds Maintenance",
      content: "Engagement and Management of all Grounds Maintenance Services.",
      image: "https://images.unsplash.com/photo-1545173168-9f1947eebb7f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 12,
      title: "Building Maintenance",
      content: "Engagement and Management of all Building Maintenance.",
      image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setContactForm({
      ...contactForm,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    console.log('Form submitted:', contactForm);
    alert('Thank you for your message. We will get back to you soon!');
    setContactForm({
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
    <div className="home">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container">
          {/* Left side - Text content */}
          <div className="hero-text">
            <h1 className="hero-title">
              Securing Your Future
              <br />
              Together.
            </h1>
            <p className="hero-description">
              Achieve your financial goals with personalized strategies and expert guidance. 
              We are your partner in building lasting wealth and financial freedom.
            </p>
            <button className="hero-btn" onClick={openModal}>
              Get a Quote
            </button>
          </div>

          {/* Right side - Images */}
          <div className="hero-images">
            {isMobile ? (
              // Mobile view - stacked images
              <div className="hero-images-mobile">
                <div className="hero-image-container">
                  <img 
                    src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" 
                    alt="Cleaning service" 
                    className="hero-image"
                  />
                </div>
                <div className="hero-image-container">
                  <img 
                    src="https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" 
                    alt="Professional cleaner" 
                    className="hero-image"
                  />
                </div>
                <div className="hero-image-container">
                  <img 
                    src="https://images.unsplash.com/photo-1545173168-9f1947eebb7f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" 
                    alt="Clean office" 
                    className="hero-image"
                  />
                </div>
              </div>
            ) : (
              // Desktop view - positioned images
              <div className="hero-images-desktop">
                <div className="hero-image-1">
                  <img 
                    src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" 
                    alt="Cleaning service" 
                    className="hero-image"
                  />
                </div>
                <div className="hero-image-2">
                  <img 
                    src="https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" 
                    alt="Professional cleaner" 
                    className="hero-image"
                  />
                </div>
                <div className="hero-image-3">
                  <img 
                    src="https://images.unsplash.com/photo-1545173168-9f1947eebb7f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" 
                    alt="Clean office" 
                    className="hero-image"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Client Logos Section */}
      <section className="clients-section">
        <div className="clients-container">
          <h2 className="clients-title">Our Clients</h2>
          <p className="clients-subtitle">
            Trusted by leading businesses and organizations who value cleanliness and professionalism
          </p>
          <div className="clients-grid">
            {clientLogos.map((logo, index) => (
              <div key={index} className="client-logo">
                <img 
                  src={logo} 
                  alt={`Client ${index + 1}`} 
                  className="client-logo-img"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/100x100/2b4194/ffffff?text=Client";
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="services-section">
        <div className="services-container">
          <h2 className="services-title">At your service.</h2>
          <p className="services-intro">
            Our service is providing solutions to the many challenges associated with managing all types of facilities. 
            We proudly provide commercial and industrial cleaning service solutions as detailed below. We also specialise in
            engaging and managing numerous other facility services such as hygiene and pest control, supply of consumable 
            products and waste/recycling management.
          </p>
          <div className="services-grid">
            {services.map(service => (
              <div key={service.id} className="service-card">
                <div className="service-card-inner">
                  <div className="service-card-front" style={{ backgroundImage: `url(${service.image})` }}>
                    <div className="service-card-overlay"></div>
                    <h3 className="service-card-title">{service.title}</h3>
                  </div>
                  <div className="service-card-back">
                    <h3 className="service-card-title">{service.title}</h3>
                    <p className="service-card-content">{service.content}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="team-section">
        <div className="team-container">
          <h2 className="team-title">One Goal, One Vision, One Team</h2>
          <p className="team-description">
            Teamwork is a vital ingredient to the success of any business and our team all share the one common goal and one vision. 
            And that is to provide the highest levels of service delivery, with the minimum amount of fuss or bother. Equally important 
            is to do so in a safe and sustainable manner whilst continuing to be competitive in the marketplace. Our team members may 
            be spread far and wide but the glue that bonds us all is our commitment to all of our valued clients. And that commitment 
            is to ensure that all of the service solutions provided by Wally Cleaning Company are exactly that, solutions.
          </p>
        </div>
      </section>

      {/* About Us Section */}
      <section className="about-section">
        <div className="about-container">
          <div className="about-content">
            <h2 className="about-title">Family first. A true Family Business.</h2>
            <p className="about-description">
              Originally established in 2002, Wally Cleaning Company Solutions is literally one big happy family. Four brothers and 
              three sisters of the same family (and their respective partners) all share ownership of this Australian owned business. 
              Each family member is actively involved in their own area of expertise. Be that management/supervision, operations, 
              training or administration, their commitment is unquestionable as it is unwavering.
            </p>
            <p className="about-description">
              Providing the highest level of service is always a matter of effectively and efficiently managing your people and this 
              is one area we pride ourselves on. We are, after all, in the people business. We rely on our people and our people rely 
              on us. We treat our people with the respect, dignity and empathy that they deserve and are entitled to. We always encourage, 
              engage and support our entire team through clear, open lines of communication, ongoing training, mentoring and guidance. 
              Most importantly, we treat all of our people like part of our own family.
            </p>
          </div>
          <div className="about-image">
            <img 
              src="https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
              alt="Wally Cleaning Company Team" 
              className="about-img"
            />
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section id="contact" className="contact-section">
        <div className="contact-container">
          <div className="contact-info">
            <h2 className="contact-title">Quick Contact Form</h2>
            <p className="contact-subtitle">Call us anytime</p>
            <div className="contact-details">
              <p className="contact-phone">Phone: +1 (555) 123-4567</p>
              <p className="contact-email">Email: info@wallycleaningcompany.com</p>
              <p className="contact-address">Address: 123 Cleaning Street, Sydney, Australia</p>
            </div>
          </div>
          <div className="contact-form-container">
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <input
                  type="text"
                  name="name"
                  value={contactForm.name}
                  onChange={handleInputChange}
                  placeholder="Your Name"
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="tel"
                  name="phone"
                  value={contactForm.phone}
                  onChange={handleInputChange}
                  placeholder="Your Phone"
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="email"
                  name="email"
                  value={contactForm.email}
                  onChange={handleInputChange}
                  placeholder="Your Email"
                  required
                />
              </div>
              <div className="form-group">
                <textarea
                  name="services"
                  value={contactForm.services}
                  onChange={handleInputChange}
                  placeholder="Description of services needed"
                  rows="4"
                  required
                ></textarea>
              </div>
              <button type="submit" className="contact-submit-btn">Send Message</button>
            </form>
          </div>
        </div>
      </section>

      {/* Modal for Get a Quote */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>×</button>
            <h2 className="modal-title">Get a Quote</h2>
            <form className="modal-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <input
                  type="text"
                  name="name"
                  value={contactForm.name}
                  onChange={handleInputChange}
                  placeholder="Your Name"
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="tel"
                  name="phone"
                  value={contactForm.phone}
                  onChange={handleInputChange}
                  placeholder="Your Phone"
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="email"
                  name="email"
                  value={contactForm.email}
                  onChange={handleInputChange}
                  placeholder="Your Email"
                  required
                />
              </div>
              <div className="form-group">
                <textarea
                  name="services"
                  value={contactForm.services}
                  onChange={handleInputChange}
                  placeholder="Description of services needed"
                  rows="4"
                  required
                ></textarea>
              </div>
              <button type="submit" className="modal-submit-btn">Get Quote</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
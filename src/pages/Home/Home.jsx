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

  // // Client logos (random placeholder logos)
  // const clientLogos = [
  //   "data:image/png;base64,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",
  //   "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKUAAACUCAMAAADF0xngAAAAe1BMVEX////yUCKAugECpO//uQIAoO7/tgD/+vn7/fj//fj4/P7o8tvb7vz/8tvzVix6twCoznBwwPP/znCGvRnzYDvxQwD82dPj78+MwCn2i3UprPDP6vv/78//vBrySxnxRgv/vyr84t70aUaRwzbxOAD3lYH/0ngAnO7/wjeglacbAAAA8klEQVR4nO3ZSVICURBFUYoCAWlsEHsKsd//Cv1WbSB/mBEyOHf8MuLMczSSJEmSJEnSCXSsaFb282VFacrXZhOtuy37u/E23Fua8qZrgnW7XnkxDnf/D8qGkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKS8gSVm90h2vugjLdNU348xDuW/fKyojTlrKL+YF5RmlJ5nVfUHywqSlNeVbQq+/V1vM805eM03NdT2T+fxdsnKtto00E5CfdCSUlJSUlJSUlJSUlJSUlJSUlJSUlJSUlJSTkow8i27ZWTfbjvNOWqot936WJdUZpSkiRJkiRJf+gHHqaloGRaWAIAAAAASUVORK5CYII=",
  //   "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAP8AAACUCAMAAABr5Q9hAAAAaVBMVEX///8AAAD8/PwEBAT5+fna2try8vLu7u4yMjL29vZ7e3vp6enExMSfn5+urq4XFxdwcHBra2tkZGSVlZUkJCTR0dGKiopNTU0bGxsODg6+vr7g4OCmpqa1tbVdXV2CgoJEREQrKys9PT129SfZAAAFIElEQVR4nO2cCZOyMAyG23LfKHKIoqv//0d+bQEXEdf9zI5MIM8ejigzfZMeaZvCGEEQBEEQBEEQBEEQBEEQxCcQcxdgRrR204rP9SqtIEULq3A555m5SgN4eco1mbnGdmAVSSufR+bcZfkwQjq8Ljv1vIrX533zWEnlhqH0X+rVVX+zqLjBjdb/ZT53cT5OlGjxrQFSe+7ifBIhBIuTXrt6ieYu0mcRzCqH8r/yVYWBgtnnW9en/vnmuvSLUDZ+w+hHv12om8R6sHXUZ+juX/6eBVuXAfLO8YauBNVh7vJ8Gr/r/Fr9zZravmZ36/vla6Eq/9wl+ighH+CLdbV9yfFb/f7szF2az1PwfuR3sxXKZ5s++NnW5sqqvubU1v2v+LDsrk+MB7bugtKf+M2hvTT8eEFhsOj+fwsS/ZtDbgWOJ5gnRquesjUsqT4ItahnOlZY11Y7wR+q66QGYZamqZ81lteFwcuwgBLj5dGmH+muRR10i5zS7brfM4NQL373bI+WN2+h/5Sg3iS3KE/hZnnQNwvGnDz64iOqNAzmLfTfIL3rNJuxOhnubI65o2qGbcV+NbRNvxySpOEiAkLL3z3K16OeHzX10S+N2wLQiEvkIB8VZeGb8s63N/SS58VN+PTH+huGf8Cuv6n6ye2DPONb59TH+uoW+YpA1Oqcrt8DqU8vn9AaQFXceP+kbv8See8mQBoGyJgndJ+17V/KVzfHSKcGgh1OT5r+f/h/l1oqGp5bzDt4Becw+WoItHWUOLeWdwgvIOnKdJcYbxhs+0D5MgRsEM+B8lfD3gv98idCPAs2J4L+/+QsO36cTV9ySEDul7geQ+z/42uBP7NHnAkjC36Fut/H2/WrfX1Y7ycJ8S6BitHO1jtsA5xhr0awDKo/wp0JkgLlu4irvyy46b6W+CNy3o849mP2kzW/X+PbqPUHUP0ZQ1z/ZfQH1Y88DzKv1qxfsDB5LXG5+mX4A/V/NrcCGCD9aupf4N7+tWD6OU8DpMu+CgEf/0prbhEABHNA+mUFuGCOfxnzQPGvagAR7nNw5UuRLzgFaJu/qrlnqH6eM7QnAYXe+AWy9fA2AAFf/9Ebn3ixoeoNfkGd/VIBF0DlzamHNP9JldoH7v2qm9UYiFF/twAM1r+LsAZBpt7/Au5/GtIAaDdBzBNMf2sDXnhYT8Q1QPGdAXYh0kDYAu+A8bYXSA8oA0EHngDQpU/tUWZCi/gP9Ou/EqX/1cl2eANQHOdW8h4meA+0w8HZAer0zz9gg3Ui7EA3gVtypEEwY7ULmwTom1O8iQB2+iy3/bcG4DoPBiVq/6LegSdBGxur+8VfJEHuarStXwFOgj2jfh6SYAXM/Vfsj8MSF4j8JEJc9xk8EXCL/KEIKn8ZsBPg5u3JacQIFpze6wONduKDuwEo8rfmgXLoT/FrV4j4nc1wg7solz0m8Ir9GwZIsAa+YwTzTo/eNe7f3r3Xnx5xLvtOYm/v5wEPxyLvzkAr+caSnoMrmFOO9crQ/lqeFKVb8Tv/qyfBZbZ0/2JMIA3g7+8E7stzk7ebO0F43I5WitzYxHz2a4x+yEd0HehLY2voXDvMyoF9tvrJFwsY+m+ouXBetBaoTkX4ENeaVuxftQkumzhYQtgzQgqyD3WWRU0eTG5qms4hb+I4tAKBOvV/mk6Paf7cp+kuTyBO/XxKd5RT+3ZSnLra9/iL6fl6xOh1+kti+EIQBEEQBEEQBEEQBEEQBEEQBEEQBPE//ANRXzQfOsAb6gAAAABJRU5ErkJggg==",
  //   "https://logo.clearbit.com/amazon.com",
  //   "https://logo.clearbit.com/facebook.com",
  //   "https://logo.clearbit.com/netflix.com",
  //   "https://logo.clearbit.com/intel.com"
  // ];

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
      {/* <section className="clients-section">
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
      </section> */}

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
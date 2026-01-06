import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import TextType from '../../components/TextType/TextType';
import ServiceModal from "../../components/ServiceModal/ServiceModal";
import FAQ from '../../components/FAQ/FAQ';
import SEO from '../../components/SEO/SEO';
import { getOrganizationSchema, getWebsiteSchema } from '../../utils/structuredData';
import './Home.css';

const Home = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loadedImages, setLoadedImages] = useState({});
  const [contactForm, setContactForm] = useState({
    name: '',
    phone: '',
    email: '',
    services: ''
  });
  const location = useLocation();
  const [selectedService, setSelectedService] = useState(null);


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

   const handleImageLoad = (imageName) => {
    setLoadedImages(prev => ({ ...prev, [imageName]: true }));
  };

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
      title: "Commercial Cleaning Melbourne",
      content:
        "FBI Facility Solutions specialises in commercial cleaning services across Melbourne. Since 2002, we've provided professional cleaning solutions for offices, showrooms, medical centres, and commercial facilities throughout Victoria.",
      contentPoint: [
        "Office buildings – single to multi-level",
        "Showrooms – retail and wholesale",
        "Aged Care Centres",
        "Child Care Centres",
        "Kindergartens",
        "Medical Centres",
        "Gymnasiums",
        "Production facilities",
        "Food processing plants",
        "Factories",
        "Warehouses",
        "Restaurants",
        "Art Galleries"
      ],
      contentFinishing:
        "Whatever your business, we have the skills, expertise and experience to deliver your desired results. Call us now for a competitive, obligation free quotation.",
      image: "/images/services/commercial-cleaning.jpg"
    },

    {
      id: 2,
      title: "Industrial Cleaning Services",
      content:
        "Professional industrial cleaning services for factories, warehouses, and production facilities across Melbourne. FBI Facility Solutions delivers comprehensive industrial cleaning solutions tailored to your operational needs.",
      contentPoint: [
        "Production facilities",
        "Food processing plants",
        "Factories",
        "Warehouses"
      ],
      contentFinishing:
        "Whatever your business, we have the skills, expertise, equipment and experience to deliver your desired results. Call us now for a competitive, obligation free quotation.",
      image: "/images/services/industrial-cleaning.jpg"
    },

    {
      id: 3,
      title: "Specialised Cleaning Services",
      content:
        "FBI Facility Solutions offers specialised cleaning services including COVID-19 disinfection, carpet steam cleaning, floor stripping and sealing, and high-pressure cleaning across Melbourne.",
      contentPoint: [
        "Infection Control / COVID-19 Cleaning – disinfection & sanitisation as per DHHS standards",
        "Steam Cleaning – carpet, rugs, soft furnishings",
        "Stripping & Re-Sealing (polishing) – hard floors such as vinyl",
        "Spring (deep) Cleaning – thorough periodical cleaning",
        "Window Cleaning – internal & external, single or multi-level",
        "High Pressure Cleaning – external pathways, paving, courtyards"
      ],
      contentFinishing:
        "Whatever the task, we have the skills, expertise, equipment and experience to self-deliver your desired results. Call us now for a competitive, obligation free quotation.",
      image: "/images/services/specialised-cleaning.jpg"
    },

    {
      id: 4,
      title: "Aged Care Cleaning Melbourne",
      content:
        "Specialized aged care cleaning services in Melbourne with focus on infection control and DHHS compliance. FBI Facility Solutions understands the critical importance of hygiene in aged care facilities.",
      contentPoint: [],
      contentFinishing:
        "No matter the size of your centre, we have the capacity, resources and experience to deliver the desired results. Call us now for a competitive, obligation free consultation.",
      image: "/images/services/aged-care.jpg"
    },

    {
      id: 5,
      title: "Child Care Cleaning Services",
      content:
        "Professional childcare and kindergarten cleaning services throughout Melbourne. FBI Facility Solutions prioritizes child safety with thorough disinfection and sanitization protocols for child care centres.",
      contentPoint: [],
      contentFinishing:
        "No matter the size of your centre, we have the capacity, resources and experience to deliver the desired results. Call us now for a competitive, obligation free quotation.",
      image: "/images/services/child-care.jpg"
    },

    {
      id: 6,
      title: "Retail Cleaning Services",
      content:
        "Premium retail cleaning services for showrooms, dealerships, and retail spaces in Melbourne. FBI Facility Solutions ensures your retail environment makes the perfect first impression.",
      contentPoint: [
        "Prestige New Car Dealerships",
        "Contemporary Furniture Showrooms",
        "Premium Kitchen Appliance Showrooms",
        "Wholesale Lighting Showrooms"
      ],
      contentFinishing:
        "Our primary goal is to enhance your customer experience through premium cleaning standards.",
      image: "/images/services/retail-cleaning.jpg"
    },

    {
      id: 7,
      title: "Consumable Products Supply",
      content:
        "Bulk cleaning consumables and supplies for businesses across Melbourne. FBI Facility Solutions manages ordering, restocking, and delivery of essential cleaning products at competitive prices.",
      contentPoint: [
        "Toilet Paper",
        "Hand Towel",
        "Hand Soaps",
        "Hand Sanitiser",
        "Bin Liners"
      ],
      contentFinishing:
        "Reliable supply, competitive pricing, and zero hassle.",
      image: "/images/services/consumable.jpg"
    },

    {
      id: 8,
      title: "Hygiene Services Melbourne",
      content:
        "Complete hygiene services management for Melbourne businesses. FBI Facility Solutions sources, engages, and manages professional hygiene service providers for your facility.",
      contentPoint: [],
      contentFinishing:
        "That's one less thing for you to worry about, leaving you more time to focus on your business.",
      image: "/images/services/hygiene.jpg"
    },

    {
      id: 9,
      title: "Waste Management Services",
      content:
        "Professional waste management solutions for businesses in Melbourne. FBI Facility Solutions coordinates waste management and recycling services tailored to your facility's needs.",
      contentPoint: [],
      contentFinishing:
        "That's one less thing for you to worry about, leaving you more time to focus on your business.",
      image: "/images/services/waste-management.jpg"
    },

    {
      id: 10,
      title: "Ground Maintenance Melbourne",
      content:
        "Professional grounds maintenance services for commercial properties across Melbourne. FBI Facility Solutions manages trusted grounds maintenance providers for your facility.",
      contentPoint: [],
      contentFinishing:
        "That's one less thing for you to worry about, leaving you more time to focus on your business.",
      image: "/images/services/ground-maintenance.jpg"
    },

    {
      id: 11,
      title: "Building Maintenance Services",
      content:
        "Comprehensive building maintenance solutions for Melbourne commercial properties. FBI Facility Solutions coordinates all building maintenance requirements through trusted industry partners.",
      contentPoint: [],
      contentFinishing:
        "That's one less thing for you to worry about, leaving you more time to focus on your business.",
      image: "/images/services/building-maintenance3.jpg"
    },

    {
      id: 12,
      title: "Pest Control Services Melbourne",
      content:
        "Professional pest control management for commercial facilities in Melbourne. FBI Facility Solutions sources and manages reliable pest control providers for your business.",
      contentPoint: [],
      contentFinishing:
        "That's one less thing for you to worry about, leaving you more time to focus on your business.",
      image: "/images/services/pest-control.jpg"
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

   const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      getOrganizationSchema(),
      getWebsiteSchema()
    ]
  };

  return (
    <>
    <SEO
        title="FBI Facility Solutions - Professional Commercial Cleaning Services Melbourne"
        description="FBI Facility Solutions provides premium commercial cleaning, industrial cleaning, aged care, childcare, and facility management services throughout Melbourne. Family-owned business since 2002. Call 1300 424 066 for a free quote."
        keywords="commercial cleaning Melbourne, industrial cleaning services, office cleaning Chadstone, facility management Melbourne, aged care cleaning, childcare cleaning, retail cleaning services, cleaning company Melbourne, professional cleaners Melbourne"
        canonicalUrl="https://fbifacilitysolutions.com.au/"
        ogImage="/images/home/home-1.jpg"
        structuredData={structuredData}
      />
    <div className="home">
      {/* Hero Section */}
     <section className="hero-section">
          <div className="hero-container">
            {/* Left side - Text content */}
            <div className="hero-text">
              <h1 className="hero-title">
                <TextType 
                  text={[
                    "Professional Commercial Cleaning Melbourne",
                    "Your Facility. Our Responsibility.", 
                    "Excellence in Facility Management",
                    "Trusted Cleaning Services Since 2002"
                  ]}
                  typingSpeed={75}
                  pauseDuration={1500}
                  showCursor={true}
                  cursorCharacter="|"
                />
              </h1>
              <p className="hero-description">
                FBI Facility Solutions delivers professional commercial cleaning, industrial cleaning, and comprehensive facility management services across Melbourne. Family-owned and operated since 2002, we provide quality cleaning solutions with care, consistency, and respect.
              </p>
              <button className="header-quote-btn" onClick={openModal}>
                Get a Free Quote
              </button>
            </div>

            {/* Right side - Images */}
            <div className="hero-images">
              {isMobile ? (
                <div className="hero-images-mobile">
                  <div className="hero-image-container">
                    <img 
                      src="/images/home/home-1.jpg" 
                      alt="Professional commercial cleaning services in Melbourne office building" 
                      className={`hero-image ${loadedImages['home-1'] ? 'loaded' : ''}`}
                      loading="eager"
                      fetchpriority="high"
                      onLoad={() => handleImageLoad('home-1')}
                    />
                  </div>
                  <div className="hero-image-container">
                    <img 
                      src="/images/home/home-2.jpg" 
                      alt="Professional cleaner providing industrial cleaning services" 
                      className={`hero-image ${loadedImages['home-2'] ? 'loaded' : ''}`}
                      loading="lazy"
                      onLoad={() => handleImageLoad('home-2')}
                    />
                  </div>
                  <div className="hero-image-container">
                    <img 
                      src="/images/home/home-3.jpg" 
                      alt="Clean commercial office space in Melbourne" 
                      className={`hero-image ${loadedImages['home-3'] ? 'loaded' : ''}`}
                      loading="lazy"
                      onLoad={() => handleImageLoad('home-3')}
                    />
                  </div>
                </div>
              ) : (
                <div className="hero-images-desktop">
                  <div className="hero-image-1">
                    <img 
                      src="/images/home/home-1.jpg" 
                      alt="Professional commercial cleaning services in Melbourne office building" 
                      className={`hero-image ${loadedImages['home-1'] ? 'loaded' : ''}`}
                      loading="eager"
                      fetchpriority="high"
                      onLoad={() => handleImageLoad('home-1')}
                    />
                  </div>
                  <div className="hero-image-2">
                    <img 
                      src="/images/home/home-2.jpg" 
                      alt="Professional cleaner providing industrial cleaning services" 
                      className={`hero-image ${loadedImages['home-2'] ? 'loaded' : ''}`}
                      loading="lazy"
                      onLoad={() => handleImageLoad('home-2')}
                    />
                  </div>
                  <div className="hero-image-3">
                    <img 
                      src="/images/home/home-3.jpg" 
                      alt="Clean commercial office space in Melbourne" 
                      className={`hero-image ${loadedImages['home-3'] ? 'loaded' : ''}`}
                      loading="lazy"
                      onLoad={() => handleImageLoad('home-3')}
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
            <h2 className="services-title">
              Professional Cleaning Services Melbourne<span style={{color: "rgb(200, 25, 30)"}}>.</span>
            </h2>
            <p className="services-intro">
              FBI Facility Solutions provides comprehensive facility management and cleaning services across Melbourne. 
              Our commercial and industrial cleaning solutions include aged care cleaning, childcare centre cleaning, 
              office cleaning, and specialized facility services. We also manage hygiene services, pest control, 
              consumable products supply, and waste management for businesses throughout Victoria.
            </p>
            <div className="services-grid">
              {services.map(service => (
                <div key={service.id} className="service-card">
                  <div 
                    className="service-card-image" 
                    style={{ backgroundImage: `url(${service.image})` }}
                    role="img"
                    aria-label={`${service.title} services`}
                  >
                    <div className="service-card-overlay"></div>
                  </div>
                  <div className="service-card-body">
                    <h3 className="service-card-title">{service.title}</h3>
                    <p className="service-card-description">{service.content}</p>
                    <button 
                      className="service-read-more-btn"
                      onClick={() => setSelectedService(service)}
                      aria-label={`Learn more about ${service.title}`}
                    >
                      Read More
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <FAQ/>

      {/* Contact Form Section */}
      <section id="contact" className="contact-section">
          <div className="contact-container">
            <div className="contact-info">
              <h2 className="contact-title">Contact FBI Facility Solutions</h2>
              <p className="contact-subtitle">Get a free quote for cleaning services in Melbourne</p>
              <div className="contact-details">
                <p className="contact-phone">Phone: <a href="tel:1300424066">1300 424 066</a></p>
                <p className="contact-email">Email: <a href="mailto:info@fbifacilitysolution.com.au">info@fbifacilitysolution.com.au</a></p>
                <p className="contact-address">Address: 45 Atkinson, Chadstone VIC 3148</p>
              </div>
            </div>
            <div className="contact-form-container">
              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="contact-name" className="sr-only">Your Name</label>
                  <input
                    id="contact-name"
                    type="text"
                    name="name"
                    value={contactForm.name}
                    onChange={handleInputChange}
                    placeholder="Your Name"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="contact-phone" className="sr-only">Your Phone</label>
                  <input
                    id="contact-phone"
                    type="tel"
                    name="phone"
                    value={contactForm.phone}
                    onChange={handleInputChange}
                    placeholder="Your Phone"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="contact-email" className="sr-only">Your Email</label>
                  <input
                    id="contact-email"
                    type="email"
                    name="email"
                    value={contactForm.email}
                    onChange={handleInputChange}
                    placeholder="Your Email"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="contact-services" className="sr-only">Description of Services Needed</label>
                  <textarea
                    id="contact-services"
                    name="services"
                    value={contactForm.services}
                    onChange={handleInputChange}
                    placeholder="Tell us about your cleaning requirements"
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
              <button className="modal-close" onClick={closeModal} aria-label="Close quote form">×</button>
              <h2 className="modal-title">Get a Free Cleaning Quote</h2>
              <form className="modal-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="modal-name" className="sr-only">Your Name</label>
                  <input
                    id="modal-name"
                    type="text"
                    name="name"
                    value={contactForm.name}
                    onChange={handleInputChange}
                    placeholder="Your Name"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="modal-phone" className="sr-only">Your Phone</label>
                  <input
                    id="modal-phone"
                    type="tel"
                    name="phone"
                    value={contactForm.phone}
                    onChange={handleInputChange}
                    placeholder="Your Phone"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="modal-email" className="sr-only">Your Email</label>
                  <input
                    id="modal-email"
                    type="email"
                    name="email"
                    value={contactForm.email}
                    onChange={handleInputChange}
                    placeholder="Your Email"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="modal-services" className="sr-only">Services Needed</label>
                  <textarea
                    id="modal-services"
                    name="services"
                    value={contactForm.services}
                    onChange={handleInputChange}
                    placeholder="Describe your cleaning requirements"
                    rows="4"
                    required
                  ></textarea>
                </div>
                <button type="submit" className="modal-submit-btn">Get Quote</button>
              </form>
            </div>
          </div>
        )}

      {selectedService && (
        <ServiceModal 
          service={selectedService} 
          onClose={() => setSelectedService(null)} 
        />
      )}

    </div>
    </>
  );
};

export default Home;
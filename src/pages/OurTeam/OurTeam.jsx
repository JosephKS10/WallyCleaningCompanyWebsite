import "./OurTeam.css";
import { useEffect, useState } from "react";
import TextType from "../../components/TextType/TextType";
import SEO from '../../components/SEO/SEO';
import { getOrganizationSchema, getBreadcrumbSchema } from '../../utils/structuredData';

const OurTeam = () => {
  const [contactForm, setContactForm] = useState({
    name: '',
    phone: '',
    email: '',
    services: ''
  });
  const [loadedImages, setLoadedImages] = useState({});

  useEffect(() => {
    scrollTo(0, 0);
  }, []);

  const handleImageLoad = (imageName) => {
    setLoadedImages(prev => ({ ...prev, [imageName]: true }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setContactForm({
      ...contactForm,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', contactForm);
    alert('Thank you for your message. We will get back to you soon!');
    setContactForm({
      name: '',
      phone: '',
      email: '',
      services: ''
    });
  };

  const breadcrumbData = getBreadcrumbSchema([
    { name: "Home", url: "https://fbifacilitysolutions.com.au/" },
    { name: "Our Team", url: "https://fbifacilitysolutions.com.au/our-team" }
  ]);

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      getOrganizationSchema(),
      breadcrumbData
    ]
  };

  return (
    <>
      <SEO
        title="Our Team - FBI Facility Solutions | Family-Owned Cleaning Company Melbourne"
        description="Meet the FBI Facility Solutions team. A family-owned cleaning business established in 2002, providing professional commercial and industrial cleaning services across Melbourne with care and commitment."
        keywords="cleaning team Melbourne, family owned cleaning business, commercial cleaning team, professional cleaners Melbourne, FBI Facility Solutions team"
        canonicalUrl="https://fbifacilitysolutions.com.au/our-team"
        ogImage="/images/team/our-team.jpg"
        structuredData={structuredData}
      />
    <div className="our-team-page">
      {/* ✅ HERO SECTION */}
      <section className="team-hero">
        <div className="team-hero-background">
          <img 
            src="/images/team/our-team.jpg" 
            alt="Our Team"
            className={`team-hero-img ${loadedImages['hero'] ? 'loaded' : ''}`}
            loading="eager"
            fetchpriority="high"
            onLoad={() => handleImageLoad('hero')}
          />
        </div>
        <div className="team-hero-overlay"></div>
        <div className="team-hero-content">
          <TextType 
            text={["One Team", "One Goal.", "One Vision"]}
            typingSpeed={75}
            pauseDuration={1500}
            showCursor={true}
            cursorCharacter="|"
          />
        </div>
      </section>

      {/* ✅ TEAM SECTION */}
      <section className="team-section">
        <div className="team-container">
          <h2 className="team-title">Melbourne's Trusted Commercial Cleaning Team</h2>
          <p className="team-description">
            FBI Facility Solutions is a family-owned cleaning company serving Melbourne since 2002. 
            Our professional cleaning team shares a unified vision: delivering exceptional commercial 
            and industrial cleaning services with minimal disruption to your business operations. We 
            prioritize safety, sustainability, and competitive pricing while maintaining the highest 
            standards of service quality. Our commitment to Melbourne businesses is unwavering – we 
            ensure every cleaning solution we provide truly solves your facility management challenges.
          </p>
        </div>
      </section>

      {/* ✅ ABOUT US SECTION */}
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
              src="https://images.unsplash.com/photo-1603712725038-e9334ae8f39f?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
              alt="Wally Cleaning Company Team"
              className={`about-img ${loadedImages['about'] ? 'loaded' : ''}`}
              loading="lazy"
              onLoad={() => handleImageLoad('about')}
            />
          </div>
        </div>
      </section>

      <section id="contact" className="contact-section">
        <div className="contact-container">
          <div className="contact-info">
            <h2 className="contact-title">Quick Contact Form</h2>
            <p className="contact-subtitle">Call us anytime</p>
            <div className="contact-details">
              <p className="contact-phone">Phone: 1300 424 066</p>
              <p className="contact-email">Email: info@fbifacilitysolution.com.au</p>
              <p className="contact-address">Address: 45 Atkinson Chadstone,VIC 3148</p>
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
    </div>
    </>
  );
};

export default OurTeam;
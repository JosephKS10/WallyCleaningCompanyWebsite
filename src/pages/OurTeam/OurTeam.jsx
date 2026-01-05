import "./OurTeam.css";
import { useEffect, useState } from "react";
import TextType from "../../components/TextType/TextType";

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

  return (
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
          <h2 className="team-title">One Goal. One Vision. One Team</h2>
          <p className="team-description">
            Teamwork is a vital ingredient to the success of any business and our team all share the one common goal and one vision. 
            And that is to provide the highest levels of service delivery, with the minimum amount of fuss or bother. Equally important 
            is to do so in a safe and sustainable manner whilst continuing to be competitive in the marketplace. Our team members may 
            be spread far and wide but the glue that bonds us all is our commitment to all of our valued clients. And that commitment 
            is to ensure that all of the service solutions provided by Wally Cleaning Company are exactly that, solutions.
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
              src="https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
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
  );
};

export default OurTeam;
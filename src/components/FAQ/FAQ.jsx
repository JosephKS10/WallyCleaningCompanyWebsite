import { useState } from 'react';
import './FAQ.css';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "What areas in Melbourne do you service?",
      answer: "FBI Facility Solutions provides commercial and industrial cleaning services across all Melbourne suburbs, including Chadstone, CBD, and surrounding areas within a 50km radius. We service offices, factories, aged care facilities, childcare centres, and more."
    },
    {
      question: "What types of commercial cleaning services do you offer?",
      answer: "We offer comprehensive commercial cleaning including office cleaning, industrial cleaning, aged care facility cleaning, childcare centre cleaning, retail cleaning, and specialized services like COVID-19 disinfection, carpet steam cleaning, and high-pressure cleaning."
    },
    {
      question: "How do I get a quote for cleaning services?",
      answer: "Contact us at 1300 424 066 or fill out our online quote form. We'll arrange a site visit to assess your requirements and provide a competitive, obligation-free quote tailored to your facility's needs."
    },
    {
      question: "Are your cleaners police checked and insured?",
      answer: "Yes, all FBI Facility Solutions cleaners undergo police checks and Working with Children checks where required. We maintain comprehensive insurance coverage for all our cleaning operations."
    },
    {
      question: "Do you provide cleaning supplies and equipment?",
      answer: "Yes, we supply all necessary cleaning products, equipment, and consumables. We also offer bulk supply of cleaning consumables at competitive prices for businesses that prefer to manage their own supplies."
    },
    {
      question: "What makes FBI Facility Solutions different from other cleaning companies?",
      answer: "We're a family-owned Melbourne business established in 2002. Our commitment to quality, reliability, and personalized service sets us apart. We treat every client facility with the same care as if it were our own."
    }
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // Structured data for FAQs
  const faqStructuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <>
      <script type="application/ld+json">
        {JSON.stringify(faqStructuredData)}
      </script>
      
      <section className="faq-section">
        <div className="faq-container">
          <h2 className="faq-title">Frequently Asked Questions</h2>
          <p className="faq-subtitle">
            Common questions about our commercial cleaning services in Melbourne
          </p>
          
          <div className="faq-list">
            {faqs.map((faq, index) => (
              <div key={index} className="faq-item">
                <button
                  className={`faq-question ${openIndex === index ? 'active' : ''}`}
                  onClick={() => toggleFAQ(index)}
                  aria-expanded={openIndex === index}
                >
                  <span>{faq.question}</span>
                  <span className="faq-icon">{openIndex === index ? '−' : '+'}</span>
                </button>
                
                {openIndex === index && (
                  <div className="faq-answer">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default FAQ;
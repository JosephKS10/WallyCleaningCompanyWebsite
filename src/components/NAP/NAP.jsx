// NAP = Name, Address, Phone - Critical for local SEO consistency
const NAP = ({ variant = 'full', className = '' }) => {
  const businessInfo = {
    name: "FBI Facility Solutions",
    street: "45 Atkinson",
    city: "Chadstone",
    state: "VIC",
    postcode: "3148",
    phone: "1300 424 066",
    phoneLink: "1300424066",
    email: "info@fbifacilitysolution.com.au"
  };

  if (variant === 'footer') {
    return (
      <div className={`nap-footer ${className}`}>
        <p><strong>{businessInfo.name}</strong></p>
        <p>{businessInfo.street}, {businessInfo.city} {businessInfo.state} {businessInfo.postcode}</p>
        <p>Phone: <a href={`tel:${businessInfo.phoneLink}`}>{businessInfo.phone}</a></p>
        <p>Email: <a href={`mailto:${businessInfo.email}`}>{businessInfo.email}</a></p>
      </div>
    );
  }

  if (variant === 'inline') {
    return (
      <span className={`nap-inline ${className}`}>
        {businessInfo.city}, {businessInfo.state} | <a href={`tel:${businessInfo.phoneLink}`}>{businessInfo.phone}</a>
      </span>
    );
  }

  // Default 'full' variant
  return (
    <address className={`nap-full ${className}`}>
      <p className="nap-name">{businessInfo.name}</p>
      <p className="nap-street">{businessInfo.street}</p>
      <p className="nap-city">{businessInfo.city}, {businessInfo.state} {businessInfo.postcode}</p>
      <p className="nap-phone">Phone: <a href={`tel:${businessInfo.phoneLink}`}>{businessInfo.phone}</a></p>
      <p className="nap-email">Email: <a href={`mailto:${businessInfo.email}`}>{businessInfo.email}</a></p>
    </address>
  );
};

export default NAP;
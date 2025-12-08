import "./ServiceModal.css";
import { FiX } from "react-icons/fi";

const ServiceModal = ({ service, onClose }) => {
  return (
    <div className="service-modal-overlay" onClick={onClose}>
      <div className="service-modal-box" onClick={(e) => e.stopPropagation()}>
        
        {/* Close Button */}
        <button className="service-modal-close" onClick={onClose}>
          <FiX />
        </button>

        {/* Image */}
        <div 
          className="service-modal-image"
          style={{ backgroundImage: `url(${service.image})` }}
        ></div>

        {/* Content */}
        <div className="service-modal-content">
          <h2>{service.title}</h2>
          <p className="service-modal-description">{service.content}</p>

          {service.contentPoint?.length > 0 && (
            <ul className="service-modal-points">
              {service.contentPoint.map((point, idx) => (
                <li key={idx}>{point}</li>
              ))}
            </ul>
          )}

          <p className="service-modal-finishing">
            {service.contentFinishing}
          </p>
        </div>

      </div>
    </div>
  );
};

export default ServiceModal;

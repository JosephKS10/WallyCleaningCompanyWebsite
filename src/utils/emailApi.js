const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; 

export const sendQuoteEmail = async (payload) => {
  const response = await fetch(
    `${API_BASE_URL}/email-service-fbi/send-quote-email`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to send email");
  }

  return response.json();
};
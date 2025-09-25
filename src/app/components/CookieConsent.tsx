"use client";

import { useState, useEffect } from "react";

const CookieConsent: React.FC = () => {
  const [showConsent, setShowConsent] = useState<boolean>(false);

  const handleAccept = () => {
    setShowConsent(false);
    localStorage.setItem("consent", "true");
  };

  useEffect(() => {
    const consent = localStorage.getItem("consent");
    if (!consent) {
      setShowConsent(true);
    }
  }, []);

  if (!showConsent) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-secondary-light p-4 text-center flex items-center justify-center z-50">
      <p>Strona korzysta z plików cookie. Kliknij „Akceptuj”, aby wyrazić zgodę.</p>
      <button
        onClick={handleAccept}
        className="ml-10 px-4 py-1 bg-secondary-light rounded-md hover:shadow-md"
      >
        Akceptuj
      </button>
    </div>
  );
};

export default CookieConsent;

import React, { useState } from "react";
import TopNav from "../TopNav/TopNav";
import BreadcrumbAndProfile from "../BreadcrumbAndProfile/BreadcrumbAndProfile";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import emailjs from "emailjs-com";
import { faGithub, faLinkedin } from "@fortawesome/free-brands-svg-icons";

const Contact: React.FC = () => {
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userMessage, setUserMessage] = useState("");

  const [showSuccess, setShowSuccess] = useState(false); // Success Popup State

  // Handle email button click
  const handleEmailSend = () => {
    if (!userName || !userEmail || !userMessage) {
      alert("Please fill all fields.");
      return;
    }

    const templateParams = {
      user_name: userName,
      user_email: userEmail,
      message: userMessage,
    };

    const serviceId = process.env.REACT_APP_EMAILJS_SERVICE_ID;
    const templateId = process.env.REACT_APP_EMAILJS_TEMPLATE_ID;
    const publicKey = process.env.REACT_APP_EMAILJS_PUBLIC_KEY;

    if (!serviceId || !templateId || !publicKey) {
      alert("EmailJS configuration is missing. Please check your environment variables.");
      return;
    }

    emailjs
      .send(
        serviceId,
        templateId,
        templateParams,
        publicKey
      )
      .then(
        (response) => {
          console.log("SUCCESS!", response.status, response.text);

          // Show Success Popup
          setShowSuccess(true);

          // Clear fields
          setUserName("");
          setUserEmail("");
          setUserMessage("");

          // Auto-close success popup after 3 seconds
          setTimeout(() => setShowSuccess(false), 3000);
        },
        (err) => {
          console.log("FAILED...", err);
          alert("Failed to send message. Please try again.");
        }
      );
  };

  return (
    <div className="min-h-screen bg-white">
      {/* SUCCESS POPUP */}
      {showSuccess && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-xl shadow-xl p-8 text-center animate-fadeIn">
            <div className="flex items-center justify-center mb-4">
              <svg
                className="w-16 h-16 text-green-500"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-black mb-2">
              Thanks for contacting!
            </h2>
            <p className="text-gray-600">Your message was sent successfully.</p>
          </div>
        </div>
      )}

      <TopNav />

      <div className="pt-20 sm:pt-24 md:pt-28 p-4 sm:p-6 md:p-8 lg:p-10 max-w-7xl mx-auto">
        <BreadcrumbAndProfile
          pageTitle="Contact"
          breadcrumbItems={[
            { name: "Dashboard", path: "/dashboard", active: false },
            { name: "Contact", path: "/contact", active: true },
          ]}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {/* CONTACT FORM SECTION */}
          <div className="bg-white border-2 border-gray-200 rounded-xl p-6 sm:p-8 shadow-sm">
            <h2 className="text-xl sm:text-2xl font-bold text-black mb-6">
              Get in Touch
            </h2>

            <div className="space-y-5">
              <div>
                <label className="text-sm text-gray-500">Your Name</label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg text-black"
                  placeholder="Enter your name"
                />
              </div>

              <div>
                <label className="text-sm text-gray-500">Your Email</label>
                <input
                  type="email"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg text-black"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label className="text-sm text-gray-500">Your Message</label>
                <textarea
                  rows={5}
                  value={userMessage}
                  onChange={(e) => setUserMessage(e.target.value)}
                  className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg text-black"
                  placeholder="Write your message"
                />
              </div>

              <button
                onClick={handleEmailSend}
                className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-all w-full sm:w-auto"
              >
                Send Message
              </button>
            </div>
          </div>
        </div>

        {/* FOOTER SECTION */}
        <div className="mt-10 text-center text-gray-600">
          <p className="text-sm">
            Made with ❤️ by <span className="font-semibold">Deven</span>
          </p>

          <div className="flex items-center justify-center space-x-6 mt-3">
            <a
              href="https://www.linkedin.com/in/deven-puri-76a898257/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FontAwesomeIcon
                icon={faLinkedin}
                className="text-2xl hover:text-black transition"
              />
            </a>

            <a
              href="https://github.com/Deven-puri"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FontAwesomeIcon
                icon={faGithub}
                className="text-2xl hover:text-black transition"
              />
            </a>
          </div>
        </div>
      </div>

      {/* Animation CSS */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Contact;

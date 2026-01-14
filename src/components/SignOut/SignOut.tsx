import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase_config';

const SignOut: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleSignOut = async () => {
      try {
        const isGuest = localStorage.getItem('isGuest') === 'true';
        
        if (isGuest) {
          localStorage.removeItem('isGuest');
          localStorage.removeItem('guestUserId');
          setTimeout(() => {
            navigate('/');
          }, 2000);
        } else {
          await signOut(auth);
          setTimeout(() => {
            navigate('/');
          }, 2000);
        }
      } catch (error) {
        console.error('Error signing out:', error);
        setTimeout(() => {
          navigate('/');
        }, 2000);
      }
    };

    handleSignOut();
  }, [navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-4">
      <div className="bg-white border-2 border-gray-200 rounded-2xl shadow-sm p-6 sm:p-10 md:p-12 text-center max-w-md w-full">
        <div className="mb-4 sm:mb-6">
          <div className="inline-block p-3 sm:p-4 bg-black rounded-full mb-3 sm:mb-4">
            <svg className="w-8 h-8 sm:w-12 sm:h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-black mb-2">Signed Out Successfully</h2>
          <p className="text-sm sm:text-base text-gray-600">
            Thanks for using <span className="font-bold text-black">AI Financer</span>
          </p>
        </div>
        <p className="text-xs sm:text-sm text-gray-500 mb-4 sm:mb-6">Redirecting to sign in page...</p>
        <Link
          to="/"
          className="inline-block bg-black hover:bg-gray-800 text-white font-medium py-2 px-4 sm:px-6 rounded-lg transition-all duration-200 text-sm sm:text-base w-full sm:w-auto"
        >
          Go back to sign in
        </Link>
      </div>
    </div>
  );
};

export default SignOut;


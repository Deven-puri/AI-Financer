import React, { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock, faArrowRight, faEye, faEyeSlash, faUser } from '@fortawesome/free-solid-svg-icons';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { signInWithEmailAndPassword, signInWithPopup, createUserWithEmailAndPassword, AuthError } from 'firebase/auth';
import { auth, googleProvider } from '../../firebase_config';

const SignIn: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [isSignUp, setIsSignUp] = useState<boolean>(false);

  useEffect(() => {
    const guestMode = localStorage.getItem('isGuest') === 'true';
    if (guestMode) {
      navigate('/dashboard');
      return;
    }
    
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        localStorage.removeItem('isGuest');
        localStorage.removeItem('guestUserId');
        navigate('/dashboard');
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const validateForm = (): boolean => {
    if (!email) {
      setError('Email is required');
      return false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Email is invalid');
      return false;
    }

    if (!password) {
      setError('Password is required');
      return false;
    } else if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }

    setError('');
    return true;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      localStorage.removeItem('isGuest');
      localStorage.removeItem('guestUserId');
      
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      navigate('/dashboard');
    } catch (err) {
      const error = err as AuthError;
      let errorMessage = error.message || 'An error occurred during authentication';
      
      if (error.code === 'auth/unauthorized-domain') {
        errorMessage = 'This domain is not authorized. Please contact the administrator or check Firebase settings.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address. Please check and try again.';
      } else if (error.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email. Please sign up first.';
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'Incorrect password. Please try again.';
      } else if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'This email is already registered. Please sign in instead.';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Password is too weak. Please use at least 6 characters.';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      localStorage.removeItem('isGuest');
      localStorage.removeItem('guestUserId');
      await signInWithPopup(auth, googleProvider);
      navigate('/dashboard');
    } catch (err) {
      const error = err as AuthError;
      let errorMessage = error.message || 'An error occurred during Google authentication';
      
      if (error.code === 'auth/unauthorized-domain') {
        errorMessage = 'This domain is not authorized for Firebase authentication. Please add this domain to Firebase authorized domains in the Firebase Console.';
      } else if (error.code === 'auth/popup-closed-by-user') {
        errorMessage = 'Sign-in popup was closed. Please try again.';
      } else if (error.code === 'auth/popup-blocked') {
        errorMessage = 'Popup was blocked by your browser. Please allow popups and try again.';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleGuestLogin = () => {
    localStorage.setItem('isGuest', 'true');
    localStorage.setItem('guestUserId', `guest_${Date.now()}`);
    navigate('/dashboard');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-white py-6 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md bg-white border-2 border-gray-200 rounded-2xl shadow-sm p-6 sm:p-8 md:p-10 transform transition-all">
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-black mb-2">
            {isSignUp ? 'Create Account' : 'Welcome Back'}
          </h2>
          <p className="text-base sm:text-lg font-semibold text-gray-600">
            {isSignUp ? 'Join' : 'Log in to'} <span className="font-bold text-black">AI Financer</span>
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-gray-100 border-2 border-gray-300 rounded-lg">
            <p className="text-xs sm:text-sm text-black">{error}</p>
          </div>
        )}

        <div className="mb-4 sm:mb-6 space-y-3">
          <button
            type="button"
            className="w-full flex items-center justify-center gap-2 sm:gap-3 bg-white hover:bg-gray-50 text-gray-700 font-medium py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg border-2 border-gray-300 transition-all duration-200 shadow-sm hover:shadow-md relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
            onClick={handleGoogleLogin}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></span>
                <span className="relative z-10">Processing...</span>
              </>
            ) : (
              <>
                <FontAwesomeIcon icon={faGoogle} className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-xs sm:text-base">Continue with Google</span>
              </>
            )}
            {loading && (
              <div className="absolute inset-0 bg-gray-200 animate-pulse opacity-50"></div>
            )}
          </button>
          
          <button
            type="button"
            className="w-full flex items-center justify-center gap-2 sm:gap-3 bg-black hover:bg-gray-800 text-white font-medium py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg border-2 border-black transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
            onClick={handleGuestLogin}
            disabled={loading}
          >
            <FontAwesomeIcon icon={faUser} className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-xs sm:text-base">Sign in as Guest</span>
          </button>
        </div>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or continue with email</span>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4 sm:mb-5 relative">
            <label htmlFor="email" className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
              Email address
            </label>
            <div className="relative">
              <FontAwesomeIcon
                icon={faEnvelope}
                className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm sm:text-base"
              />
              <input
                id="email"
                type="email"
                className={`pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 w-full border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition-all text-sm sm:text-base ${
                  error && error.includes('email') ? 'border-gray-500' : 'border-gray-300'
                }`}
                placeholder="your.email@example.com"
                value={email}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  setEmail(e.target.value);
                  setError('');
                }}
                required
              />
            </div>
          </div>

          <div className="mb-4 sm:mb-6 relative">
            <label htmlFor="password" className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <FontAwesomeIcon
                icon={faLock}
                className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm sm:text-base"
              />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                className={`pl-10 sm:pl-12 pr-10 sm:pr-12 py-2.5 sm:py-3 w-full border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition-all text-sm sm:text-base ${
                  error && error.includes('password') ? 'border-gray-500' : 'border-gray-300'
                }`}
                placeholder="Enter your password"
                value={password}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                required
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} className="text-sm sm:text-base" />
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-black hover:bg-gray-800 text-white font-semibold py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 relative overflow-hidden text-sm sm:text-base"
            disabled={loading}
          >
            {loading ? (
              <span className="relative z-10 flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Processing...
              </span>
            ) : (
              <>
                {isSignUp ? 'Sign Up' : 'Sign In'}
                <FontAwesomeIcon icon={faArrowRight} className="text-sm sm:text-base" />
              </>
            )}
            {loading && (
              <div className="absolute inset-0 bg-gray-200 animate-pulse opacity-50"></div>
            )}
          </button>
        </form>

        <div className="mt-4 sm:mt-6 text-center space-y-2">
          <Link
            to="#"
            className="text-xs sm:text-sm text-black hover:text-gray-700 hover:underline font-medium"
            onClick={(e) => {
              e.preventDefault();
            }}
          >
            Forgot password?
          </Link>
          <p className="text-xs sm:text-sm text-gray-600">
            {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError('');
              }}
              className="text-black hover:text-gray-700 hover:underline font-medium"
            >
              {isSignUp ? 'Sign in' : 'Sign up'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;


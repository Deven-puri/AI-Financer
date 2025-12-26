import React, { useState, useEffect } from 'react';
import TopNav from '../TopNav/TopNav';
import BreadcrumbAndProfile from '../BreadcrumbAndProfile/BreadcrumbAndProfile';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faUser, faCode, faCalendar, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import { faGithub } from '@fortawesome/free-brands-svg-icons';

interface GitHubUser {
  login: string;
  name: string;
  bio: string;
  avatar_url: string;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
  location: string;
  blog: string;
  html_url: string;
}

const Contact: React.FC = () => {
  const [githubData, setGithubData] = useState<GitHubUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchGitHubData = async () => {
      try {
        const response = await fetch('https://api.github.com/users/Deven-puri');
        const data = await response.json();
        setGithubData(data);
      } catch (error) {
        console.error('Error fetching GitHub data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGitHubData();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <TopNav />
      <div className="pt-20 sm:pt-24 md:pt-28 p-4 sm:p-6 md:p-8 lg:p-10 max-w-7xl mx-auto">
        <BreadcrumbAndProfile
          pageTitle="Contact"
          breadcrumbItems={[
            { name: 'Dashboard', path: '/dashboard', active: false },
            { name: 'Contact', path: '/contact', active: true }
          ]}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          <div className="bg-white border-2 border-gray-200 rounded-xl p-6 sm:p-8 shadow-sm">
            <h2 className="text-xl sm:text-2xl font-bold text-black mb-4 sm:mb-6">Contact Information</h2>
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-center space-x-3 sm:space-x-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-black rounded-full flex items-center justify-center flex-shrink-0">
                  <FontAwesomeIcon icon={faUser} className="text-white text-lg sm:text-xl" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm text-gray-500">Name</p>
                  <p className="text-base sm:text-lg font-semibold text-black">Deven</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 sm:space-x-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-black rounded-full flex items-center justify-center flex-shrink-0">
                  <FontAwesomeIcon icon={faEnvelope} className="text-white text-lg sm:text-xl" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm text-gray-500">Email</p>
                  <a
                    href="mailto:devenpuri29@gmail.com"
                    className="text-base sm:text-lg font-semibold text-black hover:text-gray-700 break-words"
                  >
                    devenpuri29@gmail.com
                  </a>
                  <p className="text-xs sm:text-sm text-gray-500">9858909858</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border-2 border-gray-200 rounded-xl p-6 sm:p-8 shadow-sm">
            <h2 className="text-xl sm:text-2xl font-bold text-black mb-4 sm:mb-6">GitHub Profile</h2>
            {loading ? (
              <div className="flex items-center justify-center py-6 sm:py-8">
                <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-black"></div>
              </div>
            ) : githubData ? (
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <img
                    src={githubData.avatar_url}
                    alt={githubData.login}
                    className="w-12 h-12 sm:w-16 sm:h-16 rounded-full border-2 border-gray-200 flex-shrink-0"
                  />
                  <div className="min-w-0">
                    <h3 className="text-lg sm:text-xl font-bold text-black truncate">{githubData.name || githubData.login}</h3>
                    <a
                      href={githubData.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-black flex items-center space-x-2 text-sm sm:text-base"
                    >
                      <FontAwesomeIcon icon={faGithub} className="text-sm sm:text-base" />
                      <span className="truncate">@{githubData.login}</span>
                    </a>
                  </div>
                </div>
                {githubData.bio && (
                  <p className="text-sm sm:text-base text-gray-600 break-words">{githubData.bio}</p>
                )}
                <div className="grid grid-cols-3 gap-2 sm:gap-4 pt-3 sm:pt-4 border-t border-gray-200">
                  <div className="text-center">
                    <p className="text-xl sm:text-2xl font-bold text-black">{githubData.public_repos}</p>
                    <p className="text-xs sm:text-sm text-gray-500">Repositories</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xl sm:text-2xl font-bold text-black">{githubData.followers}</p>
                    <p className="text-xs sm:text-sm text-gray-500">Followers</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xl sm:text-2xl font-bold text-black">{githubData.following}</p>
                    <p className="text-xs sm:text-sm text-gray-500">Following</p>
                  </div>
                </div>
                {githubData.location && (
                  <div className="flex items-center space-x-2 text-gray-600 text-sm sm:text-base">
                    <FontAwesomeIcon icon={faMapMarkerAlt} className="text-sm sm:text-base" />
                    <span className="truncate">{githubData.location}</span>
                  </div>
                )}
                <div className="flex items-center space-x-2 text-gray-600 text-sm sm:text-base">
                  <FontAwesomeIcon icon={faCalendar} className="text-sm sm:text-base" />
                  <span>Joined {new Date(githubData.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}</span>
                </div>
                <a
                  href={githubData.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-black hover:bg-gray-800 text-white px-4 sm:px-6 py-2 rounded-lg transition-all mt-3 sm:mt-4 text-sm sm:text-base w-full sm:w-auto text-center"
                >
                  View GitHub Profile
                </a>
              </div>
            ) : (
              <p className="text-sm sm:text-base text-gray-500">Unable to load GitHub data</p>
            )}
          </div>
        </div>

        {githubData && (
          <div className="mt-6 sm:mt-8 bg-white border-2 border-gray-200 rounded-xl p-4 sm:p-8 shadow-sm">
            <h2 className="text-xl sm:text-2xl font-bold text-black mb-4 sm:mb-6">GitHub Activity</h2>
            <div className="flex items-center justify-center py-4 sm:py-8 bg-gray-50 rounded-lg overflow-x-auto">
              <img
                src={`https://ghchart.rshah.org/Deven-puri`}
                alt="GitHub Contributions"
                className="w-full max-w-4xl"
              />
            </div>
            <p className="text-xs sm:text-sm text-gray-500 text-center mt-3 sm:mt-4">
              Contribution graph showing your GitHub activity
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Contact;


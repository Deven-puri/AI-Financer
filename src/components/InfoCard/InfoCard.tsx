import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { InfoCardProps } from '../../types';

const InfoCard: React.FC<InfoCardProps> = ({ title, value, linkText, linkTo }) => {
  return (
    <div className="bg-white border-2 border-gray-200 rounded-xl p-4 sm:p-6 md:p-8 shadow-sm hover:shadow-md transition-all duration-300">
      <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-black mb-3 sm:mb-4">{title}</h3>
      <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-black mb-4 sm:mb-6 break-words">{value}</p>
      {linkText && linkTo && (
        <Link
          to={linkTo}
          className="inline-flex items-center text-black hover:text-gray-700 font-medium transition-colors duration-200 group text-sm sm:text-base"
        >
          {linkText}
          <FontAwesomeIcon
            icon={faArrowRight}
            className="ml-2 group-hover:translate-x-1 transition-transform duration-200 text-xs sm:text-sm"
          />
        </Link>
      )}
    </div>
  );
};

export default InfoCard;


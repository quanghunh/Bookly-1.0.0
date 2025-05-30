import React from 'react';

const ServiceCard = ({ service }) => {
  return (
    <div className="flex items-start space-x-4 p-4 hover:bg-gray-50 rounded-lg transition-colors duration-200">
      <div className="text-3xl text-primary-500 mt-1 flex-shrink-0">
        {service.icon}
      </div>
      <div className="flex-1">
        <h4 className="text-lg font-semibold text-gray-900 mb-2 capitalize">
          {service.title}
        </h4>
        <p className="text-gray-600 leading-relaxed">
          {service.description}
        </p>
      </div>
    </div>
  );
};

export default ServiceCard;
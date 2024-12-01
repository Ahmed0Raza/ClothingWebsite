import React from 'react';
import { X } from "react-feather";

export default function OrderProduct({ title, SCQ }) {
  return (
    <div className="flex items-center w-full border-b border-gray-200 py-3 px-4 hover:bg-gray-50 transition-colors duration-200">
      {/* Title column - fixed width for consistency */}
      <div className="flex-shrink-0 w50">
        <p className="text-sm font-semibold text-gray-900 truncate pr-4 uppercase">
          {title}
        </p>
      </div>
      
      {/* SCQ column - flexible width */}
      <div className="flex-1 px-4">
        <p className="text-sm text-gray-700">
          {SCQ}
        </p>
      </div>
      
      {/* Price column - fixed width for alignment
      <div className="flex-shrink-0 w-32 text-right">
        <span className="text-sm font-medium text-gray-900">
          PKR {price}
        </span>
      </div> */}
    </div>
  );
}

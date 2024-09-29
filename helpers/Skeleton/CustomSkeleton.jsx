import React from 'react';
import Skeleton from 'react-loading-skeleton';
import './CustomSkeleton.scss'; // Import your custom CSS file
import 'react-loading-skeleton/dist/skeleton.css'

const CustomSkeleton = () => {
  return (
    <div className="custom-skeleton">
      <Skeleton width={300} height={250} />
      <Skeleton width={250} height={300} />
    </div>
  );
};

export default CustomSkeleton;

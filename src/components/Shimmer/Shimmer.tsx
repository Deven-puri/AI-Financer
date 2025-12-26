import React from 'react';

interface ShimmerProps {
  className?: string;
}

export const Shimmer: React.FC<ShimmerProps> = ({ className = '' }) => {
  return (
    <div className={`animate-pulse ${className}`}>
      <div className="bg-gray-200 rounded"></div>
    </div>
  );
};

export const ShimmerCard: React.FC = () => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-lg">
      <Shimmer className="h-6 w-32 mb-4" />
      <Shimmer className="h-8 w-24 mb-2" />
      <Shimmer className="h-4 w-40" />
    </div>
  );
};

export const ShimmerInfoCard: React.FC = () => {
  return (
    <div className="bg-white border-2 border-gray-200 rounded-xl p-6 md:p-8 shadow-sm">
      <Shimmer className="h-6 w-24 mb-4" />
      <Shimmer className="h-12 w-32 mb-6" />
      <Shimmer className="h-4 w-28" />
    </div>
  );
};

export const ShimmerListItem: React.FC = () => {
  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <div className="flex items-start gap-4 mb-3">
        <Shimmer className="w-16 h-16 rounded-lg flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <Shimmer className="h-4 w-full" />
          <Shimmer className="h-4 w-3/4" />
          <Shimmer className="h-4 w-1/2" />
        </div>
      </div>
      <div className="flex gap-2">
        <Shimmer className="h-8 w-20 rounded-lg" />
        <Shimmer className="h-8 w-20 rounded-lg" />
      </div>
    </div>
  );
};

export const ShimmerForm: React.FC = () => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-lg">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <Shimmer className="h-4 w-20 mb-2" />
          <Shimmer className="h-10 w-full rounded-lg" />
        </div>
        <div>
          <Shimmer className="h-4 w-20 mb-2" />
          <Shimmer className="h-10 w-full rounded-lg" />
        </div>
        <div>
          <Shimmer className="h-4 w-20 mb-2" />
          <Shimmer className="h-10 w-full rounded-lg" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <Shimmer className="h-4 w-20 mb-2" />
          <Shimmer className="h-10 w-full rounded-lg" />
        </div>
        <div>
          <Shimmer className="h-4 w-20 mb-2" />
          <Shimmer className="h-10 w-full rounded-lg" />
        </div>
        <div>
          <Shimmer className="h-4 w-20 mb-2" />
          <Shimmer className="h-10 w-full rounded-lg" />
        </div>
      </div>
      <Shimmer className="h-12 w-32 rounded-lg" />
    </div>
  );
};

export const DashboardShimmer: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <div className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 h-24 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
          <Shimmer className="h-16 w-48" />
          <div className="hidden md:flex items-center space-x-2">
            <Shimmer className="h-10 w-24 rounded-lg" />
            <Shimmer className="h-10 w-24 rounded-lg" />
            <Shimmer className="h-10 w-24 rounded-lg" />
          </div>
        </div>
      </div>

      {/* Main Content Shimmer */}
      <div className="pt-24 md:pt-28 p-6 md:p-8 lg:p-10 max-w-7xl mx-auto">
        {/* Breadcrumb Shimmer */}
        <div className="mb-8">
          <Shimmer className="h-6 w-48 mb-6" />
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <Shimmer className="h-10 w-40 mb-4 md:mb-0" />
            <div className="hidden md:flex items-center space-x-4 bg-white rounded-lg p-3 shadow-md">
              <Shimmer className="w-12 h-12 rounded-full" />
              <div>
                <Shimmer className="h-4 w-24 mb-2" />
                <Shimmer className="h-3 w-32" />
              </div>
            </div>
          </div>
          <Shimmer className="h-6 w-64 mb-2" />
          <Shimmer className="h-4 w-96" />
        </div>

        <div className="mb-6">
          <ShimmerInfoCard />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <ShimmerInfoCard />
          <ShimmerInfoCard />
        </div>

      </div>
    </div>
  );
};

export const ExpensesShimmer: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <div className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 h-24 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
          <Shimmer className="h-16 w-48" />
          <div className="hidden md:flex items-center space-x-2">
            <Shimmer className="h-10 w-24 rounded-lg" />
            <Shimmer className="h-10 w-24 rounded-lg" />
            <Shimmer className="h-10 w-24 rounded-lg" />
          </div>
        </div>
      </div>

      {/* Main Content Shimmer */}
      <div className="pt-24 md:pt-28 p-6 md:p-8 lg:p-10 max-w-7xl mx-auto">
        {/* Breadcrumb Shimmer */}
        <div className="mb-8">
          <Shimmer className="h-6 w-48 mb-6" />
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <Shimmer className="h-10 w-40 mb-4 md:mb-0" />
            <div className="hidden md:flex items-center space-x-4 bg-white rounded-lg p-3 shadow-md">
              <Shimmer className="w-12 h-12 rounded-full" />
              <div>
                <Shimmer className="h-4 w-24 mb-2" />
                <Shimmer className="h-3 w-32" />
              </div>
            </div>
          </div>
        </div>

        <Shimmer className="h-12 w-full rounded-lg mb-6" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white border-2 border-gray-200 rounded-xl p-6 shadow-sm">
            <Shimmer className="h-6 w-32 mb-2" />
            <Shimmer className="h-10 w-40" />
          </div>
          <ShimmerCard />
        </div>

        <ShimmerForm />

        <div className="bg-white rounded-xl shadow-lg mb-6 mt-8">
          <div className="p-6">
            <Shimmer className="h-6 w-32 mb-4" />
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <ShimmerListItem key={i} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shimmer;


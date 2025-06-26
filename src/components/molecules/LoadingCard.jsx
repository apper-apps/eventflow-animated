import Card from '@/components/atoms/Card';

const LoadingCard = ({ lines = 3 }) => {
  return (
    <Card>
      <div className="animate-pulse space-y-3">
        <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-3/4"></div>
        {Array.from({ length: lines }).map((_, i) => (
          <div key={i} className="h-3 bg-gray-200 rounded w-full"></div>
        ))}
      </div>
    </Card>
  );
};

export default LoadingCard;
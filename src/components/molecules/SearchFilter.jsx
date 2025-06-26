import { useState } from 'react';
import Input from '@/components/atoms/Input';
import Button from '@/components/atoms/Button';

const SearchFilter = ({ 
  searchValue, 
  onSearchChange, 
  filters = [], 
  activeFilters = [], 
  onFilterChange,
  placeholder = "Search..."
}) => {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder={placeholder}
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            icon="Search"
          />
        </div>
        
        {filters.length > 0 && (
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            icon="Filter"
          >
            Filters
          </Button>
        )}
      </div>

      {showFilters && filters.length > 0 && (
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => (
              <Button
                key={filter.value}
                variant={activeFilters.includes(filter.value) ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => onFilterChange(filter.value)}
              >
                {filter.label}
              </Button>
            ))}
          </div>
        </div>
      )}

      {activeFilters.length > 0 && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Active filters:</span>
          {activeFilters.map((filterValue) => {
            const filter = filters.find(f => f.value === filterValue);
            return filter ? (
              <Button
                key={filterValue}
                variant="ghost"
                size="sm"
                icon="X"
                iconPosition="right"
                onClick={() => onFilterChange(filterValue)}
                className="text-xs"
              >
                {filter.label}
              </Button>
            ) : null;
          })}
        </div>
      )}
    </div>
  );
};

export default SearchFilter;
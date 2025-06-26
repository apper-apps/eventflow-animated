import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import Button from '@/components/atoms/Button';
import Card from '@/components/atoms/Card';
import Badge from '@/components/atoms/Badge';
import SearchFilter from '@/components/molecules/SearchFilter';
import LoadingCard from '@/components/molecules/LoadingCard';
import EmptyState from '@/components/molecules/EmptyState';
import ErrorState from '@/components/molecules/ErrorState';
import ApperIcon from '@/components/ApperIcon';
import menuItemService from '@/services/api/menuItemService';

const Menus = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [filteredMenuItems, setFilteredMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [totalCost, setTotalCost] = useState(0);

  const categoryFilters = [
    { label: 'Appetizers', value: 'appetizers' },
    { label: 'Salads', value: 'salads' },
    { label: 'Entrees', value: 'entrees' },
    { label: 'Sides', value: 'sides' },
    { label: 'Desserts', value: 'desserts' },
    { label: 'Breakfast', value: 'breakfast' },
    { label: 'Lunch', value: 'lunch' },
    { label: 'Beverages', value: 'beverages' }
  ];

  useEffect(() => {
    loadMenuItems();
  }, []);

  useEffect(() => {
    filterMenuItems();
  }, [menuItems, searchTerm, activeFilters]);

  useEffect(() => {
    calculateTotalCost();
  }, [selectedItems]);

  const loadMenuItems = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await menuItemService.getAll();
      setMenuItems(result.sort((a, b) => a.category.localeCompare(b.category)));
    } catch (err) {
      setError(err.message || 'Failed to load menu items');
      toast.error('Failed to load menu items');
    } finally {
      setLoading(false);
    }
  };

  const filterMenuItems = () => {
    let filtered = [...menuItems];

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(term) ||
        item.description.toLowerCase().includes(term) ||
        item.category.toLowerCase().includes(term)
      );
    }

    // Category filter
    if (activeFilters.length > 0) {
      filtered = filtered.filter(item => activeFilters.includes(item.category));
    }

    setFilteredMenuItems(filtered);
  };

  const handleFilterChange = (filterValue) => {
    setActiveFilters(prev =>
      prev.includes(filterValue)
        ? prev.filter(f => f !== filterValue)
        : [...prev, filterValue]
    );
  };

  const handleItemSelect = (item) => {
    setSelectedItems(prev => {
      const exists = prev.find(selected => selected.Id === item.Id);
      if (exists) {
        return prev.filter(selected => selected.Id !== item.Id);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const handleQuantityChange = (itemId, quantity) => {
    if (quantity <= 0) {
      setSelectedItems(prev => prev.filter(item => item.Id !== itemId));
    } else {
      setSelectedItems(prev =>
        prev.map(item =>
          item.Id === itemId ? { ...item, quantity } : item
        )
      );
    }
  };

  const calculateTotalCost = () => {
    const total = selectedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    setTotalCost(total);
  };

  const getDietaryColor = (dietary) => {
    const colors = {
      'vegetarian': 'success',
      'vegan': 'accent',
      'gluten-free': 'warning',
      'gluten-free-option': 'info'
    };
    return colors[dietary] || 'default';
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="space-y-6 max-w-full"
      >
        <h1 className="text-3xl font-heading font-bold text-gray-900">Menu Catalog</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <LoadingCard key={i} lines={4} />
          ))}
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="space-y-6 max-w-full"
      >
        <h1 className="text-3xl font-heading font-bold text-gray-900">Menu Catalog</h1>
        <ErrorState message={error} onRetry={loadMenuItems} />
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
transition={{ duration: 0.3 }}
      className="space-y-4 sm:space-y-6 max-w-full"
    >
      {/* Header */}
      <div className="flex flex-col gap-3 sm:gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-gray-900">Menu Catalog</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">Browse and select items for your events</p>
        </div>
<div className="flex flex-col xs:flex-row items-stretch xs:items-center gap-2 xs:gap-3">
          {selectedItems.length > 0 && (
            <div className="bg-primary/10 text-primary px-3 py-2 rounded-lg text-center xs:text-left">
              <span className="font-semibold text-sm sm:text-base">${totalCost.toFixed(2)}</span>
              <span className="text-xs sm:text-sm ml-1">({selectedItems.length} items)</span>
            </div>
          )}
          <Button icon="Plus" className="min-h-[44px]">
            <span className="hidden xs:inline">Add Item</span>
            <span className="xs:hidden">Add</span>
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <SearchFilter
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        filters={categoryFilters}
        activeFilters={activeFilters}
        onFilterChange={handleFilterChange}
        placeholder="Search menu items..."
      />

      {/* Cost Calculator Panel */}
      {selectedItems.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
<Card className="bg-primary/5 border border-primary/20 p-4 sm:p-6">
<div className="flex items-center justify-between mb-3 sm:mb-4">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">Cost Calculator</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedItems([])}
              >
                Clear All
              </Button>
            </div>
            
            <div className="space-y-3">
{selectedItems.map(item => (
                <div key={item.Id} className="flex items-center justify-between py-2 gap-2">
                  <div className="flex-1 min-w-0">
                    <span className="font-medium text-sm sm:text-base block truncate">{item.name}</span>
                    <span className="text-xs sm:text-sm text-gray-500">${item.price}</span>
                  </div>
<div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                    <button
                      onClick={() => handleQuantityChange(item.Id, item.quantity - 1)}
                      className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 touch-manipulation"
                    >
                      <ApperIcon name="Minus" size={12} />
                    </button>
                    <span className="w-6 sm:w-8 text-center text-sm">{item.quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(item.Id, item.quantity + 1)}
                      className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 touch-manipulation"
                    >
                      <ApperIcon name="Plus" size={12} />
                    </button>
                    <span className="font-semibold ml-1 sm:ml-2 w-12 sm:w-16 text-right text-sm">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
              
              <div className="border-t pt-3 flex items-center justify-between text-lg font-semibold">
                <span>Total:</span>
                <span className="text-primary">${totalCost.toFixed(2)}</span>
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Menu Items Grid */}
      {filteredMenuItems.length === 0 ? (
        <EmptyState
          icon="ChefHat"
          title={searchTerm || activeFilters.length > 0 ? "No items found" : "No menu items yet"}
          description={
            searchTerm || activeFilters.length > 0
              ? "Try adjusting your search or filters"
              : "Get started by adding your first menu item"
          }
          actionLabel={searchTerm || activeFilters.length > 0 ? undefined : "Add Menu Item"}
          onAction={() => console.log('Navigate to add menu item')}
        />
      ) : (
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredMenuItems.map((item, index) => {
            const isSelected = selectedItems.some(selected => selected.Id === item.Id);
            
            return (
              <motion.div
                key={item.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card 
                  hover 
                  className={`cursor-pointer transition-all ${
                    isSelected ? 'ring-2 ring-primary bg-primary/5' : ''
                  }`}
onClick={() => handleItemSelect(item)}
                >
                  <div className="flex items-start justify-between mb-2 sm:mb-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 mb-1 text-sm sm:text-base truncate">{item.name}</h3>
                      <p className="text-xs sm:text-sm text-gray-600 capitalize mb-1 sm:mb-2">{item.category}</p>
                    </div>
                    <div className="text-right flex-shrink-0 ml-2">
                      <p className="text-base sm:text-lg font-bold text-primary">${item.price}</p>
                      <p className="text-xs text-gray-500">{item.unit}</p>
                    </div>
                  </div>
<p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4 line-clamp-2 sm:line-clamp-3">
                    {item.description}
                  </p>
                  
                  {item.dietary && item.dietary.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {item.dietary.map(diet => (
                        <Badge 
                          key={diet} 
                          variant={getDietaryColor(diet)}
                          size="sm"
                        >
                          {diet.replace('-', ' ')}
                        </Badge>
                      ))}
                    </div>
                  )}
                  
<div className="flex items-center justify-between gap-2">
                    <Button
                      variant={isSelected ? 'primary' : 'outline'}
                      size="sm"
                      icon={isSelected ? 'Check' : 'Plus'}
                      className="flex-1 sm:flex-none min-h-[40px]"
                    >
                      <span className="hidden sm:inline">{isSelected ? 'Selected' : 'Add to Event'}</span>
                      <span className="sm:hidden">{isSelected ? 'Added' : 'Add'}</span>
                    </Button>
                    
                    {isSelected && (
                      <div className="bg-primary/10 text-primary px-2 py-1 rounded text-xs sm:text-sm font-medium">
                        x{selectedItems.find(s => s.Id === item.Id)?.quantity}
                      </div>
                    )}
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
};

export default Menus;
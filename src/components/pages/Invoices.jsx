import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { toast } from "react-toastify";
import invoiceService from "@/services/api/invoiceService";
import ApperIcon from "@/components/ApperIcon";
import EmptyState from "@/components/molecules/EmptyState";
import SearchFilter from "@/components/molecules/SearchFilter";
import StatusBadge from "@/components/molecules/StatusBadge";
import ErrorState from "@/components/molecules/ErrorState";
import LoadingCard from "@/components/molecules/LoadingCard";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";

const Invoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState([]);

  const statusFilters = [
    { label: 'Pending', value: 'pending' },
    { label: 'Paid', value: 'paid' },
    { label: 'Overdue', value: 'overdue' },
    { label: 'Draft', value: 'draft' }
  ];

  useEffect(() => {
    loadInvoices();
  }, []);

  useEffect(() => {
    filterInvoices();
  }, [invoices, searchTerm, activeFilters]);

  const loadInvoices = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await invoiceService.getAll();
      setInvoices(result.sort((a, b) => new Date(b.dateIssued) - new Date(a.dateIssued)));
    } catch (err) {
      setError(err.message || 'Failed to load invoices');
      toast.error('Failed to load invoices');
    } finally {
      setLoading(false);
    }
  };

  const filterInvoices = () => {
    let filtered = [...invoices];

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(invoice =>
        invoice.invoiceNumber.toLowerCase().includes(term) ||
        invoice.eventId.toString().includes(term)
      );
    }

    // Status filter
    if (activeFilters.length > 0) {
      filtered = filtered.filter(invoice => activeFilters.includes(invoice.status));
    }

    setFilteredInvoices(filtered);
  };

  const handleFilterChange = (filterValue) => {
    setActiveFilters(prev =>
      prev.includes(filterValue)
        ? prev.filter(f => f !== filterValue)
        : [...prev, filterValue]
    );
  };

  const handleStatusChange = async (invoiceId, newStatus) => {
    try {
      await invoiceService.update(invoiceId, { status: newStatus });
      setInvoices(invoices.map(invoice =>
        invoice.Id === invoiceId ? { ...invoice, status: newStatus } : invoice
      ));
      toast.success('Invoice status updated');
    } catch (err) {
      toast.error('Failed to update invoice status');
    }
  };

  const handleDownloadInvoice = (invoice) => {
    // Simulate PDF download
    toast.info(`Downloading ${invoice.invoiceNumber}.pdf`);
  };

  const handleSendInvoice = (invoice) => {
    // Simulate sending invoice
    toast.success(`Invoice ${invoice.invoiceNumber} sent successfully`);
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="space-y-6 max-w-full"
      >
        <h1 className="text-3xl font-heading font-bold text-gray-900">Invoices</h1>
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
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
        <h1 className="text-3xl font-heading font-bold text-gray-900">Invoices</h1>
        <ErrorState message={error} onRetry={loadInvoices} />
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
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-gray-900">Invoices</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">Manage billing and payment tracking</p>
        </div>
<div className="flex flex-col xs:flex-row items-stretch xs:items-center gap-2 xs:gap-3">
          <Button variant="outline" icon="Download" className="min-h-[44px]">
            <span className="hidden xs:inline">Export All</span>
            <span className="xs:hidden">Export</span>
          </Button>
          <Button icon="Plus" className="min-h-[44px]">
            <span className="hidden xs:inline">Generate Invoice</span>
            <span className="xs:hidden">Generate</span>
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <SearchFilter
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        filters={statusFilters}
        activeFilters={activeFilters}
        onFilterChange={handleFilterChange}
        placeholder="Search by invoice number or event ID..."
      />

{/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
        {[
          {
            label: 'Total Outstanding',
            value: `$${filteredInvoices
              .filter(i => i.status === 'pending' || i.status === 'overdue')
              .reduce((sum, i) => sum + i.total, 0)
              .toLocaleString()}`,
            icon: 'AlertCircle',
            color: 'warning'
          },
          {
            label: 'Paid This Month',
            value: `$${filteredInvoices
              .filter(i => i.status === 'paid')
              .reduce((sum, i) => sum + i.total, 0)
              .toLocaleString()}`,
            icon: 'CheckCircle',
            color: 'success'
          },
          {
            label: 'Overdue',
            value: filteredInvoices.filter(i => i.status === 'overdue').length,
            icon: 'Clock',
            color: 'error'
          },
          {
            label: 'Draft',
            value: filteredInvoices.filter(i => i.status === 'draft').length,
            icon: 'FileText',
            color: 'accent'
          }
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
<Card className="text-center p-3 sm:p-6">
              <div className={`w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2 sm:mb-3 rounded-lg flex items-center justify-center ${
                stat.color === 'success' ? 'bg-success/10 text-success' :
                stat.color === 'warning' ? 'bg-warning/10 text-warning' :
                stat.color === 'error' ? 'bg-error/10 text-error' :
                'bg-accent/10 text-accent'
              }`}>
                <ApperIcon name={stat.icon} size={20} className="sm:w-6 sm:h-6" />
              </div>
              <p className="text-lg sm:text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-xs sm:text-sm text-gray-600">{stat.label}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Invoices List */}
      {filteredInvoices.length === 0 ? (
        <EmptyState
          icon="FileText"
          title={searchTerm || activeFilters.length > 0 ? "No invoices found" : "No invoices yet"}
          description={
            searchTerm || activeFilters.length > 0
              ? "Try adjusting your search or filters"
              : "Generate your first invoice from an event"
          }
          actionLabel={searchTerm || activeFilters.length > 0 ? undefined : "Generate Invoice"}
          onAction={() => console.log('Navigate to generate invoice')}
        />
      ) : (
        <div className="space-y-4">
          {filteredInvoices.map((invoice, index) => (
            <motion.div
              key={invoice.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
<Card hover className="relative">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-3 sm:gap-4">
                      <div className="flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 bg-accent/10 rounded-xl flex items-center justify-center">
                        <ApperIcon name="FileText" size={20} className="text-accent sm:w-6 sm:h-6" />
                      </div>
                      
<div className="flex-1 min-w-0">
                        <div className="flex flex-col xs:flex-row xs:items-center gap-2 xs:gap-3 mb-2">
                          <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                            {invoice.invoiceNumber}
                          </h3>
                          <StatusBadge status={invoice.status} />
</div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <ApperIcon name="Calendar" size={16} />
                            <span>Issued: {format(new Date(invoice.dateIssued), 'MMM dd, yyyy')}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <ApperIcon name="Clock" size={16} />
                            <span>Due: {format(new Date(invoice.dueDate), 'MMM dd, yyyy')}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <ApperIcon name="Hash" size={16} />
                            <span>Event ID: {invoice.eventId}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <ApperIcon name="Package" size={16} />
                            <span>{invoice.lineItems.length} items</span>
                          </div>
                        </div>
                        
                        <div className="mt-3 space-y-1">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Subtotal:</span>
                            <span>${invoice.subtotal.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Tax:</span>
                            <span>${invoice.tax.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between font-semibold text-lg border-t pt-1">
                            <span>Total:</span>
                            <span className="text-primary">${invoice.total.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
<div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
<Button 
                      variant="ghost" 
                      size="sm" 
                      icon="Download"
                      onClick={() => handleDownloadInvoice(invoice)}
                      className="min-h-[40px] w-10 p-0 sm:w-auto sm:px-3"
                    />
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      icon="Send"
                      onClick={() => handleSendInvoice(invoice)}
                      className="min-h-[40px] w-10 p-0 sm:w-auto sm:px-3"
                    />
                    <Button variant="ghost" size="sm" icon="MoreVertical" className="min-h-[40px] w-10 p-0 sm:w-auto sm:px-3" />
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default Invoices;
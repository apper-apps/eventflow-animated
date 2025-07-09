const invoiceService = {
  async getAll() {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "event_id" } },
          { field: { Name: "invoice_number" } },
          { field: { Name: "date_issued" } },
          { field: { Name: "due_date" } },
          { field: { Name: "subtotal" } },
          { field: { Name: "tax" } },
          { field: { Name: "total" } },
          { field: { Name: "status" } },
          { field: { Name: "line_items" } }
        ],
        orderBy: [
          {
            fieldName: "date_issued",
            sorttype: "DESC"
          }
        ]
      };

      const response = await apperClient.fetchRecords('invoice', params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      console.error('Error fetching invoices:', error);
      throw error;
    }
  },

  async getById(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "event_id" } },
          { field: { Name: "invoice_number" } },
          { field: { Name: "date_issued" } },
          { field: { Name: "due_date" } },
          { field: { Name: "subtotal" } },
          { field: { Name: "tax" } },
          { field: { Name: "total" } },
          { field: { Name: "status" } },
          { field: { Name: "line_items" } }
        ]
      };

      const response = await apperClient.getRecordById('invoice', parseInt(id, 10), params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching invoice with ID ${id}:`, error);
      throw error;
    }
  },

  async create(invoiceData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Filter to only include Updateable fields
      const updateableData = {
        Name: invoiceData.Name,
        Tags: invoiceData.Tags,
        Owner: invoiceData.Owner,
        event_id: invoiceData.event_id,
        invoice_number: invoiceData.invoice_number,
        date_issued: invoiceData.date_issued || new Date().toISOString(),
        due_date: invoiceData.due_date,
        subtotal: invoiceData.subtotal,
        tax: invoiceData.tax,
        total: invoiceData.total,
        status: invoiceData.status || 'pending',
        line_items: invoiceData.line_items
      };

      const params = {
        records: [updateableData]
      };

      const response = await apperClient.createRecord('invoice', params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);

        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} invoices:${JSON.stringify(failedRecords)}`);
          throw new Error('Failed to create invoice');
        }

        return successfulRecords[0]?.data;
      }
    } catch (error) {
      console.error('Error creating invoice:', error);
      throw error;
    }
  },

  async update(id, invoiceData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Filter to only include Updateable fields
      const updateableData = {
        Id: parseInt(id, 10),
        ...Object.fromEntries(
          Object.entries(invoiceData).filter(([key]) => 
            ['Name', 'Tags', 'Owner', 'event_id', 'invoice_number', 'date_issued', 'due_date', 'subtotal', 'tax', 'total', 'status', 'line_items'].includes(key)
          )
        )
      };

      const params = {
        records: [updateableData]
      };

      const response = await apperClient.updateRecord('invoice', params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);

        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} invoices:${JSON.stringify(failedUpdates)}`);
          throw new Error('Failed to update invoice');
        }

        return successfulUpdates[0]?.data;
      }
    } catch (error) {
      console.error('Error updating invoice:', error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        RecordIds: [parseInt(id, 10)]
      };

      const response = await apperClient.deleteRecord('invoice', params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedDeletions = response.results.filter(result => !result.success);

        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} invoices:${JSON.stringify(failedDeletions)}`);
          throw new Error('Failed to delete invoice');
        }

        return true;
      }
    } catch (error) {
      console.error('Error deleting invoice:', error);
      throw error;
    }
  }
};

export default invoiceService;
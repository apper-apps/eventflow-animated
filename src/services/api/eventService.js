const eventService = {
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
          { field: { Name: "title" } },
          { field: { Name: "date" } },
          { field: { Name: "location" } },
          { field: { Name: "guest_count" } },
          { field: { Name: "status" } },
          { field: { Name: "total_cost" } },
          { field: { Name: "notes" } },
          { field: { Name: "menu_items" } }
        ],
        orderBy: [
          {
            fieldName: "date",
            sorttype: "DESC"
          }
        ]
      };

      const response = await apperClient.fetchRecords('event', params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      console.error('Error fetching events:', error);
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
          { field: { Name: "title" } },
          { field: { Name: "date" } },
          { field: { Name: "location" } },
          { field: { Name: "guest_count" } },
          { field: { Name: "status" } },
          { field: { Name: "total_cost" } },
          { field: { Name: "notes" } },
          { field: { Name: "menu_items" } }
        ]
      };

      const response = await apperClient.getRecordById('event', parseInt(id, 10), params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching event with ID ${id}:`, error);
      throw error;
    }
  },

  async create(eventData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Filter to only include Updateable fields
      const updateableData = {
        Name: eventData.Name,
        Tags: eventData.Tags,
        Owner: eventData.Owner,
        title: eventData.title,
        date: eventData.date,
        location: eventData.location,
        guest_count: eventData.guest_count,
        status: eventData.status || 'planning',
        total_cost: eventData.total_cost,
        notes: eventData.notes,
        menu_items: eventData.menu_items
      };

      const params = {
        records: [updateableData]
      };

      const response = await apperClient.createRecord('event', params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);

        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} events:${JSON.stringify(failedRecords)}`);
          throw new Error('Failed to create event');
        }

        return successfulRecords[0]?.data;
      }
    } catch (error) {
      console.error('Error creating event:', error);
      throw error;
    }
  },

  async update(id, eventData) {
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
          Object.entries(eventData).filter(([key]) => 
            ['Name', 'Tags', 'Owner', 'title', 'date', 'location', 'guest_count', 'status', 'total_cost', 'notes', 'menu_items'].includes(key)
          )
        )
      };

      const params = {
        records: [updateableData]
      };

      const response = await apperClient.updateRecord('event', params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);

        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} events:${JSON.stringify(failedUpdates)}`);
          throw new Error('Failed to update event');
        }

        return successfulUpdates[0]?.data;
      }
    } catch (error) {
      console.error('Error updating event:', error);
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

      const response = await apperClient.deleteRecord('event', params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedDeletions = response.results.filter(result => !result.success);

        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} events:${JSON.stringify(failedDeletions)}`);
          throw new Error('Failed to delete event');
        }

        return true;
      }
    } catch (error) {
      console.error('Error deleting event:', error);
      throw error;
    }
  }
};

export default eventService;
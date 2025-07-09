const menuItemService = {
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
          { field: { Name: "category" } },
          { field: { Name: "price" } },
          { field: { Name: "unit" } },
          { field: { Name: "dietary" } },
          { field: { Name: "description" } }
        ],
        orderBy: [
          {
            fieldName: "category",
            sorttype: "ASC"
          }
        ]
      };

      const response = await apperClient.fetchRecords('menu_item', params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      console.error('Error fetching menu items:', error);
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
          { field: { Name: "category" } },
          { field: { Name: "price" } },
          { field: { Name: "unit" } },
          { field: { Name: "dietary" } },
          { field: { Name: "description" } }
        ]
      };

      const response = await apperClient.getRecordById('menu_item', parseInt(id, 10), params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching menu item with ID ${id}:`, error);
      throw error;
    }
  },

  async create(menuItemData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Filter to only include Updateable fields
      const updateableData = {
        Name: menuItemData.Name,
        Tags: menuItemData.Tags,
        Owner: menuItemData.Owner,
        category: menuItemData.category,
        price: menuItemData.price,
        unit: menuItemData.unit,
        dietary: menuItemData.dietary,
        description: menuItemData.description
      };

      const params = {
        records: [updateableData]
      };

      const response = await apperClient.createRecord('menu_item', params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);

        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} menu items:${JSON.stringify(failedRecords)}`);
          throw new Error('Failed to create menu item');
        }

        return successfulRecords[0]?.data;
      }
    } catch (error) {
      console.error('Error creating menu item:', error);
      throw error;
    }
  },

  async update(id, menuItemData) {
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
          Object.entries(menuItemData).filter(([key]) => 
            ['Name', 'Tags', 'Owner', 'category', 'price', 'unit', 'dietary', 'description'].includes(key)
          )
        )
      };

      const params = {
        records: [updateableData]
      };

      const response = await apperClient.updateRecord('menu_item', params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);

        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} menu items:${JSON.stringify(failedUpdates)}`);
          throw new Error('Failed to update menu item');
        }

        return successfulUpdates[0]?.data;
      }
    } catch (error) {
      console.error('Error updating menu item:', error);
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

      const response = await apperClient.deleteRecord('menu_item', params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedDeletions = response.results.filter(result => !result.success);

        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} menu items:${JSON.stringify(failedDeletions)}`);
          throw new Error('Failed to delete menu item');
        }

        return true;
      }
    } catch (error) {
      console.error('Error deleting menu item:', error);
      throw error;
    }
  }
};

export default menuItemService;
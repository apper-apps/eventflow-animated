import menuItemData from '../mockData/menuItems.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let menuItems = [...menuItemData];

export const menuItemService = {
  async getAll() {
    await delay(300);
    return [...menuItems];
  },

  async getById(id) {
    await delay(200);
    const menuItem = menuItems.find(m => m.Id === parseInt(id, 10));
    if (!menuItem) {
      throw new Error('Menu item not found');
    }
    return { ...menuItem };
  },

  async getByCategory(category) {
    await delay(250);
    return menuItems.filter(m => m.category === category);
  },

  async getByIds(ids) {
    await delay(200);
    const intIds = ids.map(id => parseInt(id, 10));
    return menuItems.filter(m => intIds.includes(m.Id));
  },

  async create(menuItemData) {
    await delay(400);
    const newId = Math.max(...menuItems.map(m => m.Id), 0) + 1;
    const newMenuItem = {
      ...menuItemData,
      Id: newId
    };
    menuItems.push(newMenuItem);
    return { ...newMenuItem };
  },

  async update(id, menuItemData) {
    await delay(350);
    const index = menuItems.findIndex(m => m.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('Menu item not found');
    }
    const updatedMenuItem = {
      ...menuItems[index],
      ...menuItemData,
      Id: menuItems[index].Id // Prevent Id modification
    };
    menuItems[index] = updatedMenuItem;
    return { ...updatedMenuItem };
  },

  async delete(id) {
    await delay(250);
    const index = menuItems.findIndex(m => m.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('Menu item not found');
    }
    const deletedMenuItem = menuItems[index];
    menuItems.splice(index, 1);
    return { ...deletedMenuItem };
  },

  async searchByName(query) {
    await delay(200);
    const lowerQuery = query.toLowerCase();
    return menuItems.filter(m => 
      m.name.toLowerCase().includes(lowerQuery) ||
      m.description.toLowerCase().includes(lowerQuery)
    );
  }
};

export default menuItemService;
import invoiceData from '../mockData/invoices.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let invoices = [...invoiceData];

export const invoiceService = {
  async getAll() {
    await delay(300);
    return [...invoices];
  },

  async getById(id) {
    await delay(200);
    const invoice = invoices.find(i => i.Id === parseInt(id, 10));
    if (!invoice) {
      throw new Error('Invoice not found');
    }
    return { ...invoice };
  },

  async getByEventId(eventId) {
    await delay(200);
    return invoices.filter(i => i.eventId === parseInt(eventId, 10));
  },

  async create(invoiceData) {
    await delay(400);
    const newId = Math.max(...invoices.map(i => i.Id), 0) + 1;
    const invoiceNumber = `INV-${new Date().getFullYear()}-${String(newId).padStart(3, '0')}`;
    
    const newInvoice = {
      ...invoiceData,
      Id: newId,
      invoiceNumber,
      dateIssued: new Date().toISOString(),
      status: 'pending'
    };
    invoices.push(newInvoice);
    return { ...newInvoice };
  },

  async update(id, invoiceData) {
    await delay(350);
    const index = invoices.findIndex(i => i.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('Invoice not found');
    }
    const updatedInvoice = {
      ...invoices[index],
      ...invoiceData,
      Id: invoices[index].Id // Prevent Id modification
    };
    invoices[index] = updatedInvoice;
    return { ...updatedInvoice };
  },

  async delete(id) {
    await delay(250);
    const index = invoices.findIndex(i => i.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('Invoice not found');
    }
    const deletedInvoice = invoices[index];
    invoices.splice(index, 1);
    return { ...deletedInvoice };
  },

  async getByStatus(status) {
    await delay(250);
    return invoices.filter(i => i.status === status);
  },

  async generateFromEvent(eventData, menuItems) {
    await delay(500);
    
    const lineItems = menuItems.map(item => ({
      menuItemId: item.Id,
      name: item.name,
      quantity: eventData.guestCount,
      unitPrice: item.price,
      total: item.price * eventData.guestCount
    }));

    const subtotal = lineItems.reduce((sum, item) => sum + item.total, 0);
    const tax = subtotal * 0.1; // 10% tax
    const total = subtotal + tax;

    const invoiceData = {
      eventId: eventData.Id,
      lineItems,
      subtotal,
      tax,
      total,
      dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString() // 15 days from now
    };

    return this.create(invoiceData);
  }
};

export default invoiceService;
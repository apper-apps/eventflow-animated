import eventData from '../mockData/events.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let events = [...eventData];

export const eventService = {
  async getAll() {
    await delay(300);
    return [...events];
  },

  async getById(id) {
    await delay(200);
    const event = events.find(e => e.Id === parseInt(id, 10));
    if (!event) {
      throw new Error('Event not found');
    }
    return { ...event };
  },

  async create(eventData) {
    await delay(400);
    const newId = Math.max(...events.map(e => e.Id), 0) + 1;
    const newEvent = {
      ...eventData,
      Id: newId,
      status: eventData.status || 'planning'
    };
    events.push(newEvent);
    return { ...newEvent };
  },

  async update(id, eventData) {
    await delay(350);
    const index = events.findIndex(e => e.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('Event not found');
    }
    const updatedEvent = {
      ...events[index],
      ...eventData,
      Id: events[index].Id // Prevent Id modification
    };
    events[index] = updatedEvent;
    return { ...updatedEvent };
  },

  async delete(id) {
    await delay(250);
    const index = events.findIndex(e => e.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('Event not found');
    }
    const deletedEvent = events[index];
    events.splice(index, 1);
    return { ...deletedEvent };
  },

  async getUpcoming() {
    await delay(200);
    const now = new Date();
    return events
      .filter(e => new Date(e.date) >= now)
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(0, 5);
  },

  async getByStatus(status) {
    await delay(250);
    return events.filter(e => e.status === status);
  }
};

export default eventService;
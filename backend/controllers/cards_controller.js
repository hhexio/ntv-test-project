const events = require('../data/cardsMock');

const generateId = () => {
  const MAX_RANDOM_RANGE = 10000;
  const id = (Math.random() * MAX_RANDOM_RANGE).toFixed();
  const idx = events.findIndex((el) => el.id === id);

  if (idx === -1) {
    return id;
  }

  generateId();
};

module.exports = (io) => {
  const readCards = () => {
    io.sockets.emit('get_data', events);
  };

  const createCard = (payload) => {
    const form = JSON.parse(payload);
    const id = generateId();

    if (id) {
      const fullData = { ...form, id };
      events.push(fullData);

      io.sockets.emit('created_data', fullData);
    }
  };

  const editCard = (payload) => {
    const form = JSON.parse(payload);
    const idx = events.findIndex((el) => el.id === +form.id);

    if (idx !== -1) {
      events[idx] = form;

      io.sockets.emit('changed_data', form);
    }
  };

  const removeCard = (id) => {
    const idx = events.findIndex((el) => el.id === id);

    if (idx !== -1) {
      events.splice(idx, 1);

      io.sockets.emit('removed_data', id);
    }
  };

  return {
    readCards,
    createCard,
    editCard,
    removeCard,
  };
};

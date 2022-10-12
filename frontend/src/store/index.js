import Vue from 'vue';
import Vuex from 'vuex';
import { io } from 'socket.io-client';
import { formMapper } from '@/utils/index'

export const socket = io('http://localhost:3030');

Vue.use(Vuex);



export default new Vuex.Store({
  state: {
    cards: [],
    lastEditedCard: null,

    addModalVisibility: false,
    editModalVisibility: false,
  },
  getters: {
    sortedByDateDesc: (state) => {
      return state.cards.sort(
        (a, b) => new Date(b.event_date) - new Date(a.event_date)
      );
    },
    sortedByGuestsCount: (state) => state.cards.sort((a, b) => b.guests_count - a.guests_count),
    sortedByAbout: (state) => state.cards.sort((a, b) => b.about.length - a.about.length),

  },
  mutations: {
    SET_STATE(state, payload) {
      Object.keys(payload).forEach((key) => {
        if (key in state) {
          state[key] = payload[key];
        }
      });
    },

    ADD_CARD(state, form) {
      const idx = state.cards.findIndex((el) => el.id === +form.id);

      if (idx === -1) {
        state.cards.push(form);
      }
    },

    EDIT_CARD(state, form) {
      const idx = state.cards.findIndex((el) => el.id === +form.id);

      if (idx !== -1) {
        state.cards.splice(idx, 1, form);
      }
    },

    FILTER_CARDS(state, id) {
      state.cards = state.cards.filter((el) => el.id !== id);
    },
  },
  actions: {
    init() {
      socket.emit('initial_data');
    },

    getCards({ commit, dispatch }) {
      dispatch('init');

      socket.on('get_data', (data) => {
        if (data?.length) {
          commit('SET_STATE', { cards: data });
        }
      });
    },

    removeCard(_, id) {
      socket.emit('remove_data', id);
    },

    createCard(_, payload) {
      const form = JSON.stringify(formMapper(payload));

      socket.emit('create_data', form);
    },

    editCard(_, { payload, id }) {
      let form = formMapper(payload);

      socket.emit('edit_data', JSON.stringify({ ...form, id }));
    },
  },
  modules: {},
});

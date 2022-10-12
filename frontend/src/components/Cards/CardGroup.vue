<template>
  <div>
    <div class="py-3 d-flex flex-row-reverse">
      <b-button variant="success" @click="openAddModal">Add card</b-button>
      <b-dropdown text="Sort by" variant="primary" class="mx-2">
        <b-dropdown-item @click="sortBy('sortedByDateDesc')"
           :active="isActiveSorting('sortedByDateDesc')">Event data</b-dropdown-item
        >
        <b-dropdown-item @click="sortBy('sortedByGuestsCount')"
           :active="isActiveSorting('sortedByGuestsCount')">Guests count</b-dropdown-item
        >
        <b-dropdown-item @click="sortBy('sortedByAbout')"
          :active="isActiveSorting('sortedByAbout')" >About</b-dropdown-item
        >
      </b-dropdown>
    </div>
    <b-row class="py-3" v-if="sortedCards && sortedCards.length">
      <b-col v-for="card in sortedCards" :key="card.id" sm="12" md="3">
        <card-item :data="card" />
      </b-col>
    </b-row>
    <div v-else class="text-center">
      <h3>List is empty</h3>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapActions } from 'vuex';
import { socket } from '@/store/index';
import CardItem from '@/components/Cards/CardItem.vue';
import { setCookie, getCookie } from '@/utils/index';

export default {
  components: { CardItem },

  data() {
    return {
      sortVal: '',
    };
  },

  computed: {
    sortedCards() {
      return this.$store.getters[this.sortVal];
    },

    isActiveSorting() {
      return (sort) => this.sortVal === sort
    }
  },

  methods: {
    ...mapActions(['getCards']),
    ...mapMutations(['SET_STATE', 'ADD_CARD', 'EDIT_CARD', 'FILTER_CARDS']),

    openAddModal() {
      this.SET_STATE({ addModalVisibility: true });
    },

    sortBy(sortVal) {
      this.sortVal = sortVal;
      setCookie('sortBy', sortVal, { secure: true, 'max-age': 3600 });
    },

    initSort() {
      const sortedCookie = getCookie('sortBy');

      this.sortVal = sortedCookie || 'sortedByDateDesc';
    },
  },

  mounted() {
    this.getCards();

    this.initSort();

    socket.on('created_data', (form) => {
      if (form?.id) {
        this.ADD_CARD(form);
      }
    });

    socket.on('changed_data', (form) => {
      const id = form?.id;

      if (id) {
        this.EDIT_CARD(form);
        this.SET_STATE({ lastEditedCard: id });
      }
    });

    socket.on('removed_data', (id) => {
      if (id) {
        this.FILTER_CARDS(id);
      }
    });
  },
};
</script>

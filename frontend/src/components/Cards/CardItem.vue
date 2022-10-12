<template>
  <b-card
    :title="data.title"
    tag="article"
    style="min-width: 100%"
    class="mb-2"
    :class="{'red-border': isEditedCard}"
  >
    <b-card-text>
      {{ data.about || '' }}
    </b-card-text>
    <b-card-text>
      <small>Guests count: {{ data.guests_count }}</small>
    </b-card-text>
    <b-card-text>
      <small>Event date: {{ data.event_date }}</small>
    </b-card-text>

    <b-button variant="primary" class="m-1" @click="edit"><b-icon-pencil-fill/></b-button>
    <b-button variant="danger" class="m-1" @click="remove"><b-icon-trash-fill/></b-button>
  </b-card>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex';
export default {
  props: {
    data: {
      type: Object,
    },
  },

  computed: {
    ...mapState({
      lastEditedCardId: (state) => state.lastEditedCard
    }),

    isEditedCard() {
      return this.lastEditedCardId === this.data.id
    }
  },

  methods: {
    ...mapActions(['removeCard']),
    ...mapMutations(['SET_STATE']),

    remove() {
      this.removeCard(this.data.id);
    },

    edit() {
      this.$router.push({ query: { edit: this.data.id } });
      this.SET_STATE({ addModalVisibility: true });
    },
  },
};
</script>

<style scoped>
.red-border {
  border: 2px solid red;
  box-sizing: border-box;
}
</style>
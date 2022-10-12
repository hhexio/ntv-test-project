<template>
  <b-modal
    v-model="visibily"
    title="Add card"
    @hidden="closeModal"
    @ok="handleOk"
  >
    <div class="d-block">
      <form ref="form" @submit.stop.prevent="handleSubmit">
        <b-form-group
          label="Title"
          label-for="title-input"
          invalid-feedback="Title is required"
          class="mb-2"
          :state="form.title.state"
        >
          <b-form-input
            id="title-input"
            v-model="form.title.value"
            :state="form.title.state"
            required
          ></b-form-input>
        </b-form-group>

        <b-form-group
          label="Event date"
          label-for="date-input"
          invalid-feedback="Event date is required"
          class="mb-2"
          :state="form.event_date.state"
        >
          <b-form-datepicker
            id="date-input"
            v-model="form.event_date.value"
            :state="form.event_date.state"
            required
          ></b-form-datepicker>
        </b-form-group>

        <b-form-group
          label="Guests count"
          label-for="guests-input"
          invalid-feedback="Guests is required"
          class="mb-2"
          :state="form.guests_count.state"
        >
          <b-form-input
            id="guests-input"
            type="number"
            v-model="form.guests_count.value"
            :state="form.guests_count.state"
            required
          ></b-form-input>
        </b-form-group>

        <b-form-group label="About" label-for="about-input" class="mb-2">
          <b-form-textarea id="about-input" v-model="form.about" />
        </b-form-group>
      </form>
    </div>
  </b-modal>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex';

export default {
  data() {
    return {
      visibily: false,

      id: null,

      form: {
        title: {
          value: '',
          state: null,
        },
        event_date: {
          value: '',
          state: null,
        },
        guests_count: {
          value: '',
          state: null,
        },
        about: '',
      },
    };
  },

  computed: {
    ...mapState({
      addModalVisibility: (state) => state.addModalVisibility,
      cards: (state) => state.cards,
    }),
  },

  watch: {
    addModalVisibility: {
      handler(val) {
        if (val) this.visibily = val;
      },
    },

    visibily: {
      handler(val) {
        if (val) {
          this.id = +this.$route.query.edit || null;

          if (this.id) {
            const formKeys = Object.keys(this.form);
            const foundCard = this.cards.find((el) => el.id === this.id);

            if (foundCard?.id) {
              formKeys.forEach((key) => {
                if (typeof this.form[key] !== 'string') {
                  this.form[key].value = foundCard[key];

                  return;
                }

                this.form[key] = foundCard[key];
              });
            }
          }
        }
      },
    },
  },

  methods: {
    ...mapActions(['createCard', 'editCard']),
    ...mapMutations(['SET_STATE']),

    setFormStates() {
      const formKeys = Object.keys(this.form);

      formKeys.forEach((key) => {
        if (typeof this.form[key] !== 'string' && !this.form[key].value) {
          this.form[key].state = false;
        }
      });
    },

    checkFormValidity() {
      const valid = this.$refs.form.checkValidity();

      this.setFormStates();

      return valid;
    },

    async handleSubmit() {
      if (!this.checkFormValidity()) {
        return;
      }

      if (this.id) {
        await this.editCard({ payload: this.form, id: this.id });
      } else {
        await this.createCard(this.form);
      }

      this.$nextTick(() => {
        this.closeModal();
      });
    },

    handleOk(bvModalEvent) {
      bvModalEvent.preventDefault();

      this.handleSubmit();
    },

    closeModal() {
      if (this.id) {
        this.$router.push({ query: {} });
      }

      this.visibily = false;
      this.SET_STATE({ addModalVisibility: false });

      const formKeys = Object.keys(this.form);

      formKeys.forEach((key) => {
        if (typeof this.form[key] !== 'string') {
          this.form[key].value = '';
          this.form[key].state = null;

          return;
        }

        this.form[key] = '';
      });
    },
  },
};
</script>

<template>
  <b-container>
    <card-group />
    <card-modal />
  </b-container>
</template>

<script>
import CardGroup from '@/components/Cards/CardGroup.vue';
import CardModal from '@/components/Modals/CardModal.vue';

export default {
  components: { CardGroup, CardModal },
};
</script>

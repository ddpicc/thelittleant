<template>
  <v-footer
    id="core-footer"
    height="42"
  >
    
    <v-spacer />
    <span class="font-weight-light copyright">
      &copy;
      {{ (new Date()).getFullYear() }}
      <v-icon
        color="red"
        size="17"
      >mdi-heart</v-icon>
      抱抱转运
    </span>
  </v-footer>
</template>

<script>
  export default {
    data: () => ({
      
    })
  }
</script>

<style>
#core-footer {
  z-index: 0;
}
</style>

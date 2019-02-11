<template>
  <div>
    <!-- <h1>toutou</h1> -->
  </div>
</template>

<script>
export default {
  name: 'Header',
  props: {
    isActive: {
      type: Boolean,
      default: false
    },
    toggleClick: {
      type: Function,
      default: null
    }
  }
}
</script>

<style scoped>

</style>

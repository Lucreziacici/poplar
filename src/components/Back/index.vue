<template>
  
      <i class="el-icon-arrow-left" @click="back">返回</i>
      
  
</template>

<script>
export default {
  name: 'Back',
  props: {},
  data() {
    return {
      visible: false,
      interval: null,
      isMoving: false
    }
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll)
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.handleScroll)
    if (this.interval) {
      clearInterval(this.interval)
    }
  },
  methods: {
    back(){
      if (window.history.length <= 1) {
                this.$router.push({path:'/'})
                return false
            } else {
                this.$router.go(-1)
            }
    }
  }
}
</script>

<style scoped>
  .back-to-ceiling {
    position: fixed;
    display: inline-block;
    text-align: center;
    cursor: pointer;
  }

  .back-to-ceiling:hover {
    background: #d5dbe7;
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: opacity .5s;
  }

  .fade-enter,
  .fade-leave-to {
    opacity: 0
  }

  .back-to-ceiling .Icon {
    fill: #9aaabf;
    background: none;
  }
</style>

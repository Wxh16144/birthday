<template lang="pug">
  div(id="app")
    router-view
</template>

<style lang="stylus">
@import '~@/public/stylus/variable.styl'
#app
  width 100vw
  height 100vh
  position relative
  top 0
  left 0
  background-color backgroundColor
@media (min-width: 991.98px)
  #app
    margin 0 auto
    width 991.98px
</style>

<template>
  <div class="container">
    <NavMenu></NavMenu>
    <MainContainer></MainContainer>
  </div>
</template>

<script>
import NavMenu from './NavMenu.vue';
import MainContainer from './MainContainer.vue';

export default {
  name: 'container',
  components: {
    NavMenu,
    MainContainer,
  },
};
</script>

<style lang="scss" scoped>
.container {
  height: 100%;
  width: 100%;
  position: relative;
}
</style>

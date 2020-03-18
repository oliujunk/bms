<template>
  <div class="main-container">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'mainContainer',
};
</script>

<style>
.main-container {
  height: 100%;
  right: 0;
  left: 200px;
  position: absolute;
}
</style>

<template>
  <div class="nav-menu">
    <el-menu
      :default-active="$route.path"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b"
      :collapse="$store.state.collapse"
      :collapse-transition="false"
    >
      <el-menu-item index="/edit" @click="$router.push('edit')">
        <i class="el-icon-edit"></i>
        <span slot="title">程序编辑</span>
      </el-menu-item>
      <el-menu-item index="/test" @click="$router.push('test')">
        <i class="el-icon-check"></i>
        <span slot="title">程序测试</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script>
export default {
  name: 'navMenu',
};
</script>

<style lang="scss" scoped>
.nav-menu {
  position: absolute;
  height: 100%;
  width: 200px;
  left: 0;
}
.el-menu {
  text-align: center;
  height: 100%;
  border: 0;
  font-size: 20px;
}
</style>

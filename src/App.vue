<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: "App",
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
}
/* 全局样式  表格内容居中 */
.el-table--enable-row-transition .el-table__body td,
.el-table--border td, .el-table--border th {
  text-align: center;
}
</style>

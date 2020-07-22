<template>
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>{{title1}}</el-breadcrumb-item>
    <el-breadcrumb-item>{{title2}}</el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script>
export default {
    props:['title1','title2']
};
</script>

<style lang='less' scoped>
.el-breadcrumb{
    margin-bottom: 15px;
}
</style>
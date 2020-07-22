<template>
  <el-container class="home-container">
    <el-header>
      <div class="header_img">
        <img src="../assets/heima.png" alt />
        <span>电商后台管理系统</span>
      </div>
      <div>
        <el-button type="info" @click="logout">退出</el-button>
      </div>
    </el-header>
    <el-container>
      <el-aside :width="isCollapse?'64px':'200px'">
        <div class="collapse" @click="Collapse">|||</div>
        <el-menu
          background-color="#2e3440"
          text-color="#fff"
          active-text-color="#409eFF"
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="false"
          router
          :default-active="activePath"
        >
          <!-- 一级菜单 -->
          <el-submenu :index="item.id +''" v-for="item in menuList" :key="item.id">
            <template slot="title">
              <i :class="iconsObj[item.id]"></i>
              <span>{{item.authName}}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item
              :index="'/'+i.path"
              v-for="i in item.children"
              :key="i.id"
              @click="saveActivePath('/'+i.path)"
            >
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{i.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import welcome from "./Welcome";
export default {
  data() {
    return {
      menuList: [],
      iconsObj: {
        "125": "iconfont icon-users",
        "103": "iconfont icon-lock_fill",
        "101": "iconfont icon-shangpin",
        "102": "iconfont icon-danju",
        "145": "iconfont icon-baobiao"
      },
      isCollapse: false,
      activePath: ""
    };
  },
  created() {
    this.getMenuList();
    this.activePath = window.sessionStorage.getItem("activePath");
  },
  components: {
    welcome
  },
  methods: {
    async getMenuList() {
      const { data: res } = await this.$http.get("menus");
      /*  console.log(res); */
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.menuList = res.data;
    },
    logout() {
      window.sessionStorage.clear();
      this.$router.push("/login");
    },
    Collapse() {
      this.isCollapse = !this.isCollapse;
    },
    saveActivePath(activePath) {
      window.sessionStorage.setItem("activePath", activePath);
      this.activePath=activePath
    }
  }
};
</script>

<style lang='less' scoped>
.home-container {
  height: 100%;
}
.el-header {
  background-color: #31373a;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 0;
  font-size: 20px;
  color: #fff;
  .header_img {
    display: flex;
    align-items: center;
    span {
      margin-left: 15px;
    }
  }
}
.el-aside {
  background-color: #2e3440;
  .el-menu {
    border-right: none;
  }
}
.el-main {
  background-color: #fbfefb;
}
.iconfont {
  margin-right: 10px;
}
.collapse {
  cursor: pointer;
  color: #fbfefb;
  background-color: #465062;
  text-align: center;
  font-size: 10px;
  line-height: 24px;
  letter-spacing: 0.2em;
}
</style>
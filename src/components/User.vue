<template>
  <div>
    <Header title1="用户管理" title2="用户列表" />
    <el-card>
      <div class="addUser">
        <el-input placeholder="请输入搜索内容" v-model="queryInfo.query" clearable @clear="getUser">
          <el-button slot="append" icon="el-icon-search" @click="getUser"></el-button>
        </el-input>
        <el-button type="primary" @click="dialogAddUserVisible = true">添加用户</el-button>
      </div>
      <!-- 用户列表 -->
      <el-table :data="userList" style="width: 100%" border stripe>
        <el-table-column type="index" width="50" label="#"></el-table-column>
        <el-table-column prop="username" label="姓名" width="120"></el-table-column>
        <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
        <el-table-column prop="mobile" label="电话" width="180"></el-table-column>
        <el-table-column prop="role_name" label="角色" width="180"></el-table-column>
        <el-table-column label="状态" width="180">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.mg_state"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="changeState(scope.row)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" icon="el-icon-edit" @click="editUser(scope.row)"></el-button>
            <el-button type="danger" size="mini" icon="el-icon-delete" @click="delUser(scope.row)"></el-button>
            <el-tooltip content="分配角色" placement="top" :enterable="false">
              <el-button type="warning" size="mini" icon="el-icon-setting"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 4, 8]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalPage"
      ></el-pagination>
    </el-card>
    <!-- 添加用户对话框 -->
    <el-dialog title="添加用户" :visible.sync="dialogAddUserVisible" @close="addDialogClosed">
      <el-form label-width="80px" :model="addUserInfo" :rules="addUserRules" ref="addUserRef">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addUserInfo.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addUserInfo.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addUserInfo.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addUserInfo.mobile"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="dialogAddUserVisible = false;">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 修改用户 -->
    <el-dialog title="修改用户" :visible.sync="dialogEditUserVisible" @close="editDialogClosed">
      <el-form label-width="80px" :model="editUserInfo" :rules="addUserRules" ref="editUserRef">
        <el-form-item label="用户名">
          <el-input disabled v-model="editUserInfo.username"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editUserInfo.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editUserInfo.mobile"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="dialogEditUserVisible = false;">取 消</el-button>
        <el-button type="primary" @click="confirmEditUser">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Header from "./Header";
export default {
  data() {
    var checkEmail = (rule, value, cb) => {
      const reg = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/;
      if (reg.test(value)) {
        return cb();
      } else {
        cb(new Error("邮箱格式不正确!"));
      }
    };
    var checkMobile = (rule, value, cb) => {
      const reg = /^((13[0-9])|(17[0-1,6-8])|(15[^4,\\D])|(18[0-9]))\d{8}$/;
      if (reg.test(value)) {
        return cb();
      } else {
        cb(new Error("手机号格式不正确!"));
      }
    };
    return {
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 2
      },
      userList: [],
      totalPage: 0,
      dialogAddUserVisible: false,
      addUserInfo: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      addUserRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 10, message: "长度在 3 到 10 个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, max: 15, message: "长度在 6 到 15 个字符", trigger: "blur" }
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" }
        ],
        mobile: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" }
        ]
      },
      dialogEditUserVisible: false,
      editUserInfo: {}
    };
  },
  created() {
    this.getUser();
  },
  methods: {
    async getUser() {
      const { data: res } = await this.$http.get("/users", {
        params: this.queryInfo
      });
      /* console.log(res); */
      if (res.meta.status !== 200) {
        return this.$message.error("获取用户列表失败");
      }
      this.userList = res.data.users;
      this.totalPage = res.data.total;
      /* console.log(this.userList); */
    },
    handleSizeChange(val) {
      this.queryInfo.pagesize = val;
      this.getUser();
      /* console.log("handleSizeChange", val); */
    },
    handleCurrentChange(val) {
      this.queryInfo.pagenum = val;
      this.getUser();
      /*   console.log("handleCurrentChange", val); */
    },
    async changeState(row) {
      const { data: res } = await this.$http.put(
        `users/${row.id}/state/${row.mg_state}`
      );
      if (res.meta.status !== 200) {
        row.mg_state = !row.mg_state;
        return this.$message.error("设置状态失败");
      }
      this.$message.success(res.meta.msg);
      /*  console.log(res); */
    },
    addUser() {
      this.$refs.addUserRef.validate(async valid => {
        if (!valid) return;
        const { data: res } = await this.$http.post("users", this.addUserInfo);
        if (res.meta.status !== 201) {
          /*  console.log(res); */
          this.$message.error("添加用户失败");
        }
        this.$message.success("添加用户成功");
        this.dialogAddUserVisible = false;
        this.getUser();
      });
    },
    addDialogClosed() {
      this.$refs.addUserRef.resetFields();
    },
    async editUser(user) {
      this.dialogEditUserVisible = true;
      // console.log(user);
      const { data: res } = await this.$http.get(`users/${user.id}`);
      if (res.meta.status !== 200) {
        return this.$message.error("查询用户失败");
      }
      this.editUserInfo = res.data;
    },
    editDialogClosed() {
      this.$refs.editUserRef.resetFields();
    },
    confirmEditUser() {
      this.$refs.editUserRef.validate(async valid => {
        if (!valid) return;
        const { id, email, mobile } = this.editUserInfo;
        const { data: res } = await this.$http.put(`users/${id}`, {
          email,
          mobile
        });
        if (res.meta.status !== 200) {
          return this.$message.error("修改用户失败");
        }
        this.$message.success("修改用户成功");
        this.dialogEditUserVisible = false;
        this.getUser();
      });
    },
    delUser(user) {
      this.$confirm("此操作将永久删除该用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          console.log(user);
          const { data: res } = await this.$http.delete(`users/${user.id}`);
          if (res.meta.status !== 200) {
            return this.$message.error("删除用户失败");
          }
          this.$message.success("删除用户成功");
          this.getUser();
          this.$message({
            type: "success",
            message: "删除成功!"
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    }
  },
  components: {
    Header
  }
};
</script>

<style lang='less' scoped>
.addUser {
  display: flex;

  .el-input {
    width: 400px;
  }
  > .el-button {
    margin-left: 20px;
  }
}
</style>
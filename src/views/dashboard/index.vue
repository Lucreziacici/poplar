<template>
  <div class="dashboard-editor-container">
    <div class=" clearfix">
      <pan-thumb :image="avatar" style="float: left;">
        <p style=" color:#333;">
          Thank you for playing my project.
          <span>*^_^*</span>
        </p>

      </pan-thumb>
      <div class="info-container">
        <span class="display_name">{{ name }}</span>
        <span style="font-size:20px;padding-top:20px;display:inline-block;"> {{$t("dashboard.welcome")}}</span>
      </div>
    </div>
    <panel-group v-permission="['supplier']" :num='datanum' />
    <div v-permission="['supplier_purchasing_agent','purchase-manager','developer']">
      <img :src="emptyGif" class="emptyGif">
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { GetHomepageStatistics } from "@/api/supplier";
import PanThumb from "@/components/PanThumb";
import PanelGroup from "./components/PanelGroup";
import permission from "@/directive/permission/index.js"; // 权限判断指令
import checkPermission from "@/utils/permission"; // 权限判断函数

export default {
  name: "DashboardEditor",

  components: { PanThumb, PanelGroup },
  directives: { permission },
  data() {
    return {
      emptyGif:
        "https://wpimg.wallstcn.com/0e03b7da-db9e-4819-ba10-9016ddfdaed3",
      datanum: {}
    };
  },
  computed: {
    ...mapGetters(["name", "avatar", "roles"])
  },
  created() {
    const n = this.roles.some(f => f == "supplier");
    if (n) {
      this.GetHomepage();
    }
  },
  methods: {
    GetHomepage() {
      GetHomepageStatistics().then(response => {
        if (response.data.res_status_code == 0) {
          this.datanum = response.data.res_content;
        } else {
          this.$message({
            type: "error",
            message: response.data.res_message
          });
        }
      });
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.emptyGif {
  display: block;
  width: 45%;
  margin: 0 auto;
}

.dashboard-editor-container {
  background-color: #e3e3e3;
  min-height: 100vh;
  padding: 50px 60px 0px;
  .pan-info-roles {
    font-size: 12px;
    font-weight: 700;
    color: #333;
    display: block;
  }
  .info-container {
    position: relative;
    margin-left: 190px;
    height: 150px;
    line-height: 200px;
    .display_name {
      font-size: 48px;
      line-height: 48px;
      color: #212121;
      position: absolute;
      top: 25px;
    }
  }
}
</style>

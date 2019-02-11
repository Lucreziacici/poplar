<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input :placeholder="$t('addSupplierinfo.name')" clearable v-model="listQuery.name" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.status" clearable :placeholder="$t('supplierInfo.status')" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter">
        <el-option v-for="item in status_list" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
      <el-select v-model="listQuery.brand_status" clearable :placeholder="$t('supplierInfo.brand_status')" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter">
        <el-option v-for="item in brand_status_list" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{$t('button.search')}}</el-button>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-plus" @click="handleCreate">{{$t('button.add')}}</el-button>
    </div>
    <Header></Header>
    <el-table v-loading="listLoading" :key="tableKey" :data="list" border fit highlight-current-row style="width: 100%;" height="600" @sort-change="sortChange">
      <el-table-column :label="$t('table.No')" prop="id" type="index" align="center">
      </el-table-column>
      <el-table-column :label="$t('addSupplierinfo.name')" prop="name" sortable="custom" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('addSupplierinfo.enterprice_code')" prop="enterprice_code" sortable="custom" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.enterprice_code}}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('addSupplierinfo.address')" prop="address" sortable="custom" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.address}}</span>
        </template>

      </el-table-column>
      <el-table-column :label="$t('addSupplierinfo.contacts')" prop="contacts" sortable="custom" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.contacts}}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('addSupplierinfo.phone')" prop="phone" sortable="custom" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.phone}}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('supplierInfo.status')" prop="status" sortable="custom" align="center">
        <template slot-scope="scope">
          <el-tag type="primary" v-if="scope.row.status=='10'">{{$t('tag.new')}}</el-tag>
          <el-tag type="success" v-if="scope.row.status=='20'">{{$t('tag.passed')}}</el-tag>
          <el-tag type="danger" v-if="scope.row.status=='30'">{{$t('tag.fail')}}</el-tag>
          <el-tag type="danger" v-if="scope.row.status=='40'">{{$t('tag.close')}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="$t('supplierInfo.brand_status')" align="center">
        <template slot-scope="scope">
          <el-tag type="success" v-if="scope.row.brand_status_name=='全部已审核'">{{$t('tag.allcheck')}}</el-tag>
          <el-tag type="warning" v-if="scope.row.brand_status_name=='全部未审核'">{{$t('tag.unaudited')}}</el-tag>
          <el-tag type="warning" v-if="scope.row.brand_status_name=='部分审核'">{{$t('tag.audit')}}</el-tag>
          <!-- <span>{{ scope.row.brand_status_name }}</span> -->
        </template>
      </el-table-column>
      <el-table-column :label="$t('supplierInfo.brand')" align="center">
        <template slot-scope="scope">
          <router-link :to="{name:'brandList',query:{id:scope.row.id}}">
            <svg-icon icon-class="link" /> &nbsp;&nbsp;&nbsp;{{$t('supplierInfo.look_brand')}}</router-link>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.operate')" fixed="right" align="center" width="250" class-name="small-padding">
        <template slot-scope="scope">
          <el-button v-permission="['supplier_purchasing_agent','purchase-manager','developer']" type="primary" size="mini" icon="el-icon-edit" @click="handleCheck(scope.row)">{{$t('button.check')}}</el-button>
          <el-button type="primary" size="mini" icon="el-icon-edit" @click="handleUpdate(scope.row)">{{$t('button.edit')}}</el-button>
        </template>
      </el-table-column>

    </el-table>
    <el-dialog :title="$t('dialog.check_title')" :visible.sync="dialogFormVisible" :append-to-body="true">
      <el-form ref="formdata" :rules="rules" :model="formdata" label-position="left" label-width="100px">
        <el-form-item :label="$t('brandlist.status')" prop="status">
          <el-checkbox :label="$t('brandlist.pass')" true-label="20" false-label="0" v-model="formdata.status" name="status"></el-checkbox>
          <el-checkbox :label="$t('brandlist.fail')" true-label="30" false-label="0" v-model="formdata.status" name="status"></el-checkbox>
        </el-form-item>
        <el-form-item :label="$t('brandlist.remark')" prop="remark">
          <el-input v-model="formdata.remark" type="textarea"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{$t('button.cancel')}}</el-button>
        <el-button type="primary" @click="checkData()">{{$t('button.submit')}}</el-button>
      </div>
    </el-dialog>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page_no" :limit.sync="listQuery.page_size" @pagination="getList" />
  </div>
</template>

<script>
import { GetSupplierList, AuditingSupplier } from "@/api/supplier";
import waves from "@/directive/waves"; // Waves directive
import permission from "@/directive/permission/index.js"; // 权限判断指令
import checkPermission from "@/utils/permission"; // 权限判断函数
import { parseTime } from "@/utils";
import Pagination from "@/components/Pagination"; // Secondary package based on el-pagination


export default {
  name: "supplier_list",
  components: { Pagination },
  directives: { waves, permission },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        name: "",
        status: "",
        page_size: 20,
        page_no: 1,
        order_by: "",
        direction: ""
      },
      dialogFormVisible: false,
      formdata: {},
    };
  },
  computed: {
    rules: function() {
      var checkremark = (rule, value, callback) => {
        setTimeout(() => {
          if (this.formdata.status == "30" && value == "") {
            callback(new Error(this.$t("brandlist.reject_rule")));
          } else {
            callback();
          }
        }, 100);
      };
      const rules = {
        remark: [{ trigger: "focus", validator: checkremark }]
      };
      return rules;
    },
    status_list: function() {
      const arr = [
        {
          label: this.$t("tag.new"),
          value: "10"
        },
        {
          label: this.$t("tag.passed"),
          value: "20"
        },
        {
          label: this.$t("tag.fail"),
          value: "30"
        },
        {
          label: this.$t("tag.close"),
          value: "40"
        }
      ];
      return arr;
    },
    brand_status_list:function(){
      const arr =  [
        {
          label: this.$t("tag.allcheck"),
          value: "1"
        },
        {
          label: this.$t("tag.audit"),
          value: "2"
        },
        {
          label: this.$t("tag.unaudited"),
          value: "3"
        }
      ];
      return arr;
    }
  },
  created() {
    this.getList();
  },
  methods: {
    // 获取列表
    getList() {
      this.listLoading = true;
      GetSupplierList(this.listQuery).then(response => {
        this.listLoading = false;
        if (response.data.res_status_code == 0) {
          this.supplier = response.data.res_content;
          this.list = response.data.res_content.data_list;
          this.total = response.data.res_content.total_count;
        } else {
          this.$message({
            type: "error",
            message: response.data.res_message
          });
        }
      });
    },

    // 新增跳转
    handleCreate() {
      this.$router.push({ name: "addSupplierinfo" });
    },
    // 更新数据
    handleUpdate(row) {
      this.$router.push({
        name: "addSupplierinfo",
        query: {
          id: row.id
        }
      });
    },
    // 审核
    handleCheck(row) {
      this.formdata = Object.assign({}, row);
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["formdata"].clearValidate();
      });
    },
    // 审核
    checkData() {
      this.$refs["formdata"].validate(valid => {
        if (valid) {
          AuditingSupplier(this.formdata).then(response => {
            if (response.data.res_status_code == 0) {
              this.$message({
                type: "success",
                message: this.$t("message.savesuccess")
              });
              this.dialogFormVisible = false;
              this.getList();
            } else {
              this.$message({
                type: "error",
                message: response.data.res_message
              });
            }
          });
        }
      });
    },
    sortChange(data) {
      const { prop, order } = data;
      if (order == "descending") {
        this.listQuery.direction = "desc";
      } else if (order == "ascending") {
        this.listQuery.direction = "asc";
      } else {
        this.listQuery.direction = "";
      }
      this.listQuery.order_by = prop;
      this.getList();
    },
    handleFilter() {
      this.listQuery.page_no = 1;
      this.getList();
    }
  }
};
</script>

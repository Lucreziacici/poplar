<template>
  <div class="app-container" v-loading="listLoading">
    <div class="filter-container">
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-plus" @click="handleCreate">{{$t('button.add')}}</el-button>
    </div>
    <el-collapse v-model="activeNames">
      <el-collapse-item :title="$t('addSupplierinfo.companyinformation')" name="1">
        <div>
          <el-col :span="8">
            <div>{{$t('addSupplierinfo.name')}}：{{supplier.name}}</div>
          </el-col>

          <el-col :span="8">
            <div>{{$t('addSupplierinfo.address')}}：{{supplier.address}}</div>
          </el-col>
          <el-col :span="8">
            <div>{{$t('addSupplierinfo.email')}}：{{supplier.email}}</div>
          </el-col>
        </div>
        <div v-if="supplier.supplier_type=='2'">
          <el-col :span="8">
            <div>{{$t('addSupplierinfo.contacts')}}：{{supplier.contacts}}</div>
          </el-col>
          <el-col :span="8">
            <div>{{$t('addSupplierinfo.enterprice_code')}}：{{supplier.enterprice_code}}</div>
          </el-col>
          <el-col :span="8">
            <div>{{$t('addSupplierinfo.phone')}}：{{supplier.phone}}</div>
          </el-col>
        </div>
      </el-collapse-item>

    </el-collapse>
    <el-table :key="tableKey" :data="list" border fit highlight-current-row style="width: 100%;" height="600">
      <el-table-column :label="$t('table.No')" prop="id" type="index" align="center">
      </el-table-column>
      <el-table-column :label="$t('brandlist.brand_name')" prop="brand_name" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.brand_name}}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('brandlist.authorization_file_url')" align="center">
        <template slot-scope="scope">
          <a target="view_window" :href="scope.row.authorization_file_url">{{$t('brandlist.look')}}</a>
        </template>

      </el-table-column>
      <el-table-column :label="$t('brandlist.validity_term')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.validity_term_from}}/{{ scope.row.validity_term_to}}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('brandlist.validity_status')" align="center">
        <template slot-scope="scope">
          <el-tag type="warning" v-if="scope.row.validity_status==0">{{$t('tag.invalid')}}</el-tag>
          <el-tag type="success" v-if="scope.row.validity_status==1">{{$t('tag.valid')}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="$t('brandlist.status')" align="center">
        <template slot-scope="scope">
          <el-tag type="warning" v-if="scope.row.status==0">{{$t('tag.unreviewed')}}</el-tag>
          <el-tag type="success" v-if="scope.row.status==1">{{$t('tag.passed')}}</el-tag>
          <el-tag type="danger" v-if="scope.row.status==2">{{$t('tag.fail')}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="$t('brandlist.remark')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.remark}}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.operate')" fixed="right" align="center" width="300" class-name="small-padding">
        <template slot-scope="scope">
          <el-button type="primary" v-permission="['supplier_purchasing_agent','purchase-manager','developer']" size="mini" icon="el-icon-edit" @click="handleCheck(scope.row)">{{$t('button.check')}}</el-button>
          <el-button type="primary" size="mini" icon="el-icon-edit" @click="handleUpdate(scope.row)">{{$t('button.edit')}}</el-button>
          <el-button size="mini" icon="el-icon-delete" type="danger" @click="handleDelete(scope.row,'deleted')">{{$t('button.delete')}}
          </el-button>

        </template>
      </el-table-column>
    </el-table>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" :append-to-body="true">
      <log :id="formdata.id" :type="'supplier_brand'"></log>
      <el-form ref="formdata" :rules="rules" :model="formdata" label-position="left" label-width="140px">
        <el-form-item :label="$t('brandlist.brand_name')" prop="brand_name">
          <el-input v-model="formdata.brand_name" />
        </el-form-item>
        <el-form-item :label="$t('brandlist.authorization_file_url')" prop="authorization_file_url">
          <UploadFile v-if="dialogFormVisible" :files="formdata.authorization_file_url" :maxFiles="1" v-on:changeFile="changeFile"></UploadFile>
        </el-form-item>
        <el-form-item :label="$t('brandlist.validity_term_from')" prop="validity_term_from">
          <el-date-picker type="date" :placeholder="$t('input.date')" v-model="formdata.validity_term_from" style="width: 100%;"></el-date-picker>
        </el-form-item>
        <el-form-item :label="$t('brandlist.validity_term_to')" prop="validity_term_to">
          <el-date-picker type="date" :placeholder="$t('input.date')" v-model="formdata.validity_term_to" style="width: 100%;"></el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{$t('button.cancel')}}</el-button>
        <el-button v-permission="['supplier','developer']" type="primary" @click="createData()">{{$t('button.submit')}}</el-button>
      </div>
    </el-dialog>
    <el-dialog :title="$t('dialog.check_title')" :visible.sync="dialogFormVisible1" :append-to-body="true">
      <el-form ref="formdata1" :rules="rules1" :model="formdata1" label-position="left" label-width="100px">
        <el-form-item :label="$t('brandlist.status')" prop="status">
          <el-checkbox :label="$t('brandlist.pass')" true-label="1" false-label="0" v-model="formdata1.status" name="status"></el-checkbox>
          <el-checkbox :label="$t('brandlist.fail')" true-label="2" false-label="0" v-model="formdata1.status" name="status"></el-checkbox>
        </el-form-item>
        <el-form-item :label="$t('brandlist.remark')" prop="remark">
          <el-input v-model="formdata1.remark" type="textarea"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible1 = false">{{$t('button.cancel')}}</el-button>
        <el-button type="primary" @click="checkData()">{{$t('button.submit')}}</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import {
  SaveSupplierBrandInfo,
  GetSupplierBrandInfo,
  AuditingSupplierBrand
} from "@/api/supplier";
import waves from "@/directive/waves"; // Waves directive
import permission from "@/directive/permission/index.js"; // 权限判断指令
import checkPermission from "@/utils/permission"; // 权限判断函数
import UploadFile from "@/components/UploadFile";
import Log from "@/components/Log";

export default {
  name: "brandList",
  components: { Log, UploadFile },
  directives: { waves, permission },
  data() {
    return {
      tableKey: 0,
      total: 0,
      listLoading: true, //加载loading
      formdata: {
        id: 0,
        brand_name: "",
        authorization_file_url: "",
        validity_term_from: "",
        validity_term_to: "",
        validity_status: ""
      }, //品牌值
      formdata1: {},
      list: [], //品牌列表
      supplier: {}, //供应商信息
      dialogFormVisible1: false,
      dialogFormVisible: false, //弹出框是否显示
      dialogStatus: "", //弹出框类型 新建or编辑
      textMap: {
        update: this.$t("dialog.edit_title"),
        create: this.$t("dialog.add_title")
      },
      downloadLoading: false, //上传loading
      activeNames: ["1"]
    };
  },
  computed: {
    rules: function() {
      const rules = {
        brand_name: [
          {
            required: true,
            message: this.$t("brandlist.brand_name_rule"),
            trigger: "blur"
          }
        ],
        validity_term_from: [
          {
            required: true,
            message: this.$t("brandlist.validity_term_from_rule"),
            trigger: "blur"
          }
        ],
        validity_term_to: [
          {
            required: true,
            message: this.$t("brandlist.validity_term_from_rule"),
            trigger: "blur"
          }
        ],
        authorization_file_url: [
          {
            required: true,
            message: this.$t("brandlist.authorization_file_url_rule"),
            trigger: "focus"
          }
        ]
      };
      return rules;
    },
    rules1: function() {
      var checkremark = (rule, value, callback) => {
        setTimeout(() => {
          if (this.formdata1.status == "2" && this.formdata1.remark == "") {
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
    }
  },
  created() {
    if (this.$route.query.id) {
      this.supplier_id = this.$route.query.id;
      this.formdata.supplier_id = this.$route.query.id;
    }
    // 获取信息
    this.getInfo();
  },
  methods: {
    // 获取供应商信息，品牌信息
    getInfo() {
      this.listLoading = true;
      GetSupplierBrandInfo({ supplier_id: this.supplier_id }).then(response => {
        this.listLoading = false;
        if (response.data.res_status_code == 0) {
          this.supplier = response.data.res_content;
          this.list = response.data.res_content.brands;
        } else {
          this.$message({
            type: "error",
            message: response.data.res_message
          });
        }
      });
    },
    changeFile(i) {
      this.formdata.authorization_file_url = i;
    },
    //  删除
    handleDelete(row, status) {
      this.$confirm(this.$t("confirm.delconfirm"), this.$t("confirm.hint"), {
        confirmButtonText: this.$t("confirm.ensure"),
        cancelButtonText: this.$t("confirm.cancel"),
        type: "warning"
      })
        .then(() => {
          row.action_flg = 2;
          SaveSupplierBrandInfo(row).then(response => {
            if (response.data.res_status_code == 0) {
              this.$message({
                type: "info",
                message: this.$t("message.delsuc")
              });
              this.dialogFormVisible = false;
              this.getInfo();
            } else {
              this.$message({
                type: "error",
                message: response.data.res_message
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: this.$t("message.cancel")
          });
        });
    },
    // 初始化form
    resetFormdata() {
      this.formdata = {
        id: 0,
        brand_name: "",
        authorization_file_url: "",
        validity_term_from: "",
        validity_term_to: "",
        validity_status: ""
      };
    },
    // 新增 弹出model
    handleCreate() {
      this.resetFormdata();
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["formdata"].clearValidate();
      });
    },
    // 新增品牌
    createData() {
      this.$refs["formdata"].validate(valid => {
        if (valid) {
          if (this.dialogStatus == "create") {
            this.formdata.action_flg = 0;
            this.formdata.supplier_id = this.supplier_id;
          } else if (this.dialogStatus == "update") {
            this.formdata.action_flg = 1;
          }
          SaveSupplierBrandInfo(this.formdata).then(response => {
            if (response.data.res_status_code == 0) {
              this.$message({
                type: "success",
                message: this.$t("message.savesuccess")
              });
              this.dialogFormVisible = false;
              this.getInfo();
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
    // 编辑
    handleUpdate(row) {
      this.formdata = Object.assign({}, row); // copy obj
      this.dialogStatus = "update";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["formdata"].clearValidate();
      });
    },
    // 审核
    handleCheck(row) {
      this.formdata1 = Object.assign({}, row);
      this.dialogFormVisible1 = true;
      this.$nextTick(() => {
        this.$refs["formdata1"].clearValidate();
      });
    },
    // 审核
    checkData() {
      this.$refs["formdata1"].validate(valid => {
        if (valid) {
          AuditingSupplierBrand(this.formdata1).then(response => {
            if (response.data.res_status_code == 0) {
              this.$message({
                type: "success",
                message: this.$t("message.savesuccess")
              });
              this.dialogFormVisible1 = false;
              this.getInfo();
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
    // 编辑保存
    updateData() {
      console.log("bbb");
      this.$refs["formdata"].validate(valid => {
        if (valid) {
          const brand = Object.assign({}, this.formdata);
          brand.action_flg = 1;
          SaveSupplierBrandInfo(brand).then(response => {
            if (response.data.res_status_code == 0) {
              this.$message({
                type: "success",
                message: this.$t("message.savesuccess")
              });
              this.dialogFormVisible = false;
              this.getInfo();
            } else {
              this.$message({
                type: "error",
                message: response.data.res_message
              });
            }
          });
        }
      });
    }
  }
};
</script>

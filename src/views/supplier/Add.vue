
<template>
  <el-row style="padding:20px">
    <log :id="supplier_id" :type="'supplier_base'"></log>
    <el-col :span="8">
      <el-card shadow="hover">
        <div slot="header" class="flex_between_center">
          <span>{{$t('addSupplierinfo.companyinformation')}}</span>
          <el-button v-show="supplier_id" size="mini" @click="Linkto()">
            <router-link :to="{name:'brandList',query:{id:supplier_id}}">
              <svg-icon icon-class="link" /> {{$t('addSupplierinfo.addbrand')}}</router-link>
          </el-button>
        </div>
        <el-alert :title="$t('alert.title')" type="warning" :description="$t('addSupplierinfo.tips')" show-icon>
        </el-alert>
        <el-form :model="formdata" :rules="supplier_rules" ref="ruleForm" label-width="150px" class="demo-ruleForm">
          <el-form-item :label="$t('addSupplierinfo.supplier_type')" prop="supplier_type">
            <el-radio-group v-model="formdata.supplier_type" fill="#42b983" size="medium">
              <el-radio-button label="1">跨境贸易</el-radio-button>
              <el-radio-button label="2">一般贸易</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item :label="$t('addSupplierinfo.name')" prop="name">
            <el-input v-model="formdata.name"></el-input>
          </el-form-item>
          <el-form-item :label="$t('addSupplierinfo.logo')" prop="logo">
            <UploadFile :files="formdata.logo" id="logo" :maxFiles="1" :disabled='true' @changeFile="changeFile"></UploadFile>
          </el-form-item>
          <el-form-item :label="$t('addSupplierinfo.address')" prop="address">
            <el-input v-model="formdata.address"></el-input>
          </el-form-item>
          <el-form-item :label="$t('addSupplierinfo.email')" prop="email">
            <el-input v-model="formdata.email"></el-input>
          </el-form-item>
          <el-form-item v-if="formdata.supplier_type=='2'" :label="$t('addSupplierinfo.enterprice_code')" prop="enterprice_code">
            <el-input v-model="formdata.enterprice_code"></el-input>
          </el-form-item>
          <el-form-item v-if="formdata.supplier_type=='2'" :label="$t('addSupplierinfo.contacts')" prop="contacts">
            <el-input v-model="formdata.contacts"></el-input>
          </el-form-item>
          <el-form-item v-if="formdata.supplier_type=='2'" :label="$t('addSupplierinfo.phone')" prop="phone">
            <el-input v-model="formdata.phone"></el-input>
          </el-form-item>
          <el-form-item :label="formdata.supplier_type=='1'?$t('addSupplierinfo.registration'):$t('addSupplierinfo.business_license')" prop="business_license">
            <UploadFile :files="formdata.business_license" id="business_license" :maxFiles="1" :disabled='true' @changeFile="changeFile1"></UploadFile>
          </el-form-item>
          <el-form-item>
            <el-button @click="resetForm('ruleForm')">{{$t('button.reset')}}</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </el-col>
    <el-col :span="1">&nbsp;</el-col>
    <el-col :span="15">
      <el-card shadow="hover">
        <div slot="header" class="flex_between_center">
          <span>{{$t('addSupplierinfo.bankname')}}</span>
          <el-button size="mini" icon="el-icon-plus" @click="open('bankinfo')">{{$t('button.add')}}</el-button>
        </div>
        <el-table v-loading="listLoading" :key="tableKey" :data="banks" border fit highlight-current-row style="width: 100%;" height="300">
          <el-table-column :label="$t('addSupplierinfo.account_no')" prop="account_no" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.account_no}}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('addSupplierinfo.bank_name')" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.bank_name}}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('addSupplierinfo.company_name')" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.company_name }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('addSupplierinfo.swift_code')" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.swift_code }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('addSupplierinfo.bank_address')" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.address }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('table.operate')" fixed="right" align="center" width="170" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button v-if="scope.row.action_flg!==2" type="primary" size="mini" icon="el-icon-edit" @click="handleUpdate(scope.row,scope.$index,'bankinfo')">{{$t('button.edit')}}</el-button>
              <el-button v-if="scope.row.action_flg!==2" type="danger" size="mini" icon="el-icon-delete" @click="handleDelete(scope.row,scope.$index,'bankinfo')">{{$t('button.delete')}}
              </el-button>
              <el-tag type="warning" v-if="scope.row.action_flg==2">{{$t('tag.deleted')}}</el-tag>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
      <el-card shadow="hover" style="margin-top:10px">
        <div slot="header" class="flex_between_center">
          <span>{{$t('addSupplierinfo.warehouse')}}</span>
          <el-button size="mini" icon="el-icon-plus" @click="open('warehouse')">{{$t('button.add')}}</el-button>
        </div>
        <el-table v-loading="listLoading" :key="tableKey" :data="warehouses" border fit highlight-current-row style="width: 100%;" height="300">
          <el-table-column :label="$t('addSupplierinfo.warehouse_name')" prop="warehouse_name" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.warehouse_name}}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('addSupplierinfo.warehouse_address')" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.address}}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('addSupplierinfo.warehouse_contacts')" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.contacts }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('addSupplierinfo.warehouse_phone')" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.phone }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('table.operate')" fixed="right" align="center" width="170" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button v-if="scope.row.action_flg!==2" type="primary" size="mini" icon="el-icon-edit" @click="handleUpdate(scope.row,scope.$index,'warehouse')">{{$t('button.edit')}}</el-button>
              <el-button v-if="scope.row.action_flg!==2" type="danger" size="mini" icon="el-icon-delete" @click="handleDelete(scope.row,scope.$index,'warehouse')">{{$t('button.delete')}}
              </el-button>
              <el-tag type="warning" v-if="scope.row.action_flg==2">{{$t('tag.deleted')}}</el-tag>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </el-col>
    <el-dialog :title="$t('addSupplierinfo.warehouse')" :visible.sync="dialogTableVisible" :append-to-body="true">
      <el-form :model="warehouse" :rules="warehouserules" ref="warehouse" label-width="130px" class="demo-ruleForm">
        <el-form-item :label="$t('addSupplierinfo.warehouse_name')" prop="warehouse_name">
          <el-input v-model="warehouse.warehouse_name"></el-input>
        </el-form-item>
        <el-form-item :label="$t('addSupplierinfo.warehouse_address')" prop="address">
          <el-input v-model="warehouse.address"></el-input>
        </el-form-item>
        <el-form-item :label="$t('addSupplierinfo.warehouse_contacts')" prop="contacts">
          <el-input v-model="warehouse.contacts"></el-input>
        </el-form-item>
        <el-form-item :label="$t('addSupplierinfo.warehouse_phone')" prop="phone">
          <el-input v-model="warehouse.phone"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitwarehouse('warehouse')">{{$t('button.submit')}}</el-button>
          <el-button @click="resetwarehouse('warehouse')">{{$t('button.reset')}}</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog :title="$t('addSupplierinfo.bankname')" :visible.sync="dialogTableVisible1" :append-to-body="true">
      <el-form :model="bankinfo" :rules="bankrules" ref="bankinfo" label-width="130px" class="demo-ruleForm">
        <el-form-item :label="$t('addSupplierinfo.account_no')" prop="account_no">
          <el-input v-model="bankinfo.account_no"></el-input>
        </el-form-item>
        <el-form-item :label="$t('addSupplierinfo.bank_name')" prop="bank_name">
          <el-input v-model="bankinfo.bank_name"></el-input>
        </el-form-item>
        <el-form-item :label="$t('addSupplierinfo.company_name')" prop="company_name">
          <el-input v-model="bankinfo.company_name"></el-input>
        </el-form-item>
        <el-form-item :label="$t('addSupplierinfo.swift_code')" prop="swift_code">
          <el-input v-model="bankinfo.swift_code"></el-input>
        </el-form-item>
        <el-form-item :label="$t('addSupplierinfo.bank_address')" prop="address">
          <el-input v-model="bankinfo.address"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitwarehouse('bankinfo')">{{$t('button.submit')}}</el-button>
          <el-button @click="resetwarehouse('bankinfo')">{{$t('button.reset')}}</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-col :span="24" class="pd20_0 ">
      <el-button v-permission="['supplier','developer']" type="primary" class="floatright" @click="submitForm('ruleForm')">{{$t('button.submit')}}</el-button>
    </el-col>
  </el-row>
</template>
<script>
import { SaveSupplierBaseInfo, GetSupplierInfo } from "@/api/supplier";
import waves from "@/directive/waves"; // Waves directive
import store from "@/store";
import { parseTime } from "@/utils";
import Log from "@/components/Log";
import UploadFile from "@/components/UploadFile";
import permission from "@/directive/permission/index.js"; // 权限判断指令
import checkPermission from "@/utils/permission"; // 权限判断函数
export default {
  name: "addSupplierinfo",
  components: { Log, UploadFile },
  directives: { waves, permission },
  data() {
    return {
      supplier_id: "",
      formdata: {
        id: 0, //默认id
        supplier_type: 1, //贸易类型 1:跨境贸易 2:一般贸易 ,
        name: "", //公司名称
        enterprice_code: "", //企业代码
        address: "", //公司地址
        contacts: "", //联系人
        phone: "", //手机号
        email: "" //邮箱
      }, //供应商
      warehouse: {
        id: "",
        supplier_id: "", //供应商id
        warehouse_name: "", //仓库名
        address: "", //仓库地址
        contacts: "", //联系人
        phone: "", //手机号
        action_flg: "" //操作标记
      }, //仓库信息
      bankinfo: {
        id: "",
        supplier_id: "", //供应商id
        account_no: "", //银行账号
        bank_name: "", //开户行名
        company_name: "", //开户公司名
        address: "", //开户城市
        action_flg: "" //操作标记
      },
      warehouses: [], //仓库列表
      banks: [],
      type: "create", //操作类型
      dialogTableVisible: false, //弹窗是否打开
      dialogTableVisible1: false, //弹窗是否打开
      tableKey: 0,
      listLoading: false
    };
  },
  computed: {
    supplier_rules: function() {
      var checkphone = (rule, value, callback) => {
        setTimeout(() => {
          if (!/^1[34578]\d{9}$/.test(value)) {
            callback(new Error(this.$t("common_rule.phone")));
          } else {
            callback();
          }
        }, 100);
      };

      var checkemail = (rule, value, callback) => {
        setTimeout(() => {
          if (
            !/^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/.test(
              value
            )
          ) {
            callback(new Error(this.$t("common_rule.email")));
          } else {
            callback();
          }
        }, 100);
      };
      const rules = {
        supplier_type: [
          {
            required: true,
            message: this.$t("addSupplierinfo.supplier_type_rule"),
            trigger: "blur"
          }
        ],
        name: [
          {
            required: true,
            message: this.$t("addSupplierinfo.name_rule"),
            trigger: "blur"
          }
        ],
        enterprice_code: [
          {
            required: true,
            message: this.$t("addSupplierinfo.enterprice_code_rule"),
            trigger: "blur"
          }
        ],
        address: [
          {
            required: true,
            message: this.$t("addSupplierinfo.address_rule"),
            trigger: "blur"
          }
        ],
        contacts: [
          {
            required: true,
            message: this.$t("addSupplierinfo.contacts_rule"),
            trigger: "blur"
          }
        ],
        phone: [
          {
            required: true,
            message: this.$t("addSupplierinfo.phone_rule"),
            trigger: "blur"
          },
          { validator: checkphone, trigger: "blur" }
        ],
        email: [
          {
            required: true,
            message: this.$t("addSupplierinfo.email_rule"),
            trigger: "blur"
          },
          { validator: checkemail, trigger: "blur" }
        ],
        business_license: [
          {
            required: true,
            message: this.$t("addSupplierinfo.business_license_rule"),
            trigger: "change"
          }
        ]
      };
      return rules;
    },
    warehouserules: function() {
      var checkphone = (rule, value, callback) => {
        setTimeout(() => {
          if (!/^1[34578]\d{9}$/.test(value)) {
            callback(new Error(this.$t("common_rule.phone")));
          } else {
            callback();
          }
        }, 100);
      };

      const rules = {
        warehouse_name: [
          {
            required: true,
            message: this.$t("addSupplierinfo.warehouse_name_rule"),
            trigger: "blur"
          }
        ],
        address: [
          {
            required: true,
            message: this.$t("addSupplierinfo.warehouse_address_rule"),
            trigger: "blur"
          }
        ],
        contacts: [
          {
            required: true,
            message: this.$t("addSupplierinfo.contacts_rule"),
            trigger: "blur"
          }
        ],
        phone: [
          {
            required: true,
            message: this.$t("addSupplierinfo.phone_rule"),
            trigger: "blur"
          },
          { validator: checkphone, trigger: "blur" }
        ]
      };
      return rules;
    },
    bankrules: function() {
      var checkbankcard = (rule, value, callback) => {
        setTimeout(() => {
          if (!/^([1-9]{1})(\d{14}|\d{18})$/.test(value)) {
            callback(new Error(this.$t("common_rule.bank")));
          } else {
            callback();
          }
        }, 100);
      };
      const rules = {
        account_no: [
          {
            required: true,
            message: this.$t("addSupplierinfo.account_no_rule"),
            trigger: "blur"
          },
          {
            validator: checkbankcard,
            trigger: "blur"
          }
        ],
        bank_name: [
          {
            required: true,
            message: this.$t("addSupplierinfo.bank_name_rule"),
            trigger: "blur"
          }
        ],
        swift_code: [
          {
            required: true,
            message: this.$t("addSupplierinfo.swift_code_rule"),
            trigger: "blur"
          }
        ],
        company_name: [
          {
            required: true,
            message: this.$t("addSupplierinfo.company_name_rule"),
            trigger: "blur"
          }
        ],
        address: [
          {
            required: true,
            message: this.$t("addSupplierinfo.bank_address_rule"),
            trigger: "blur"
          }
        ]
      };
      return rules;
    }
  },
  created() {
    if (this.$route.query.id) {
      this.supplier_id = this.$route.query.id;
    }
    // 获取信息
    this.getInfo();
  },
  methods: {
    getInfo() {
      GetSupplierInfo({ supplier_id: this.supplier_id }).then(response => {
        if (response.data.res_status_code == 0) {
          this.formdata = response.data.res_content;
          this.supplier_id = response.data.res_content.id;
          this.$nextTick(() => {
            this.formdata.business_license =
              response.data.res_content.business_license;
          });
          if (response.data.res_content.warehouses) {
            this.warehouses = response.data.res_content.warehouses;
          }
          if (response.data.res_content.accounts) {
            this.banks = response.data.res_content.accounts;
          }
        } else {
          this.$message({
            type: "error",
            message: response.data.res_message
          });
        }
      });
    },
    // 保存
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$confirm(this.$t("confirm.committed"), this.$t("confirm.hint"), {
            confirmButtonText: this.$t("confirm.ensure"),
            cancelButtonText: this.$t("confirm.cancel"),
            type: "warning"
          })
            .then(() => {
              var data = {};
              data = this.formdata;
              data.warehouses = this.warehouses;
              data.accounts = this.banks;
              SaveSupplierBaseInfo(data).then(response => {
                if (response.data.res_status_code == 0) {
                  this.$message({
                    type: "success",
                    message: this.$t("message.savesuc")
                  });
                  this.supplier_id = response.data.res_content.id;
                  this.getInfo();
                  store
                    .dispatch("GetUserInfo")
                    .then(res => {
                      console.log(res);
                    })
                    .catch(err => {});
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
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    submitwarehouse(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (formName == "warehouse") {
            //新建
            if (this.type == "create") {
              var dataList = this.warehouses;
              this.warehouse.action_flg = 0;
              this.warehouse.id = 0;
              this.warehouse.supplier_id = this.formdata.id;
              var data = this.warehouse;
              dataList.push(data);
              this.$set(dataList, this.warehouse);
              this.dialogTableVisible = false;
            } else if (this.type == "edit") {
              //如果是修改
              this.warehouse.action_flg = 1;
              var dataList = this.warehouses;
              this.$set(dataList, this.index, this.warehouse);
              this.warehouses = dataList;
              this.dialogTableVisible = false;
            }
          } else if (formName == "bankinfo") {
            //新建
            if (this.type == "create") {
              var dataList = this.banks;
              this.bankinfo.action_flg = 0;
              this.bankinfo.id = 0;
              this.bankinfo.supplier_id = this.formdata.id;
              var data = this.bankinfo;
              dataList.push(data);
              this.$set(dataList, this.bankinfo);
              this.dialogTableVisible1 = false;
            } else if (this.type == "edit") {
              //如果是修改
              this.bankinfo.action_flg = 1;
              var dataList = this.banks;
              this.$set(dataList, this.index, this.bankinfo);
              this.banks = dataList;
              this.dialogTableVisible1 = false;
            }
          }
        } else {
          return false;
        }
      });
    },
    // 打开新建弹窗
    open(formName) {
      if (formName == "warehouse") {
        this.$nextTick(function() {
          this.clearValidate("warehouse");
        });
        this.dialogTableVisible = true;
        this.type = "create";
        this.warehouse = {
          id: "",
          supplier_id: "", //供应商id
          warehouse_name: "", //仓库名
          address: "", //仓库地址
          contacts: "", //联系人
          phone: "", //手机号
          action_flg: "" //操作标记
        };
      } else if (formName == "bankinfo") {
        this.$nextTick(function() {
          this.clearValidate("bankinfo");
        });
        this.dialogTableVisible1 = true;
        this.type = "create";
        this.bankinfo = {
          id: "",
          supplier_id: "", //供应商id
          account_no: "", //银行账号
          bank_name: "", //开户行名
          company_name: "", //开户公司名
          address: "", //开户城市
          action_flg: "" //操作标记
        };
      }
    },
    clearValidate(formName) {
      if (this.$refs[formName] !== undefined) {
        this.$refs[formName].clearValidate();
      }
    },
    // 清空form
    resetwarehouse(formName) {
      if (this.$refs[formName] !== undefined) {
        this.$refs[formName].resetFields();
      }
    },
    // 清空form
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    // 点击编辑
    handleUpdate(data, index, formName) {
      var obj = JSON.parse(JSON.stringify(data));
      if (formName == "warehouse") {
        this.warehouse = obj;
        this.dialogTableVisible = true;
      } else if (formName == "bankinfo") {
        this.bankinfo = obj;
        this.dialogTableVisible1 = true;
      }
      this.index = index;
      this.type = "edit";
    },
    // 点击删除
    handleDelete(data, index, formName) {
      this.$confirm(this.$t("confirm.delconfirm"), this.$t("confirm.hint"), {
        confirmButtonText: this.$t("confirm.ensure"),
        cancelButtonText: this.$t("confirm.cancel"),
        type: "warning"
      })
        .then(() => {
          var obj = JSON.parse(JSON.stringify(data));
          if (formName == "warehouse") {
            this.warehouse = obj;
            this.warehouse.action_flg = 2;
            this.index = index;
            var dataList = this.warehouses;
            this.$set(dataList, this.index, this.warehouse);
            this.warehouses = dataList;
          } else if (formName == "bankinfo") {
            this.bankinfo = obj;
            this.bankinfo.action_flg = 2;
            this.index = index;
            var dataList = this.banks;
            this.$set(dataList, this.index, this.bankinfo);
            this.banks = dataList;
          }

          this.$message({
            type: "info",
            message: this.$t("message.delsuc")
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: this.$t("message.cancel")
          });
        });
    },
    Linkto() {
      this.$router.push({ name: "brandList", query: { id: this.supplier_id } });
    },
    changeFile(i) {
      this.formdata.logo = i;
    },
    changeFile1(i) {
      this.formdata.business_license = i;
    }
  }
};
</script>
<style scoped>
.demo-ruleForm {
  margin: 40px 0 0 0;
}
.upload_image {
  width: 50px;
  height: 50px;
}
</style>

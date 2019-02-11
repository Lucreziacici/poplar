
<template>
    <el-row style="padding:20px">
        <el-col :span="24">
            <el-card shadow="hover">
                <div slot="header" class="flex_between_center">
                    <span>商品提案</span>
                </div>
                <el-form :model="supplier" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                    <el-row>
                        <el-col :span="6">
                            <el-form-item label="公司名称" prop="name">
                                <el-select v-model="value4" clearable placeholder="请选择">
                                    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="企业代码" prop="enterprice_code">
                                <el-input v-model="supplier.enterprice_code"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="公司地址" prop="address">
                                <el-input v-model="supplier.address"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="联系人" prop="contacts">
                                <el-input v-model="supplier.contacts"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="手机号" prop="phone">
                                <el-input v-model="supplier.phone"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="银行账号" prop="bank_account">
                                <el-input v-model="supplier.bank_account"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="开户行名" prop="bank_name">
                                <el-input v-model="supplier.bank_name"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="开户城市" prop="bank_city">
                                <el-input v-model="supplier.bank_city"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-form-item>
                        <el-button @click="resetForm('ruleForm')">重置</el-button>
                    </el-form-item>
                </el-form>
            </el-card>
        </el-col>
        <el-col :span="24" class="pd20_0 ">
            <el-button type="primary" class="floatright" @click="submitForm('ruleForm')">保存</el-button>
        </el-col>
    </el-row>
</template>
<script>
import { SaveSupplierBaseInfo, GetSupplierInfo } from "@/api/supplier";
import waves from "@/directive/waves"; // Waves directive
import { parseTime } from "@/utils";
export default {
  name: "addCommodity",
  data() {
    var checkphone = (rule, value, callback) => {
      setTimeout(() => {
        if (!/^1[34578]\d{9}$/.test(value)) {
          callback(new Error("手机号格式有误"));
        } else {
          callback();
        }
      }, 100);
    };
    var checkbankcard = (rule, value, callback) => {
      setTimeout(() => {
        if (!/^([1-9]{1})(\d{14}|\d{18})$/.test(value)) {
          callback(new Error("银行卡格式有误"));
        } else {
          callback();
        }
      }, 100);
    };
    return {
      product:{
          goods_name:"",//商品名称 *
          spec_name:"",//规格名称 *
          goods_description:"",//商品描述 *
          barcode:"",//条码 *
          brand_name:"",//品牌 *
          record_price:"",//备案 价格 *
          net_weight:"",//净重  *
          goods_length:"",//商品-长  
          goods_width:"",//商品-宽 
          goods_height:"",//商品-高 
          unit:"",//计量单位 
          count_per_box:"",//箱规（件/箱） 
          box_weight:"",//箱重 
          box_length:"",//箱长 
          box_width:"",//箱宽 
          box_height:"",//箱高 
          goods_class:"",//品类 *
          declaration_item:"",//申报要素 *
          customs_name:"",//海关品名 *
          legal_weight:"",//法定重量 
          origin_country:"",//原产地 *
          main_ingredient:"",//主要成分 
          manufacturing_enterprise:"",//生产企业名称 
          pic_url:"",// 商品图片  
      },//商品
      type: "creat", //操作类型
      dialogTableVisible: false, //弹窗是否打开
      tableKey: 0,
      rules: {
        name: [
          {
            required: true,
            message: "请输入公司名称",
            trigger: "blur"
          }
        ],
        enterprice_code: [
          {
            required: true,
            message: "请输入企业代码",
            trigger: "blur"
          }
        ],
        address: [
          {
            required: true,
            message: "请输入公司地址",
            trigger: "blur"
          }
        ],
        contacts: [
          {
            required: true,
            message: "请输入联系人",
            trigger: "blur"
          }
        ],
        phone: [
          {
            required: true,
            message: "请输入手机号",
            trigger: "blur"
          },
          { validator: checkphone, trigger: "blur" }
        ],
        bank_account: [
          {
            required: true,
            message: "请输入银行账号",
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
            message: "请填写开户行名",
            trigger: "blur"
          }
        ],
        bank_account_name: [
          {
            required: true,
            message: "请填写开户公司名",
            trigger: "blur"
          }
        ],
        bank_city: [
          {
            required: true,
            message: "请填写开户城市",
            trigger: "blur"
          }
        ]
      }, //表单规则
      options: [
        {
          value: "选项1",
          label: "黄金糕"
        },
        {
          value: "选项2",
          label: "双皮奶"
        },
        {
          value: "选项3",
          label: "蚵仔煎"
        },
        {
          value: "选项4",
          label: "龙须面"
        },
        {
          value: "选项5",
          label: "北京烤鸭"
        }
      ],
      value4: ""
    };
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
          this.supplier = response.data.res_content;
          this.warehouses = response.data.res_content.warehouses;
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
      console.log(formName);
      this.$refs[formName].validate(valid => {
        if (valid) {
          var data = {};
          data = this.supplier;
          data.warehouses = this.warehouses;
          SaveSupplierBaseInfo(data).then(response => {
            if (response.data.res_status_code == 0) {
              this.$message({
                type: "success",
                message: "保存成功"
              });
              this.supplier_id = response.data.res_content.id;
              this.getInfo();
            } else {
              this.$message({
                type: "error",
                message: response.data.res_message
              });
            }
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
          //新建
          if (this.type == "creat") {
            var dataList = this.warehouses;
            this.warehouse.action_flg = 0;
            this.warehouse.id = 0;
            this.warehouse.supplier_id = this.supplier.id;
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
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 打开新建弹窗
    open() {
      this.$nextTick(function() {
        this.clearValidate("warehouse");
      });
      this.dialogTableVisible = true;
      this.type = "creat";
      this.warehouse = {
        id: "",
        supplier_id: "", //供应商id
        warehouse_name: "", //仓库名
        address: "", //仓库地址
        contacts: "", //联系人
        phone: "", //手机号
        action_flg: "" //操作标记
      };
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
    handleUpdate(data, index) {
      var obj = JSON.parse(JSON.stringify(data));
      this.warehouse = obj;
      this.index = index;
      this.dialogTableVisible = true;
      this.type = "edit";
    },
    // 点击删除
    handleDelete(data, index) {
      this.$confirm("确认删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          var obj = JSON.parse(JSON.stringify(data));
          this.warehouse = obj;
          this.warehouse.action_flg = 2;
          this.index = index;
          var dataList = this.warehouses;
          this.$set(dataList, this.index, this.warehouse);
          this.warehouses = dataList;
          this.$message({
            type: "info",
            message: "删除成功"
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
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

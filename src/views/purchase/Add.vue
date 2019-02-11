
<template>
  <div>
    <el-row style="padding:20px">
      <Log v-if="id" :id="id" :type="'supplier_demand'"></Log>
      <el-col :span="24">
        <el-card shadow="hover">
          <div slot="header" class="flex_between_center">
            <span>{{$t('purchaseAdd.title')}}</span>
            <el-button v-permission="['supplier_purchasing_agent','purchase-manager','developer']" v-if="formdata.supplier_id&&(formdata.status=='00'||!formdata.status)" v-waves size="mini" icon="el-icon-plus" @click="open()">{{$t('purchaseAdd.choose')}}</el-button>
          </div>

          <el-form :model="formdata" :rules="rules" ref="ruleForm" label-width="180px" class="demo-ruleForm">
            <el-row v-if="formdata.demand_no">
              <el-col :span="6">
                <el-form-item :label="$t('requirementList.demand_order')" prop="demand_no">
                  <el-input disabled v-model="formdata.demand_no"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="6">
                <el-form-item :label="$t('requirementList.supplier')" prop="supplier_id">
                  <el-select v-model="formdata.supplier_id " :disabled="!(formdata.status=='00'||!formdata.status)" :loading="selectLoading1" clearable :placeholder="$t('requirementList.supplier')" style="width: 100%;" class="filter-item">
                    <el-option v-for="item in supplier_list" :key="item.value" :label="item.name" :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item :label="$t('requirementList.currency_code')" prop="currency_code">
                  <el-select v-model="formdata.currency_code " :disabled="!(formdata.status=='00'||!formdata.status)" :loading="selectLoading2" clearable :placeholder="$t('requirementList.currency_code')" style="width: 100%;" class="filter-item">
                    <el-option v-for="item in currencylist" :key="item.value" :label="item.name" :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item :label="$t('requirementList.expect_arrival_date')" prop="expect_arrival_date">
                  <el-date-picker type="date" :placeholder="$t('input.date')" :disabled="!(formdata.status=='00'||!formdata.status)" v-model="formdata.expect_arrival_date" value-format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item :label="$t('purchaseAdd.delivery_term')" prop="delivery_term">
                  <el-select v-model="formdata.delivery_term " :disabled="!(formdata.status=='00'||!formdata.status)" clearable :placeholder="$t('purchaseAdd.delivery_term')" style="width: 100%;" class="filter-item">
                    <el-option v-for="item in querylist" :key="item.value" :label="item.name" :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item :label="$t('requirementList.trade_type')" prop="trade_type">
                  <el-select v-model="formdata.trade_type " :disabled="!(formdata.status=='00'||!formdata.status)" clearable :placeholder="$t('requirementList.trade_type')" style="width: 100%;" class="filter-item">
                    <el-option v-for="item in trademode" :key="item.id" :label="item.value" :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item :label="$t('purchaseAdd.order_type')" prop="order_type">
                  <el-select v-model="formdata.order_type " :disabled="!(formdata.status=='00'||!formdata.status)" clearable :placeholder="$t('purchaseAdd.order_type') " style="width: 100%;" class="filter-item">
                    <el-option v-for="item in order_type" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>

            </el-row>
            <el-table v-loading="listLoading" :key="tableKey" :data="detail_list" border fit highlight-current-row style="width: 100%;" height="533">
              <el-table-column :label="$t('purchaseAdd.goods_no')" align="center">
                <template slot-scope="scope">
                  <span>{{ scope.row.goods_no }}</span>
                </template>
              </el-table-column>
              <el-table-column :label="$t('purchaseAdd.goods_name')" align="center">
                <template slot-scope="scope">
                  <span>{{ scope.row.goods_name }}</span>
                </template>
              </el-table-column>
              <el-table-column :label="$t('purchaseAdd.barcode')" align="center">
                <template slot-scope="scope">
                  <span>{{ scope.row.barcode }}</span>
                </template>
              </el-table-column>
              <el-table-column :label="$t('purchaseAdd.price')" align="center">
                <template slot-scope="scope">
                  <span>{{ scope.row.price }}</span>
                </template>
              </el-table-column>
              <el-table-column :label="$t('purchaseAdd.num')" align="center">
                <template slot-scope="scope">
                  <span>{{ scope.row.num }}</span>
                </template>
              </el-table-column>
              <el-table-column :label="$t('purchaseAdd.amount')" align="center">
                <template slot-scope="scope">
                  <span>{{ scope.row.amount }}</span>
                </template>
              </el-table-column>
              <el-table-column :label="$t('purchaseAdd.warehouse_name')" align="center">
                <template slot-scope="scope">
                  <span>{{ scope.row.warehouse_name }}</span>
                </template>
              </el-table-column>
              <el-table-column v-if="checkPermission(['supplier_purchasing_agent','purchase-manager','developer'])&&(formdata.status=='00'||!formdata.status)" :label="$t('table.operate')" fixed="right" align="center" width="180" class-name="small-padding fixed-width">
                <template slot-scope="scope">
                  <el-button v-permission="['supplier_purchasing_agent','purchase-manager','developer']" v-if="scope.row.action_flg!==2" type="primary" size="mini" icon="el-icon-edit" @click="handleUpdate(scope.row,scope.$index)">{{$t('button.edit')}}</el-button>
                  <el-button v-permission="['supplier_purchasing_agent','purchase-manager','developer']" v-if="scope.row.action_flg!==2" type="danger" size="mini" icon="el-icon-delete" @click="handleDelete(scope.row,scope.$index)">{{$t('button.delete')}}
                  </el-button>
                  <el-tag type="warning" v-if="scope.row.action_flg==2">{{$t('tag.deleted')}}</el-tag>
                </template>
              </el-table-column>
            </el-table>
            <el-col :span="24" class="pd20_0 ">
              <el-button v-permission="['supplier_purchasing_agent','purchase-manager','developer']" v-if="formdata.status=='00'||!formdata.status" type="primary" class="floatright" @click="submitForm('ruleForm')">{{$t('button.put')}}</el-button>
            </el-col>
          </el-form>
        </el-card>
      </el-col>
    </el-row>

    <el-dialog :title="$t('purchaseAdd.choose')" :visible.sync="dialogTableVisible" :append-to-body="true">
      <el-form :model="detail" :rules="detailrules" ref="detail" label-width="150px" class="demo-ruleForm">
        <el-form-item :label="$t('purchaseAdd.goods_no')" prop="goods_no">
          <el-input v-model="detail.goods_no" @change="handleFilter" class="uppercase" @keyup.enter.native="handleFilter"></el-input>
        </el-form-item>
        <el-form-item :label="$t('purchaseAdd.goods_name')" prop="goods_name">
          <el-input disabled v-model="detail.goods_name"></el-input>
        </el-form-item>
        <el-form-item :label="$t('purchaseAdd.barcode')" prop="barcode">
          <el-input disabled v-model="detail.barcode"></el-input>
        </el-form-item>
        <el-form-item :label="$t('purchaseAdd.price')" prop="price">
          <el-input type="number" v-model="detail.price" @change="changenum" @keyup.enter.native="changenum"></el-input>
        </el-form-item>
        <el-form-item :label="$t('purchaseAdd.num')" prop="num">
          <el-input type="number" v-model="detail.num" @change="changenum" @keyup.enter.native="changenum"></el-input>
        </el-form-item>
        <el-form-item :label="$t('purchaseAdd.amount')" prop="amount">
          <el-input disabled v-model="detail.amount"></el-input>
        </el-form-item>
        <el-form-item :label="$t('purchaseAdd.warehouse_name')" prop="warehouse_no">
          <el-select v-model="detail.warehouse_no" :loading="selectLoading3" clearable :placeholder="$t('purchaseAdd.warehouse_name')" style="width: 100%;" class="filter-item" @change="selectchange()">
            <el-option v-for="item in warehouse_list" :key="item.value" :label="item.warehouse_name" :value="item.warehouse_no">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitdetail('detail')">{{$t('button.submit')}}</el-button>
          <el-button @click="resetdetail('detail')">{{$t('button.reset')}}</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import {
  SavePurchaseDemand,
  GetGoodsInfoByNo,
  GetDemandOrderDetail
} from "@/api/purchase";
import {
  GetSupplierList,
  GetBaseDataByCodetype,
  GetRoleWarehouseList
} from "@/api/common";
import waves from "@/directive/waves"; // Waves directive
import permission from "@/directive/permission/index.js"; // 权限判断指令
import checkPermission from "@/utils/permission"; // 权限判断函数
import { parseTime } from "@/utils";
import Log from "@/components/Log";
export default {
  name: "purchaseAdd",
  components: { Log },
  directives: { waves, permission },
  data() {
    return {
      formdata: {
        id: 0, //默认id
        demand_no: "", //需求单号
        currency_code: "", //币种
        supplier_id: "", //供应商id
        expect_arrival_date: "", //期望到货日期
        delivery_term: "", //交货方式
        trade_type: "", //贸易方式
        order_type: "" //采购单类型
      }, //需求单
      detail: {
        id: "",
        demand_no: "", //需求单号
        goods_no: "", //商品编码
        goods_name: "", //商品名称
        barcode: "", //条码
        price: "", //单价
        num: "", //数量
        amount: "", //金额
        warehouse_no: "" //到货仓库
      }, //商品
      detail_list: [], //商品列表
      type: "create", //操作类型
      id: "",
      dialogTableVisible: false, //弹窗是否打开
      tableKey: 0,
      listLoading: false,
      selectLoading1: true,
      selectLoading2: true,
      selectLoading3: true,
      supplier_list: [], //供应商列表
      warehouse_list: [], //仓库列表
      currencylist: [], //货币列表
      index: 0,
      querylist: [
        { name: "空运", value: "air" },
        { name: "海运", value: "ship" },
        { name: "自提(香港仓自提)", value: "self" },
        { name: "陆运(仅限香港送仓)", value: "land" }
      ], //选择交货方式
      trademode: [
        {
          value: "CIF/CNF",
          id: "0"
        },
        {
          value: "FOB",
          id: "1"
        },
        {
          value: "EXW",
          id: "2"
        },
        {
          value: "一般贸易",
          id: "3"
        }
      ],
      order_type: [
        {
          label: "寄售",
          value: "1"
        },
        {
          label: "非寄售",
          value: "2"
        }
      ]
    };
  },
  computed: {
    rules: function() {
      const rules = {
        supplier_id: [
          {
            required: true,
            message: this.$t("purchaseAdd.supplier_id_rule"),
            trigger: "change"
          }
        ],
        currency_code: [
          {
            required: true,
            message: this.$t("purchaseAdd.currency_code_rule"),
            trigger: "change"
          }
        ],
        trade_type: [
          {
            required: true,
            message: this.$t("purchaseAdd.trade_type_rule"),
            trigger: "change"
          }
        ],
        expect_arrival_date: [
          {
            required: true,
            message: this.$t("purchaseAdd.expect_arrival_date_rule"),
            trigger: "blur"
          }
        ],
        delivery_term: [
          {
            required: true,
            message: this.$t("purchaseAdd.delivery_term_rule"),
            trigger: "change"
          }
        ],
        order_type: [
          {
            required: true,
            message: this.$t("purchaseAdd.order_type_rule"),
            trigger: "change"
          }
        ]
      };
      return rules;
    },
    detailrules: function() {
      const rules = {
        goods_no: [
          {
            required: true,
            message: this.$t("purchaseAdd.goods_no_rule"),
            trigger: "blur"
          }
        ],
        price: [
          {
            required: true,
            message: this.$t("purchaseAdd.price_rule"),
            trigger: "blur"
          }
        ],
        num: [
          {
            required: true,
            message: this.$t("purchaseAdd.num_rule"),
            trigger: "blur"
          }
        ],
        warehouse_no: [
          {
            required: true,
            message: this.$t("purchaseAdd.warehouse_no_rule"),
            trigger: "change"
          }
        ]
      };
      return rules;
    }
  },
  created() {
    // 获取信息
    this.getInfo();
    if (this.$route.query.id) {
      this.id = this.$route.query.id;
      this.getDetail();
    }
  },
  methods: {
    checkPermission,
    getDetail() {
      GetDemandOrderDetail({
        demand_no: this.id
      }).then(response => {
        if (response.data.res_status_code == 0) {
          if (response.data.res_content) {
            this.formdata = response.data.res_content;
            this.detail_list = response.data.res_content.detail_list;
          }
        } else {
          this.$message({
            type: "error",
            message: response.data.res_message
          });
        }
      });
    },
    getInfo() {
      // 获取供应商信息
      GetSupplierList().then(response => {
        this.selectLoading1 = false;
        if (response.data.res_status_code == 0) {
          this.supplier_list = response.data.res_content;
        } else {
          this.$message({
            type: "error",
            message: response.data.res_message
          });
        }
      });
      // 获取币种信息
      GetBaseDataByCodetype({ codetype: "currency" }).then(response => {
        this.selectLoading2 = false;
        if (response.data.res_status_code == 0) {
          this.currencylist = response.data.res_content;
        } else {
          this.$message({
            type: "error",
            message: response.data.res_message
          });
        }
      });
      // 获取仓库信息
      GetRoleWarehouseList().then(response => {
        this.selectLoading3 = false;
        if (response.data.res_status_code == 0) {
          this.warehouse_list = response.data.res_content;
        } else {
          this.$message({
            type: "error",
            message: response.data.res_message
          });
        }
      });
    },
    handleFilter() {
      // 获取商品信息
      GetGoodsInfoByNo({
        goods_no: this.detail.goods_no,
        supplier_id: this.formdata.supplier_id
      }).then(response => {
        if (response.data.res_status_code == 0) {
          if (response.data.res_content.goods_name) {
            this.detail.goods_name = response.data.res_content.goods_name;
            this.detail.barcode = response.data.res_content.barcode;
          } else {
            this.$message({
              type: "error",
              message: this.$t("purchaseAdd.sku_message")
            });
          }
        } else {
          this.$message({
            type: "error",
            message: response.data.res_message
          });
        }
      });
    },
    changenum() {
      this.detail.amount = Number(this.detail.num) * Number(this.detail.price);
    },
    selectchange(vId) {
      let obj = {};
      obj = this.warehouse_list.find(item => {
        //这里的userList就是上面遍历的数据源
        return item.warehouse_no === this.detail.warehouse_no; //筛选出匹配数据
      });
      this.detail.warehouse_name = obj.warehouse_name;
    },
    // 保存
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          var data = {};
          data = this.formdata;
          if (this.detail_list.length < 1) {
            this.$message({
              type: "error",
              message: this.$t("purchaseAdd.product_message")
            });
            return false;
          }
          data.detail_list = this.detail_list;
          this.$confirm(this.$t("confirm.committed"), this.$t("confirm.hint"), {
            confirmButtonText: this.$t("confirm.ensure"),
            cancelButtonText: this.$t("confirm.cancel"),
            type: "warning"
          })
            .then(() => {
              SavePurchaseDemand(data).then(response => {
                if (response.data.res_status_code == 0) {
                  this.$message({
                    type: "success",
                    message: this.$t("message.savesuc")
                  });
                  this.$store.dispatch("delView", this.$route);
                  this.$router.push({
                    name: "requirementList",
                    query: {
                      t: +new Date() //保证每次点击路由的query项都是不一样的，确保会重新刷新view
                    }
                  });
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
    submitdetail(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.detail_list.length > 0) {
            const n = this.detail_list.some(
              f => f.goods_no == this.detail.goods_no
            ); //n 为 true 代表这个数组有该规格的商品
            const m = this.type == "create"; //m 为 true 代表这个是新增项
            const y =
              this.detail_list[this.index].goods_no == this.detail.goods_no;

            // y 为true 代表这个商品 为正在修改的商品
            if ((n && m && y) || (n && !m && !y)) {
              this.$message({
                type: "info",
                message: this.$t("purchaseAdd.same_message")
              });
              return false;
            }
          }

          //新建
          if (this.type == "create") {
            var dataList = this.detail_list;
            this.detail.id = 0;
            this.detail.demand_no = this.formdata.demand_no;
            var data = this.detail;
            dataList.push(data);
            this.$set(dataList, this.detail);
            this.dialogTableVisible = false;
          } else if (this.type == "edit") {
            //如果是修改
            var dataList = this.detail_list;
            this.$set(dataList, this.index, this.detail);
            this.detail_list = dataList;
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
        this.clearValidate("detail");
      });
      this.dialogTableVisible = true;
      this.type = "create";
      this.detail = {
        id: "",
        demand_no: "", //需求单号
        goods_no: "", //商品编码
        goods_name: "", //商品名称
        barcode: "", //条码
        price: "", //单价
        num: "", //数量
        amount: "", //金额
        warehouse_no: "" //到货仓库
      };
    },
    clearValidate(formName) {
      if (this.$refs[formName] !== undefined) {
        this.$refs[formName].clearValidate();
      }
    },
    // 清空form
    resetdetail(formName) {
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
      var obj = Object.assign({}, data);
      this.detail = obj;
      this.index = index;
      this.dialogTableVisible = true;
      this.type = "edit";
    },
    // 点击删除
    handleDelete(data, index) {
      this.$confirm(this.$t("confirm.delconfirm"), this.$t("confirm.hint"), {
        confirmButtonText: this.$t("confirm.ensure"),
        cancelButtonText: this.$t("confirm.cancel"),
        type: "warning"
      })
        .then(() => {
          var obj = JSON.parse(JSON.stringify(data));
          this.detail = obj;
          this.detail.action_flg = 2;
          this.index = index;
          this.detail_list.splice(index, 1);
          this.$message({
            type: "success",
            message: this.$t("message.delsuc")
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: this.$t("message.cancel")
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


<template>
    <div>
        <el-row style="padding:20px">

            <el-col :span="24">
                <el-card shadow="hover">
                    <div slot="header" class="flex_between_center">
                        <span>{{$t('outboundDetail.title')}}</span>
                    </div>
                    <el-form :model="formdata" ref="ruleForm" label-width="180px" class="demo-ruleForm">
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
                                    <el-select v-model="formdata.supplier_id " :disabled="true" clearable :placeholder="$t('requirementList.supplier')" style="width: 100%;" class="filter-item">
                                        <el-option v-for="item in supplier_list" :key="item.value" :label="item.name" :value="item.id">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item :label="$t('requirementList.currency_code')" prop="currency_code">
                                    <el-select v-model="formdata.currency_code " :disabled="true" clearable :placeholder="$t('requirementList.currency_code')" style="width: 100%;" class="filter-item">
                                        <el-option v-for="item in currencylist" :key="item.value" :label="item.name" :value="item.value">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item :label="$t('requirementList.expect_arrival_date')" prop="expect_arrival_date">
                                    <el-date-picker type="date" :placeholder="$t('input.date')" :disabled="true" v-model="formdata.expect_arrival_date" value-format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item :label="$t('purchaseAdd.delivery_term')" prop="delivery_term">
                                    <el-select v-model="formdata.delivery_term " :disabled="true" clearable :placeholder="$t('purchaseAdd.delivery_term')" style="width: 100%;" class="filter-item">
                                        <el-option v-for="item in querylist" :key="item.value" :label="item.name" :value="item.value">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item :label="$t('requirementList.trade_type')" prop="trade_type">
                                    <el-select v-model="formdata.trade_type " :disabled="true" clearable :placeholder="$t('requirementList.trade_type')" style="width: 100%;" class="filter-item">
                                        <el-option v-for="item in trademode" :key="item.id" :label="item.value" :value="item.value">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item :label="$t('purchaseAdd.order_type')" prop="order_type">
                                    <el-select v-model="formdata.order_type " :disabled="true" clearable :placeholder="$t('purchaseAdd.order_type') " style="width: 100%;" class="filter-item">
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
                            <el-table-column :label="$t('outboundDetail.out_num')" align="center">
                                <template slot-scope="scope">
                                    <span>{{ scope.row.out_num }}</span>
                                </template>
                            </el-table-column>

                            <el-table-column v-if="checkPermission(['supplier_purchasing_agent','purchase-manager','developer'])&&(formdata.status<'20')" :label="$t('table.operate')" fixed="right" align="center" width="150" class-name="small-padding fixed-width">
                                <template slot-scope="scope">
                                    <el-button v-if="scope.row.action_flg!==2" type="primary" size="mini" icon="el-icon-edit" @click="handleUpdate(scope.row,scope.$index)">{{$t('button.edit')}}</el-button>

                                </template>
                            </el-table-column>
                        </el-table>
                        <el-col :span="24" class="pd20_0 ">
                            <!-- <back></back> -->
                            <el-button v-if="formdata.status=='10'||formdata.status=='21'" v-permission="['supplier_purchasing_agent','purchase-manager','developer']" type="primary" class="floatright" @click="submitForm('ruleForm')">{{$t('button.submit')}}</el-button>
                        </el-col>
                    </el-form>
                </el-card>
            </el-col>
        </el-row>
        <el-dialog :title="$t('purchaseAdd.choose')" :visible.sync="dialogTableVisible" :append-to-body="true">
            <el-form :model="detail" ref="detail" label-width="180px" class="demo-ruleForm">
                <el-form-item :label="$t('purchaseAdd.goods_no')" prop="goods_no">
                    <el-input disabled v-model="detail.goods_no"></el-input>
                </el-form-item>
                <el-form-item :label="$t('purchaseAdd.goods_name')" prop="goods_name">
                    <el-input disabled v-model="detail.goods_name"></el-input>
                </el-form-item>
                <el-form-item :label="$t('purchaseAdd.barcode')" prop="barcode">
                    <el-input disabled v-model="detail.barcode"></el-input>
                </el-form-item>
                <el-form-item :label="$t('purchaseAdd.num')" prop="num">
                    <el-input disabled type="number" v-model="detail.num"></el-input>
                </el-form-item>
                <el-form-item :label="$t('outboundDetail.out_num')" prop="out_num">
                    <el-input type="number" v-model="detail.out_num"></el-input>
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
  SaveDeliveryNote,
  PurchaseDetail,
  CreateOutOrder,
  SupplierOutDetail
} from "@/api/purchase";
import permission from "@/directive/permission/index.js"; // 权限判断指令
import checkPermission from "@/utils/permission"; // 权限判断函数
import waves from "@/directive/waves"; // Waves directive
import { parseTime } from "@/utils";
import Log from "@/components/Log";
// import Back from "@/components/Back";
export default {
  name: "outboundDetail",
  components: { Log },
  directives: { waves, permission },
  data() {
    return {
      formdata: {}, //需求单
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
      dialogTableVisible: false, //弹窗是否打开
      tableKey: 0,
      listLoading: false,
      supplier_list: [], //供应商列表
      warehouse_list: [], //仓库列表
      querylist: [],
      currencylist: [], //货币列表
      trademode: [],
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
  created() {
    // 获取信息
    this.getInfo();
    if (this.$route.query.id) {
      this.id = this.$route.query.id;
      this.getDetail();
    }
    if (this.$route.query.out_no) {
      this.id = this.$route.query.out_no;
      this.getoutDetail();
    }
  },
  methods: {
    checkPermission,
    // todo 获取出库单详情 接口会换
    getDetail() {
      PurchaseDetail({
        purchase_no: this.id
      }).then(response => {
        if (response.data.res_status_code == 0) {
          if (response.data.res_content) {
            this.formdata = response.data.res_content;
            (this.formdata.out_type = "0"),
              (this.detail_list = response.data.res_content.detail_list);
          }
        } else {
          this.$message({
            type: "error",
            message: response.data.res_message
          });
        }
      });
    },
    getoutDetail() {
      SupplierOutDetail({
        stock_out_no: this.id
      }).then(response => {
        if (response.data.res_status_code == 0) {
          if (response.data.res_content) {
            this.formdata = response.data.res_content;
            (this.formdata.out_type = "0"),
              (this.detail_list = response.data.res_content.detail_list);
          }
        } else {
          this.$message({
            type: "error",
            message: response.data.res_message
          });
        }
      });
    },
    getInfo() {},

    // 保存
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          var data = {};
          data = this.formdata;
          data.detail_list = this.detail_list;
          this.$confirm(this.$t("confirm.committed"), this.$t("confirm.hint"), {
            confirmButtonText: this.$t("confirm.ensure"),
            cancelButtonText: this.$t("confirm.cancel"),
            type: "warning"
          })
            .then(() => {
              CreateOutOrder(data).then(response => {
                if (response.data.res_status_code == 0) {
                  this.$message({
                    type: "success",
                    message: this.$t("message.savesuc")
                  });
                  this.$store.dispatch("delView", this.$route);
                  this.$router.push({
                    name: "purchaselist",
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
          //如果是修改
          var dataList = this.detail_list;
          this.$set(dataList, this.index, this.detail);
          this.detail_list = dataList;
          this.dialogTableVisible = false;
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },

    // 清空form
    resetdetail(formName) {
      if (this.$refs[formName] !== undefined) {
        this.$refs[formName].resetFields();
      }
    },

    // 点击编辑
    handleUpdate(data, index) {
      var obj = JSON.parse(JSON.stringify(data));
      this.detail = obj;
      this.index = index;
      this.dialogTableVisible = true;
      this.type = "edit";
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

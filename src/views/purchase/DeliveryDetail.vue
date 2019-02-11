
<template>
    <div>
        <el-row style="padding:20px">
            <Log :id="id" :type="'supplier_delivery'"></Log>
            <el-col :span="24">
                <el-card shadow="hover">
                    <div slot="header" class="flex_between_center">
                        <span>{{$t('deliveryDetail.title')}}</span>
                    </div>
                    <el-form :model="formdata" ref="ruleForm" label-width="180px" class="demo-ruleForm">
                        <el-row v-if="formdata.demand_no">
                            <el-col :span="6">
                                <el-form-item :label="$t('requirementList.demand_order')" prop="demand_no">
                                    <el-input disabled v-model="formdata.demand_no"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item :label="$t('deliveryDetail.delivery_order_no')" prop="delivery_order_no">
                                    <el-input disabled v-model="formdata.delivery_order_no"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item :label="$t('requirementList.target_arrival_date')" prop="target_arrival_date">
                                    <el-input disabled v-model="formdata.target_arrival_date"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item :label="$t('requirementList.lading_bill_no')" prop="lading_bill_no">
                                    <el-input :disabled="formdata.status!=='30'&&formdata.status!=='31'" v-model="formdata.lading_bill_no"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="6">
                                <el-form-item :label="$t('requirementList.supplier')" prop="supplier_id">
                                    <el-select disabled v-model="formdata.supplier_id " clearable  style="width: 100%;" class="filter-item">
                                        <el-option v-for="item in supplier_list" :key="item.value" :label="item.name" :value="item.id">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item :label="$t('requirementList.currency_code')" prop="currency_code">
                                    <el-select disabled v-model="formdata.currency_code " clearable  style="width: 100%;" class="filter-item">
                                        <el-option v-for="item in currencylist" :key="item.value" :label="item.name" :value="item.value">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item :label="$t('requirementList.trade_type')" prop="trade_type">
                                    <el-select disabled v-model="formdata.trade_type " clearable  style="width: 100%;" class="filter-item">
                                        <el-option v-for="item in trademode" :key="item.id" :label="item.value" :value="item.value">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item :label="$t('requirementList.expect_arrival_date')" prop="expect_arrival_date">
                                    <el-date-picker disabled type="date"  v-model="formdata.expect_arrival_date" value-format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>
                                </el-form-item>
                            </el-col>

                        </el-row>
                        <el-row>
                            <el-col :span="6">
                                <el-form-item :label="$t('purchaseAdd.delivery_term')" prop="delivery_term">
                                    <el-select disabled v-model="formdata.delivery_term " clearable  style="width: 100%;" class="filter-item">
                                        <el-option v-for="item in querylist" :key="item.value" :label="item.name" :value="item.value">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item :label="$t('purchaseAdd.order_type')" prop="order_type">
                                    <el-select disabled v-model="formdata.order_type " clearable  style="width: 100%;" class="filter-item">
                                        <el-option v-for="item in order_type" :key="item.value" :label="item.label" :value="item.value">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item :label="$t('deliveryDetail.packing_url')" prop="packing_url">
                                    <a v-if="formdata.packing_url" target="view_window" :href="formdata.packing_url">
                                        <svg-icon icon-class="link" />{{$t('upload.look')}}</a>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item :label="$t('deliveryDetail.invoice_url')" prop="invoice_url">
                                    <a v-if="formdata.invoice_url" target="view_window" :href="formdata.invoice_url">
                                        <svg-icon icon-class="link" />{{$t('upload.look')}}</a>
                                </el-form-item>
                            </el-col>

                        </el-row>
                        <el-row>
                            
                            <el-col :span="6">
                                <el-form-item :label="$t('deliveryDetail.account_no')" prop="account_no ">
                                    <el-input type="input" disabled v-model="formdata.account_no"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item :label="$t('deliveryDetail.delivery_memo')" prop="delivery_memo ">
                                    <el-input type="textarea" disabled v-model="formdata.delivery_memo"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item :label="$t('deliveryDetail.purchase_memo')" prop="purchase_memo">
                                    <el-input type="textarea" :disabled="formdata.status!=='30'&&formdata.status!=='31'" :placeholder="$t('deliveryDetail.purchase_memo')" v-model="formdata.purchase_memo"></el-input>
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
                            <!-- <el-table-column label="单价" align="center">
                                <template slot-scope="scope">
                                    <span>{{ scope.row.price }}</span>
                                </template>
                            </el-table-column> -->
                            <el-table-column :label="$t('purchaseAdd.num')" align="center">
                                <template slot-scope="scope">
                                    <span>{{ scope.row.out_num }}</span>
                                </template>
                            </el-table-column>
                            <!-- <el-table-column label="金额" align="center">
                                <template slot-scope="scope">
                                    <span>{{ scope.row.amount }}</span>
                                </template>
                            </el-table-column> -->
                            <el-table-column :label="$t('deliveryDetail.unusual_num')" align="center">
                                <template slot-scope="scope">
                                    <span>{{ scope.row.unusual_num }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column :label="$t('deliveryDetail.memo')" align="center">
                                <template slot-scope="scope">
                                    <span>{{ scope.row.memo }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column :label="$t('purchaseAdd.warehouse_name')" align="center">
                                <template slot-scope="scope">
                                    <span>{{ scope.row.warehouse_name }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column v-if="checkPermission(['supplier_purchasing_agent','purchase-manager','developer'])&&(formdata.status=='30'||formdata.status=='31')" :label="$t('table.operate')" fixed="right" align="center" width="150" class-name="small-padding fixed-width">
                                <template slot-scope="scope">
                                    <el-button v-if="scope.row.action_flg!==2" type="primary" size="mini" icon="el-icon-edit" @click="handleUpdate(scope.row,scope.$index)">{{$t('button.edit')}}</el-button>

                                </template>
                            </el-table-column>
                        </el-table>
                        <el-col :span="24" class="pd20_0 ">
                            <!-- <back></back> -->
                            <el-button v-permission="['supplier_purchasing_agent','purchase-manager','developer']" v-if="formdata.status=='30'||formdata.status=='31'" type="primary" class="floatright" @click="submitForm('ruleForm')">{{$t('button.submit')}}</el-button>
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
                <!-- <el-form-item label="单价" prop="price">
                    <el-input disabled type="number" v-model="detail.price" ></el-input>
                </el-form-item> -->
                <el-form-item :label="$t('purchaseAdd.num')" prop="out_num">
                    <el-input disabled type="number" v-model="detail.out_num"></el-input>
                </el-form-item>
                <!-- <el-form-item label="金额" prop="amount">
                    <el-input disabled v-model="detail.amount"></el-input>
                </el-form-item> -->
                <el-form-item :label="$t('deliveryDetail.unusual_num')"  prop="unusual_num">
                    <el-input type="number" v-model="detail.unusual_num"></el-input>
                </el-form-item>
                <el-form-item :label="$t('deliveryDetail.memo')" prop="memo">
                    <el-input type="textarea" v-model="detail.memo"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button v-if="formdata.status=='30'||formdata.status=='31'" type="primary" @click="submitdetail('detail')">{{$t('button.submit')}}</el-button>
                    <el-button @click="resetdetail('detail')">{{$t('button.reset')}}</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>
<script>
import { SaveDeliveryNote, GetDeliveryDetail } from "@/api/purchase";
import permission from "@/directive/permission/index.js"; // 权限判断指令
import checkPermission from "@/utils/permission"; // 权限判断函数
import waves from "@/directive/waves"; // Waves directive
import { parseTime } from "@/utils";
import Log from "@/components/Log";
// import Back from "@/components/Back";
export default {
  name: "deliveryDetail",
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
  },
  methods: {
    checkPermission,
    getDetail() {
      GetDeliveryDetail({
        delivery_order_no: this.id
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
              SaveDeliveryNote(data).then(response => {
                if (response.data.res_status_code == 0) {
                  this.$message({
                    type: "success",
                     message: this.$t("message.savesuc")
                  });
                  this.$store.dispatch("delView", this.$route);
                  this.$router.push({
                    name: "deliverlist",
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

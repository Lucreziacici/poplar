
<template>
  <div>
    <el-row style="padding:20px">
      <el-col :span="24">
        <el-card shadow="hover">
          <div slot="header" class="flex_between_center">
            <span>{{$t('bidDetail.title')}}</span>
          </div>

          <el-form :model="formdata" :rules="rules" ref="ruleForm" label-width="160px" class="demo-ruleForm">
            <el-row v-if="formdata.biding_no">
              <el-col :span="6">
                <el-form-item :label="$t('bidDetail.biding_no')" prop="biding_no">
                  <el-input disabled v-model="formdata.biding_no"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="6">
                <el-form-item :label="$t('bidDetail.currency_code')" prop="currency_code">
                  <el-select v-model="formdata.currency_code " clearable :placeholder="$t('bidDetail.currency_code')" style="width: 100%;" class="filter-item">
                    <el-option v-for="item in currencylist" :key="item.value" :label="item.name" :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item :label="$t('bidDetail.trade_type')" prop="trade_type">
                  <el-select v-model="formdata.trade_type " clearable :placeholder="$t('bidDetail.trade_type')" style="width: 100%;" class="filter-item">
                    <el-option v-for="item in trademode" :key="item.id" :label="item.value" :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item :label="$t('bidDetail.bid_expired_date')" prop="bid_expired_date">
                  <el-date-picker type="date" :placeholder="$t('input.date')" v-model="formdata.bid_expired_date" value-format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item :label="$t('bidDetail.warehouse_id')" prop="warehouse_id">
                  <el-select v-model="formdata.warehouse_id" :loading="selectLoading3" clearable :placeholder="$t('bidDetail.warehouse_id')" style="width: 100%;" class="filter-item" @change="selectchange()">
                    <el-option v-for="item in warehouse_list" :key="item.id" :label="item.warehouse_name" :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-table v-loading="listLoading" :key="tableKey" :data="detail_list" border fit highlight-current-row style="width: 100%;" height="533">
              <el-table-column :label="$t('requestList.goods_no')" align="center">
                <template slot-scope="scope">
                  <span>{{ scope.row.goods_no }}</span>
                </template>
              </el-table-column>
              <el-table-column :label="$t('requestList.goods_name')" align="center">
                <template slot-scope="scope">
                  <span>{{ scope.row.goods_name }}</span>
                </template>
              </el-table-column>
              <el-table-column :label="$t('bidDetail.bid_price')" align="center">
                <template slot-scope="scope">
                  <span v-if="scope.row.bid_price">{{ scope.row.bid_price }}</span>
                  <span v-else>{{$t('table.haveno')}}</span>
                </template>
              </el-table-column>

              <el-table-column :label="$t('requestList.num')" align="center">
                <template slot-scope="scope">
                  <span>{{ scope.row.num }}</span>
                </template>
              </el-table-column>
              <el-table-column :label="$t('bidDetail.available_num')" align="center">
                <template slot-scope="scope">
                  <span v-if="scope.row.available_num">{{ scope.row.available_num }}</span>
                  <span v-else>{{$t('table.haveno')}}</span>
                </template>
              </el-table-column>
              <el-table-column :label="$t('bidDetail.delivery_date')" align="center">
                <template slot-scope="scope">
                  <span v-if="scope.row.delivery_date">{{ scope.row.delivery_date }}</span>
                  <span v-else>{{$t('table.haveno')}}</span>
                </template>
              </el-table-column>

              <el-table-column :label="$t('table.operate')" fixed="right" align="center" width="150" class-name="small-padding fixed-width">
                <template slot-scope="scope">
                  <el-button type="primary" size="mini" icon="el-icon-edit" @click="handleUpdate(scope.row,scope.$index)">{{$t('button.edit')}}</el-button>

                </template>
              </el-table-column>

            </el-table>
            <el-col :span="24" class="pd20_0 flex_between_center">
              <span>{{$t('bidDetail.total_price')}}￥{{total_price}}</span>
              <el-button type="primary" class="floatright" @click="submitForm('ruleForm')">{{$t('button.put')}}</el-button>
            </el-col>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
    <el-dialog :title="$t('dialog.edit_title')" :visible.sync="dialogTableVisible" :append-to-body="true">
      <el-form :model="detail" :rules="detailrules" ref="detail" label-width="170px" class="demo-ruleForm">
        <el-form-item :label="$t('requestList.goods_no')" prop="goods_no">
          <el-input disabled v-model="detail.goods_no"></el-input>
        </el-form-item>
        <el-form-item :label="$t('requestList.goods_name')" prop="goods_name">
          <el-input disabled v-model="detail.goods_name"></el-input>
        </el-form-item>
        <el-form-item :label="$t('bidDetail.bid_price')" prop="bid_price">
          <el-input type="number" v-model="detail.bid_price"></el-input>
        </el-form-item>
        <el-form-item :label="$t('requestList.num')" prop="num">
          <el-input disabled type="number" v-model="detail.num"></el-input>
        </el-form-item>
        <el-form-item :label="$t('bidDetail.available_num')" prop="available_num">
          <el-input type="number" v-model="detail.available_num"></el-input>
        </el-form-item>
        <el-form-item :label="$t('bidDetail.delivery_date')" prop="delivery_date">
          <el-date-picker type="datetime" :placeholder="$t('input.date')" v-model="detail.delivery_date" value-format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>
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
import { QuotationRequestList, SaveBid } from "@/api/requestandbid";
import { GetSupplierInfo } from "@/api/supplier";
import { GetBaseDataByCodetype } from "@/api/common";
import waves from "@/directive/waves"; // Waves directive
import { parseTime } from "@/utils";
export default {
  name: "purchaseAdd",
  directives: { waves },
  data() {
    return {
      id: "",
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
        warehouse_no: "", //到货仓库
        warehouse_name: ""
      }, //商品
      detail_list: [], //商品列表
      type: "create", //操作类型
      dialogTableVisible: false, //弹窗是否打开
      tableKey: 0,
      listLoading: false,
      selectLoading2: false,
      selectLoading3: false,
      warehouse_list: [], //仓库列表
      currencylist: [], //货币列表
      total_price: 0, //总价
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
    };
  },
  computed: {
    rules: function() {
      const rules = {
        currency_code: [
          {
            required: true,
            message: this.$t("purchaseAdd.currency_code_rule"),
            trigger: "blur"
          }
        ],
        trade_type: [
          {
            required: true,
            message: this.$t("purchaseAdd.trade_type_rule"),
            trigger: "blur"
          }
        ],
        bid_expired_date: [
          {
            required: true,
            message: this.$t("bidDetail.bid_expired_date_rule"),
            trigger: "blur"
          }
        ],
        warehouse_id: [
          {
            required: true,
            message: this.$t("purchaseAdd.warehouse_no_rule"),
            trigger: "blur"
          }
        ]
      }; //表单规则
      return rules;
    },
    detailrules: function() {
      const rules = {
        bid_price: [
          {
            required: true,
            message: this.$t("bidDetail.bid_price_rule"),
            trigger: "blur"
          }
        ],
        available_num: [
          {
            required: true,
            message: this.$t("bidDetail.available_num_rule"),
            trigger: "blur"
          }
        ],
        delivery_date: [
          {
            required: true,
            message: this.$t("bidDetail.delivery_date_rule"),
            trigger: "blur"
          }
        ]
      };
      return rules;
    }
  },
  created() {
    // 获取信息
    this.getInfo();
    this.id = this.$route.query.id;
    this.getDetail();
  },
  methods: {
    getDetail() {
      QuotationRequestList({
        request_ids: this.id
      }).then(response => {
        if (response.data.res_status_code == 0) {
          if (response.data.res_content) {
            // this.formdata = response.data.res_content.data_list;
            this.detail_list = response.data.res_content.data_list;
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
      // 获取币种信息
      GetBaseDataByCodetype({ codetype: "currency" }).then(response => {
        if (response.data.res_status_code == 0) {
          this.currencylist = response.data.res_content;
        } else {
          this.$message({
            type: "error",
            message: response.data.res_message
          });
        }
      });
      GetSupplierInfo({ supplier_id: "" }).then(response => {
        if (response.data.res_status_code == 0) {
          if (response.data.res_content.warehouses) {
            this.warehouse_list = response.data.res_content.warehouses;
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
          var data = {};
          data = this.formdata;
          var list = this.detail_list;
          for (var i = 0; i < list.length; i++) {
            list[i].bid_expired_date = this.formdata.bid_expired_date;
            list[i].currency_code = this.formdata.currency_code;
            list[i].trade_type = this.formdata.trade_type;
            list[i].warehouse_id = this.formdata.warehouse_id;
          }

          this.$confirm(this.$t("confirm.committed"), this.$t("confirm.hint"), {
            confirmButtonText: this.$t("confirm.ensure"),
            cancelButtonText: this.$t("confirm.cancel"),
            type: "warning"
          })
            .then(() => {
              SaveBid(list).then(response => {
                if (response.data.res_status_code == 0) {
                  this.$message({
                    type: "success",
                    message: this.$t("message.savesuc")
                  });
                  this.$store.dispatch("delView", this.$route);
                  this.$router.push({
                    name: "bidList",
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
          this.total_price = 0;
          for (var i = 0; i < this.detail_list.length; i++) {
            if (
              this.detail_list[i].bid_price &&
              this.detail_list[i].available_num
            ) {
              this.total_price =
                this.total_price +
                this.detail_list[i].bid_price *
                  this.detail_list[i].available_num;
            }
          }
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
    },
    selectchange(vId) {
      let obj = {};

      obj = this.warehouse_list.find(item => {
        //这里的userList就是上面遍历的数据源
        return item.id === this.formdata.warehouse_id; //筛选出匹配数据
      });
      this.formdata.warehouse_name = obj.warehouse_name;
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

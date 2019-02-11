<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input :placeholder="$t('requirementList.demand_order')" v-model="listQuery.demand_no " clearable style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <!-- <el-input placeholder="条码" v-model="listQuery.barcode " clearable style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" /> -->
      <!-- <el-select v-model="listQuery.brand_name " clearable placeholder="品牌名" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter">
        <el-option v-for="item in querylist" :key="item.value" :label="item.label" :value="item.brand_name">
        </el-option>
      </el-select> -->
      <el-select v-model="listQuery.currency_code " clearable :placeholder="$t('requirementList.currency_code')" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter">
        <el-option v-for="item in currencylist" :key="item.value" :label="item.name" :value="item.value">
        </el-option>
      </el-select>
      <el-select v-model="listQuery.supplier_id " clearable :placeholder="$t('requirementList.supplier')" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter">
        <el-option v-for="item in supplier_list" :key="item.value" :label="item.name" :value="item.id">
        </el-option>
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{$t('button.search')}}</el-button>
      <el-button v-permission="['supplier_purchasing_agent','purchase-manager','developer']" v-waves class="filter-item" type="primary" icon="el-icon-plus" @click="linkTo">{{$t('button.add')}}</el-button>
      <el-alert :title="$t('alert.title')" type="warning" :description="$t('requirementList.tips')" show-icon>
      </el-alert>
    </div>

    <el-table v-loading="listLoading" stripe :key="tableKey" :data="list" border fit highlight-current-row @sort-change="sortChange" style="width: 100%;" height="600">
      <el-table-column :label="$t('table.No')" type="index" sortable="custom" prop="id" align="center">
      </el-table-column>
      <el-table-column :label="$t('requirementList.demand_order')" sortable="custom" prop="demand_no" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.demand_no}}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('requirementList.supplier')" sortable="custom" prop="supplier_name" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.supplier_name }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('requirementList.trade_type')" sortable="custom" prop="trade_type" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.trade_type }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('requirementList.currency_code')" sortable="custom" prop="currency_code" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.currency_code }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.create_time')" sortable="custom" prop="create_time" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.create_time_yyyymmdd }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('requirementList.expect_arrival_date')" sortable="custom" prop="expect_arrival_date" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.expect_arrival_date }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('requirementList.promise_date')" sortable="custom" prop="promise_date" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.promise_date">{{ scope.row.promise_date }}</span>
          <span v-else>{{$t('table.haveno')}}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('requirementList.status')" sortable="custom" prop="status" align="center">
        <template slot-scope="scope">
          <el-tag type="success" v-if="scope.row.status=='00'">{{$t('tag.submitted')}}</el-tag>
          <el-tag type="success" v-if="scope.row.status=='10'">{{$t('tag.confirmed')}}</el-tag>
          <el-tag type="success" v-if="scope.row.status=='20'">{{$t('tag.outbound')}}</el-tag>
          <el-tag type="success" v-if="scope.row.status=='21'">{{$t('tag.partofoutbound')}}</el-tag>
          <el-tag type="success" v-if="scope.row.status=='30'">{{$t('tag.delivered')}}</el-tag>
          <el-tag type="success" v-if="scope.row.status=='31'">{{$t('tag.partofdelivered')}}</el-tag>
          <el-tag type="success" v-if="scope.row.status=='40'">{{$t('tag.entered')}}</el-tag>
          <el-tag type="success" v-if="scope.row.status=='41'">{{$t('tag.partofentered')}}</el-tag>
          <el-tag type="warning" v-if="scope.row.status=='90'">{{$t('tag.canceled')}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.operate')" fixed="right" align="center" width="350" class-name="small-padding ">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" icon="el-icon-edit" @click="handleLink(scope.row)">{{$t('requirementList.link')}}</el-button>
          <el-button type="primary" v-permission="['supplier','developer']" v-show="scope.row.status=='00'" size="mini" icon="el-icon-edit" @click="handleConfirm(scope.row)">{{$t('requirementList.comfirm')}}</el-button>
          <el-button v-permission="['supplier_purchasing_agent','purchase-manager','supplier','developer']" type="danger" v-show="scope.row.status=='00'" size="mini" icon="el-icon-delete" @click="handleAbandon(scope.row)">{{$t('requirementList.abandon')}}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :label="$t('requirementList.comfirm')" :visible.sync="dialogFormVisible" :append-to-body="true">
      <el-form ref="promise_date" :rules="rules" :model="formdata" label-position="left" label-width="180px">
        <el-form-item :label="$t('requirementList.promise_date')" prop="promise_date">
          <el-date-picker type="date" :placeholder="$t('requirementList.promise_date')" v-model="formdata.promise_date" value-format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{$t('button.cancel')}}</el-button>
        <el-button type="primary" @click="confirmPurchase()">{{$t('button.submit')}}</el-button>
      </div>
    </el-dialog>
    <el-dialog :title="$t('requirementList.send')" :visible.sync="dialogFormVisible2" :append-to-body="true">
      <el-form ref="send" :rules="rules2" :model="formdata2" label-position="left" label-width="180px">
        <el-form-item :label="$t('requirementList.example')">
          <a target="view_window" href="http://182.254.151.220:8060/template/PackingList.xlsx">
            <i class="el-icon-document"></i>{{$t('upload.download')}}</a>
        </el-form-item>
        <el-form-item :label="$t('requirementList.upload_invoice')" prop="invoice_url">
          <UploadFile id="myVueDropzone" v-if="dialogFormVisible2" :files="formdata2.invoice_url" :maxFiles="1" v-on:changeFile="changeinvoice_url"></UploadFile>
        </el-form-item>
        <el-form-item :label="$t('requirementList.upload_packing')" prop="packing_url">
          <UploadFile id="myVueDropzone2" v-if="dialogFormVisible2" :files="formdata2.packing_url" :maxFiles="1" v-on:changeFile="changepacking_url"></UploadFile>
        </el-form-item>
        <el-form-item :label="$t('requirementList.lading_bill_no')" prop="lading_bill_no">
          <el-input :placeholder="$t('requirementList.lading_bill_no')" v-model="formdata2.lading_bill_no" />
        </el-form-item>
        <el-form-item :label="$t('requirementList.target_arrival_date')" prop="target_arrival_date">
          <el-date-picker type="date" :placeholder="$t('requirementList.target_arrival_date')" v-model="formdata2.target_arrival_date" value-format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>
        </el-form-item>
        <el-form-item :label="$t('requirementList.account_no')" prop="account_no">
          <el-select v-model="formdata2.account_no" clearable :placeholder="$t('requirementList.account_no')" style="width: 100%;" class="filter-item">
            <el-option v-for="item in accountlist" :key="item.value" :label="item.name" :value="item.bank_name+item.account_no">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('requirementList.remark')" prop="delivery_memo">
          <el-input type="textarea" :placeholder="$t('requirementList.remark')" v-model="formdata2.delivery_memo" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible2 = false">{{$t('button.cancel')}}</el-button>
        <el-button type="primary" @click="sendPurchase()">{{$t('button.submit')}}</el-button>
      </div>
    </el-dialog>
   
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page_no" :limit.sync="listQuery.page_size" @pagination="getList" />
  </div>
</template>

<script>
import {
  GetDemandList,
  ConfirmPurchaseDemand,
  ConfirmDelivery,
  QuitPurchaseDemand,
  
} from "@/api/purchase";
import {
  GetSupplierList,
  GetBaseDataByCodetype,
  SupplierBankAccountList
} from "@/api/common";
import waves from "@/directive/waves"; // Waves directive
import permission from "@/directive/permission/index.js"; // 权限判断指令
import checkPermission from "@/utils/permission"; // 权限判断函数
import UploadFile from "@/components/UploadFile";
import Pagination from "@/components/Pagination"; // Secondary package based on el-pagination

export default {
  name: "requirementList",
  components: { Pagination, UploadFile },
  directives: { waves, permission },
  data() {
    return {
      tableKey: 0,
      total: 0,
      listLoading: true, //加载loading
      listQuery: {
        demand_no: "",
        currency_code: "",
        supplier_id: "",
        page_size: 20,
        page_no: 1,
        order_by: "",
        direction: ""
      }, //搜索条件
      formdata: {},
      formdata2: {},
      formdata3: {},
      dialogFormVisible: false, //弹出框
      dialogFormVisible2: false, //弹出框
      dialogFormVisible3: false, //弹出框
      supplier_list: [], //供应商列表
      currencylist: [], //货币列表
      accountlist: [], //银行账户列表
      list: []
    };
  },
  computed: {
    rules: function() {
      const rules = {
        promise_date: [
          {
            required: true,
            message: this.$t("requirementList.promise_date_rule"),
            trigger: "blur"
          }
        ]
      };
      return rules;
    },
    rules2: function() {
      const rules = {
        invoice_url: [
          {
            required: true,
            message: this.$t("requirementList.invoice_url_rule"),
            trigger: "blur"
          }
        ],
        packing_url: [
          {
            required: true,
            message: this.$t("requirementList.packing_url_rule"),
            trigger: "blur"
          }
        ],
        target_arrival_date: [
          {
            required: true,
            message: this.$t("requirementList.target_arrival_date_rule"),
            trigger: "blur"
          }
        ],
        account_no: [
          {
            required: true,
            message: this.$t("requirementList.account_no_rule"),
            trigger: "blur"
          }
        ]
      };
      return rules;
    },
   
  },
  created() {
    // 获取信息
    this.getInfo();
    this.getList();
  },
  methods: {
    // 获取列表
    getList() {
      this.listLoading = true;
      GetDemandList(this.listQuery).then(response => {
        this.listLoading = false;
        if (response.data.res_status_code == 0) {
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

    // 获取品牌列表提供筛选
    getInfo() {
      // 获取供应商信息
      GetSupplierList().then(response => {
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
        if (response.data.res_status_code == 0) {
          this.currencylist = response.data.res_content;
        } else {
          this.$message({
            type: "error",
            message: response.data.res_message
          });
        }
      });
    },
    // 查看详情
    handleLink(row) {
      this.$store.dispatch("delView", this.$route);
      this.$router.push({
        name: "purchaseAdd",
        query: {
          id: row.demand_no,
          t: +new Date()
        }
      });
    },
    // 确认订单
    handleConfirm(row) {
      this.formdata = Object.assign({}, row); // copy obj
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["promise_date"].clearValidate();
      });
    },
    // 确认订单
    confirmPurchase() {
      this.$refs["promise_date"].validate(valid => {
        if (valid) {
          ConfirmPurchaseDemand({
            demand_no: this.formdata.demand_no,
            promise_date: this.formdata.promise_date
          }).then(response => {
            if (response.data.res_status_code == 0) {
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
    //订单发货
    handleSend(row) {
      this.formdata2 = Object.assign({}, row); // copy obj
      this.dialogFormVisible2 = true;
      this.$nextTick(() => {
        this.$refs["send"].clearValidate();
      });
      SupplierBankAccountList({ supplier_id: this.formdata2.supplier_id }).then(
        response => {
          if (response.data.res_status_code == 0) {
            this.accountlist = response.data.res_content;
          } else {
            this.$message({
              type: "error",
              message: response.data.res_message
            });
          }
        }
      );
    },
   
    changeinvoice_url(i) {
      this.formdata2.invoice_url = i;
    },
    changepacking_url(i) {
      this.formdata2.packing_url = i;
    },
    // 订单发货
    sendPurchase() {
      this.$refs["send"].validate(valid => {
        if (valid) {
          ConfirmDelivery({
            demand_no: this.formdata2.demand_no,
            target_arrival_date: this.formdata2.target_arrival_date,
            lading_bill_no: this.formdata2.lading_bill_no,
            account_no: this.formdata2.account_no,
            packing_url: this.formdata2.packing_url,
            invoice_url: this.formdata2.invoice_url,
            delivery_memo: this.formdata2.delivery_memo
          }).then(response => {
            if (response.data.res_status_code == 0) {
              this.dialogFormVisible2 = false;
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
    // 放弃订单
    handleAbandon(row) {
      this.$confirm(this.$t("confirm.abandon"), this.$t("confirm.hint"), {
        confirmButtonText: this.$t("confirm.ensure"),
        cancelButtonText: this.$t("confirm.cancel"),
        type: "warning"
      })
        .then(() => {
          QuitPurchaseDemand({
            demand_no: row.demand_no
          }).then(response => {
            if (response.data.res_status_code == 0) {
              this.$message({
                type: "info",
                message: this.$t("message.operatesuc")
              });
              this.getList();
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
    
    // 跳转
    linkTo() {
      this.$store.dispatch("delView", this.$route);
      this.$router.push({
        name: "purchaseAdd",
        query: {
          t: +new Date() //保证每次点击路由的query项都是不一样的，确保会重新刷新view
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

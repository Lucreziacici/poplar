<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input :placeholder="$t('requirementList.demand_order')" v-model="listQuery.demand_no " clearable style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input :placeholder="$t('purchaseList.purchase_no')" v-model="listQuery.purchase_no " clearable style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.currency_code " clearable :placeholder="$t('requirementList.currency_code')" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter">
        <el-option v-for="item in currencylist" :key="item.value" :label="item.name" :value="item.value">
        </el-option>
      </el-select>
      <el-select v-model="listQuery.supplier_id " clearable :placeholder="$t('requirementList.supplier')" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter">
        <el-option v-for="item in supplier_list" :key="item.value" :label="item.name" :value="item.id">
        </el-option>
      </el-select>

      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{$t('button.search')}}</el-button>
    </div>
    <el-table v-loading="listLoading" :key="tableKey" :data="list" border fit highlight-current-row @sort-change="sortChange" style="width: 100%;" height="600">
      <el-table-column :label="$t('table.No')" type="index" sortable="custom" prop="id" align="center">

      </el-table-column>
      <el-table-column :label="$t('purchaseList.purchase_no')" sortable="custom" prop="purchase_no" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.purchase_no}}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('requirementList.demand_order')" sortable="custom" prop="demand_no" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.demand_no}}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('requirementList.supplier')" sortable="custom" prop="supplier_name" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.supplier_name}}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('requirementList.currency_code')" sortable="custom" prop="currency_code" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.currency_code}}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.create_time')" sortable="custom" prop="created" align="center" :formatter="parseTime">
      </el-table-column>
      <el-table-column :label="$t('requirementList.expect_arrival_date')" sortable="custom" prop="expect_arrival_date" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.expect_arrival_date }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('purchaseAdd.warehouse_name')" sortable="custom" prop="warehouse_name" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.warehouse_name}}</span>
        </template>
      </el-table-column>
       <el-table-column :label="$t('table.operate')" fixed="right" align="center" width="150" class-name="small-padding ">
        <template slot-scope="scope">
          
          <el-button type="primary" v-permission="['supplier','developer']" v-show="scope.row.status=='10'||scope.row.status=='21'||scope.row.status=='31'||scope.row.status=='41'" size="mini" icon="el-icon-edit" @click="handleOutbound(scope.row)">{{$t('requirementList.outbound')}}</el-button>
        </template>
      </el-table-column>
    </el-table>
     <el-dialog :title="$t('requirementList.outbound')" :visible.sync="dialogFormVisible3" :append-to-body="true">
      <el-form ref="outbound" :rules="rules3" :model="formdata3" label-position="left" label-width="180px">
        <!-- 出库方式 -->
        <el-form-item :label="$t('requirementList.out_type')" prop="out_type">
          <el-radio-group v-model="formdata3.out_type" fill="#42b983" size="medium">
            <el-radio-button label="1">{{$t('requirementList.all_out')}}</el-radio-button>
            <el-radio-button label="0">{{$t('requirementList.part_out')}}</el-radio-button>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible3 = false">{{$t('button.cancel')}}</el-button>
        <el-button type="primary" @click="outboundPurchase()">{{$t('button.submit')}}</el-button>
      </div>
    </el-dialog>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page_no" :limit.sync="listQuery.page_size" @pagination="getList" />
  </div>
</template>

<script>
import { GetPurchaseList,CreateOutOrder  } from "@/api/purchase";
import { GetSupplierList, GetBaseDataByCodetype } from "@/api/common";
import { parseTime} from "@/utils/index"
import waves from "@/directive/waves"; // Waves directive
import permission from "@/directive/permission/index.js"; // 权限判断指令
import checkPermission from "@/utils/permission"; // 权限判断函数
import Pagination from "@/components/Pagination"; // Secondary package based on el-pagination

export default {
  name: "purchaseList",
  components: { Pagination },
  directives: { waves ,permission},
  data() {
    return {
      tableKey: 0,
      total: 0,
      listLoading: true, //加载loading
      listQuery: {
        demand_no: "",
        purchase_no: "",
        currency_code: "",
        supplier_id: "",
        page_size: 20,
        page_no: 1,
        order_by: "",
        direction: ""
      }, //搜索条件
      list: [],
      supplier_list: [], //供应商列表
      currencylist: [], //货币列表
      formdata3:{},
      dialogFormVisible3:false,
    };
  },
 computed: {
     rules3: function() {
      const rules = {
        out_type: [
          {
            required: true,
            message: this.$t("requirementList.out_type_rule"),
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
    this.getList();
  },
  methods: {
    // 获取列表
    getList() {
      this.listLoading = true;
      GetPurchaseList(this.listQuery).then(response => {
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
      // 订单出库
    handleOutbound(row) {
      this.formdata3 = Object.assign({}, row); // copy obj
      if (this.formdata3.status == "21") {
        this.$router.push({
          name: "outboundDetail",
          query: {
            id: this.formdata3.purchase_no,
            t: +new Date()
          }
        });
      } else {
        this.dialogFormVisible3 = true;
      }
    },
    //订单出库
    outboundPurchase() {
      this.$refs["outbound"].validate(valid => {
        if (valid) {
          //全部出库
          if (this.formdata3.out_type == "1") {
            CreateOutOrder(this.formdata3).then(response => {
              this.dialogFormVisible3 = false;
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
          } else {
            this.dialogFormVisible3 = false;
            this.$router.push({
              name: "outboundDetail",
              query: {
                id: this.formdata3.purchase_no,
                t: +new Date()
              }
            });
          }
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
    },
    parseTime(row,column){
      if(row.created) return parseTime(row.created)
      else return row.created
      
    }
  }
};
</script>

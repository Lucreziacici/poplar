<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input :placeholder="$t('deliveryDetail.delivery_order_no')" v-model="listQuery.delivery_order_no " clearable style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input :placeholder="$t('requirementList.demand_order')" v-model="listQuery.demand_no " clearable style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{$t('button.search')}}</el-button>
    </div>
    <el-table v-loading="listLoading" :key="tableKey" :data="list" border fit highlight-current-row @sort-change="sortChange" style="width: 100%;" height="600">
      <el-table-column :label="$t('table.No')" type="index" sortable="custom" prop="id" align="center">

      </el-table-column>
      <el-table-column :label="$t('deliveryDetail.delivery_order_no')" sortable="custom" prop="delivery_order_no" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.delivery_order_no}}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('requirementList.demand_order')" sortable="custom" prop="demand_no" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.demand_no}}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('requirementList.lading_bill_no')" sortable="custom" prop="lading_bill_no" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.lading_bill_no">{{ scope.row.lading_bill_no}}</span>
          <span v-else>{{$t('table.haveno')}}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('requirementList.target_arrival_date')" sortable="custom" prop="target_arrival_date" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.target_arrival_date}}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('deliveryDetail.purchase_memo')" :show-overflow-tooltip="true" sortable="custom" prop="purchase_memo" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.purchase_memo">{{ scope.row.purchase_memo}}</span>
          <span v-else>{{$t('table.haveno')}}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.create_time')" sortable="custom" prop="create_time" align="center" :formatter="parseTime">
      </el-table-column>
      <el-table-column :label="$t('table.operate')" fixed="right" align="center" width="250" class-name="small-padding ">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleLink(scope.row)">
            <svg-icon icon-class="link" />{{$t('deliveryList.link')}}</el-button>
          <el-button v-permission="['supplier_purchasing_agent','purchase-manager','developer']" v-if="scope.row.status=='30'||scope.row.status=='31'" type="primary" size="mini" icon="el-icon-check" @click="handleUpdate(scope.row)">{{$t('button.submit')}}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page_no" :limit.sync="listQuery.page_size" @pagination="getList" />
  </div>
</template>

<script>
import { GetDeliveryList, ConfirmInStock } from "@/api/purchase";
import { parseTime } from "@/utils/index";
import waves from "@/directive/waves"; // Waves directive
import permission from "@/directive/permission/index.js"; // 权限判断指令
import checkPermission from "@/utils/permission"; // 权限判断函数
import Pagination from "@/components/Pagination"; // Secondary package based on el-pagination

export default {
  name: "purchaseList",
  components: { Pagination },
  directives: { waves,permission },
  data() {
    return {
      tableKey: 0,
      total: 0,
      listLoading: true, //加载loading
      listQuery: {
        demand_no: "",
        delivery_order_no: "",
        page_size: 20,
        page_no: 1,
        order_by: "",
        direction: ""
      }, //搜索条件
      querylist: [],
      list: [],
      formdata: {}
      
    };
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
      GetDeliveryList(this.listQuery).then(response => {
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
    getInfo() {},
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
    handleLink(row) {
      this.$store.dispatch("delView", this.$route);
      this.$router.push({
        name: "deliverydetail",
        query: {
          id: row.delivery_order_no,
          t: +new Date()
        }
      });
    },
    handleUpdate(row) {
      this.$confirm(this.$t('confirm.confirm'), this.$t('confirm.hint'), {
        confirmButtonText: this.$t('confirm.ensure'),
        cancelButtonText: this.$t('confirm.cancel'),
        type: "warning"
      })
        .then(() => {
          ConfirmInStock({
            delivery_order_no: row.delivery_order_no
          }).then(response => {
            if (response.data.res_status_code == 0) {
              this.$message({
                type: "info",
                message: this.$t('message.operatesuc')
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
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: this.$t('message.cancel')
          });
        });
    },
    confirmPurchase() {
      SaveDeliveryNote({
        delivery_order_no: this.formdata.delivery_order_no,
        purchase_memo: this.formdata.purchase_memo
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
    },
    parseTime(row, column) {
      if (row.create_time) return parseTime(row.create_time);
      else return row.create_time;
    }
  }
};
</script>

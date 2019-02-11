<template>
  <div class="app-container">
    <div class="filter-container">

      <el-input :placeholder="$t('requestList.brand_name')" v-model="listQuery.brand_name " clearable style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input :placeholder="$t('requestList.goods_no')" v-model="listQuery.goods_no " clearable style="width: 200px;text-transform: uppercase;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.supplier_id " clearable :placeholder="$t('requirementList.supplier')" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter">
        <el-option v-for="item in supplier_list" :key="item.value" :label="item.name" :value="item.id">
        </el-option>
      </el-select>
      <el-select v-model="listQuery.bid_status " clearable :placeholder="$t('requirementList.status')" style="width: 200px" class="filter-item" @keyup.enter.native="handleFilter">
        <el-option v-for="item in status_list" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{$t('button.search')}}</el-button>

    </div>
    <el-table v-loading="listLoading" :key="tableKey" :data="list" border fit highlight-current-row @sort-change="sortChange" style="width: 100%;" height="600">

      <el-table-column :label="$t('table.No')" type="index" sortable="custom" prop="id" align="center">
      </el-table-column>
      <el-table-column :label="$t('requirementList.supplier')" sortable="custom" prop="supplier_id" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.supplier_name}}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('requestList.goods_no')" sortable="custom" prop="goods_no" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.goods_no}}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('requestList.goods_name')" :show-overflow-tooltip="true" sortable="custom" prop="goods_name" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.goods_name}}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('requestList.brand_name')" sortable="custom" prop="brand_name" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.brand_name}}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('requestList.num')" sortable="custom" prop="num" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.num}}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('bidDetail.available_num')" sortable="custom" prop="available_num" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.available_num}}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('bidDetail.bid_price')" sortable="custom" prop="bid_price" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.bid_price}}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('bidDetail.trade_type')" sortable="custom" prop="trade_type" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.trade_type}}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('bidDetail.currency_code')" sortable="custom" prop="currency_code" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.currency_code}}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('requestList.request_date')" sortable="custom" prop="request_date" align="center" :formatter="parseTime">
      </el-table-column>
      <el-table-column :label="$t('requestList.expired_date')" sortable="custom" prop="expired_date" align="center" :formatter="parseTime">
      </el-table-column>
      <el-table-column :label="$t('bidDetail.delivery_date')" sortable="custom" prop="expired_date" align="center" :formatter="parseTime">
      </el-table-column>
      <el-table-column :label="$t('table.update_user_name')" sortable="custom" prop="update_user_name" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.update_user_name}}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.update_time_yyyymmdd')" sortable="custom" prop="update_time" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.update_time_yyyymmdd}}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('requirementList.status')" sortable="custom" prop="bid_status" align="center">
        <template slot-scope="scope">
          <el-tag type="primary" v-if="scope.row.bid_status=='00'">{{$t('tag.toconfirmed')}}</el-tag>
          <el-tag type="success" v-if="scope.row.bid_status=='10'">{{$t('tag.adopt')}}</el-tag>
          <el-tag type="warning" v-if="scope.row.bid_status=='20'">{{$t('tag.reject')}}</el-tag>
          <el-tag type="danger" v-if="scope.row.bid_status=='30'">{{$t('tag.outdate')}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column v-if="checkPermission(['supplier_purchasing_agent','purchase-manager','developer'])" :label="$t('table.operate')" fixed="right" align="center" width="300" class-name="small-padding">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" icon="el-icon-check" @click="handleCheck(scope.row)">{{$t('bidList.adopt')}}</el-button>
          <el-button type="primary" size="mini" icon="el-icon-close" @click="handleClose(scope.row)">{{$t('bidList.reject')}}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page_no" :limit.sync="listQuery.page_size" @pagination="getList" />
  </div>
</template>

<script>
import { GetBidList, ConfirmBid, RefuseBid } from "@/api/requestandbid";
import { GetSupplierList } from "@/api/common";
import { parseTime } from "@/utils/index";
import waves from "@/directive/waves"; // Waves directive
import permission from "@/directive/permission/index.js"; // 权限判断指令
import checkPermission from "@/utils/permission"; // 权限判断函数
import Pagination from "@/components/Pagination"; // Secondary package based on el-pagination
import UploadExcelComponent from "@/components/UploadExcel/index.vue";
export default {
  name: "bidList",
  components: { Pagination, UploadExcelComponent },
  directives: { waves, permission },
  data() {
    return {
      tableKey: 0,
      total: 0,
      listLoading: true, //加载loading
      listQuery: {
        page_size: 20,
        page_no: 1,
        order_by: "",
        direction: ""
      }, //搜索条件
      list: [],
      supplier_list: [],
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
      ]
    };
  },
  computed: {
    status_list: function() {
      const rules = [
        { label: this.$t("tag.toconfirmed"), value: "00" },
        { label: this.$t("tag.adopt"), value: "10" },
        { label: this.$t("tag.reject"), value: "20" },
        { label: this.$t("tag.outdate"), value: "30" }
      ];
      return rules;
    }
  },
  created() {
    // 获取信息
    this.getInfo();
    this.getList();
  },
  methods: {
    checkPermission,
    // 获取列表
    getList() {
      this.listLoading = true;
      GetBidList(this.listQuery).then(response => {
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
    parseTime(row, column) {
      if (column.property == "request_date") return parseTime(row.request_date);
      if (column.property == "expired_date") return parseTime(row.expired_date);
      if (column.property == "delivery_date")
        return parseTime(row.expired_date);
    },

    // 编辑
    handleCheck(row) {
      this.$confirm(this.$t("confirm.adopt"), this.$t("confirm.hint"), {
        confirmButtonText: this.$t("confirm.ensure"),
        cancelButtonText: this.$t("confirm.cancel"),
        type: "warning"
      })
        .then(() => {
          this.formdata = Object.assign({}, row); // copy obj
          ConfirmBid(this.formdata).then(response => {
            if (response.data.res_status_code == 0) {
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
    // 编辑
    handleClose(row) {
      this.$confirm(this.$t("confirm.reject"), this.$t("confirm.hint"), {
        confirmButtonText: this.$t("confirm.ensure"),
        cancelButtonText: this.$t("confirm.cancel"),
        type: "warning"
      })
        .then(() => {
          this.formdata = Object.assign({}, row); // copy obj
          RefuseBid(this.formdata).then(response => {
            if (response.data.res_status_code == 0) {
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
    }
  }
};
</script>

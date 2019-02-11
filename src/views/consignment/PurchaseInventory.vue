<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input :placeholder="$t('purchaseAdd.goods_no')" v-model='listQuery.goods_no' clearable style="width: 200px;text-transform: uppercase;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{$t('button.search')}}</el-button>
    </div>
    <el-table v-loading="listLoading" :key="tableKey" :data="list" border fit highlight-current-row @sort-change="sortChange" style="width: 100%;" height="600">
      <el-table-column :label="$t('table.No')" type="index" sortable="custom" prop="id" align="center">
      </el-table-column>
      <el-table-column :label="$t('purchaseAdd.goods_no')" sortable="custom" prop='goods_no' align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.goods_no}}</span>
        </template>
      </el-table-column>
       <el-table-column :label="$t('purchaseAdd.goods_name')" :show-overflow-tooltip="true" sortable="custom" prop='goods_name' align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.goods_name}}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('requirementList.supplier')" sortable="custom" prop='supplier_name' align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.supplier_name}}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('requestList.brand_name')" sortable="custom" prop='brand_name' align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.brand_name}}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('purchaseInventory.transit_stock')" sortable="custom" prop='num_on_passage' align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.num_on_passage}}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('purchaseInventory.num_in_warehouse')" sortable="custom" prop='num_in_warehouse' align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.num_in_warehouse}}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('purchaseInventory.sales5')" sortable="custom" prop='sales5' align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.sales5}}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('purchaseInventory.sales30')" sortable="custom" prop='sales30' align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.sales30}}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('purchaseInventory.soldnum')" sortable="custom" prop='sold_num' align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.sold_num}}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.operate')" fixed="right" align="center" width="130" class-name="small-padding ">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleOpen(scope.row)">
            <svg-icon icon-class="chart" /> {{$t('purchaseInventory.line')}}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page_no" :limit.sync="listQuery.page_size" @pagination="getList" />
    <el-dialog :title="$t('purchaseInventory.line')" :visible.sync="dialogTableVisible" :append-to-body="true">
      <div>
        <el-col :span="4">
          <div class="pd20_0 bold">{{$t('purchaseAdd.goods_no')}}：{{formdata.goods_no}}</div>
        </el-col>
        <el-col :span="16">
          <div class="pd20_0 bold">{{$t('purchaseAdd.goods_name')}}：{{formdata.goods_name}}</div>
        </el-col>
        <el-col :span="4">
          <div class="pd20_0 bold">{{$t('purchaseInventory.num_in_warehouse')}}: {{formdata.num_in_warehouse}}</div>
        </el-col>

      </div>
      <el-table v-loading="listLoading1" :key="1" :data="recordlist" border fit highlight-current-row @sort-change="sortChange1" style="width: 100%;" height="400">
        <el-table-column :label="$t('table.No')" type="index" sortable="custom" prop="id" align="center">
        </el-table-column>
        <el-table-column :label="$t('purchaseInventory.trade_time')" sortable="custom" prop='trade_time' align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.trade_time}}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('purchaseInventory.trade_type')" prop='trade_type' align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.trade_type=='0'">{{$t('purchaseInventory.in')}}</span>
            <span v-if="scope.row.trade_type=='1'">{{$t('purchaseInventory.out')}}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('purchaseInventory.trade_num')" prop='trade_num' align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.trade_num}}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('purchaseInventory.direction')" prop='direction' align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.direction}}</span>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="recordtotal>0" :total="recordtotal" :page.sync="listQuery1.page_no" :limit.sync="listQuery1.page_size" @pagination="getConsignmentGoodsStockRecordList" />
    </el-dialog>
  </div>
</template>
<script>
import {
  ConsignmentGoodsList,
  ConsignmentGoodsStockRecordList
} from "@/api/consignment";
import waves from "@/directive/waves"; // Waves directive
import Pagination from "@/components/Pagination"; // Secondary package based on el-pagination
export default {
  name: "purchaseInventory",
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      tableKey: 0,
      total: 0,
      recordtotal: 0,
      listLoading: true, //加载loading
      listLoading1: true,
      listQuery: {
        page_size: 20,
        page_no: 1,
        order_by: "",
        direction: ""
      }, //搜索条件
      listQuery1: {
        page_size: 20,
        page_no: 1,
        order_by: "",
        direction: ""
      }, //搜索条件
      list: [],
      dialogTableVisible: false,
      formdata: {},
      recordlist: []
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
      ConsignmentGoodsList(this.listQuery).then(response => {
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
    sortChange1(data) {
      const { prop, order } = data;
      if (order == "descending") {
        this.listQuery1.direction = "desc";
      } else if (order == "ascending") {
        this.listQuery1.direction = "asc";
      } else {
        this.listQuery1.direction = "";
      }
      this.listQuery1.order_by = prop;
      this.getConsignmentGoodsStockRecordList();
    },
    handleFilter() {
      this.listQuery.page_no = 1;
      this.getList();
    },
    handleOpen(row) {
      this.formdata = row;
      this.dialogTableVisible = true;
      this.listQuery1.page_size = 20;
      this.listQuery1.page_no = 1;
      this.getConsignmentGoodsStockRecordList();
    },
    getConsignmentGoodsStockRecordList() {
      var data = this.formdata;
      this.listQuery1.supplier_id = this.formdata.supplier_id;
      this.listQuery1.goods_no = this.formdata.goods_no;
      ConsignmentGoodsStockRecordList(this.listQuery1).then(response => {
        this.listLoading1 = false;
        if (response.data.res_status_code == 0) {
          this.recordlist = response.data.res_content.data_list;
          this.recordtotal = response.data.res_content.total_count;
        } else {
          this.$message({
            type: "error",
            message: response.data.res_message
          });
        }
      });
    }
  }
};
//{"search":[{"type":"input","placeholder":"SKU编码","model":"goods_no","dataname":"","func":"","label":"","value":"","format":""}],"add":{"show":false,"link":""},"table":[{"label":"SKU编码","prop":"goods_no","type":"text","content":"goods_no"},{"label":"品牌","type":"text","prop":"brand_name","content":"brand_name"},{"label":"在途库存","prop":"num_on_passage","content":"num_on_passage","type":"text"},{"label":"在库库存","prop":"num_in_warehouse","content":"num_in_warehouse","type":"text"},{"label":"5天日均销量","type":"text","prop":"sales5","content":"sales5"},{"content":"sales30","prop":"sales30","type":"text","label":"30日均销量"}],"name":"purchaseInventory","file":"consignment","pagesize":"20","port":"ConsignmentGoodsList"}
</script>


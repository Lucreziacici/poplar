<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input :placeholder="$t('commodityList.product_name')" v-model="listQuery.goods_name " clearable style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input :placeholder="$t('commodityList.barcode')" v-model="listQuery.barcode " clearable style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.brand_name " clearable :placeholder="$t('brandlist.brand_name')" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter">
        <el-option v-for="item in querylist" :key="item.value" :label="item.label" :value="item.brand_name">
        </el-option>
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{$t('button.search')}}</el-button>
    </div>
    <el-table v-loading="listLoading" :key="tableKey" :data="list" border fit highlight-current-row @sort-change="sortChange" style="width: 100%;" height="600">
      <el-table-column :label="$t('table.No')" type="index" sortable="custom" prop="id" align="center">

      </el-table-column>
      <el-table-column :label="$t('commodityList.sku')" sortable="custom" prop="goods_no" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.goods_no}}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('commodityList.product_name')" :show-overflow-tooltip="true" sortable="custom" prop="goods_name" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.goods_name }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('commodityList.barcode')" sortable="custom" prop="barcode" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.barcode }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('brandlist.brand_name')" sortable="custom" prop="brand_name" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.brand_name }}</span>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page_no" :limit.sync="listQuery.page_size" @pagination="getList" />
  </div>
</template>

<script>
import { GetSupplierProductList, GetAuthorizeBrandList } from "@/api/supplier";
import waves from "@/directive/waves"; // Waves directive
import Pagination from "@/components/Pagination"; // Secondary package based on el-pagination

export default {
  name: "commodityList",
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      tableKey: 0,
      total: 0,
      listLoading: true, //加载loading
      listQuery: {
        brand_name: "",
        goods_name: "",
        barcode: "",
        goods_no: "",
        page_size: 20,
        page_no: 1,
        order_by: "",
        direction: ""
      }, //搜索条件
      querylist: [],
      list: []
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
      GetSupplierProductList(this.listQuery).then(response => {
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
      GetAuthorizeBrandList().then(response => {
        if (response.data.res_status_code == 0) {
          this.querylist = response.data.res_content;
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
    handleFilter(){
      this.listQuery.page_no=1;
      this.getList();
    }
  }
};
</script>

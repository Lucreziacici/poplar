<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input placeholder='SKU编码' v-model='listQuery.goods_no' clearable style="width: 200px;text-transform: uppercase;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
    </div>
    <el-table v-loading="listLoading" :key="tableKey" :data="list" border fit highlight-current-row @sort-change="sortChange" style="width: 100%;" height="600">
      <el-table-column label="序号" type="index" sortable="custom" prop="id" align="center">
      </el-table-column>
      <el-table-column label='SKU编码' sortable="custom" prop='goods_no' align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.goods_no}}</span>
        </template>
      </el-table-column>
      <el-table-column label='SKU名称' sortable="custom" prop='goods_name' align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.goods_name}}</span>
        </template>
      </el-table-column>
      <el-table-column label='品牌' sortable="custom" prop='brand_name' align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.brand_name}}</span>
        </template>
      </el-table-column>
      <el-table-column label='库存' sortable="custom" prop='num_in_warehouse' align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.num_in_warehouse}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" align="center" width="130" class-name="small-padding ">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleOpen(scope.row)">
            <svg-icon icon-class="chart" /> 查看流水</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="流水信息" :visible.sync="dialogTableVisible" :append-to-body="true">
       <div >
          <el-col :span="4">
            <div class="pd20_0">SKU编码：{{formdata.goods_no}}</div>
          </el-col>
          <el-col :span="16">
            <div class="pd20_0">SKU名称：{{formdata.goods_name}}</div>
          </el-col>
          <el-col :span="4">
            <div class="pd20_0">库存：{{formdata.num_in_warehouse}}</div>
          </el-col>

        </div>
      <el-table v-loading="listLoading" :key="tableKey" :data="list" border fit highlight-current-row @sort-change="sortChange" style="width: 100%;" height="400">
        <el-table-column label="序号" type="index" sortable="custom" prop="id" align="center">
        </el-table-column>
        <el-table-column label='时间' sortable="custom" prop='goods_no' align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.goods_no}}</span>
          </template>
        </el-table-column>
        <el-table-column label='出库方式' sortable="custom" prop='goods_name' align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.goods_name}}</span>
          </template>
        </el-table-column>
          <el-table-column label='采购单号' sortable="custom" prop='goods_name' align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.goods_name}}</span>
          </template>
        </el-table-column>
        <el-table-column label='数量' sortable="custom" prop='brand_name' align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.brand_name}}</span>
          </template>
        </el-table-column>
        <el-table-column label='备注' sortable="custom" prop='num_in_warehouse' align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.num_in_warehouse}}</span>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page_no" :limit.sync="listQuery.page_size" @pagination="getList" />
  </div>
</template>
<script>
import { GoodsInfoList } from "@/api/consignment";
import waves from "@/directive/waves"; // Waves directive
import Pagination from "@/components/Pagination"; // Secondary package based on el-pagination
export default {
  name: "CommodityInventory",
  components: { Pagination },
  directives: { waves },
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
      dialogTableVisible: false,
      formdata:{}
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
      GoodsInfoList(this.listQuery).then(response => {
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
    handleFilter() {
      this.listQuery.page_no = 1;
      this.getList();
    },
    handleOpen(row) {
      this.formdata=row;
      this.dialogTableVisible = true;
    }
  }
};
//{"search":[{"type":"input","placeholder":"SKU编码","model":"goods_no","dataname":"","func":"","label":"","value":"","format":""}],"add":{"show":false,"link":""},"table":[{"label":"SKU编码","prop":"goods_no","type":"text","content":"goods_no"},{"label":"品牌","type":"text","prop":"brand_name","content":"brand_name"},{"label":"库存","prop":"num_in_warehouse","content":"num_in_warehouse","type":"text"}],"name":"CommodityInventory","file":"consignment","pagesize":"20","port":"GoodsInfoList"}
</script>


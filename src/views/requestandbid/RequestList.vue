<template>
  <div class="app-container">
    <div class="filter-container">
      <el-date-picker type="datetime" :placeholder="$t('requestList.request_date')" v-model="listQuery.request_date" style="width: 200px;" value-format="yyyy-MM-dd hh-mm" class="filter-item" @keyup.enter.native="handleFilter"></el-date-picker>
      <el-input :placeholder="$t('requestList.brand_name')" v-model="listQuery.brand_name " clearable style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input :placeholder="$t('requestList.goods_no')" v-model="listQuery.goods_no " clearable style="width: 200px;" class="filter-item uppercase" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.status " clearable :placeholder="$t('requestList.stauts')" style="width: 200px" class="filter-item" @keyup.enter.native="handleFilter">
        <el-option v-for="item in status_list" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{$t('button.search')}}</el-button>
      <el-button v-waves v-permission="['supplier_purchasing_agent','purchase-manager','developer']" class="filter-item" type="primary" icon="el-icon-plus" @click="handleCreate">{{$t('button.add')}}</el-button>
      <el-button v-waves v-permission="['supplier_purchasing_agent','purchase-manager','developer']" class="filter-item" type="primary" icon="el-icon-upload2" @click="handleInto">{{$t('requestList.Inquiry_into')}}</el-button>
      <el-button v-waves v-permission="['supplier','developer']" class="filter-item" type="primary" icon="el-icon-sold-out" @click="handleLink(2,multipleSelection)">{{$t('requestList.Blanket_Quotation')}}</el-button>
    </div>
    <el-table v-loading="listLoading" :key="tableKey" :data="list" border fit highlight-current-row @sort-change="sortChange" @selection-change="handleSelectionChange" style="width: 100%;" height="600">
      <el-table-column :label="$t('table.No')" type="index" sortable="custom" prop="id" align="center">
      </el-table-column>
      <el-table-column type="selection" width="50" :selectable="selectable">
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
      <el-table-column :label="$t('requestList.request_date')" sortable="custom" prop="request_date" align="center" :formatter="parseTime">
      </el-table-column>
      <el-table-column :label="$t('requestList.expired_date')" sortable="custom" prop="expired_date" align="center" :formatter="parseTime">
      </el-table-column>
      <el-table-column :label="$t('requestList.stauts')" sortable="custom" prop="status" align="center">
        <template slot-scope="scope">
          <el-tag type="primary" v-if="scope.row.status=='00'">{{$t('tag.quote')}}</el-tag>
          <el-tag type="success" v-if="scope.row.status=='10'">{{$t('tag.quoted')}}</el-tag>
          <el-tag type="warning" v-if="scope.row.status=='20'">{{$t('tag.outdate')}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.operate')" fixed="right" align="center" width="250" class-name="small-padding">
        <template slot-scope="scope">
          <el-button v-if="scope.row.status!=='20'" v-permission="['supplier','developer']" type="primary" size="mini" icon="el-icon-sold-out" @click="handleLink(1,scope.row)">{{$t('requestList.quotation')}}</el-button>
          <el-button v-permission="['supplier_purchasing_agent','purchase-manager','developer']" type="primary" size="mini" icon="el-icon-edit" @click="handleUpdate(scope.row)">{{$t('button.edit')}}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" :append-to-body="true">
      <Log v-if="dialogStatus == 'update'" :id="formdata.id" :type="'supplier_quotation'"></Log>
      <el-form ref="formdata" :rules="rules" :model="formdata" label-position="left" label-width="170px">
        <el-form-item :label="$t('requestList.goods_no')" prop="goods_no">
          <el-input :disabled="formdata.status=='10'||formdata.status=='20'?true:false" v-model="formdata.goods_no" />
        </el-form-item>
        <el-form-item :label="$t('requestList.num')" prop="num">
          <el-input :disabled="formdata.status=='10'||formdata.status=='20'?true:false" type="number" v-model="formdata.num" />
        </el-form-item>
        <el-form-item :label="$t('requestList.request_date')" prop="request_date">
          <el-date-picker :disabled="formdata.status=='10'||formdata.status=='20'?true:false" type="datetime" placeholder="选择日期" v-model="formdata.request_date" value-format="yyyy-MM-dd hh:mm" style="width: 100%;"></el-date-picker>
        </el-form-item>
        <el-form-item :label="$t('requestList.expired_date')" prop="expired_date">
          <el-date-picker :disabled="formdata.status=='10'||formdata.status=='20'?true:false" type="datetime" placeholder="选择日期" v-model="formdata.expired_date" value-format="yyyy-MM-dd hh:mm" style="width: 100%;"></el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{$t('button.cancel')}}</el-button>
        <el-button type="primary" @click="createData()">{{$t('button.submit')}}</el-button>
      </div>
    </el-dialog>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible1" :append-to-body="true">

      <el-form label-position="left" label-width="160px">
        <el-form-item :label="$t('requestList.example')">
          <a target="view_window" href="http://182.254.151.220:8060/template/询价.xls">
            <i class="el-icon-document"></i>{{$t('upload.download')}}</a>
        </el-form-item>
      </el-form>
      <upload-excel-component :on-success="handleSuccess" style="width: 100%;" :before-upload="beforeUpload" />
      <el-table :data="tableData" border highlight-current-row style="width: 100%;margin-top:20px;">
        <el-table-column v-for="item of tableHeader" :prop="item" :label="item" :key="item" />
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible1 = false">{{$t('button.cancel')}}</el-button>
        <el-button type="primary" @click="createData()">{{$t('button.submit')}}</el-button>
      </div>
    </el-dialog>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page_no" :limit.sync="listQuery.page_size" @pagination="getList" />
  </div>
</template>

<script>
import {
  QuotationRequestList,
  SaveQuotationRequest
} from "@/api/requestandbid";
import { parseTime } from "@/utils/index";
import waves from "@/directive/waves"; // Waves directive
import permission from "@/directive/permission/index.js"; // 权限判断指令
import checkPermission from "@/utils/permission"; // 权限判断函数
import Pagination from "@/components/Pagination"; // Secondary package based on el-pagination
import Log from "@/components/Log";
import UploadExcelComponent from "@/components/UploadExcel/index.vue";
export default {
  name: "requestList",
  components: { Pagination, UploadExcelComponent, Log },
  directives: { waves, permission },
  data() {
    return {
      tableKey: 0,
      total: 0,
      listLoading: true, //加载loading
      listQuery: {
        request_date: "",
        goods_no: "",
        brand_name: "",
        page_size: 20,
        page_no: 1,
        order_by: "",
        direction: ""
      }, //搜索条件
      list: [],
      formdata: {
        goods_no: "",
        num: "",
        request_date: "",
        expired_date: ""
      },
      dialogFormVisible: false, //弹出框是否显示
      dialogFormVisible1: false, //弹出框是否显示
      dialogStatus: "", //弹出框类型 新建or编辑
      
      tableData: [],
      tableHeader: [],
      multipleSelection: [],
     
    };
  },
  computed: {
    rules:function(){
      const rules={
        goods_no: [
          { required: true, message: this.$t('requestList.goods_no_rule'), trigger: "blur" }
        ],
        num: [{ required: true, message: this.$t('requestList.num_rule'), trigger: "blur" }],
        request_date: [
          { required: true, message: this.$t('requestList.request_date_rule'), trigger: "blur" }
        ],
        expired_date: [
          { required: true, message: this.$t('requestList.expired_date_rule'), trigger: "blur" }
        ]
      }
      return rules
    },
    status_list:function(){
       const rules= [
        { label: this.$t('tag.quote'), value: "00" },
        { label: this.$t('tag.quoted'), value: "10" },
        { label: this.$t('tag.outdate'), value: "20" }
      ];
      return rules
    },
    textMap:function(){
      const rules={
        update: this.$t('dialog.edit_title'),
        create: this.$t('dialog.add_title'),
        into: this.$t('dialog.into_title'),
      };
      return rules
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
      QuotationRequestList(this.listQuery).then(response => {
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
    parseTime(row, column) {
      if (column.property == "request_date") return parseTime(row.request_date);
      if (column.property == "expired_date") return parseTime(row.expired_date);
    },
    // 创建询价单
    handleCreate() {
      this.resetFormdata();
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["formdata"].clearValidate();
      });
    },
    // 编辑
    handleUpdate(row) {
      this.formdata = Object.assign({}, row); // copy obj
      this.dialogStatus = "update";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["formdata"].clearValidate();
      });
    },
    handleInto() {
      this.dialogStatus = "into";
      this.dialogFormVisible1 = true;
    },
    handleLink(type, row) {
      if (type == 1) {
        this.$router.push({
          name: "bidDetail",
          query: {
            id: row.id
          }
        });
      } else {
        if (this.multipleSelection.length == 0) {
          this.$message({
            type: "error",
            message: this.$t("requestList.choose_product")
          });
          return;
        }
        var id = "";
        for (var i = 0; i < this.multipleSelection.length; i++) {
          id += this.multipleSelection[i].id + ",";
        }
        id = id.slice(0, -1);
        this.$router.push({
          name: "bidDetail",
          query: {
            id: id
          }
        });
      }
    },
    // 初始化form
    resetFormdata() {
      this.formdata = {
        goods_no: "",
        num: "",
        request_date: "",
        expired_date: ""
      };
    },
    createData() {
      if (this.dialogStatus == "create" || this.dialogStatus == "update") {
        this.$refs["formdata"].validate(valid => {
          if (valid) {
            var arr = [];
            arr.push(this.formdata);
            SaveQuotationRequest(arr).then(response => {
              if (response.data.res_status_code == 0) {
                this.$message({
                  type: "success",
                  message: this.$t("message.savesuccess")
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
          }
        });
      } else if (this.dialogStatus == "into") {
        SaveQuotationRequest(this.tableData).then(response => {
          if (response.data.res_status_code == 0) {
            this.$message({
              type: "success",
              message: this.$t("message.savesuccess")
            });
            this.dialogFormVisible1 = false;
            this.getList();
          } else {
            this.$message({
              type: "error",
              message: response.data.res_message,
              dangerouslyUseHTMLString: true
            });
          }
        });
      }
    },
    beforeUpload(file) {
      const isLt1M = file.size / 1024 / 1024 < 1;

      if (isLt1M) {
        return true;
      }

      this.$message({
        message: "Please do not upload files larger than 1m in size.",
        type: "warning"
      });
      return false;
    },
    handleSuccess({ results, header }) {
      var data = [];
      for (var i = 0; i < results.length; i++) {
        if (results[i].goods_no !== "商品编码") {
          data.push(results[i]);
        }
      }
      this.tableData = data;
      this.tableHeader = header;
    },
    handleSelectionChange(val) {
      console.log(val);
      this.multipleSelection = val;
    },
    selectable(row, index) {
      if (row.status === "20") {
        return false;
      } else {
        return true;
      }
    }
  }
};
</script>


<template>
 <el-row style="padding:20px">
  <el-col :span="10">
    <el-card shadow="hover"> 
      <div slot="header" class="clearfix">
        <span>活动编辑</span>
        <el-button style="float: right; " @click="dialogTableVisible = true">弹窗</el-button>
      </div>  
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm"> 
        <el-form-item label="活动名称" prop="name">  
          <el-input v-model="ruleForm.name"></el-input> 
        </el-form-item>  
        <el-form-item label="活动区域" prop="region">  
          <el-select v-model="ruleForm.region" placeholder="请选择活动区域"> 
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="活动时间" required>
          <el-col :span="11">
            <el-form-item prop="date1">
              <el-date-picker type="date" placeholder="选择日期" v-model="ruleForm.date1" style="width: 100%;"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col class="line" :span="2">-</el-col>
          <el-col :span="11">
            <el-form-item prop="date2">
              <el-time-picker type="fixed-time" placeholder="选择时间" v-model="ruleForm.date2" style="width: 100%;"></el-time-picker>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item label="即时配送" prop="delivery">
          <el-switch v-model="ruleForm.delivery"></el-switch>
        </el-form-item>
        <el-form-item label="活动性质" prop="type">
          <el-checkbox-group v-model="ruleForm.type">
            <el-checkbox label="美食/餐厅线上活动" name="type"></el-checkbox>
            <el-checkbox label="地推活动" name="type"></el-checkbox>
            <el-checkbox label="线下主题活动" name="type"></el-checkbox>
            <el-checkbox label="单纯品牌曝光" name="type"></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="特殊资源" prop="resource">
          <el-radio-group v-model="ruleForm.resource">
            <el-radio label="线上品牌商赞助"></el-radio>
            <el-radio label="线下场地免费"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="上传图片" prop="resource">
          <div >
           <dropzone id="myVueDropzone" url="https://httpbin.org/post" :thumbnailHeight="100" :thumbnailWidth="100" :maxFiles="10" @dropzone-removedFile="dropzoneR" @dropzone-success="dropzoneS"/>
          </div>
        </el-form-item>
        <el-form-item label="上传图片" prop="resource">
          <div >
           <dropzone id="myVueDropzone1" url="https://httpbin.org/post" :thumbnailHeight="100" :thumbnailWidth="100" :maxFiles="10" @dropzone-removedFile="dropzoneR" @dropzone-success="dropzoneS"/>
          </div>
        </el-form-item>
        <el-form-item label="活动形式" prop="desc">
          <el-input type="textarea" v-model="ruleForm.desc"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </el-col>
  <el-col :span="1">&nbsp;</el-col>
  <el-col :span="13">
    <el-card shadow="hover">
       <div slot="header" class="clearfix">
        <span>列表</span>
      </div> 
       <el-table
      v-loading="listLoading"
      :key="tableKey"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;" height="600"
      @sort-change="sortChange">
      <el-table-column label="序号" prop="id" sortable="custom" align="center" width="65">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="时间" prop="id" width="150px" sortable="custom" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.timestamp | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
       <el-table-column label="图片"  width="150px"  align="center">
        <template slot-scope="scope">
          <img style="width:100px" :src="scope.row.image_uri" alt="scope.row.image_uri">
        </template>
      </el-table-column>
      <el-table-column label="名称"  width="150px"  align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.content_short}}</span>
        </template>
      </el-table-column>
      <el-table-column label="内容"  width="150px"  align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.content}}</span>
        </template>
      </el-table-column>
      
      <el-table-column label="作者" width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.author }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" align="center" width="150" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" icon="el-icon-edit"  @click="handleUpdate(scope.row)"></el-button>
          <el-button v-if="scope.row.status!='deleted'" size="mini" icon="el-icon-delete" type="danger" @click="handleModifyStatus(scope.row,'deleted')">
          </el-button>
        </template>
      </el-table-column>
    </el-table>
 

    </el-card>
  </el-col>
<el-dialog title="收货地址" :visible.sync="dialogTableVisible" :append-to-body="true">
   <el-table
      v-loading="listLoading"
      :key="tableKey"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;" height="600"
      @sort-change="sortChange">
      <el-table-column label="序号" prop="id" sortable="custom" align="center" width="65">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="时间" prop="id" width="150px" sortable="custom" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.timestamp | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
       <el-table-column label="图片"  width="150px"  align="center">
        <template slot-scope="scope">
          <img style="width:100px" :src="scope.row.image_uri" alt="scope.row.image_uri">
        </template>
      </el-table-column>
      <el-table-column label="名称"  width="150px"  align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.content_short}}</span>
        </template>
      </el-table-column>
      <el-table-column label="内容"  width="150px"  align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.content}}</span>
        </template>
      </el-table-column>
      
      <el-table-column label="作者" width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.author }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" align="center" width="150" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" icon="el-icon-edit"  @click="handleUpdate(scope.row)"></el-button>
          <el-button v-if="scope.row.status!='deleted'" size="mini" icon="el-icon-delete" type="danger" @click="handleModifyStatus(scope.row,'deleted')">
          </el-button>
        </template>
      </el-table-column>
    </el-table>
</el-dialog>
 </el-row>

</template>
<script>
import Dropzone from "@/components/Dropzone";
import {
  fetchList,
  fetchPv,
  createArticle,
  updateArticle
} from "@/api/article";
import waves from "@/directive/waves"; // Waves directive
import { parseTime } from "@/utils";
export default {
  name: "formexample",
  components: { Dropzone },
  data() {
    return {
      ruleForm: {
        name: "",
        region: "",
        date1: "",
        date2: "",
        delivery: false,
        type: [],
        resource: "",
        desc: ""
      },
      dialogTableVisible: false,
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: "+id"
      },
      rules: {
        name: [
          {
            required: true,
            message: "请输入活动名称",
            trigger: "blur"
          },
          {
            min: 3,
            max: 5,
            message: "长度在 3 到 5 个字符",
            trigger: "blur"
          }
        ],
        region: [
          {
            required: true,
            message: "请选择活动区域",
            trigger: "change"
          }
        ],
        date1: [
          {
            type: "date",
            required: true,
            message: "请选择日期",
            trigger: "change"
          }
        ],
        date2: [
          {
            type: "date",
            required: true,
            message: "请选择时间",
            trigger: "change"
          }
        ],
        type: [
          {
            type: "array",
            required: true,
            message: "请至少选择一个活动性质",
            trigger: "change"
          }
        ],
        resource: [
          {
            required: true,
            message: "请选择活动资源",
            trigger: "change"
          }
        ],
        desc: [
          {
            required: true,
            message: "请填写活动形式",
            trigger: "blur"
          }
        ]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      this.listLoading = true;
      fetchList(this.listQuery).then(response => {
        console.log(response.data.items);
        this.list = response.data.items;
        this.total = response.data.total;

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false;
        }, 1.5 * 1000);
      });
    },
     handleFilter() {
      this.listQuery.page = 1;
      this.getList();
    },
    sortChange(data) {
      const { prop, order } = data;
      if (prop === "id") {
        this.sortByID(order);
      }
    },
     sortChange(data) {
      const { prop, order } = data;
      if (prop === "id") {
        this.sortByID(order);
      }
    },
    sortByID(order) {
      if (order === "ascending") {
        this.listQuery.sort = "+id";
      } else {
        this.listQuery.sort = "-id";
      }
      this.handleFilter();
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          alert("submit!");
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },

    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    dropzoneS(file) {
      console.log(file);
      this.$message({ message: "Upload success", type: "success" });
    },
    dropzoneR(file) {
      console.log(file);
      this.$message({ message: "Delete success", type: "success" });
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

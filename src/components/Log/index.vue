<template>
    <div style="position:relative">
        <el-button style="margin:0 0 20px 0" @click="open()">
            <svg-icon style="margin:0 10px 0 0" icon-class="documentation" />{{$t('log.title')}}</el-button>
        <el-dialog :title="$t('log.title')" :visible.sync="dialogTableVisible" :append-to-body="true">
            <el-table v-loading="listLoading" stripe :key="tableKey" :data="list" border fit highlight-current-row style="width: 100%;" height="400">
                <el-table-column :label="$t('table.No')" type="index" prop="id" align="center">
                </el-table-column>
                <el-table-column :label="$t('log.update')" align="center">
                    <template slot-scope="scope">
                        <span>{{ scope.row.user_name}}</span>
                    </template>
                </el-table-column>
                <el-table-column :label="$t('log.operate')" align="left">
                    <template slot-scope="scope">
                        <span>{{ scope.row.operation_log}}</span>
                    </template>
                </el-table-column>
                <el-table-column :label="$t('log.time')" align="left" prop="operation_date_time" :formatter="parseTime">
                </el-table-column>
            </el-table>

        </el-dialog>

    </div>
</template>

<script>
import { logList } from "@/api/log";
import { parseTime } from "@/utils/index";
export default {
  name: "Log",
  props: {
    type: {
      //获取日志参数
      type: String
    },
    id: {
      type: [String, Number]
    }
  },
  data() {
    return {
      dialogTableVisible: false,
      listLoading: true,
      listQuery: {},
      list: [],
      tableKey: 0
    };
  },
  mounted(){
    //   document.body.appendChild(this.$el)
  },
  methods: {
    open() {
      this.dialogTableVisible = true;
      this.getList();
    },
    parseTime(row, column) {
        console.log(column)
      if (column.property == "operation_date_time") return parseTime(row.operation_date_time);
    },
    getList() {
      this.listQuery.operation_name = this.type;
      this.listQuery.id = this.id;
      logList(this.listQuery).then(response => {
        this.listLoading = false;
        if (response.data.res_status_code == 0) {
          this.list = response.data.res_content;
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
</script>

<style scoped>
</style>

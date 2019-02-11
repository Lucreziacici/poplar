<template>
  <div>
    <el-row>
      <p>只能上传一张图</p>
      <UploadFile :files="file_list1" id="test1" :maxFiles="1" :disabled='true' v-on:changeFile="changeFile1"></UploadFile>
    </el-row>
    <el-row>
      <p>上传多张图</p>
      <UploadFile :files="file_list2" id="test2" :maxFiles="100"  :disabled='true'  v-on:changeFile="changeFile2"></UploadFile>
    </el-row>
    <el-row>
      <p>上传多张图，可排序</p>
      <UploadFile :files="file_list3" id="test3" :maxFiles="100" :disabled='false' v-on:changeFile="changeFile3"></UploadFile>
    </el-row>
  </div>
</template>
<script>
import waves from "@/directive/waves"; // Waves directive
import Dropzone from "@/components/Dropzone";
import UploadFile from "@/components/UploadFile";
export default {
  name: "test",
  components: { Dropzone, UploadFile },
  directives: { waves },
  data() {
    return {
      // file_list:["http://182.254.151.220:8060/Uploads/20181206/fa470994-c88c-4e2c-93eb-4d8c43dc1bbe.png","http://182.254.151.220:8060/Uploads/20181206/d6899d2d-9b72-432a-bd79-30cbca20278a.pdf","http://182.254.151.220:8060/Uploads/20181206/fa470994-c88c-4e2c-93eb-4d8c43dc1bbe.png"]
      // file_list:["http://182.254.151.220:8060/Uploads/20181206/fa470994-c88c-4e2c-93eb-4d8c43dc1bbe.png"]
      file_list1:
        "http://182.254.151.220:8060/Uploads/20181206/fa470994-c88c-4e2c-93eb-4d8c43dc1bbe.png",
      file_list2:
        "http://182.254.151.220:8060/Uploads/20181206/fa470994-c88c-4e2c-93eb-4d8c43dc1bbe.png,http://182.254.151.220:8060/Uploads/20181206/d6899d2d-9b72-432a-bd79-30cbca20278a.pdf,http://182.254.151.220:8060/Uploads/20181206/fa470994-c88c-4e2c-93eb-4d8c43dc1bbe.png",
      file_list3:
        "http://182.254.151.220:8060/Uploads/20181206/fa470994-c88c-4e2c-93eb-4d8c43dc1bbe.png,http://182.254.151.220:8060/Uploads/20181206/d6899d2d-9b72-432a-bd79-30cbca20278a.pdf,http://182.254.151.220:8060/Uploads/20181206/fa470994-c88c-4e2c-93eb-4d8c43dc1bbe.png"
    };
  },
  created() {},
  methods: {
    changeFile1(i) {
      this.file_list1 = i;
    },
    changeFile2(i) {
      this.file_list2 = i;
    },
    changeFile3(i) {
      this.file_list3 = i;
    }
  }
};
</script>
<style scoped>
</style>


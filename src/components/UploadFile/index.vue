<template>
  <div class="upload-file">
    <draggable v-if="file_list.length>0" :list="file_list" :options="{disabled:disabled,animation:120}" @update="checkMove">
      <div v-for="(item,index) in file_list" :key="index" class="upload" :style="{'cursor':!disabled? 'move':''}">
        <img :src="item" :onerror="errorImg" alt="点击查看">
        <div class="layer">
          <a target="view_window" :href="item">
            <i class="el-icon-zoom-in"></i>
          </a>
          <i @click="deleteimg(index)" class="el-icon-delete"></i>
        </div>
      </div>
    </draggable>
    <div class="upload" @click="open()">
      <i class="el-icon-upload"></i>
      <p>{{$t('upload.upload')}}</p>
    </div>
    <el-dialog :title="$t('upload.title')" :visible.sync="dialogFormVisible" :append-to-body="true">
      <dropzone v-if="dialogFormVisible" :id="id" :thumbnailHeight="100" :acceptedFiles="acceptedFiles" :defaultMsg="$t('upload.content')" :thumbnailWidth="100" :maxFiles="8" @dropzone-removedFile="dropzoneR" @dropzone-success="dropzoneS" />
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false;image=[]">{{$t("button.cancel")}}</el-button>
        <el-button type="primary" @click="confirm()">{{$t("button.submit")}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import draggable from "vuedraggable";
import Dropzone from "@/components/Dropzone";
import errorimage from "@/assets/word/word.png";
export default {
  name: "uploadfile",
  props: {
    id: {
      type: String, //id
      default: "myVueDropzone"
    },
    files: {
      type: String, //文件列表
      default: ""
    },
    maxFiles: {
      type: Number, //最大上传数
      required: true
    },
    acceptedFiles: {
      type: String, //可接受文件类型
      default: ".jpg,.gif,.png,.pdf,.xls,.doc"
    },
    disabled: {
      type: Boolean, //是否可以拖拽排序 true 不开启  false 开启
      default: false
    }
  },
  components: { Dropzone, draggable },
  data() {
    return {
      dialogFormVisible: false,
      errorImg: 'this.src="' + errorimage + '"',
      image: [],
      file_list: []
    };
  },
  created() {
    this.$nextTick(() => {
      if (this.files == ""||!this.files) {
        this.file_list = [];
      } else {
        this.file_list = this.files.split(",");
      }
    });
  },
  computed: {},
  mounted: function() {
    this.$nextTick(() => {
      if (this.files == ""||!this.files) {
        this.file_list = [];
      } else {
        this.file_list = this.files.split(",");
      }
    });
  },
  watch: {
    files(val, oldVal) {
      //普通的watch监听
      this.$nextTick(() => {
        if (this.files == ""||!this.files) {
          this.file_list = [];
        } else {
          this.file_list = this.files.split(",");
        }
      });
    }
  },
  methods: {
    //上传文件
    dropzoneS(file) {
      this.image.push(JSON.parse(file.xhr.response).File);
    },
    dropzoneR(file) {
      console.log(file);
    },
    deleteimg(i) {
      this.file_list.splice(i, 1);
      this.$emit("changeFile", this.file_list.join(","));
      // this.files = this.file_list.join(",");
    },
    confirm() {
      if (this.maxFiles == 1) {
        this.file_list = [];
      }
      if (this.file_list.length + this.image.length > this.maxFiles) {
        this.$message({
          type: "warning",
          message: "超过上传数最大值"
        });
        this.dialogFormVisible = false;
        this.image = [];
        return false;
      }
      this.file_list = this.file_list.concat(this.image);
      this.$emit("changeFile", this.file_list.join(","));
      this.dialogFormVisible = false;
      this.image = "";
      this.image = [];
    },
    open() {
      if (
        this.file_list.length + this.image.length >= this.maxFiles &&
        this.maxFiles !== 1
      ) {
        this.$message({
          type: "warning",
          message: "超过上传数最大值"
        });
        return false;
      }
      this.dialogFormVisible = true;
    },
    checkMove(e) {
      this.$emit("changeFile", this.file_list.join(","));
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.upload {
  width: 120px;
  height: 120px;
  border: 1px dashed;
  display: flex;
  justify-content: center;
  align-self: center;
  flex-direction: column;
  color: #42b983;
  overflow: hidden;
  cursor: pointer;
  position: relative;
  margin: 0 6px 6px 0;
  border-radius: 5px;
  padding: 0;
  float: left;
  cursor: pointer;
  i {
    font-size: 1.5em;
    text-align: center;
  }
  p {
    text-align: center;
    font-size: 0.5em;
  }
  img {
    position: absolute;
    left: 0px;
    right: 0px;
    top: 0px;
    bottom: 0px;
    margin: auto;
    width: 110px;
    display: block;
  }
  .layer {
    position: absolute;
    left: 0px;
    right: 0px;
    top: 0px;
    bottom: 0px;
    margin: auto;
    transition-property: background 0.3s ease-out 0s;
    /* Firefox 4 */
    -moz-transition: background 0.3s ease-out 0s;
    /* Safari and Chrome */
    -webkit-transition: background 0.3s ease-out 0s;
    /* Opera */
    -o-transition: background 0.3s ease-out 0s;
    i {
      display: none;
    }
  }
  .layer:hover {
    background: rgba($color: #000000, $alpha: 0.4);
    color: white;
    display: flex;
    justify-content: space-around;
    align-items: center;
    i {
      display: block;
    }
  }
}
</style>

<template>
  <div class="edit-container">
    <vxe-table
      ref="programTable"
      :data.sync="programList"
      border
      show-header-overflow
      show-overflow
      highlight-hover-row
      resizable
      size="small"
    >
      <vxe-table-column type="seq" width="60"></vxe-table-column>
      <vxe-table-column field="name" title="名称"></vxe-table-column>
      <vxe-table-column field="createTime" title="创建时间" width="200"></vxe-table-column>
      <vxe-table-column field="operator" title="创建人" width="150"></vxe-table-column>
      <vxe-table-column type="expand" title="测试项" width="100">
        <template v-slot:content="{ row }">
          <vxe-table :data="row.item" size="mini">
            <vxe-table-column type="seq" width="60"></vxe-table-column>
            <vxe-table-column field="name" title="名称" width="100"></vxe-table-column>
            <vxe-table-column field="description" title="描述"></vxe-table-column>
            <vxe-table-column field="param" title="参数"></vxe-table-column>
          </vxe-table>
        </template>
      </vxe-table-column>
      <vxe-table-column title="操作">
        <template v-slot="{ row }">
          <template>
            <el-button size="mini" type="primary" @click="onClickEditProgram(row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="onClickDeleteProgram(row)">删除</el-button>
          </template>
        </template>
      </vxe-table-column>
    </vxe-table>

    <!-- 编辑 -->
    <el-dialog
      title="编辑"
      :visible.sync="editProgramDialogVisible"
      width="1200px"
      :modal="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
    >
      <el-row :gutter="20">
        <el-col :span="4">
          <el-table
            :data.sync="testCaseList"
            size="mini"
            style="cursor: pointer;"
            height="500"
            @cell-click="handleTestCaseClick"
            stripe
            border
          >
            <el-table-column
              prop="name"
              show-overflow-tooltip
              align="center"
              label="可选测试项目"
            ></el-table-column>
          </el-table>
        </el-col>
        <el-col :span="20">
          <div>
            <span>程序名称：</span>
            <el-input v-model="programEdit.name" placeholder="请输入程序名称" size="mini" style="width: 800px;"></el-input>
          </div>
          <div style="margin-top: 20px;">测试项：</div>
          <vxe-table
            :data.sync="programEdit.item"
            size="mini"
            height="430"
            :edit-config="{trigger: 'click', mode: 'cell'}"
            border
            stripe
            resizable
            highlight-hover-row
          >
            <vxe-table-column type="seq" width="60"></vxe-table-column>
            <vxe-table-column field="name" title="名称" width="100"></vxe-table-column>
            <vxe-table-column field="description" title="描述"></vxe-table-column>
            <vxe-table-column field="param" title="参数" :edit-render="{name: 'input', attrs: {type: 'text'}}"></vxe-table-column>
            <vxe-table-column title="操作" width="150">
              <template v-slot="scope">
                <el-button type="text" size="mini" @click="onClickTestCaseUp(scope.rowIndex, scope.row)" :disabled="scope.rowIndex === 0">上移</el-button>
                <el-button type="text" size="mini" @click="onClickTestCaseDown(scope.rowIndex, scope.row)" :disabled="scope.rowIndex === programEdit.item.length - 1">下移</el-button>
                <el-button type="text" size="mini" @click="onClickDeleteTestCase(scope.rowIndex)" style="color: #F56C6C;">移除</el-button>
              </template>
            </vxe-table-column>
          </vxe-table>
        </el-col>
      </el-row>
      <div slot="footer" style="text-align: center;">
        <el-button size="small" @click="onClickEditProgramCancel">取消</el-button>
        <el-button type="primary" size="small" @click="onClickEditProgramOk">确定</el-button>
      </div>
    </el-dialog>
    <!-- 新建 -->
    <el-dialog
      title="新建"
      :visible.sync="newProgramDialogVisible"
      width="1200px"
      :modal="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
    >
      <el-row :gutter="20">
        <el-col :span="4">
          <el-table
            :data.sync="testCaseList"
            size="mini"
            style="cursor: pointer;"
            height="500"
            @cell-click="handleTestCaseClick"
            stripe
            border
          >
            <el-table-column
              prop="name"
              show-overflow-tooltip
              align="center"
              label="可选测试项目"
            ></el-table-column>
          </el-table>
        </el-col>
        <el-col :span="20">
          <div>
            <span>程序名称：</span>
            <el-input v-model="programEdit.name" placeholder="请输入程序名称" size="mini" style="width: 800px;"></el-input>
          </div>
          <div style="margin-top: 20px;">测试项：</div>
          <!-- <vxe-table
            :data.sync="programEdit.item"
            size="mini"
            height="430"
            :edit-config="{trigger: 'click', mode: 'cell'}"
            border
            stripe
            resizable
            highlight-hover-row
          >
            <vxe-table-column type="seq" width="60"></vxe-table-column>
            <vxe-table-column field="name" title="名称" width="100"></vxe-table-column>
            <vxe-table-column field="description" title="描述"></vxe-table-column>
            <vxe-table-column field="param" title="参数" :edit-render="{name: 'input', attrs: {type: 'text'}}"></vxe-table-column>
            <vxe-table-column title="操作" width="150">
              <template v-slot="scope">
                <el-button type="text" size="mini" @click="onClickTestCaseUp(scope.rowIndex, scope.row)" :disabled="scope.rowIndex === 0">上移</el-button>
                <el-button type="text" size="mini" @click="onClickTestCaseDown(scope.rowIndex, scope.row)" :disabled="scope.rowIndex === programEdit.item.length - 1">下移</el-button>
                <el-button type="text" size="mini" @click="onClickDeleteTestCase(scope.rowIndex)" style="color: #F56C6C;">移除</el-button>
              </template>
            </vxe-table-column>
          </vxe-table> -->
          <el-table
            :data.sync="programEdit.item"
            size="mini"
            height="430"
            border
            stripe
          >
            <el-table-column type="index" width="60"></el-table-column>
            <el-table-column prop="name" label="名称" width="100"></el-table-column>
            <el-table-column prop="description" label="描述"></el-table-column>
            <el-table-column prop="param" label="参数"></el-table-column>
            <el-table-column label="操作" width="150">
              <template slot-scope="scope">
                <el-button type="text" size="mini" @click="onClickTestCaseUp(scope.$index, scope.row)" :disabled="scope.$index === 0">上移</el-button>
                <el-button type="text" size="mini" @click="onClickTestCaseDown(scope.$index, scope.row)" :disabled="scope.$index === programEdit.item.length - 1">下移</el-button>
                <el-button type="text" size="mini" @click="onClickDeleteTestCase(scope.$index)" style="color: #F56C6C;">移除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <div slot="footer" style="text-align: center;">
        <el-button size="small" @click="onClickNewProgramCancel">取消</el-button>
        <el-button type="primary" size="small" @click="onClickNewProgramOk">确定</el-button>
      </div>
    </el-dialog>

    <el-button type="primary" class="new-button" @click="onClickNewProgram">新建</el-button>
  </div>
</template>

<script>
import TestCase from '@/common/testCase';
import moment from 'moment';

export default {
  name: 'edit',

  data() {
    return {
      programList: [],
      testCaseList: Object.values(TestCase),
      editProgramDialogVisible: false,
      newProgramDialogVisible: false,
      programEdit: {},
    };
  },

  methods: {
    isEmpty(obj) {
      if (typeof obj === 'undefined' || obj == null || obj === '') {
        return true;
      }
      return false;
    },
    onClickNewProgram() {
      this.newProgramDialogVisible = true;
      this.programEdit = {};
      this.programEdit.item = [];
    },
    onClickNewProgramCancel() {
      this.$confirm('取消新建', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          this.$message('取消新建');
          this.newProgramDialogVisible = false;
        })
        .catch((err) => console.log(err));
    },
    async onClickNewProgramOk() {
      if (!this.isEmpty(this.programEdit.name) && await this.checkProgramName(this.programEdit.name)) {
        this.programEdit.createTime = moment().format('YYYY-MM-DD HH:mm:ss');
        this.programEdit.operator = sessionStorage.getItem('username');
        this.$db.program.insert(this.programEdit, (err) => {
          if (err) {
            this.$message.error('保存失败');
          } else {
            this.newProgramDialogVisible = false;
            this.updateProgramList();
          }
        });
      } else {
        this.$message.error('程序名称已存在或为空');
      }
    },
    onClickDeleteProgram(row) {
      this.$confirm('确认删除', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          this.$db.program.remove({ _id: row._id }, {}, (err, numRemoved) => {
            if (err || numRemoved <= 0) {
              this.$message.error('删除失败');
            } else {
              this.$refs.programTable.remove(row);
            }
          });
        })
        .catch(() => {
          this.$message('取消删除');
        });
    },
    onClickEditProgram(row) {
      this.editProgramDialogVisible = true;
      this.programEdit = row;
      if (!this.programEdit.item) {
        this.programEdit.item = [];
      }
    },
    onClickEditProgramCancel() {
      this.$confirm('取消编辑', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          this.$message('取消修改');
          this.editProgramDialogVisible = false;
        })
        .catch((err) => console.log(err));
    },
    onClickEditProgramOk() {
      this.programEdit.createTime = moment().format('YYYY-MM-DD HH:mm:ss');
      this.$db.program.update({ _id: this.programEdit._id }, this.programEdit, (err, numReplaced) => {
        console.log(err, numReplaced);
        this.editProgramDialogVisible = false;
      });
    },
    onClickDeleteTestCase(index) {
      this.programEdit.item.splice(index, 1);
    },
    onClickTestCaseUp(index, row) {
      this.programEdit.item[index] = this.programEdit.item.splice(index - 1, 1, row).pop();
    },
    onClickTestCaseDown(index, row) {
      this.programEdit.item[index] = this.programEdit.item.splice(index + 1, 1, row).pop();
    },
    handleTestCaseClick(row) {
      this.programEdit.item.push(row);
    },
    updateProgramList() {
      this.$db.program.find({}).sort({ createTime: 1 }).exec((err, docs) => {
        this.programList = docs;
      });
    },
    async checkProgramName(name) {
      let result = [];
      await new Promise((resolve) => {
        this.$db.program.find({ name }).exec((err, docs) => {
          result = docs;
          resolve();
        });
      });
      if (result.length <= 0) {
        return true;
      }
      return false;
    },
  },

  mounted() {
    this.updateProgramList();
  },
};
</script>

<style lang="scss" scoped>
.edit-container {
  width: 100%;
  padding: 5px;
}

.test-case-list {
  width: 100px;
  height: 100%;
  overflow-y: auto;
}
.new-button {
  position: absolute;
  bottom: 10px;
  left: 10px;
}
</style>

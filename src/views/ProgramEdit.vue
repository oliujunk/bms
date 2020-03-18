<template>
  <div class='programEdit'>
    <el-row :gutter='20'>
      <el-col :span='6'>
        <div class='grid-content bg-purple'>
          <div class='testListContainer'>
            <div class='testListHeader'>测试项目列表</div>
            <el-scrollbar class='testListContent' style='height: 745px;'>
              <ul class='testListUl'>
                <li class='testListItem' v-for='(item, index) in testItemLists' :key='index' >
                  <el-button
                    @click='addTestiItem(index)' >{{ item.testItemName }}</el-button>
                </li>
              </ul>
            </el-scrollbar>
          </div>
        </div>
      </el-col>
      <el-col :span='18'>
        <div class='grid-content bg-purple programHandleContainer'>
          <el-button type='primary' icon='el-icon-folder-add' @click='newProgramHandle'>新建</el-button>
          <el-button type='primary' icon='el-icon-folder-opened' @click='openProgramHandle'>打开</el-button>
          <el-button type='primary' icon='el-icon-folder-checked' @click='saveProgramHandle'>保存</el-button>
          <el-button type='primary' icon='el-icon-folder-delete' @click='resetProgramHandle'>重置</el-button>
          <el-dialog title='新建测试程序' :visible.sync='newProgramDialogFlag'>
            <el-form :model='newProgramInfo'>
              <el-form-item label='程序名称'>
                <el-input @input='newProgramNameChange' v-model='newProgramInfo.programName' placeholder='请输入程序名' autocomplete='off'></el-input>
                <span class='programNameInputTip' v-if='newProgramNameUniqueFlag'>程序名'{{ newProgramInfo.programName }}'与现有程序名冲突，请更换一个程序名</span>
              </el-form-item>
              <el-form-item label='创建人'>
                <el-input v-model='newProgramInfo.createOperator' autocomplete='off'></el-input>
              </el-form-item>
              <el-form-item label='更新时间'>
                <el-input v-model='newProgramInfo.createDate' autocomplete='off'></el-input>
              </el-form-item>
              <el-form-item label='正确性'>
                <el-input v-model='newProgramInfo.correctFlag' autocomplete='off'></el-input>
              </el-form-item>
            </el-form>
            <div slot='footer' class='dialog-footer'>
              <el-button @click='confirmNewProgramHandle(false)'>取 消</el-button>
              <el-button type='primary' @click='confirmNewProgramHandle(true)'>确 定</el-button>
            </div>
          </el-dialog>
          <el-dialog title='测试程序列表' :visible.sync='openProgramDialogFlag'>
            <el-table
              ref='testProgramListRef'
              :data='testProgramList'
              highlight-current-row
              @current-change='selectestProgramList'
              >
              <el-table-column property='programName' label='程序名' width='150'></el-table-column>
              <el-table-column property='createOperator' label='创建人' width='200'></el-table-column>
              <el-table-column property='createDate' label='更新时间'></el-table-column>
              <el-table-column label='正确性'>
                <template slot-scope='scope'>{{ scope.row.correctFlag ? '正确' : '未验证' }}</template>
              </el-table-column>
            </el-table>
            <div slot='footer' class='dialog-footer'>
              <el-button @click='confirmOpenProgramHandle(false)'>取 消</el-button>
              <el-button type='primary' @click='confirmOpenProgramHandle(true)'>确 定</el-button>
            </div>
          </el-dialog>
          <el-dialog
            title='提示'
            :visible.sync='saveProgramDialogFlag'
            width='30%'
            >
            <span>是否保存程序修改信息</span>
            <span slot='footer' class='dialog-footer'>
              <el-button @click='confirmSaveProgramHandle(false)'>取 消</el-button>
              <el-button type='primary' @click='confirmSaveProgramHandle(true)'>确 定</el-button>
            </span>
          </el-dialog>
          <el-dialog
            title='提示'
            :visible.sync='resetProgramDialogFlag'
            width='30%'
            >
            <span>是否重置当前修改</span>
            <span slot='footer' class='dialog-footer'>
              <el-button @click='resetProgramDialogFlag = false'>取 消</el-button>
              <el-button type='primary' @click='resetProgramDialogFlag = false'>确 定</el-button>
            </span>
          </el-dialog>
        </div>
        <div class='programNameContainer'>
          <label>当前程序：</label>
          <span>{{ currentProgramInfo.programName }}</span>
          <!-- <el-button type='primary' icon='el-icon-edit' @click='editProgramNameFlag = true'>编辑</el-button>
          <el-dialog title='测试程序列表' :visible.sync='editProgramNameFlag'>
            <el-form :model='newProgramInfo'>
              <el-form-item label='程序名称' :label-width='formLabelWidth'>
                <el-input v-model='newProgramInfo.programName' autocomplete='off'></el-input>
              </el-form-item>
              <el-form-item label='创建人' :label-width='formLabelWidth'>
                <el-input v-model='newProgramInfo.createOperator' autocomplete='off'></el-input>
              </el-form-item>
              <el-form-item label='更新时间' :label-width='formLabelWidth'>
                <el-input v-model='newProgramInfo.createDate' autocomplete='off'></el-input>
              </el-form-item>
              <el-form-item label='正确性' :label-width='formLabelWidth'>
                <el-input v-model='newProgramInfo.correctFlag' autocomplete='off'></el-input>
              </el-form-item>
            </el-form>
            <div slot='footer' class='dialog-footer'>
              <el-button @click='editProgramNameFlag = false'>取 消</el-button>
              <el-button type='primary' @click='editProgramNameFlag = false'>确 定</el-button>
            </div>
          </el-dialog> -->
        </div>
        <div class='grid-content bg-purple testProgEditContainer'>
          <el-table
            ref='multipleTable'
              :data='currentTestForm'
              tooltip-effect='dark'
              style='width: 100%'
              max-height='781'
              @selection-change='handleSelectionChange'>
            <el-table-column
              type='selection'
              width='55'>
            </el-table-column>
            <el-table-column
              label='编号'
              width='55'>
              <template slot-scope='scope'>{{ scope.$index + 1 }}</template>
            </el-table-column>
            <el-table-column
              label='启用状态'
              width='100'>
              <template slot-scope='scope'>{{ scope.row.enabled ? '已启用' : '未启用' }}</template>
            </el-table-column>
            <el-table-column
              prop='testItemName'
              label='测试项目'
              width='120'>
            </el-table-column>
            <el-table-column
              prop='testItemDescription'
              label='测试项目描述'
              show-overflow-tooltip>
            </el-table-column>
            <el-table-column
              prop='testItemParams'
              label='测试参数'
              show-overflow-tooltip>
            </el-table-column>
            <el-table-column
              label='是否生成报告'
              >
              <template slot-scope='scope'>
                <el-button
                  type='text'
                  size='small'
                  @click.native.prevent='taggleEnabledReport(scope.$index, currentTestForm)'
                >
                  {{ scope.row.enabledReport ? '生成': '不生成' }}
                </el-button>
              </template>
            </el-table-column>
            <el-table-column
              fixed='right'
              label='操作'
              width='120'>
              <template slot-scope='scope'>
                <el-button
                @click.native.prevent='deleteRow(scope.$index, currentTestForm)'
                type='text'
                size='small'>
                移除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'edit',

  data() {
    return {
      testProgramList: [
        {
          programName: 'test01',
          createOperator: 'daiwei',
          createDate: '2020-03-03 17:50:21',
          correctFlag: true,
        },
        {
          programName: 'test02',
          createOperator: 'daiwei',
          createDate: '2020-03-03 17:50:21',
          correctFlag: true,
        },
        {
          programName: 'test03',
          createOperator: 'daiwei',
          createDate: '2020-03-03 17:50:21',
          correctFlag: false,
        },
      ],
      testItemLists: [
        {
          testItemIndex: 1,
          testItemName: 'BMS初始化',
          testItemDescription: '暂无',
          testItemParams: '暂无',
        },
        {
          testItemIndex: 2,
          testItemName: 'DP0001',
          testItemDescription: '暂无',
          testItemParams: '暂无',
        },
        {
          testItemIndex: 3,
          testItemName: 'DP0002',
          testItemDescription: '暂无',
          testItemParams: '暂无',
        },
      ],
      simulateSqlTestItemLists: [
        [
          {
            index: 1,
            enabled: true,
            testItemIndex: 1,
            testItemName: 'BMS初始化',
            testItemDescription: '暂无',
            testItemParams: '暂无',
            enabledReport: true,
          },
          {
            index: 2,
            enabled: true,
            testItemIndex: 1,
            testItemName: 'BMS初始化',
            testItemDescription: '暂无',
            testItemParams: '暂无',
            enabledReport: true,
          },
          {
            index: 3,
            enabled: true,
            testItemIndex: 1,
            testItemName: 'BMS初始化',
            testItemDescription: '暂无',
            testItemParams: '暂无',
            enabledReport: true,
          },
        ],
        [
          {
            index: 1,
            enabled: true,
            testItemIndex: 1,
            testItemName: 'BMS初始化',
            testItemDescription: '暂无',
            testItemParams: '暂无',
            enabledReport: true,
          },
          {
            index: 2,
            enabled: true,
            testItemIndex: 1,
            testItemName: 'BMS初始化',
            testItemDescription: '暂无',
            testItemParams: '暂无',
            enabledReport: true,
          },
          {
            index: 3,
            enabled: true,
            testItemIndex: 1,
            testItemName: 'BMS初始化',
            testItemDescription: '暂无',
            testItemParams: '暂无',
            enabledReport: true,
          },
          {
            index: 4,
            enabled: true,
            testItemIndex: 1,
            testItemName: 'BMS初始化',
            testItemDescription: '暂无',
            testItemParams: '暂无',
            enabledReport: true,
          },
          {
            index: 5,
            enabled: true,
            testItemIndex: 1,
            testItemName: 'BMS初始化',
            testItemDescription: '暂无',
            testItemParams: '暂无',
            enabledReport: true,
          },
        ],
        [
          {
            index: 1,
            enabled: true,
            testItemIndex: 1,
            testItemName: 'BMS初始化',
            testItemDescription: '暂无',
            testItemParams: '暂无',
            enabledReport: true,
          },
          {
            index: 2,
            enabled: true,
            testItemIndex: 1,
            testItemName: 'BMS初始化',
            testItemDescription: '暂无',
            testItemParams: '暂无',
            enabledReport: true,
          },
          {
            index: 3,
            enabled: true,
            testItemIndex: 1,
            testItemName: 'BMS初始化',
            testItemDescription: '暂无',
            testItemParams: '暂无',
            enabledReport: true,
          },
          {
            index: 4,
            enabled: true,
            testItemIndex: 1,
            testItemName: 'BMS初始化',
            testItemDescription: '暂无',
            testItemParams: '暂无',
            enabledReport: true,
          },
          {
            index: 5,
            enabled: true,
            testItemIndex: 1,
            testItemName: 'BMS初始化',
            testItemDescription: '暂无',
            testItemParams: '暂无',
            enabledReport: true,
          },
          {
            index: 6,
            enabled: true,
            testItemIndex: 1,
            testItemName: 'BMS初始化',
            testItemDescription: '暂无',
            testItemParams: '暂无',
            enabledReport: true,
          },
        ],
      ],
      newProgramInfo: {
        programName: '',
        createOperator: '',
        createDate: '',
        correctFlag: '',
      },
      currentProgramInfo: {
        programName: 'test1',
        createOperator: 'daiwei',
        createDate: '2020-03-03 17:50:21',
        correctFlag: false,
      },
      currentTestForm: [
        {
          index: 1,
          enabled: true,
          testItemIndex: 1,
          testItemName: 'BMS初始化',
          testItemDescription: '暂无',
          testItemParams: '暂无',
          enabledReport: true,
        },
      ],
      oldTestForm: [
        {
          index: 1,
          enabled: true,
          testItemIndex: 1,
          testItemName: 'BMS初始化',
          testItemDescription: '暂无',
          testItemParams: '暂无',
          enabledReport: true,
        },
      ],
      currentSelectedTestProgram: null,
      newProgramDialogFlag: false,
      openProgramDialogFlag: false,
      saveProgramDialogFlag: false,
      resetProgramDialogFlag: false,
      editProgramNameFlag: false,
      currentTestData: [
        {
          index: 1,
          id: '1812F476',
          flag: '接受',
          interval: 500,
          dataLength: 7,
          data: '4C 1D D0 07 64 00 01',
          text: '充电机报文CHM: 电压输出5V... 充电机通讯协议 V1.1',
        },
      ],
      newProgramNameUniqueFlag: false,
      simulateTimer: null,
    };
  },

  methods: {
    // 添加测试条目
    addTestiItem(index) {
      const that = this;
      that.currentTestForm.push({
        index: that.currentTestForm.length + 1,
        enabled: true,
        testItemIndex: that.testItemLists[index].testItemIndex,
        testItemName: that.testItemLists[index].testItemName,
        testItemDescription: that.testItemLists[index].testItemDescription,
        testItemParams: that.testItemLists[index].testItemParams,
        enabledReport: true,
      });
    },
    // 激活或关闭所有待测条目
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 删除测试条目
    deleteRow(index, rows) {
      rows.splice(index, 1);
    },
    // 改变测试条目的生成报告标识
    taggleEnabledReport(index, rows) {
      const that = this;
      that.currentTestForm[index].enabledReport = !rows[index].enabledReport;
    },
    // 创建新的测试程序
    newProgramHandle() {
      const that = this;
      // 判断当前是否存在测试程序正在编辑
      const a = true;
      if (a) {
        that.newProgramInfo = {
          programName: '',
          createOperator: 'daiwei',
          createDate: new Date().Format('yyyy-MM-dd hh:mm:ss'),
          correctFlag: false,
        };
        that.newProgramDialogFlag = true;
      } else {
        that.saveProgramHandle();
        that.newProgramDialogFlag = true;
      }
    },
    newProgramNameChange() {
      const that = this;
      that.newProgramNameUniqueFlag = false;
    },
    // 程序名重复性校验
    checkProgramName(programName) {
      const that = this;
      let uniqueFlag = true;
      for (let i = 0; i < that.testProgramList.length; i += 1) {
        if (programName === that.testProgramList[i].programName) {
          uniqueFlag = false;
          that.newProgramNameUniqueFlag = true;
          return uniqueFlag;
        }
      }
      that.newProgramNameUniqueFlag = false;
      return uniqueFlag;
    },
    // 确定或取消创建新的测试程序
    confirmNewProgramHandle(flag) {
      const that = this;
      if (flag) {
        if (that.checkProgramName(that.newProgramInfo.programName)) {
          that.testProgramList.push({
            programName: that.newProgramInfo.programName,
            createOperator: that.newProgramInfo.createOperator,
            createDate: that.newProgramInfo.createDate,
            correctFlag: that.newProgramInfo.correctFlag,
          });
          that.newProgramDialogFlag = false;
          that.newProgramNameUniqueFlag = false;
        }
      } else {
        that.newProgramDialogFlag = false;
      }
    },
    // 打开测试程序
    openProgramHandle() {
      const that = this;
      that.openProgramDialogFlag = true;
      setTimeout(() => {
        that.$refs.testProgramListRef.setCurrentRow(that.testProgramList[0]);
      }, 300);
    },
    // 选择测试程序
    selectestProgramList(row) {
      const that = this;
      that.currentSelectedTestProgram = {
        programName: row.programName,
        createOperator: row.createOperator,
        createDate: row.createDate,
        correctFlag: row.correctFlag,
      };
    },
    // 确认或取消选择测试程序
    confirmOpenProgramHandle(flag) {
      const that = this;
      if (flag) {
        // 变更程序基础信息
        that.currentProgramInfo = {
          programName: that.currentSelectedTestProgram.programName,
          createOperator: that.currentSelectedTestProgram.createOperator,
          createDate: that.currentSelectedTestProgram.createDate,
          correctFlag: that.currentSelectedTestProgram.correctFlag,
        };
        // 变更程序测试单信息
        let index = -1;
        for (let i = 0; i < that.testProgramList.length; i += 1) {
          if (that.currentSelectedTestProgram.programName === that.testProgramList[i].programName) {
            index = i;
            break;
          }
        }
        if (index !== -1) {
          that.currentTestForm = that.simulateSqlTestItemLists[index];
        } else {
          that.$alert('打开文件失败', '未找到匹配的测试单信息', {
            confirmButtonText: '确定',
            callback: (action) => {
              this.$message({
                type: 'info',
                message: `action: ${action}`,
              });
            },
          });
        }
        that.openProgramDialogFlag = false;
      } else {
        that.openProgramDialogFlag = false;
      }
    },
    // 保存测试程序
    saveProgramHandle() {
      const that = this;
      that.saveProgramDialogFlag = true;
    },
    // 确认或取消保存修改
    confirmSaveProgramHandle(flag) {
      const that = this;
      if (flag) {
        that.saveProgramDialogFlag = false;
      } else {
        that.openProgramDialogFlag = false;
      }
    },
    // 重置测试程序
    resetProgramHandle() {
    },
  },

  mounted() {
  },
};
</script>

<style scoped>
.programEdit {
  height: 100%;
}

.el-tabs {
  height: 100%;
  width: 100%;
}

.el-tabs--left /deep/ .el-tabs__header  {
  width: 15%;
  background: #409EFF;
}

.el-tabs--left /deep/ .el-tabs__item {
  width: 100%;
  text-align: center;
  font-size: 24px;
}

.testListContainer {
  border: 1px solid #ebeef5;
  margin: 10px 0px 10px 0px;
}

.testListHeader {
  height: 36px;
  line-height: 36px;
  padding: 0px 10px 0px 10px;
  background-color: #f5f7fa;
  border-bottom: 1px solid #ebeef5;
}

.testListHeader /deep/ .el-checkbox__inner {
  height: 18px;
  width: 18px;
}

.testListHeader /deep/  .el-checkbox__label {
  font-size: 20px;
  color: #303133 !important;
}

.testListContent {
  padding: 0px 18px 0px 0px;
}

.testListContent /deep/ .el-scrollbar__thumb, .testListContent /deep/ .el-scrollbar__bar {
  display: none;
}

.testListUl {
  display: contents;
}

.testListItem {
  width: 93%;
  margin: 8px;
}

.testListItem button {
  height: 100%;
  width: 100%;
  font-size: 16px;
  border-radius: 5px;
  background: #DCDFE6;
}

li {
  list-style-type:none;
}

.testProgEditContainer {
  height: 821px;
  border: 1px solid #ebeef5;
  background: #fff;
  margin: 10px 10px 10px 0px;
}

.programHandleContainer {
  height: 41px;
  margin: 10px 0;
}

.programNameInputTip {
  color: #F56C6C;
}
</style>

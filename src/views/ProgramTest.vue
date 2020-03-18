<template>
  <div class="programTest">
    <div class="function-area">
      <div>
        <span>端口号：</span>
        <el-select
          v-model="channel"
          placeholder="请选择端口号"
          size="mini"
          value-key="name"
        >
          <el-option
            v-for="(item, index) in channelList"
            :key="index"
            :label="item.name"
            :value="item"
          ></el-option>
        </el-select>
        <el-button
          type="primary"
          size="mini"
          style="margin-left: 10px;"
          @click="onClickOpen"
        >{{ link.listened ? '断开' : '监听' }}</el-button>
        <el-checkbox v-model="capture" style="margin-left: 10px;">允许CAN报文捕获</el-checkbox>
      </div>
    </div>
    <div class="message-area">
      <el-scrollbar style="width: 100%; height: 100%;">
      <el-table
        :data="messageTable"
        ref="messageTable"
        size="mini"
        border
      >
        <el-table-column type="index" label="帧序号" width="100" align="center"></el-table-column>
        <el-table-column label="收发标志" prop="flag" width="70" align="center"></el-table-column>
        <el-table-column label="时间戳" prop="time" width="170" align="center"></el-table-column>
        <el-table-column label="帧ID" prop="id" width="100" align="center">
          <template slot-scope="scope">
            <span>0x{{ scope.row.id.toString(16).toUpperCase() }}</span>
          </template>
        </el-table-column>
        <el-table-column label="数据长度" prop="dataLength" width="70" align="center"></el-table-column>
        <el-table-column label="数据" prop="data" width="300" show-overflow-tooltip></el-table-column>
        <el-table-column label="报文翻译" prop="text" show-overflow-tooltip></el-table-column>
      </el-table>
      </el-scrollbar>
    </div>
    <div class="send-area"></div>
  </div>
</template>

<script>
import Translator from '@/common/translator';

const net = require('net');

export default {
  name: 'test',

  data() {
    return {
      channel: { name: '127.0.0.1:8899', type: 'server' },
      channelList: [
        { name: '127.0.0.1:8899', type: 'server' },
        { name: 'COM1', type: 'serial' },
      ],
      capture: true,
      link: {
        linked: false,
        listened: false,
      },
      messageTable: [],
      socket: null,
      server: null,
      translator: new Translator(),
    };
  },

  methods: {
    reciveProcess(data) {
      const message = this.translator.translate(data);
      if (message) {
        this.$db.message.insert(message, (err, doc) => {
          console.log(err, doc);
          this.messageTable.push(doc);
          this.$refs.messageTable.bodyWrapper.scrollTop = this.$refs.messageTable.bodyWrapper.scrollHeight;
        });
      }
    },
    onClickOpen() {
      if (!this.link.listened) {
        this.createTCPServer();
      } else {
        if (this.socket) {
          this.socket.destroy();
        }
        this.server.close();
      }
    },

    createTCPServer() {
      const server = net.createServer();
      server.maxConnections = 1;
      server.on('connection', (socket) => {
        this.link.linked = true;
        console.log('已连接');
        socket.on('data', (data) => {
          console.log(data);
          this.reciveProcess(data);
        });
        socket.on('close', () => {
          this.link.linked = false;
        });
        this.socket = socket;
      });
      server.on('close', () => {
        this.link.listened = false;
        console.log('TCP server 已关闭');
      });
      server.on('listening', () => {
        this.link.listened = true;
        console.log('正在监听127.0.0.1:8899');
      });
      // server.listen(8899, '127.0.0.1');
      server.listen(8899, '192.168.124.8');
      this.server = server;
    },
  },

  mounted() {
    this.$db.message.find({}).sort({ time: 1 }).exec((err, docs) => {
      this.messageTable = docs;
    });
    // this.$db.message.remove({}, { multi: true });
  },
};
</script>

<style lang="scss" scoped>
.programTest {
  height: 100%;
  position: relative;
  padding: 5px;
}

.function-area {
  position: absolute;
  width: 100%;
  height: 40px;
}

.message-area {
  position: absolute;
  width: 100%;
  top: 40px;
  bottom: 40px;
}

.send-area {
  position: absolute;
  width: 100%;
  bottom: 0;
  height: 40px;
}
</style>

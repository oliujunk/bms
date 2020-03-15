<template>
  <div class="home">
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
        <el-table-column type="index" label="帧序号" width="100"></el-table-column>
        <el-table-column label="收发标志" prop="flag" width="80"></el-table-column>
        <el-table-column label="时间戳" prop="time" width="200"></el-table-column>
        <el-table-column label="帧ID" prop="id" width="150">
          <template slot-scope="scope">
            <span>0x{{ scope.row.id.toString(16).toUpperCase() }}</span>
          </template>
        </el-table-column>
        <el-table-column label="数据长度" prop="dataLength" width="100"></el-table-column>
        <el-table-column label="数据" prop="data" width="300"></el-table-column>
        <el-table-column label="报文翻译" prop="text"></el-table-column>
      </el-table>
      </el-scrollbar>
    </div>
    <div class="send-area"></div>
  </div>
</template>

<script>
import PGN from '@/common/pgn';
import Message from '@/common/message';

const net = require('net');

export default {
  name: 'Home',

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
      messageTable: [
        {
          flag: '接收',
          time: '2020-03-15 15:30:00.000',
          id: 0x1826F456,
          dataLength: 3,
          data: '12 34',
          text: '报文',
        },
      ],
      socket: null,
      server: null,
    };
  },

  methods: {
    reciveProcess(data) {
      const { length } = data;
      if (length < 4) {
        return;
      }
      let message = null;
      switch (data[1]) {
        case PGN.CHM.code:
          message = new Message(PGN.CHM);
          message.flag = '接收';
          message.data = data.toString('hex').slice(8).replace(/\s/g, '').replace(/(.{2})/g, '$1 ')
            .toUpperCase();
          message.text = `充电机报文CHM: ${PGN.CHM.description} 充电机通信协议 V1.1`;
          this.$db.message.insert(message, (err, doc) => {
            console.log(err, doc);
            this.messageTable.push(doc);
            this.$refs.messageTable.bodyWrapper.scrollTop = this.$refs.messageTable.bodyWrapper.scrollHeight;
          });
          break;
        default:
          break;
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
      server.listen(8899, '127.0.0.1');
      this.server = server;
    },
  },

  mounted() {
    this.$db.message.find({}).sort({ time: 1 }).exec((err, docs) => {
      this.messageTable = docs;
    });
    this.$db.message.remove({}, { multi: true });
  },
};
</script>

<style lang="scss" scoped>
.home {
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

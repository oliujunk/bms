import moment from 'moment';

class Message {
  // 收发标志
  flag;

  // 时间
  time;

  // 帧ID
  id;

  // 数据长度
  dataLength;

  // 数据
  data;

  // 翻译报文
  text;

  constructor(code) {
    this.time = moment().format('YYYY-MM-DD HH:mm:ss.SSS');
    this.id = code.id;
    this.dataLength = code.dataLength;
  }
}

export default Message;

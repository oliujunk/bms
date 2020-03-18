import PGN from './pgn';
import Message from './message';

class Translator {
  message;

  constructor() {
    this.message = null;
  }

  getBatteryType = (data) => {
    let ret = '未知电池';
    switch (data) {
      case 0x01:
        ret = '铅酸电池';
        break;
      case 0x02:
        ret = '镍氢电池';
        break;
      case 0x03:
        ret = '磷酸铁锂电池';
        break;
      case 0x04:
        ret = '锰酸锂电池';
        break;
      case 0x05:
        ret = '钴酸锂电池';
        break;
      case 0x06:
        ret = '三元材料电池';
        break;
      case 0x07:
        ret = '聚合物锂离子电池';
        break;
      case 0x08:
        ret = '钛酸锂电池';
        break;
      case 0xFF:
        ret = '其他电池';
        break;
      default:
        break;
    }
    return ret;
  }

  getReadyState = (data) => {
    let ret = '无效';
    switch (data) {
      case 0x00:
        ret = '未做好充电准备';
        break;
      case 0xAA:
        ret = '完成充电准备';
        break;
      case 0xFF:
        ret = '无效';
        break;
      default:
        break;
    }
    return ret;
  }

  getFaultState = (data) => {
    let ret = '未知';
    if (data === 0x00) {
      ret = '否';
    } else if (data === 0x01) {
      ret = '是';
    } else if (data === 0x10) {
      ret = '不可信状态';
    }
    return ret;
  }

  translate = (data) => {
    const { length } = data;
    if (length < 4) {
      return null;
    }
    let message = null;
    let value = null;
    switch (data[1]) {
      case PGN.CHM.code:
        message = new Message(PGN.CHM);
        message.flag = '发送';
        message.data = data.slice(4);
        message.text = `充电机报文CHM: ${PGN.CHM.description}, 充电机通信协议: V1.1`;
        break;
      case PGN.BHM.code:
        message = new Message(PGN.BHM);
        message.data = data.slice(4);
        message.flag = '接收';
        value = ((data[4] + (data[5] << 8)) / 10.0).toFixed(1);
        message.text = `车辆报文BHM: ${PGN.BHM.description}, 最高允许充电总电压: ${value}V`;
        break;
      case PGN.CRM.code:
        message = new Message(PGN.CRM);
        message.data = data.slice(4);
        message.dataLength = length - 4;
        message.flag = '发送';
        if (data[4] === 0x00) {
          value = 'BMS不能辨识';
        } else if (data[4] === 0xAA) {
          value = 'BMS能辨识';
        }
        message.text = `充电机报文CRM: ${PGN.CRM.description}, ${value}`;
        value = data[5] + (data[6] << 8) + (data[7] << 16) + (data[8] << 24);
        message.text += `, 充电机编号: ${value}`;
        if (message.dataLength === 8) {
          value = String.fromCharCode(data[9]) + String.fromCharCode(data[10]) + String.fromCharCode(data[11]);
          message.text += `, 充电机所在区域编号: ${value}`;
        }
        break;
      case PGN.BRM.code:
        message = new Message(PGN.BRM);
        message.data = data.slice(4);
        message.dataLength = 8;
        message.flag = '接收';
        message.text = `BMS和车辆辨识报文BRM: ${PGN.BRM.description}, BMS通信协议版本号: V1.1`;
        value = this.getBatteryType(data[7]);
        message.text += `, 电池类型: ${value}`;
        value = ((data[8] + (data[9] << 8)) / 10.0).toFixed(1);
        message.text += `, 整车动力蓄电池系统额定容量: ${value}Ah`;
        value = ((data[10] + (data[11] << 8)) / 10.0).toFixed(1);
        message.text += `, 整车动力蓄电池系统额定总电压: ${value}V`;
        break;

      // BCP只会在多包报文中出现
      case PGN.BCP.code:
        break;

      case PGN.CTS.code:
        message = new Message(PGN.CTS);
        message.data = data.slice(4);
        message.flag = '发送';
        message.text = '充电机发送时间同步信息报文CTS: '
          + `${data[10].toString(16)}${data[9].toString(16)}/${data[8].toString(16)}/${data[7].toString(16)} `
          + `${data[6].toString(16)}:${data[5].toString(16)}:${data[4].toString(16)}`;
        break;
      case PGN.CML.code:
        message = new Message(PGN.CML);
        message.data = data.slice(4);
        message.flag = '发送';
        message.text = `充电机最大输出能力报文CML: ${PGN.CML.description}`;
        value = ((data[4] + (data[5] << 8)) / 10.0).toFixed(1);
        message.text += `, 最高输出电压: ${value}V`;
        value = ((data[6] + (data[7] << 8)) / 10.0).toFixed(1);
        message.text += `, 最低输出电压: ${value}V`;
        value = (400 - ((data[8] + (data[9] << 8)) / 10.0)).toFixed(1);
        message.text += `, 最高输出电流: ${value}A`;
        value = (400 - ((data[10] + (data[11] << 8)) / 10.0)).toFixed(1);
        message.text += `, 最低输出电流: ${value}A`;
        break;
      case PGN.BRO.code:
        message = new Message(PGN.BRO);
        message.data = data.slice(4);
        message.flag = '接收';
        message.text = `BMS充电准备就绪报文BRO: ${PGN.BRO.description}`;
        value = this.getReadyState(data[4]);
        message.text += `, BMS是否充电准备好: ${value}`;
        break;
      case PGN.CRO.code:
        message = new Message(PGN.CRO);
        message.data = data.slice(4);
        message.flag = '发送';
        message.text = `充电机输出准备就绪报文CRO: ${PGN.CRO.description}`;
        value = this.getReadyState(data[4]);
        message.text += `, 充电机是否充电准备好: ${value}`;
        break;
      case PGN.BCL.code:
        message = new Message(PGN.BCL);
        message.data = data.slice(4);
        message.flag = '接收';
        message.text = `电池充电需求报文BCL: ${PGN.BCL.description}`;
        value = ((data[4] + (data[5] << 8)) / 10.0).toFixed(1);
        message.text += `, 电压需求: ${value}V`;
        value = (400 - ((data[6] + (data[7] << 8)) / 10.0)).toFixed(1);
        message.text += `, 电流需求: ${value}A`;
        value = data[8] === 0x01 ? '恒压充电' : '恒流充电';
        message.text += `, 充电模式: ${value}`;
        break;

      // BCS只会在多包报文中出现
      case PGN.BCS.code:
        break;

      case PGN.CCS.code:
        message = new Message(PGN.CCS);
        message.data = data.slice(4);
        message.flag = '发送';
        message.text = `充电机充电状态报文CCS: ${PGN.CCS.description}`;
        value = ((data[4] + (data[5] << 8)) / 10.0).toFixed(1);
        message.text += `, 电压输出值: ${value}V`;
        value = (400 - ((data[6] + (data[7] << 8)) / 10.0)).toFixed(1);
        message.text += `, 电流输出值: ${value}V`;
        value = (data[8] + (data[9] << 8)).toString();
        message.text += `, 累计充电时间: ${value}min`;
        value = (data[10] & 0x01) === 0x00 ? '暂停' : '允许';
        message.text += `, 充电允许: ${value}`;
        break;
      case PGN.BSM.code:
        message = new Message(PGN.BSM);
        message.data = data.slice(4);
        message.flag = '接收';
        message.text = `BMS发送动力蓄电池状态信息报文BSM: ${PGN.BSM.description}`;
        value = (data[4] + 1).toString();
        message.text += `, 最高单体动力蓄电池电压所在编号: ${value}`;
        value = (data[5] - 50).toString();
        message.text += `, 最高动力蓄电池温度: ${value}°C`;
        value = (data[6] + 1).toString();
        message.text += `, 最高温度检测点编号: ${value}`;
        value = (data[7] - 50).toString();
        message.text += `, 最低动力蓄电池温度: ${value}°C`;
        value = (data[8] + 1).toString();
        message.text += `, 最低温度检测点编号: ${value}`;
        value = data[9] & 0x03;
        if (value === 0x00) {
          value = '正常';
        } else if (value === 0x01) {
          value = '过高';
        } else if (value === 0x10) {
          value = '过低';
        }
        message.text += `, 单体动力蓄电池电压: ${value}`;
        value = (data[9] & 0x0C) >> 2;
        if (value === 0x00) {
          value = '正常';
        } else if (value === 0x01) {
          value = '过高';
        } else if (value === 0x10) {
          value = '过低';
        }
        message.text += `, 整车动力蓄电池荷电状态SOC: ${value}`;
        value = (data[9] & 0x30) >> 4;
        value = this.getFaultState(value);
        message.text += `, 动力蓄电池充电过电流: ${value}`;
        value = (data[9] & 0xC0) >> 6;
        value = this.getFaultState(value);
        message.text += `, 动力蓄电池温度过高: ${value}`;
        value = data[10] & 0x03;
        value = this.getFaultState(value);
        message.text += `, 动力蓄电池绝缘状态不正常: ${value}`;
        value = (data[10] & 0x0C) >> 2;
        value = this.getFaultState(value);
        message.text += `, 动力蓄电池组输出连接器连接不正常: ${value}`;
        value = (data[10] & 0x30) >> 4;
        if (value === 0x00) {
          value = '禁止';
        } else if (value === 0x01) {
          value = '允许';
        }
        message.text += `, 充电允许: ${value}`;
        break;

      // 可选
      case PGN.BMV.code:
        message = new Message(PGN.BMV);
        message.flag = '接收';
        message.text = '';
        break;
      // 可选
      case PGN.BMT.code:
        message = new Message(PGN.BMT);
        message.flag = '接收';
        message.text = '';
        break;
      // 可选
      case PGN.BSP.code:
        message = new Message(PGN.BSP);
        message.flag = '接收';
        message.text = '';
        break;

      case PGN.BST.code:
        message = new Message(PGN.BST);
        message.data = data.slice(4);
        message.flag = '接收';
        message.text = `BMS中止充电报文BST: ${PGN.BST.description}`;
        value = data[4] & 0x03;
        value = this.getFaultState(value);
        message.text += `, 达到所需的SOC目标值: ${value}`;
        value = (data[4] & 0x0C) >> 2;
        value = this.getFaultState(value);
        message.text += `, 达到总电压的设定值: ${value}`;
        value = (data[4] & 0x30) >> 4;
        value = this.getFaultState(value);
        message.text += `, 达到单体电压的设定值: ${value}`;
        value = (data[4] & 0xC0) >> 6;
        value = this.getFaultState(value);
        message.text += `, 充电机主动中止: ${value}`;
        value = data[5] & 0x03;
        value = this.getFaultState(value);
        message.text += `, 绝缘故障: ${value}`;
        value = (data[5] & 0x0C) >> 2;
        value = this.getFaultState(value);
        message.text += `, 输出连接器过温故障: ${value}`;
        value = (data[5] & 0x30) >> 4;
        value = this.getFaultState(value);
        message.text += `, BMS元件、输出连接器过温: ${value}`;
        value = (data[5] & 0xC0) >> 6;
        value = this.getFaultState(value);
        message.text += `, 充电连接器故障: ${value}`;
        value = data[6] & 0x03;
        value = this.getFaultState(value);
        message.text += `, 电池组温度过高故障: ${value}`;
        value = (data[6] & 0x0C) >> 2;
        value = this.getFaultState(value);
        message.text += `, 高压继电器故障: ${value}`;
        value = (data[6] & 0x30) >> 4;
        value = this.getFaultState(value);
        message.text += `, 检测点2电压检测故障: ${value}`;
        value = (data[6] & 0xC0) >> 6;
        value = this.getFaultState(value);
        message.text += `, 其他故障: ${value}`;
        value = data[7] & 0x03;
        value = this.getFaultState(value);
        message.text += `, 电流过大: ${value}`;
        value = (data[7] & 0x0C) >> 2;
        value = this.getFaultState(value);
        message.text += `, 电压异常: ${value}`;
        break;
      case PGN.CST.code:
        message = new Message(PGN.CST);
        message.data = data.slice(4);
        message.flag = '发送';
        message.text = `充电机中止充电报文CST: ${PGN.CST.description}`;
        value = data[4] & 0x03;
        value = this.getFaultState(value);
        message.text += `, 达到充电机设定的条件中止: ${value}`;
        value = (data[4] & 0x0C) >> 2;
        value = this.getFaultState(value);
        message.text += `, 人工中止: ${value}`;
        value = (data[4] & 0x30) >> 4;
        value = this.getFaultState(value);
        message.text += `, 故障中止: ${value}`;
        value = (data[4] & 0xC0) >> 6;
        value = this.getFaultState(value);
        message.text += `, BMS主动中止: ${value}`;
        value = data[5] & 0x03;
        value = this.getFaultState(value);
        message.text += `, 充电机过温故障: ${value}`;
        value = (data[5] & 0x0C) >> 2;
        value = this.getFaultState(value);
        message.text += `, 充电连接器故障: ${value}`;
        value = (data[5] & 0x30) >> 4;
        value = this.getFaultState(value);
        message.text += `, 充电机内部过温故障: ${value}`;
        value = (data[5] & 0xC0) >> 6;
        value = this.getFaultState(value);
        message.text += `, 所需电量不能传送: ${value}`;
        value = data[6] & 0x03;
        value = this.getFaultState(value);
        message.text += `, 充电机急停故障: ${value}`;
        value = (data[6] & 0x0C) >> 2;
        value = this.getFaultState(value);
        message.text += `, 其他故障: ${value}`;
        value = data[7] & 0x03;
        value = this.getFaultState(value);
        message.text += `, 电流不匹配: ${value}`;
        value = (data[7] & 0x0C) >> 2;
        value = this.getFaultState(value);
        message.text += `, 电压异常: ${value}`;
        break;
      case PGN.BSD.code:
        message = new Message(PGN.BSD);
        message.data = data.slice(4);
        message.flag = '接收';
        message.text = `BMS统计数据报文BSD: ${PGN.BSD.description}`;
        value = data[4].toString();
        message.text += `, 中止荷电状态SOC: ${value}%`;
        value = ((data[5] + (data[6] << 8)) / 100.0).toFixed(2);
        message.text += `, 动力蓄电池单体最低电压: ${value}V`;
        value = ((data[7] + (data[8] << 8)) / 100.0).toFixed(2);
        message.text += `, 动力蓄电池单体最高电压: ${value}V`;
        value = (data[9] - 50).toString();
        message.text += `, 动力蓄电池最低温度: ${value}°C`;
        value = (data[10] - 50).toString();
        message.text += `, 动力蓄电池最高温度: ${value}°C`;
        break;
      case PGN.CSD.code:
        message = new Message(PGN.CSD);
        message.data = data.slice(4);
        message.flag = '发送';
        message.text = `充电机统计数据报文CSD: ${PGN.CSD.description}`;
        value = (data[4] + (data[5] << 8)).toString();
        message.text += `, 累计充电时间: ${value}min`;
        value = ((data[6] + (data[7] << 8)) / 10.0).toFixed(1);
        message.text += `, 输出能量: ${value}kW·h`;
        value = data[8] + (data[9] << 8) + (data[10] << 16) + (data[11] << 24) + 1;
        message.text += `, 充电机编号: ${value}`;
        break;
      case PGN.BEM.code:
        message = new Message(PGN.BEM);
        message.data = data.slice(4);
        message.flag = '接收';
        message.text = `BMS错误报文BEM: ${PGN.BEM.description}`;
        value = data[4] & 0x03;
        value = this.getFaultState(value);
        message.text += `, 接收SPN2560=0x00的充电机辨识报文超时: ${value}`;
        value = (data[4] & 0x0C) >> 2;
        value = this.getFaultState(value);
        message.text += `, 接收SPN2560=0xAA的充电机辨识报文超时: ${value}`;
        value = data[5] & 0x03;
        value = this.getFaultState(value);
        message.text += `, 接收充电机的时间同步和充电机最大输出能力报文超时: ${value}`;
        value = (data[5] & 0x0C) >> 2;
        value = this.getFaultState(value);
        message.text += `, 接收充电机完成充电准备报文超时: ${value}`;
        value = data[6] & 0x03;
        value = this.getFaultState(value);
        message.text += `, 接收充电机充电状态报文超时: ${value}`;
        value = (data[6] & 0x0C) >> 2;
        value = this.getFaultState(value);
        message.text += `, 接收充电机中止充电报文超时: ${value}`;
        value = data[7] & 0x03;
        value = this.getFaultState(value);
        message.text += `, 接收充电机充电统计报文超时: ${value}`;
        break;
      case PGN.CEM.code:
        message = new Message(PGN.CEM);
        message.data = data.slice(4);
        message.flag = '发送';
        message.text = `充电机错误报文: ${PGN.CEM.description}`;
        value = data[4] & 0x03;
        value = this.getFaultState(value);
        message.text += `, 接收BMS和车辆的辨识报文超时: ${value}`;
        value = data[5] & 0x03;
        value = this.getFaultState(value);
        message.text += `, 接收电池充电参数报文超时: ${value}`;
        value = (data[5] & 0x0C) >> 2;
        value = this.getFaultState(value);
        message.text += `, 接收BMS完成充电准备报文超时: ${value}`;
        value = data[6] & 0x03;
        value = this.getFaultState(value);
        message.text += `, 接收电池充电总状态报文超时: ${value}`;
        value = (data[6] & 0x0C) >> 2;
        value = this.getFaultState(value);
        message.text += `, 接收电池充电要求报文超时: ${value}`;
        value = (data[6] & 0x30) >> 4;
        value = this.getFaultState(value);
        message.text += `, 接收BMS中止充电报文超时: ${value}`;
        value = data[7] & 0x03;
        value = this.getFaultState(value);
        message.text += `, 接收BMS充电统计报文超时: ${value}`;
        break;
      case PGN.TPCM.code:
        if (data[4] === 0x10) {
          message = new Message(PGN.TPCM);
          message.data = data.slice(4);
          message.flag = '接收';
          message.text = '多包报文首报文';
          value = (data[5] + (data[6] << 8)).toString();
          message.text += `, 总报文字节数: ${value}`;
          message.text += `, 总数据包数: ${data[7]}`;
          value = `0000${(data[9] + (data[10] << 8)).toString(16)}`.slice(-4);
          message.text += `, 打包报文PGN: 0x${value}`;
          // 开始传输
          switch (data[10]) {
            case PGN.BCP.code:
              this.message = new Message(PGN.BCP);
              this.message.data = [];
              break;
            case PGN.BCS.code:
              this.message = new Message(PGN.BCS);
              this.message.data = [];
              break;
            default:
              break;
          }
        } else if (data[4] === 0x13) {
          // 结束传输
          switch (data[10]) {
            case PGN.BCP.code:
              message = new Message(PGN.BCP);
              message.flag = '接收';
              message.data = Buffer.from(this.message.data);
              message.text = `动力蓄电池充电参数报文BCP: ${PGN.BCP.description}`;
              value = ((message.data[0] + (message.data[1] << 8)) / 100.0).toFixed(2);
              message.text += `, 单体动力蓄电池最高允许充电电压: ${value}V`;
              value = (400 - ((message.data[2] + (message.data[3] << 8)) / 10.0)).toFixed(1);
              message.text += `, 最高允许充电电流: ${value}A`;
              value = ((message.data[4] + (message.data[5] << 8)) / 10.0).toFixed(1);
              message.text += `, 动力蓄电池标称总能量: ${value}kW·h`;
              value = ((message.data[6] + (message.data[7] << 8)) / 10.0).toFixed(1);
              message.text += `, 最高允许充电总电压: ${value}V`;
              value = (message.data[8] - 50).toString();
              message.text += `, 最高允许温度: ${value}°C`;
              value = ((message.data[9] + (message.data[10] << 8)) / 10.0).toFixed(1);
              message.text += `, 整车动力蓄电池荷电状态: ${value}%`;
              value = ((message.data[11] + (message.data[12] << 8)) / 10.0).toFixed(1);
              message.text += `, 整车动力蓄电池当前电池电压: ${value}V`;
              this.message = null;
              break;
            case PGN.BCS.code:
              message = new Message(PGN.BCS);
              message.flag = '接收';
              message.data = Buffer.from(this.message.data);
              message.text = `电池充电总状态报文BCS: ${PGN.BCS.description}`;
              value = ((message.data[0] + (message.data[1] << 8)) / 10.0).toFixed(1);
              message.text += `, 充电电压测量值: ${value}V`;
              value = (400 - ((message.data[2] + (message.data[3] << 8)) / 10.0)).toFixed(1);
              message.text += `, 充电电流测量值: ${value}A`;
              value = ((message.data[5] & 0xF0) >> 4).toString();
              message.text += `, 最高单体动力蓄电池组号: ${value}`;
              value = (message.data[4] + ((message.data[5] & 0x0F) << 8) / 10.0).toFixed(1);
              message.text += ` 电压: ${value}`;
              value = message.data[6].toString();
              message.text += `, 当前荷电状态: ${value}%`;
              value = (message.data[7] + (message.data[8] << 8)).toString();
              message.text += `, 估计剩余充电时间: ${value}min`;
              this.message = null;
              break;
            default:
              break;
          }
        }
        break;

      case PGN.TPDP.code:
        if (this.message) {
          switch (this.message.code) {
            case PGN.BCP.code:
              if (data[4] === 0x01) {
                this.message.data.splice(0, 0, ...data.slice(5));
              } else if (data[4] === 0x02) {
                this.message.data.splice(7, 0, ...data.slice(5, 11));
              }
              break;
            case PGN.BCS.code:
              if (data[4] === 0x01) {
                this.message.data.splice(0, 0, ...data.slice(5));
              } else if (data[4] === 0x02) {
                this.message.data.splice(7, 0, ...data.slice(5, 7));
              }
              break;
            default:
              break;
          }
        }
        break;

      default:
        break;
    }

    if (message) {
      message.data = message.data.toString('hex').replace(/\s/g, '').replace(/(.{2})/g, '$1 ').toUpperCase();
    }

    return message;
  }
}

export default Translator;

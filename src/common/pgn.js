const PGN = {
  // 低压辅助上电及充电握手阶段
  CHM: {
    code: 0x26,
    id: 0x1826F456,
    description: '充电机握手',
    interval: 250,
    dataLength: 3,
  },
  BHM: {
    code: 0x27,
    id: 0x182756F4,
    description: '车辆握手',
    interval: 250,
    dataLength: 2,
  },
  CRM: {
    code: 0x01,
    id: 0x1801F456,
    description: '充电机辨识',
    interval: 250,
    dataLength: 8,
  },
  BRM: {
    code: 0x02,
    id: 0x1C0256F4,
    description: 'BMS和车辆辨识报文',
    interval: 250,
    dataLength: 41,
  },

  // 充电参数配置阶段
  BCP: {
    code: 0x06,
    id: 0x1C0656F4,
    description: '动力蓄电池充电参数',
    interval: 500,
    dataLength: 13,
  },
  CTS: {
    code: 0x07,
    id: 0x1807F456,
    description: '充电机发送时间同步信息',
    interval: 500,
    dataLength: 7,
  },
  CML: {
    code: 0x08,
    id: 0x1808F456,
    description: '充电机最大输出能力',
    interval: 250,
    dataLength: 8,
  },
  BRO: {
    code: 0x09,
    id: 0x100956F4,
    description: '电池充电准备就绪状态',
    interval: 250,
    dataLength: 1,
  },
  CRO: {
    code: 0x0A,
    id: 0x100AF456,
    description: '充电机输出准备就绪状态',
    interval: 250,
    dataLength: 1,
  },

  // 充电阶段
  BCL: {
    code: 0x10,
    id: 0x181056F4,
    description: '电池充电需求',
    interval: 50,
    dataLength: 5,
  },
  BCS: {
    code: 0x11,
    id: 0x1C1156F4,
    description: '电池充电总状态',
    interval: 250,
    dataLength: 9,
  },
  CCS: {
    code: 0x12,
    id: 0x1812F456,
    description: '充电机充电状态',
    interval: 50,
    dataLength: 8,
  },
  BSM: {
    code: 0x13,
    id: 0x181356F4,
    description: '动力蓄电池状态信息',
    interval: 250,
    dataLength: 7,
  },
  BMV: {
    code: 0x15,
    id: 0x1C1556F4,
    description: '单体动力蓄电池电压',
    interval: 10000,
    dataLength: 0,
  },
  BMT: {
    code: 0x16,
    id: 0x1C1656F4,
    description: '动力蓄电池温度',
    interval: 10000,
    dataLength: 0,
  },
  BSP: {
    code: 0x17,
    id: 0x1C1756F4,
    description: '动力蓄电池预留报文',
    interval: 10000,
    dataLength: 0,
  },
  BST: {
    code: 0x19,
    id: 0x101956F4,
    description: 'BMS中止充电',
    interval: 10,
    dataLength: 4,
  },
  CST: {
    code: 0x1A,
    id: 0x101AF456,
    description: '充电机中止充电',
    interval: 10,
    dataLength: 4,
  },

  // 充电结束阶段
  BSD: {
    code: 0x1C,
    id: 0x181C56F4,
    description: 'BMS统计数据',
    interval: 250,
    dataLength: 7,
  },
  CSD: {
    code: 0x1D,
    id: 0x181DF456,
    description: '充电机统计数据',
    interval: 250,
    dataLength: 8,
  },

  // 错误报文
  BEM: {
    code: 0x1E,
    id: 0x081E56F4,
    description: 'BMS错误报文',
    interval: 250,
    dataLength: 4,
  },
  CEM: {
    code: 0x1F,
    id: 0x081FF456,
    description: '充电机报文',
    interval: 250,
    dataLength: 4,
  },
};

export default PGN;

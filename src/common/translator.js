// import PGN from './pgn';
// import Message from './message';

class Translator {
  translate = (data) => {
    const { length } = data;
    if (length < 4) {
      return null;
    }
    const message = null;
    // switch (data[1]) {
    //   case PGN.CHM.code:
    //     message = new Message(PGN.CHM);
    //     message.flag = '接收';
    //     message.data = data.toString('hex').slice(8).replace(/\s/g, '').replace(/(.{2})/g, '$1 ')
    //       .toUpperCase();
    //     message.text = `充电机报文CHM: ${PGN.CHM.description} 充电机通信协议 V1.1`;
    //     break;
    //   case PGN.
    //   default:
    //     break;
    // }
    return message;
  }
}

export default Translator;

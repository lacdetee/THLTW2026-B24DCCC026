import { useState } from 'react';
import { Button, InputNumber } from 'antd';

const Bai1 = () => {
  const [so, setSo] = useState<number>(0);
  const [doan, setDoan] = useState<number>(0);
  const [soLuotDoan, setSoLuotDoan] = useState<number>(0);

  const taoSo = () => {
    const random = Math.floor(Math.random() * 100) + 1;
    setSo(random);
  };

  const kiemTra = () => {
    setSoLuotDoan(soLuotDoan + 1);
    if (soLuotDoan === 10) {
      alert("Bạn đã hết lượt đoán! Số đúng là: " + so);}
    if (doan === so) {
      alert("Chúc mừng bạn đã đoán đúng!");
    } else if (doan > so) {
      alert("Bạn đoán quá cao!");
    } else {
      alert("Bạn đoán quá thấp!");
    }
  };

  return (
    <div>
        <h1>Đoán số ngẫu nhiên</h1>
        <h2>BẠn có 100 lượt đoán</h2>
        <hr></hr>
        <Button type='primary' onClick={taoSo}>Tạo số ngẫu nhiên</Button>
        <hr></hr>
        <InputNumber min={1} max={100} value={doan} onChange={(value) => setDoan(value||0)} />
        <Button type='primary' onClick={kiemTra} style={{ marginLeft: 10 }}>Kiểm tra</Button>
        <br />
        <h3>Số lượt đoán: {soLuotDoan}</h3>
    </div>
  );
};

export default Bai1;
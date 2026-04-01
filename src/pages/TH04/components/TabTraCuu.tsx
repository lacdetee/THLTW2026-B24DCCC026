import React, { useState } from 'react';
import { Card, Form, Input, Button, Row, Col, Table, message, Typography } from 'antd';
import { useModel } from 'umi';

const { Text } = Typography;

const TabTraCuu: React.FC = () => {
  const { danhSachVanBang, danhSachQuyetDinh, tangLuotTraCuu } = useModel('useModelVanBang' as any);
  const [form] = Form.useForm();
  const [ketQua, datKetQua] = useState<any[]>([]);

  const timKiem = (values: any) => {
    const thamSoDaNhap = Object.values(values).filter(v => v !== undefined && v !== '');
    if (thamSoDaNhap.length < 2) {
      return message.error('Vui lòng nhập ít nhất 2 tham số để tra cứu!');
    }

    const ketQuaLoc = danhSachVanBang.filter((vb: any) => {
      let khop = true;
      if (values.soHieu && !vb.soHieu.includes(values.soHieu)) khop = false;
      if (values.soVaoSo && String(vb.soVaoSo) !== values.soVaoSo) khop = false;
      if (values.maSinhVien && !vb.maSinhVien.includes(values.maSinhVien)) khop = false;
      if (values.hoTen && !vb.hoTen.toLowerCase().includes(values.hoTen.toLowerCase())) khop = false;
      return khop;
    });

    datKetQua(ketQuaLoc);
    
    if (ketQuaLoc.length > 0) {
      tangLuotTraCuu(ketQuaLoc[0].idQuyetDinh);
    }
  };

  return (
    <Row gutter={24}>
      <Col span={8}>
        <Card title="Bộ Lọc Tra Cứu (Nhập ≥ 2 trường)" size="small">
          <Form form={form} layout="vertical" onFinish={timKiem}>
            <Form.Item name="soHieu" label="Số hiệu văn bằng"><Input placeholder="" /></Form.Item>
            <Form.Item name="soVaoSo" label="Số vào sổ"><Input placeholder="" /></Form.Item>
            <Form.Item name="maSinhVien" label="Mã sinh viên"><Input placeholder="" /></Form.Item>
            <Form.Item name="hoTen" label="Họ tên"><Input placeholder="" /></Form.Item>
            <Button type="primary" htmlType="submit" block>Tra Cứu Thông Tin</Button>
          </Form>
        </Card>
        
        <Card title="Thống Kê Tra Cứu" size="small" style={{ marginTop: 20 }}>
          <ul>
            {danhSachQuyetDinh.map((qd: any) => (
              <li key={qd.id}>QĐ {qd.soQuyetDinh}: <Text type="danger" strong>{qd.luotTraCuu}</Text> lượt</li>
            ))}
          </ul>
        </Card>
      </Col>

      <Col span={16}>
        <Table bordered size="small" dataSource={ketQua} rowKey="id" locale={{ emptyText: 'Nhập thông tin để tra cứu' }} columns={[
          { title: 'Số Sổ', dataIndex: 'soVaoSo', align: 'center' as const, render: (s)=><b>{s}</b> },
          { title: 'Số Hiệu', dataIndex: 'soHieu' },
          { title: 'Mã SV', dataIndex: 'maSinhVien' },
          { title: 'Họ Tên', dataIndex: 'hoTen' },
          { title: 'Thuộc QĐ', render: (_: any, vb: any) => danhSachQuyetDinh.find((qd: any) => qd.id === vb.idQuyetDinh)?.soQuyetDinh }
        ]} />
      </Col>
    </Row>
  );
};
export default TabTraCuu;
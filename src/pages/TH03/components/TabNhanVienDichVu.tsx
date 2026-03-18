import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, Row, Col } from 'antd';
import { useModel } from 'umi';
import { KieuNhanVien, KieuDichVu } from '../types';

const TabNhanVienDichVu: React.FC = () => {
  const { danhSachNhanVien, luuNhanVien, danhSachDichVu, luuDichVu } = useModel('useModelSalon' as any);
  const [form] = Form.useForm();
  const [loaiModal, datLoaiModal] = useState<'NhanVien' | 'DichVu' | null>(null);

  const xuLyLuu = (values: any) => {
    if (loaiModal === 'NhanVien') luuNhanVien([...danhSachNhanVien, { id: `NV_${Date.now()}`, ...values }]);
    else luuDichVu([...danhSachDichVu, { id: `DV_${Date.now()}`, ...values }]);
    datLoaiModal(null);
  };

  return (
    <Row gutter={24}>
      <Col span={12}>
        <Button type="primary" onClick={() => { form.resetFields(); datLoaiModal('NhanVien'); }} style={{ marginBottom: 16 }}>+ Thêm Nhân Viên</Button>
        <Table bordered size="small" dataSource={danhSachNhanVien} rowKey="id" columns={[
          { title: 'Tên NV', dataIndex: 'tenNhanVien' },
          { title: 'Giới hạn/ngày', dataIndex: 'gioiHanKhach', align: 'center' as const },
          { title: 'Ca làm việc', dataIndex: 'caLamViec' },
          { title: 'Thao tác', align: 'center' as const, render: (_: any, nv: KieuNhanVien) => <Button danger type="text" onClick={() => luuNhanVien(danhSachNhanVien.filter((n: KieuNhanVien) => n.id !== nv.id))}>Xóa</Button> }
        ]} />
      </Col>

      <Col span={12}>
        <Button type="primary" onClick={() => { form.resetFields(); datLoaiModal('DichVu'); }} style={{ marginBottom: 16, backgroundColor: '#52c41a', borderColor: '#52c41a' }}>+ Thêm Dịch Vụ</Button>
        <Table bordered size="small" dataSource={danhSachDichVu} rowKey="id" columns={[
          { title: 'Tên Dịch Vụ', dataIndex: 'tenDichVu' },
          { title: 'Giá (VND)', dataIndex: 'giaTien', render: (gia: number) => gia.toLocaleString() },
          { title: 'Thời gian', dataIndex: 'thoiGianThucHien', render: (tg: number) => `${tg} phút` },
          { title: 'Thao tác', align: 'center' as const, render: (_: any, dv: KieuDichVu) => <Button danger type="text" onClick={() => luuDichVu(danhSachDichVu.filter((d: KieuDichVu) => d.id !== dv.id))}>Xóa</Button> }
        ]} />
      </Col>

      <Modal title={loaiModal === 'NhanVien' ? 'Thêm Nhân Viên' : 'Thêm Dịch Vụ'} visible={!!loaiModal} onCancel={() => datLoaiModal(null)} onOk={() => form.submit()} destroyOnClose>
        <Form form={form} layout="vertical" onFinish={xuLyLuu}>
          {loaiModal === 'NhanVien' ? (
            <>
              <Form.Item name="tenNhanVien" label="Tên nhân viên" rules={[{ required: true }]}><Input /></Form.Item>
              <Form.Item name="gioiHanKhach" label="Giới hạn khách tối đa / ngày" rules={[{ required: true }]}><InputNumber min={1} style={{ width: '100%' }} /></Form.Item>
              <Form.Item name="caLamViec" label="Ca làm việc (VD: 08:00 - 17:00)" rules={[{ required: true }]}><Input /></Form.Item>
            </>
          ) : (
            <>
              <Form.Item name="tenDichVu" label="Tên dịch vụ" rules={[{ required: true }]}><Input /></Form.Item>
              <Form.Item name="giaTien" label="Giá tiền (VND)" rules={[{ required: true }]}><InputNumber min={0} step={10000} style={{ width: '100%' }} /></Form.Item>
              <Form.Item name="thoiGianThucHien" label="Thời gian thực hiện (Phút)" rules={[{ required: true }]}><InputNumber min={5} step={5} style={{ width: '100%' }} /></Form.Item>
            </>
          )}
        </Form>
      </Modal>
    </Row>
  );
};
export default TabNhanVienDichVu;
import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, Select, DatePicker, TimePicker, Tag, Space, message } from 'antd';
import { useModel } from 'umi';
import { KieuLichHen, TrangThaiLich, KieuDichVu, KieuNhanVien } from '../types';

const TabQuanLyLichHen: React.FC = () => {
  const { danhSachNhanVien, danhSachDichVu, danhSachLichHen, luuLichHen, themLichHenMoi } = useModel('useModelSalon' as any);
  const [hienThiModal, datHienThiModal] = useState(false);
  const [form] = Form.useForm();

  const datLich = (values: any) => {
    const lichMoi = { ...values, ngayHen: values.ngayHen.format('YYYY-MM-DD'), gioHen: values.gioHen.format('HH:mm') };
    if (themLichHenMoi(lichMoi)) datHienThiModal(false);
  };

  const capNhatTrangThai = (idLich: string, trangThaiMoi: TrangThaiLich) => {
    luuLichHen(danhSachLichHen.map((lh: KieuLichHen) => lh.id === idLich ? { ...lh, trangThai: trangThaiMoi } : lh));
    message.success(`Trạng thái: ${trangThaiMoi}`);
  };

  const cotBang = [
    { title: 'Khách Hàng', dataIndex: 'tenKhachHang' },
    { title: 'Lịch Hẹn', render: (_: any, lh: KieuLichHen) => <b>{lh.ngayHen} | {lh.gioHen}</b> },
    { title: 'Dịch Vụ', dataIndex: 'idDichVu', render: (id: string) => danhSachDichVu.find((dv: KieuDichVu) => dv.id === id)?.tenDichVu },
    { title: 'Nhân Viên', dataIndex: 'idNhanVien', render: (id: string) => danhSachNhanVien.find((nv: KieuNhanVien) => nv.id === id)?.tenNhanVien },
    { title: 'Trạng Thái', dataIndex: 'trangThai', render: (tt: string) => <Tag color={tt === 'Hoàn thành' ? 'success' : tt === 'Hủy' ? 'error' : tt === 'Xác nhận' ? 'processing' : 'warning'}>{tt}</Tag> },
    { title: 'Thao tác', align: 'center' as const, render: (_: any, lh: KieuLichHen) => (
      <Space>
        {lh.trangThai === 'Chờ duyệt' && <Button size="small" type="primary" onClick={() => capNhatTrangThai(lh.id, 'Xác nhận')}>Duyệt</Button>}
        {lh.trangThai === 'Xác nhận' && <Button size="small" style={{backgroundColor: '#52c41a', color: '#fff'}} onClick={() => capNhatTrangThai(lh.id, 'Hoàn thành')}>Xong</Button>}
        {lh.trangThai !== 'Hủy' && lh.trangThai !== 'Hoàn thành' && <Button size="small" danger onClick={() => capNhatTrangThai(lh.id, 'Hủy')}>Hủy</Button>}
      </Space>
    )}
  ];

  return (
    <>
      <Button type="primary" onClick={() => { form.resetFields(); datHienThiModal(true); }} style={{ marginBottom: 16 }}>+ Đặt Lịch Hẹn</Button>
      <Table bordered size="small" dataSource={danhSachLichHen} rowKey="id" columns={cotBang} />

      <Modal title="Đặt Lịch Hẹn Mới" visible={hienThiModal} onCancel={() => datHienThiModal(false)} onOk={() => form.submit()} destroyOnClose>
        <Form form={form} layout="vertical" onFinish={datLich}>
          <Form.Item name="tenKhachHang" label="Tên khách hàng" rules={[{ required: true }]}><Input /></Form.Item>
          <div style={{ display: 'flex', gap: '16px' }}>
            <Form.Item name="ngayHen" label="Ngày đến" rules={[{ required: true }]}><DatePicker style={{ width: 200 }} format="YYYY-MM-DD" /></Form.Item>
            <Form.Item name="gioHen" label="Giờ bắt đầu" rules={[{ required: true }]}><TimePicker format="HH:mm" style={{ width: 150 }} /></Form.Item>
          </div>
          <Form.Item name="idDichVu" label="Dịch vụ" rules={[{ required: true }]}><Select>{danhSachDichVu.map((dv: KieuDichVu) => <Select.Option key={dv.id} value={dv.id}>{dv.tenDichVu}</Select.Option>)}</Select></Form.Item>
          <Form.Item name="idNhanVien" label="Nhân viên" rules={[{ required: true }]}><Select>{danhSachNhanVien.map((nv: KieuNhanVien) => <Select.Option key={nv.id} value={nv.id}>{nv.tenNhanVien} (Ca: {nv.caLamViec})</Select.Option>)}</Select></Form.Item>
        </Form>
      </Modal>
    </>
  );
};
export default TabQuanLyLichHen;
import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, Rate, Tag, message } from 'antd';
import { useModel } from 'umi';
import { KieuLichHen, KieuDanhGia, KieuNhanVien } from '../types';

const TabDanhGia: React.FC = () => {
  const { danhSachLichHen, danhSachNhanVien, danhSachDanhGia, luuDanhGia } = useModel('useModelSalon' as any);
  const [form] = Form.useForm();
  const [lichHenDangChon, datLichHenDangChon] = useState<KieuLichHen | null>(null);
  const [danhGiaDangChon, datDanhGiaDangChon] = useState<KieuDanhGia | null>(null);

  // Khai báo rõ lh là kiểu KieuLichHen để hết báo đỏ
  const lichDaXong = danhSachLichHen.filter((lh: KieuLichHen) => lh.trangThai === 'Hoàn thành');

  const guiDanhGia = (values: any) => {
    luuDanhGia([...danhSachDanhGia, { id: `DG_${Date.now()}`, idLichHen: lichHenDangChon!.id, idNhanVien: lichHenDangChon!.idNhanVien, soSao: values.soSao, nhanXet: values.nhanXet, phanHoi: '' }]);
    datLichHenDangChon(null); message.success('Cảm ơn bạn đã đánh giá!');
  };

  const guiPhanHoi = (values: any) => {
    luuDanhGia(danhSachDanhGia.map((dg: KieuDanhGia) => dg.id === danhGiaDangChon!.id ? { ...dg, phanHoi: values.phanHoi } : dg));
    datDanhGiaDangChon(null); message.success('Đã gửi phản hồi!');
  };

  return (
    <>
      <h3 style={{marginTop: 0}}>Danh sách Lịch đã Hoàn thành (Dành cho Khách đánh giá)</h3>
      <Table bordered size="small" dataSource={lichDaXong} rowKey="id" columns={[
        { title: 'Khách hàng', dataIndex: 'tenKhachHang' },
        { title: 'Nhân viên phục vụ', render: (_: any, lh: KieuLichHen) => danhSachNhanVien.find((nv: KieuNhanVien) => nv.id === lh.idNhanVien)?.tenNhanVien },
        { title: 'Trạng thái Đánh giá', align: 'center' as const, render: (_: any, lh: KieuLichHen) => {
          const dg = danhSachDanhGia.find((d: KieuDanhGia) => d.idLichHen === lh.id);
          return dg ? <Rate disabled defaultValue={dg.soSao} /> : <Button type="primary" size="small" onClick={() => { form.resetFields(); datLichHenDangChon(lh); }}>Viết đánh giá</Button>;
        }}
      ]} style={{ marginBottom: 40 }} />

      <h3>Danh sách Đánh giá (Dành cho Nhân viên phản hồi)</h3>
      <Table bordered size="small" dataSource={danhSachDanhGia} rowKey="id" columns={[
        { title: 'Nhân viên', render: (_: any, dg: KieuDanhGia) => danhSachNhanVien.find((nv: KieuNhanVien) => nv.id === dg.idNhanVien)?.tenNhanVien },
        { title: 'Đánh giá', render: (_: any, dg: KieuDanhGia) => <><Rate disabled defaultValue={dg.soSao} style={{ fontSize: 14 }} /> <br/> <i>"{dg.nhanXet}"</i></> },
        { title: 'Phản hồi của NV', render: (_: any, dg: KieuDanhGia) => dg.phanHoi ? <Tag color="blue">{dg.phanHoi}</Tag> : <Button size="small" onClick={() => { form.resetFields(); datDanhGiaDangChon(dg); }}>Trả lời</Button> }
      ]} />

      <Modal title="Khách hàng Đánh giá" visible={!!lichHenDangChon} onCancel={() => datLichHenDangChon(null)} onOk={() => form.submit()} destroyOnClose>
        <Form form={form} layout="vertical" onFinish={guiDanhGia}>
          <Form.Item name="soSao" label="Chất lượng phục vụ" rules={[{ required: true }]}><Rate /></Form.Item>
          <Form.Item name="nhanXet" label="Nhận xét của bạn" rules={[{ required: true }]}><Input.TextArea rows={3} /></Form.Item>
        </Form>
      </Modal>

      <Modal title="Nhân viên Phản hồi" visible={!!danhGiaDangChon} onCancel={() => datDanhGiaDangChon(null)} onOk={() => form.submit()} destroyOnClose>
        <Form form={form} layout="vertical" onFinish={guiPhanHoi}>
          <Form.Item name="phanHoi" label="Nội dung phản hồi" rules={[{ required: true }]}><Input.TextArea rows={3} /></Form.Item>
        </Form>
      </Modal>
    </>
  );
};
export default TabDanhGia;
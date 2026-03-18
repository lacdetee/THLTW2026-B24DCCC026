import React from 'react';
import { Row, Col, Card, Statistic, Table } from 'antd';
import { useModel } from 'umi';
import { KieuLichHen, KieuDichVu, KieuNhanVien } from '../types';

const TabThongKe: React.FC = () => {
  const { danhSachNhanVien, danhSachDichVu, danhSachLichHen } = useModel('useModelSalon' as any);

  const lichThanhCong = danhSachLichHen.filter((lh: KieuLichHen) => lh.trangThai === 'Hoàn thành');

  const tongDoanhThu = lichThanhCong.reduce((tong: number, lh: KieuLichHen) => {
    const gia = danhSachDichVu.find((dv: KieuDichVu) => dv.id === lh.idDichVu)?.giaTien || 0;
    return tong + gia;
  }, 0);

  const thongKeNV = danhSachNhanVien.map((nv: KieuNhanVien) => {
    const cacLichCuaNV = lichThanhCong.filter((lh: KieuLichHen) => lh.idNhanVien === nv.id);
    const doanhThuNV = cacLichCuaNV.reduce((tong: number, lh: KieuLichHen) => tong + (danhSachDichVu.find((dv: KieuDichVu) => dv.id === lh.idDichVu)?.giaTien || 0), 0);
    return { ...nv, soLich: cacLichCuaNV.length, doanhThu: doanhThuNV };
  });

  return (
    <div style={{ padding: 20 }}>
      <Row gutter={24} style={{ marginBottom: 24 }}>
        <Col span={8}>
          <Card><Statistic title="Tổng số Lịch hẹn (Tất cả)" value={danhSachLichHen.length} /></Card>
        </Col>
        <Col span={8}>
          <Card><Statistic title="Lịch đã Hoàn thành" value={lichThanhCong.length} valueStyle={{ color: '#3f8600' }} /></Card>
        </Col>
        <Col span={8}>
          <Card><Statistic title="Tổng Doanh Thu (VND)" value={tongDoanhThu} suffix="đ" valueStyle={{ color: '#cf1322', fontWeight: 'bold' }} /></Card>
        </Col>
      </Row>

      <Card title="Thống Kê Doanh Thu Theo Nhân Viên" bordered={false}>
        <Table bordered size="small" dataSource={thongKeNV} rowKey="id" pagination={false} columns={[
          { title: 'Tên Nhân Viên', dataIndex: 'tenNhanVien' },
          { title: 'Số lượng khách đã phục vụ', dataIndex: 'soLich', align: 'center' as const },
          { title: 'Doanh Thu Mang Lại', dataIndex: 'doanhThu', render: (dt: number) => <b style={{ color: '#cf1322' }}>{dt.toLocaleString()} đ</b> }
        ]} />
      </Card>
    </div>
  );
};
export default TabThongKe;
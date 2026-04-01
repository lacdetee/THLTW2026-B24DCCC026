import React, { useMemo } from 'react';
import { Row, Col, Card, Statistic } from 'antd';
import {
  TeamOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';
import ReactApexChart from 'react-apexcharts';
import { useModel } from 'umi';
import type { KieuCauLacBo, KieuDonDangKy } from '../types';

const TabThongKe: React.FC = () => {
  const { danhSachCLB, danhSachDon } = useModel('useModelCLB' as any);

  /* ========== TÍNH TOÁN SỐ LIỆU THỐNG KÊ ========== */
  const soLieuTongQuat = useMemo(() => {
    const tongCLB = danhSachCLB.length;
    const tongChoXuLy = danhSachDon.filter(
      (don: KieuDonDangKy) => don.trangThai === 'Pending',
    ).length;
    const tongDaDuyet = danhSachDon.filter(
      (don: KieuDonDangKy) => don.trangThai === 'Approved',
    ).length;
    const tongTuChoi = danhSachDon.filter(
      (don: KieuDonDangKy) => don.trangThai === 'Rejected',
    ).length;

    return { tongCLB, tongChoXuLy, tongDaDuyet, tongTuChoi };
  }, [danhSachCLB, danhSachDon]);

  /* ========== DỮ LIỆU BIỂU ĐỒ CỘT ========== */
  const cauHinhBieuDo = useMemo(() => {
    const danhSachTenCLB = danhSachCLB.map((clb: KieuCauLacBo) => clb.tenCLB);

    /** Đếm số đơn theo trạng thái cho từng CLB */
    const demTheoTrangThai = (trangThai: string): number[] => {
      return danhSachCLB.map((clb: KieuCauLacBo) => {
        return danhSachDon.filter(
          (don: KieuDonDangKy) => don.idCLB === clb.id && don.trangThai === trangThai,
        ).length;
      });
    };

    const cauHinh: ApexCharts.ApexOptions = {
      chart: {
        type: 'bar',
        height: 400,
        toolbar: { show: true },
        fontFamily: 'inherit',
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '55%',
          borderRadius: 4,
        },
      },
      dataLabels: {
        enabled: true,
        style: { fontSize: '12px', fontWeight: 600 },
      },
      stroke: {
        show: true,
        width: 2,
        colors: ['transparent'],
      },
      xaxis: {
        categories: danhSachTenCLB,
        title: { text: 'Câu lạc bộ', style: { fontSize: '14px', fontWeight: 600 } },
        labels: {
          rotate: -30,
          style: { fontSize: '12px' },
        },
      },
      yaxis: {
        title: { text: 'Số đơn đăng ký', style: { fontSize: '14px', fontWeight: 600 } },
        labels: {
          formatter: (giaTri: number) => Math.round(giaTri).toString(),
        },
      },
      fill: { opacity: 1 },
      tooltip: {
        y: {
          formatter: (giaTri: number) => `${giaTri} đơn`,
        },
      },
      colors: ['#faad14', '#52c41a', '#f5222d'],
      legend: {
        position: 'top',
        fontSize: '14px',
        markers: { shape: 'square' as ApexMarkerShape },
      },
    };

    const duLieuChuoi = [
      { name: 'Chờ duyệt (Pending)', data: demTheoTrangThai('Pending') },
      { name: 'Đã duyệt (Approved)', data: demTheoTrangThai('Approved') },
      { name: 'Từ chối (Rejected)', data: demTheoTrangThai('Rejected') },
    ];

    return { cauHinh, duLieuChuoi };
  }, [danhSachCLB, danhSachDon]);

  /* ========== GIAO DIỆN ========== */
  return (
    <div>
      {/* Các card thống kê tổng quan */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <Card
            size="small"
            hoverable
            style={{ borderLeft: '4px solid #1890ff' }}
          >
            <Statistic
              title="Tổng số CLB"
              value={soLieuTongQuat.tongCLB}
              prefix={<TeamOutlined style={{ color: '#1890ff' }} />}
              valueStyle={{ color: '#1890ff', fontWeight: 700 }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Card
            size="small"
            hoverable
            style={{ borderLeft: '4px solid #faad14' }}
          >
            <Statistic
              title="Đơn chờ duyệt"
              value={soLieuTongQuat.tongChoXuLy}
              prefix={<ClockCircleOutlined style={{ color: '#faad14' }} />}
              valueStyle={{ color: '#faad14', fontWeight: 700 }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Card
            size="small"
            hoverable
            style={{ borderLeft: '4px solid #52c41a' }}
          >
            <Statistic
              title="Đã duyệt (Approved)"
              value={soLieuTongQuat.tongDaDuyet}
              prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
              valueStyle={{ color: '#52c41a', fontWeight: 700 }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Card
            size="small"
            hoverable
            style={{ borderLeft: '4px solid #f5222d' }}
          >
            <Statistic
              title="Đã từ chối (Rejected)"
              value={soLieuTongQuat.tongTuChoi}
              prefix={<CloseCircleOutlined style={{ color: '#f5222d' }} />}
              valueStyle={{ color: '#f5222d', fontWeight: 700 }}
            />
          </Card>
        </Col>
      </Row>

      {/* Biểu đồ cột */}
      <Card
        title="📊 Thống kê số đơn đăng ký theo từng Câu lạc bộ"
        style={{ borderRadius: 8 }}
      >
        {danhSachCLB.length > 0 ? (
          <ReactApexChart
            options={cauHinhBieuDo.cauHinh}
            series={cauHinhBieuDo.duLieuChuoi}
            type="bar"
            height={400}
          />
        ) : (
          <div style={{ textAlign: 'center', padding: 40, color: '#999' }}>
            Chưa có dữ liệu CLB nào. Vui lòng thêm CLB trước.
          </div>
        )}
      </Card>
    </div>
  );
};

export default TabThongKe;
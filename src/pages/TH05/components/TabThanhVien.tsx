import React, { useState, useMemo } from 'react';
import {
  Table,
  Button,
  Modal,
  Select,
  Space,
  Typography,
  Tag,
} from 'antd';
import { SwapOutlined } from '@ant-design/icons';
import { useModel } from 'umi';
import type { KieuDonDangKy, KieuCauLacBo } from '../types';

const { Text, Title } = Typography;

const TabThanhVien: React.FC = () => {
  const { danhSachDon, danhSachCLB, chuyenCLBThanhVien } = useModel('useModelCLB' as any);

  /* ========== STATE ========== */
  const [danhSachDaChon, setDanhSachDaChon] = useState<string[]>([]);
  const [hienModalChuyen, setHienModalChuyen] = useState(false);
  const [idCLBDangLoc, setIdCLBDangLoc] = useState<string | undefined>(undefined);
  const [idCLBDich, setIdCLBDich] = useState<string | undefined>(undefined);

  /* ========== DANH SÁCH THÀNH VIÊN (CHỈ APPROVED) ========== */
  const danhSachThanhVien = useMemo(() => {
    const tatCaThanhVien = danhSachDon.filter(
      (don: KieuDonDangKy) => don.trangThai === 'Approved',
    );
    if (idCLBDangLoc) {
      return tatCaThanhVien.filter((don: KieuDonDangKy) => don.idCLB === idCLBDangLoc);
    }
    return tatCaThanhVien;
  }, [danhSachDon, idCLBDangLoc]);

  /* ========== LẤY TÊN CLB ========== */
  const layTenCLB = (idCLB: string): string => {
    const clb = danhSachCLB.find((c: KieuCauLacBo) => c.id === idCLB);
    return clb?.tenCLB || 'Không xác định';
  };

  /* ========== XỬ LÝ CHUYỂN CLB ========== */
  const xuLyChuyenCLB = () => {
    if (!idCLBDich) return;
    chuyenCLBThanhVien(danhSachDaChon, idCLBDich);
    setHienModalChuyen(false);
    setDanhSachDaChon([]);
    setIdCLBDich(undefined);
  };

  /* ========== CỘT TABLE ========== */
  const danhSachCot = [
    {
      title: 'Họ tên',
      dataIndex: 'hoTen',
      key: 'hoTen',
      sorter: (a: KieuDonDangKy, b: KieuDonDangKy) => a.hoTen.localeCompare(b.hoTen),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      ellipsis: true,
    },
    {
      title: 'SĐT',
      dataIndex: 'soDienThoai',
      key: 'soDienThoai',
      width: 120,
    },
    {
      title: 'Giới tính',
      dataIndex: 'gioiTinh',
      key: 'gioiTinh',
      width: 90,
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'diaChi',
      key: 'diaChi',
      ellipsis: true,
    },
    {
      title: 'Sở trường',
      dataIndex: 'soTruong',
      key: 'soTruong',
      ellipsis: true,
    },
    {
      title: 'CLB hiện tại',
      dataIndex: 'idCLB',
      key: 'idCLB',
      render: (idCLB: string) => <Tag color="blue">{layTenCLB(idCLB)}</Tag>,
    },
  ];

  /* ========== GIAO DIỆN ========== */
  return (
    <>
      {/* Thanh công cụ */}
      <Space style={{ marginBottom: 16, width: '100%', justifyContent: 'space-between' }} wrap>
        <Space>
          <Text strong>Lọc theo CLB:</Text>
          <Select
            placeholder="Tất cả CLB"
            allowClear
            style={{ width: 250 }}
            value={idCLBDangLoc}
            onChange={(giaTri) => {
              setIdCLBDangLoc(giaTri);
              setDanhSachDaChon([]);
            }}
            options={danhSachCLB.map((clb: KieuCauLacBo) => ({
              value: clb.id,
              label: clb.tenCLB,
            }))}
          />
          <Tag color="geekblue">{danhSachThanhVien.length} thành viên</Tag>
        </Space>

        <Button
          type="primary"
          icon={<SwapOutlined />}
          disabled={!danhSachDaChon.length}
          onClick={() => setHienModalChuyen(true)}
        >
          Chuyển CLB cho {danhSachDaChon.length} thành viên
        </Button>
      </Space>

      {/* Bảng thành viên */}
      <Table
        bordered
        size="small"
        rowSelection={{
          selectedRowKeys: danhSachDaChon,
          onChange: (keys) => setDanhSachDaChon(keys as string[]),
        }}
        dataSource={danhSachThanhVien}
        columns={danhSachCot}
        rowKey="id"
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (tong) => `Tổng ${tong} thành viên`,
        }}
      />

      {/* Modal Chuyển CLB */}
      <Modal
        title="Chuyển Câu lạc bộ cho thành viên"
        visible={hienModalChuyen}
        onCancel={() => {
          setHienModalChuyen(false);
          setIdCLBDich(undefined);
        }}
        onOk={xuLyChuyenCLB}
        okText="Xác nhận chuyển"
        cancelText="Hủy"
        okButtonProps={{ disabled: !idCLBDich }}
      >
        <div style={{ marginBottom: 16 }}>
          <Title level={5} style={{ color: '#1890ff' }}>
            Thông tin chuyển CLB
          </Title>
          <Text>
            Bạn đang chuyển CLB cho{' '}
            <Text strong type="danger">
              {danhSachDaChon.length} thành viên
            </Text>
          </Text>

          {/* Hiển thị danh sách thành viên đang chọn */}
          <div
            style={{
              marginTop: 12,
              padding: '8px 12px',
              background: '#f5f5f5',
              borderRadius: 4,
              maxHeight: 150,
              overflow: 'auto',
            }}
          >
            {danhSachDaChon.map((id) => {
              const thanhVien = danhSachDon.find((d: KieuDonDangKy) => d.id === id);
              return thanhVien ? (
                <div key={id} style={{ marginBottom: 4 }}>
                  <Text>
                    • {thanhVien.hoTen} — <Text type="secondary">{layTenCLB(thanhVien.idCLB)}</Text>
                  </Text>
                </div>
              ) : null;
            })}
          </div>
        </div>

        <div>
          <Text strong>Chọn CLB muốn chuyển đến:</Text>
          <Select
            style={{ width: '100%', marginTop: 8 }}
            placeholder="Chọn Câu lạc bộ đích"
            showSearch
            optionFilterProp="label"
            value={idCLBDich}
            onChange={(giaTri) => setIdCLBDich(giaTri)}
            options={danhSachCLB.map((clb: KieuCauLacBo) => ({
              value: clb.id,
              label: clb.tenCLB,
            }))}
          />
        </div>
      </Modal>
    </>
  );
};

export default TabThanhVien;
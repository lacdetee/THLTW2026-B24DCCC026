import React, { useState, useMemo } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Space,
  Tag,
  Popconfirm,
  Avatar,
  Upload,
  Tooltip,
  Descriptions,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  TeamOutlined,
  SearchOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import { useModel } from 'umi';
import type { KieuCauLacBo, KieuDonDangKy } from '../types';

const TabCauLacBo: React.FC = () => {
  const { danhSachCLB, themCLB, suaCLB, xoaCLB, danhSachDon } = useModel('useModelCLB' as any);

  /* ========== STATE ========== */
  const [hienModalForm, setHienModalForm] = useState(false);
  const [banGhiDangSua, setBanGhiDangSua] = useState<KieuCauLacBo | null>(null);
  const [tuKhoaTimKiem, setTuKhoaTimKiem] = useState('');
  const [hienModalThanhVien, setHienModalThanhVien] = useState<KieuCauLacBo | null>(null);
  const [anhBase64, setAnhBase64] = useState<string>('');
  const [form] = Form.useForm();

  /* ========== DỮ LIỆU ĐÃ LỌC ========== */
  const danhSachDaLoc = useMemo(() => {
    if (!tuKhoaTimKiem.trim()) return danhSachCLB;
    const tuKhoa = tuKhoaTimKiem.toLowerCase();
    return danhSachCLB.filter(
      (clb: KieuCauLacBo) =>
        clb.tenCLB.toLowerCase().includes(tuKhoa) ||
        clb.chuNhiem.toLowerCase().includes(tuKhoa),
    );
  }, [danhSachCLB, tuKhoaTimKiem]);

  /* ========== XỬ LÝ MỞ FORM ========== */
  const moFormThem = () => {
    setBanGhiDangSua(null);
    setAnhBase64('');
    form.resetFields();
    setHienModalForm(true);
  };

  const moFormSua = (banGhi: KieuCauLacBo) => {
    setBanGhiDangSua(banGhi);
    setAnhBase64(banGhi.anhDaiDien || '');
    form.setFieldsValue(banGhi);
    setHienModalForm(true);
  };

  /* ========== XỬ LÝ LƯU ========== */
  const xuLyLuu = (giaTri: Record<string, any>) => {
    const duLieu = { ...giaTri, anhDaiDien: anhBase64 };
    if (banGhiDangSua) {
      suaCLB(banGhiDangSua.id, duLieu);
    } else {
      themCLB(duLieu as Omit<KieuCauLacBo, 'id'>);
    }
    setHienModalForm(false);
    form.resetFields();
    setAnhBase64('');
  };

  /* ========== XỬ LÝ UPLOAD ẢNH ========== */
  const xuLyUploadAnh = (info: any) => {
    const file = info.file?.originFileObj || info.file;
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setAnhBase64(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
    return false;
  };

  /* ========== DANH SÁCH THÀNH VIÊN CỦA CLB ========== */
  const layThanhVienCLB = (idCLB: string): KieuDonDangKy[] => {
    return danhSachDon.filter(
      (don: KieuDonDangKy) => don.idCLB === idCLB && don.trangThai === 'Approved',
    );
  };

  /* ========== CỘT TABLE ========== */
  const danhSachCot = [
    {
      title: 'Ảnh',
      dataIndex: 'anhDaiDien',
      key: 'anhDaiDien',
      width: 70,
      render: (anh: string, banGhi: KieuCauLacBo) => (
        <Avatar
          src={anh}
          size={40}
          style={{ backgroundColor: anh ? undefined : '#1890ff' }}
        >
          {!anh && banGhi.tenCLB?.charAt(0)}
        </Avatar>
      ),
    },
    {
      title: 'Tên Câu lạc bộ',
      dataIndex: 'tenCLB',
      key: 'tenCLB',
      sorter: (a: KieuCauLacBo, b: KieuCauLacBo) => a.tenCLB.localeCompare(b.tenCLB),
    },
    {
      title: 'Ngày thành lập',
      dataIndex: 'ngayThanhLap',
      key: 'ngayThanhLap',
      align: 'center' as const,
      sorter: (a: KieuCauLacBo, b: KieuCauLacBo) =>
        new Date(a.ngayThanhLap).getTime() - new Date(b.ngayThanhLap).getTime(),
    },
    {
      title: 'Mô tả',
      dataIndex: 'moTa',
      key: 'moTa',
      width: 250,
      ellipsis: true,
      render: (moTa: string) =>
        moTa ? (
          <Tooltip title={<div dangerouslySetInnerHTML={{ __html: moTa }} />}>
            <div
              dangerouslySetInnerHTML={{ __html: moTa }}
              style={{ maxHeight: 60, overflow: 'hidden' }}
            />
          </Tooltip>
        ) : (
          <span style={{ color: '#ccc' }}>—</span>
        ),
    },
    {
      title: 'Chủ nhiệm CLB',
      dataIndex: 'chuNhiem',
      key: 'chuNhiem',
    },
    {
      title: 'Hoạt động',
      dataIndex: 'dangHoatDong',
      key: 'dangHoatDong',
      align: 'center' as const,
      filters: [
        { text: 'Có', value: true },
        { text: 'Không', value: false },
      ],
      onFilter: (giaTri: any, banGhi: KieuCauLacBo) => banGhi.dangHoatDong === giaTri,
      render: (dangHoatDong: boolean) => (
        <Tag color={dangHoatDong ? 'blue' : 'default'}>
          {dangHoatDong ? 'Có' : 'Không'}
        </Tag>
      ),
    },
    {
      title: 'Thao tác',
      key: 'thaoTac',
      align: 'center' as const,
      width: 220,
      render: (_: unknown, banGhi: KieuCauLacBo) => (
        <Space>
          <Tooltip title="Chỉnh sửa">
            <Button
              size="small"
              icon={<EditOutlined />}
              onClick={() => moFormSua(banGhi)}
            />
          </Tooltip>
          <Popconfirm
            title="Bạn có chắc muốn xóa CLB này?"
            onConfirm={() => xoaCLB(banGhi.id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Tooltip title="Xóa">
              <Button size="small" danger icon={<DeleteOutlined />} />
            </Tooltip>
          </Popconfirm>
          <Tooltip title="Xem thành viên">
            <Button
              size="small"
              type="primary"
              ghost
              icon={<TeamOutlined />}
              onClick={() => setHienModalThanhVien(banGhi)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  /* ========== CỘT TABLE THÀNH VIÊN ========== */
  const cotThanhVien = [
    { title: 'Họ tên', dataIndex: 'hoTen', key: 'hoTen' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'SĐT', dataIndex: 'soDienThoai', key: 'soDienThoai' },
    { title: 'Giới tính', dataIndex: 'gioiTinh', key: 'gioiTinh' },
    { title: 'Sở trường', dataIndex: 'soTruong', key: 'soTruong' },
  ];

  /* ========== GIAO DIỆN ========== */
  return (
    <>
      {/* Thanh công cụ */}
      <Space style={{ marginBottom: 16, width: '100%', justifyContent: 'space-between' }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={moFormThem}>
          Thêm Câu Lạc Bộ
        </Button>
        <Input
          placeholder="Tìm kiếm theo tên CLB hoặc chủ nhiệm..."
          prefix={<SearchOutlined />}
          allowClear
          style={{ width: 350 }}
          value={tuKhoaTimKiem}
          onChange={(e) => setTuKhoaTimKiem(e.target.value)}
        />
      </Space>

      {/* Bảng danh sách CLB */}
      <Table
        bordered
        size="small"
        dataSource={danhSachDaLoc}
        columns={danhSachCot}
        rowKey="id"
        pagination={{ pageSize: 5, showSizeChanger: true, showTotal: (tong) => `Tổng ${tong} CLB` }}
      />

      {/* Modal Thêm/Sửa CLB */}
      <Modal
        title={banGhiDangSua ? 'Cập nhật Câu Lạc Bộ' : 'Thêm Câu Lạc Bộ mới'}
        visible={hienModalForm}
        onCancel={() => {
          setHienModalForm(false);
          form.resetFields();
          setAnhBase64('');
        }}
        onOk={() => form.submit()}
        okText={banGhiDangSua ? 'Cập nhật' : 'Thêm mới'}
        cancelText="Hủy"
        destroyOnClose
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={xuLyLuu}>
          <Form.Item label="Ảnh đại diện">
            <Space align="start">
              {anhBase64 && (
                <Avatar src={anhBase64} size={64} style={{ marginRight: 12 }} />
              )}
              <Upload
                beforeUpload={() => false}
                onChange={xuLyUploadAnh}
                showUploadList={false}
                accept="image/*"
              >
                <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
              </Upload>
            </Space>
          </Form.Item>

          <Form.Item
            name="tenCLB"
            label="Tên Câu lạc bộ"
            rules={[{ required: true, message: 'Vui lòng nhập tên CLB!' }]}
          >
            <Input placeholder="VD: CLB Lập trình" />
          </Form.Item>

          <Form.Item
            name="chuNhiem"
            label="Chủ nhiệm CLB (Nhập text)"
            rules={[{ required: true, message: 'Vui lòng nhập tên chủ nhiệm!' }]}
          >
            <Input placeholder="VD: Nguyễn Văn A" />
          </Form.Item>

          <Form.Item
            name="ngayThanhLap"
            label="Ngày thành lập"
            rules={[{ required: true, message: 'Vui lòng chọn ngày thành lập!' }]}
          >
            <Input type="date" />
          </Form.Item>

          <Form.Item name="dangHoatDong" label="Hoạt động" initialValue={true}>
            <Select
              options={[
                { value: true, label: 'Có' },
                { value: false, label: 'Không' },
              ]}
            />
          </Form.Item>

          <Form.Item name="moTa" label="Mô tả (HTML)">
            <Input.TextArea
              rows={4}
              placeholder="Nhập mã HTML hoặc text mô tả CLB..."
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal Xem Thành Viên của CLB */}
      <Modal
        title={`Danh sách thành viên — ${hienModalThanhVien?.tenCLB || ''}`}
        visible={!!hienModalThanhVien}
        onCancel={() => setHienModalThanhVien(null)}
        footer={null}
        width={800}
      >
        {hienModalThanhVien && (
          <>
            <Descriptions bordered size="small" column={2} style={{ marginBottom: 16 }}>
              <Descriptions.Item label="Tên CLB">
                {hienModalThanhVien.tenCLB}
              </Descriptions.Item>
              <Descriptions.Item label="Chủ nhiệm">
                {hienModalThanhVien.chuNhiem}
              </Descriptions.Item>
              <Descriptions.Item label="Số thành viên">
                <Tag color="blue">
                  {layThanhVienCLB(hienModalThanhVien.id).length} người
                </Tag>
              </Descriptions.Item>
            </Descriptions>

            <Table
              bordered
              size="small"
              dataSource={layThanhVienCLB(hienModalThanhVien.id)}
              columns={cotThanhVien}
              rowKey="id"
              pagination={{ pageSize: 5 }}
              locale={{ emptyText: 'Chưa có thành viên nào' }}
            />
          </>
        )}
      </Modal>
    </>
  );
};

export default TabCauLacBo;
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
  Descriptions,
  Timeline,
  Typography,
  Tooltip,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  HistoryOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { useModel } from 'umi';
import type { KieuDonDangKy, KieuCauLacBo } from '../types';
import { DS_GIOI_TINH, DS_TRANG_THAI } from '../constants';

const { Text } = Typography;

const TabDonDangKy: React.FC = () => {
  const {
    danhSachDon,
    danhSachCLB,
    themDon,
    suaDon,
    xoaDon,
    xuLyDuyetDon,
  } = useModel('useModelCLB' as any);

  /* ========== STATE ========== */
  const [danhSachDaChon, setDanhSachDaChon] = useState<string[]>([]);
  const [hienModalForm, setHienModalForm] = useState(false);
  const [hienModalChiTiet, setHienModalChiTiet] = useState<KieuDonDangKy | null>(null);
  const [hienModalLichSu, setHienModalLichSu] = useState<KieuDonDangKy | null>(null);
  const [hienModalTuChoi, setHienModalTuChoi] = useState<{ hien: boolean; danhSachId: string[] }>({
    hien: false,
    danhSachId: [],
  });
  const [banGhiDangSua, setBanGhiDangSua] = useState<KieuDonDangKy | null>(null);
  const [tuKhoaTimKiem, setTuKhoaTimKiem] = useState('');
  const [locTrangThai, setLocTrangThai] = useState<string | undefined>(undefined);

  const [formDon] = Form.useForm();
  const [formTuChoi] = Form.useForm();

  /* ========== DỮ LIỆU ĐÃ LỌC ========== */
  const danhSachDaLoc = useMemo(() => {
    let ketQua = [...danhSachDon];
    if (tuKhoaTimKiem.trim()) {
      const tuKhoa = tuKhoaTimKiem.toLowerCase();
      ketQua = ketQua.filter(
        (don: KieuDonDangKy) =>
          don.hoTen.toLowerCase().includes(tuKhoa) ||
          don.email.toLowerCase().includes(tuKhoa) ||
          don.soDienThoai.includes(tuKhoa),
      );
    }
    if (locTrangThai) {
      ketQua = ketQua.filter((don: KieuDonDangKy) => don.trangThai === locTrangThai);
    }
    return ketQua;
  }, [danhSachDon, tuKhoaTimKiem, locTrangThai]);

  /* ========== XỬ LÝ FORM ========== */
  const moFormThem = () => {
    setBanGhiDangSua(null);
    formDon.resetFields();
    setHienModalForm(true);
  };

  const moFormSua = (banGhi: KieuDonDangKy) => {
    setBanGhiDangSua(banGhi);
    formDon.setFieldsValue(banGhi);
    setHienModalForm(true);
  };

  const xuLyLuuDon = (giaTri: Record<string, any>) => {
    if (banGhiDangSua) {
      suaDon(banGhiDangSua.id, giaTri);
    } else {
      themDon(giaTri as Omit<KieuDonDangKy, 'id' | 'trangThai' | 'lichSu'>);
    }
    setHienModalForm(false);
    formDon.resetFields();
  };

  /* ========== XỬ LÝ TỪ CHỐI ========== */
  const xuLyXacNhanTuChoi = (giaTri: { lyDo: string }) => {
    xuLyDuyetDon(hienModalTuChoi.danhSachId, 'Rejected', giaTri.lyDo);
    setHienModalTuChoi({ hien: false, danhSachId: [] });
    setDanhSachDaChon([]);
    formTuChoi.resetFields();
  };

  /* ========== TÊN CLB ========== */
  const layTenCLB = (idCLB: string): string => {
    const clb = danhSachCLB.find((c: KieuCauLacBo) => c.id === idCLB);
    return clb?.tenCLB || 'Không xác định';
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
      filters: DS_GIOI_TINH.map((g) => ({ text: g.label, value: g.value })),
      onFilter: (giaTri: any, banGhi: KieuDonDangKy) => banGhi.gioiTinh === giaTri,
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
      title: 'Câu lạc bộ',
      dataIndex: 'idCLB',
      key: 'idCLB',
      render: (idCLB: string) => layTenCLB(idCLB),
      filters: danhSachCLB.map((clb: KieuCauLacBo) => ({
        text: clb.tenCLB,
        value: clb.id,
      })),
      onFilter: (giaTri: any, banGhi: KieuDonDangKy) => banGhi.idCLB === giaTri,
    },
    {
      title: 'Lý do đăng ký',
      dataIndex: 'lyDoDangKy',
      key: 'lyDoDangKy',
      ellipsis: true,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'trangThai',
      key: 'trangThai',
      width: 110,
      render: (trangThai: string) => {
        const cauHinh = DS_TRANG_THAI.find((t) => t.value === trangThai);
        return <Tag color={cauHinh?.color || 'default'}>{cauHinh?.label || trangThai}</Tag>;
      },
    },
    {
      title: 'Ghi chú',
      dataIndex: 'ghiChu',
      key: 'ghiChu',
      ellipsis: true,
      render: (ghiChu: string) => ghiChu || <span style={{ color: '#ccc' }}>—</span>,
    },
    {
      title: 'Thao tác',
      key: 'thaoTac',
      align: 'center' as const,
      width: 200,
      fixed: 'right' as const,
      render: (_: unknown, banGhi: KieuDonDangKy) => (
        <Space size={4}>
          <Tooltip title="Xem chi tiết">
            <Button
              size="small"
              icon={<EyeOutlined />}
              onClick={() => setHienModalChiTiet(banGhi)}
            />
          </Tooltip>
          <Tooltip title="Chỉnh sửa">
            <Button
              size="small"
              icon={<EditOutlined />}
              onClick={() => moFormSua(banGhi)}
            />
          </Tooltip>
          <Popconfirm
            title="Bạn có chắc muốn xóa đơn này?"
            onConfirm={() => xoaDon(banGhi.id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Tooltip title="Xóa">
              <Button size="small" danger icon={<DeleteOutlined />} />
            </Tooltip>
          </Popconfirm>
          <Tooltip title="Lịch sử">
            <Button
              size="small"
              type="link"
              icon={<HistoryOutlined />}
              onClick={() => setHienModalLichSu(banGhi)}
            />
          </Tooltip>
          {banGhi.trangThai === 'Pending' && (
            <>
              <Tooltip title="Duyệt">
                <Popconfirm
                  title="Xác nhận duyệt đơn này?"
                  onConfirm={() => xuLyDuyetDon([banGhi.id], 'Approved')}
                  okText="Duyệt"
                  cancelText="Hủy"
                >
                  <Button size="small" type="primary" ghost icon={<CheckCircleOutlined />} />
                </Popconfirm>
              </Tooltip>
              <Tooltip title="Từ chối">
                <Button
                  size="small"
                  danger
                  icon={<CloseCircleOutlined />}
                  onClick={() =>
                    setHienModalTuChoi({ hien: true, danhSachId: [banGhi.id] })
                  }
                />
              </Tooltip>
            </>
          )}
        </Space>
      ),
    },
  ];

  /* ========== GIAO DIỆN ========== */
  return (
    <>
      {/* Thanh công cụ */}
      <Space style={{ marginBottom: 16 }} wrap>
        <Button type="primary" icon={<PlusOutlined />} onClick={moFormThem}>
          Thêm đơn đăng ký
        </Button>
        <Button
          type="primary"
          disabled={!danhSachDaChon.length}
          icon={<CheckCircleOutlined />}
          onClick={() => {
            Modal.confirm({
              title: 'Xác nhận duyệt',
              content: `Bạn có chắc muốn duyệt ${danhSachDaChon.length} đơn đã chọn?`,
              okText: 'Duyệt',
              cancelText: 'Hủy',
              onOk: () => {
                xuLyDuyetDon(danhSachDaChon, 'Approved');
                setDanhSachDaChon([]);
              },
            });
          }}
        >
          Duyệt {danhSachDaChon.length} đơn đã chọn
        </Button>
        <Button
          danger
          disabled={!danhSachDaChon.length}
          icon={<CloseCircleOutlined />}
          onClick={() =>
            setHienModalTuChoi({ hien: true, danhSachId: danhSachDaChon })
          }
        >
          Không duyệt {danhSachDaChon.length} đơn đã chọn
        </Button>
      </Space>

      {/* Thanh tìm kiếm + lọc */}
      <Space style={{ marginBottom: 16 }} wrap>
        <Input
          placeholder="Tìm theo họ tên, email, SĐT..."
          prefix={<SearchOutlined />}
          allowClear
          style={{ width: 300 }}
          value={tuKhoaTimKiem}
          onChange={(e) => setTuKhoaTimKiem(e.target.value)}
        />
        <Select
          placeholder="Lọc trạng thái"
          allowClear
          style={{ width: 160 }}
          value={locTrangThai}
          onChange={(giaTri) => setLocTrangThai(giaTri)}
          options={DS_TRANG_THAI}
        />
      </Space>

      {/* Bảng đơn đăng ký */}
      <Table
        bordered
        size="small"
        rowSelection={{
          selectedRowKeys: danhSachDaChon,
          onChange: (keys) => setDanhSachDaChon(keys as string[]),
        }}
        dataSource={danhSachDaLoc}
        columns={danhSachCot}
        rowKey="id"
        scroll={{ x: 1400 }}
        pagination={{
          pageSize: 5,
          showSizeChanger: true,
          showTotal: (tong) => `Tổng ${tong} đơn`,
        }}
      />

      {/* Modal Thêm/Sửa Đơn */}
      <Modal
        title={banGhiDangSua ? 'Chỉnh sửa đơn đăng ký' : 'Thêm đơn đăng ký mới'}
        visible={hienModalForm}
        onCancel={() => {
          setHienModalForm(false);
          formDon.resetFields();
        }}
        onOk={() => formDon.submit()}
        okText={banGhiDangSua ? 'Cập nhật' : 'Thêm mới'}
        cancelText="Hủy"
        destroyOnClose
        width={700}
      >
        <Form form={formDon} layout="vertical" onFinish={xuLyLuuDon}>
          <Form.Item
            name="hoTen"
            label="Họ tên"
            rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
          >
            <Input placeholder="VD: Nguyễn Văn A" />
          </Form.Item>

          <Space style={{ width: '100%' }} size="large">
            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: 'Vui lòng nhập email!' },
                { type: 'email', message: 'Email không hợp lệ!' },
              ]}
            >
              <Input placeholder="VD: abc@gmail.com" style={{ width: 280 }} />
            </Form.Item>

            <Form.Item
              name="soDienThoai"
              label="Số điện thoại"
              rules={[{ required: true, message: 'Vui lòng nhập SĐT!' }]}
            >
              <Input placeholder="VD: 0912345678" style={{ width: 200 }} />
            </Form.Item>

            <Form.Item
              name="gioiTinh"
              label="Giới tính"
              rules={[{ required: true, message: 'Vui lòng chọn giới tính!' }]}
            >
              <Select placeholder="Chọn" style={{ width: 120 }} options={DS_GIOI_TINH} />
            </Form.Item>
          </Space>

          <Form.Item
            name="diaChi"
            label="Địa chỉ"
            rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}
          >
            <Input placeholder="VD: Hà Nội" />
          </Form.Item>

          <Form.Item name="soTruong" label="Sở trường">
            <Input placeholder="VD: Lập trình, Thiết kế, ..." />
          </Form.Item>

          <Form.Item
            name="idCLB"
            label="Câu lạc bộ muốn đăng ký"
            rules={[{ required: true, message: 'Vui lòng chọn CLB!' }]}
          >
            <Select
              placeholder="Chọn Câu lạc bộ"
              showSearch
              optionFilterProp="label"
              options={danhSachCLB.map((clb: KieuCauLacBo) => ({
                value: clb.id,
                label: clb.tenCLB,
              }))}
            />
          </Form.Item>

          <Form.Item
            name="lyDoDangKy"
            label="Lý do đăng ký"
            rules={[{ required: true, message: 'Vui lòng nhập lý do!' }]}
          >
            <Input.TextArea rows={3} placeholder="Vì sao bạn muốn tham gia CLB này?" />
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal Xem Chi Tiết */}
      <Modal
        title="Chi tiết đơn đăng ký"
        visible={!!hienModalChiTiet}
        onCancel={() => setHienModalChiTiet(null)}
        footer={null}
        width={700}
      >
        {hienModalChiTiet && (
          <Descriptions bordered column={2} size="small">
            <Descriptions.Item label="Họ tên">{hienModalChiTiet.hoTen}</Descriptions.Item>
            <Descriptions.Item label="Email">{hienModalChiTiet.email}</Descriptions.Item>
            <Descriptions.Item label="Số điện thoại">
              {hienModalChiTiet.soDienThoai}
            </Descriptions.Item>
            <Descriptions.Item label="Giới tính">{hienModalChiTiet.gioiTinh}</Descriptions.Item>
            <Descriptions.Item label="Địa chỉ" span={2}>
              {hienModalChiTiet.diaChi}
            </Descriptions.Item>
            <Descriptions.Item label="Sở trường" span={2}>
              {hienModalChiTiet.soTruong}
            </Descriptions.Item>
            <Descriptions.Item label="Câu lạc bộ">
              {layTenCLB(hienModalChiTiet.idCLB)}
            </Descriptions.Item>
            <Descriptions.Item label="Trạng thái">
              <Tag
                color={
                  DS_TRANG_THAI.find((t) => t.value === hienModalChiTiet.trangThai)?.color
                }
              >
                {DS_TRANG_THAI.find((t) => t.value === hienModalChiTiet.trangThai)?.label}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Lý do đăng ký" span={2}>
              {hienModalChiTiet.lyDoDangKy}
            </Descriptions.Item>
            <Descriptions.Item label="Ghi chú (lý do từ chối)" span={2}>
              {hienModalChiTiet.ghiChu || '—'}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>

      {/* Modal Lịch Sử Thao Tác */}
      <Modal
        title={`Lịch sử thao tác — ${hienModalLichSu?.hoTen || ''}`}
        visible={!!hienModalLichSu}
        onCancel={() => setHienModalLichSu(null)}
        footer={null}
        width={600}
      >
        {hienModalLichSu?.lichSu && hienModalLichSu.lichSu.length > 0 ? (
          <Timeline mode="left">
            {hienModalLichSu.lichSu.map((mucLichSu, chiSo) => (
              <Timeline.Item
                key={chiSo}
                color={
                  mucLichSu.hanhDong.includes('Approved')
                    ? 'green'
                    : mucLichSu.hanhDong.includes('Rejected')
                    ? 'red'
                    : 'blue'
                }
              >
                <Text strong>[{mucLichSu.thoiGian}]</Text>
                <br />
                <Text>{mucLichSu.hanhDong}</Text>
                {mucLichSu.ghiChu && (
                  <>
                    <br />
                    <Text type="secondary">Lý do: {mucLichSu.ghiChu}</Text>
                  </>
                )}
              </Timeline.Item>
            ))}
          </Timeline>
        ) : (
          <Text type="secondary">Chưa có lịch sử thao tác nào.</Text>
        )}
      </Modal>

      {/* Modal Từ Chối */}
      <Modal
        title={`Từ chối ${hienModalTuChoi.danhSachId.length} đơn đăng ký`}
        visible={hienModalTuChoi.hien}
        onOk={() => formTuChoi.submit()}
        onCancel={() => {
          setHienModalTuChoi({ hien: false, danhSachId: [] });
          formTuChoi.resetFields();
        }}
        okText="Xác nhận từ chối"
        okButtonProps={{ danger: true }}
        cancelText="Hủy"
        destroyOnClose
      >
        <Text type="secondary" style={{ display: 'block', marginBottom: 12 }}>
          Bạn đang từ chối {hienModalTuChoi.danhSachId.length} đơn đăng ký. Vui lòng nhập
          lý do:
        </Text>
        <Form form={formTuChoi} onFinish={xuLyXacNhanTuChoi} layout="vertical">
          <Form.Item
            name="lyDo"
            label="Lý do từ chối (Bắt buộc)"
            rules={[{ required: true, message: 'Bắt buộc nhập lý do từ chối!' }]}
          >
            <Input.TextArea rows={4} placeholder="Nhập lý do từ chối..." />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default TabDonDangKy;
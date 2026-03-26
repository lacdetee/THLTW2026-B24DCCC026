import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, Select, DatePicker, InputNumber, Row, Col, Typography } from 'antd';
import { useModel } from 'umi';

const { Text } = Typography;

const REGEX_CHU_CAI_TIENG_VIET = /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỮỰỲỴÝỶỸửữựỳỵỷỹ\s]+$/;

const TabVanBang: React.FC = () => {
  const { danhSachVanBang, danhSachQuyetDinh, danhSachTruong, capPhatVanBang, danhSachSo } = useModel('useModelVanBang' as any);
  const [hienThi, datHienThi] = useState(false);
  const [form] = Form.useForm();

  const xuLyCapPhat = (values: any) => {
    const { idQuyetDinh, soHieu, maSinhVien, hoTen, ngaySinh, ...thongTinDong } = values;
    const ngaySinhStr = ngaySinh ? ngaySinh.format('DD/MM/YYYY') : '';
    
    const dongDaFormat: any = {};
    danhSachTruong.forEach((tr: any) => {
      if (thongTinDong[tr.id] && tr.kieuDuLieu === 'Date') {
        dongDaFormat[tr.tenTruong] = thongTinDong[tr.id].format('DD/MM/YYYY');
      } else {
        dongDaFormat[tr.tenTruong] = thongTinDong[tr.id];
      }
    });

    const hopLe = capPhatVanBang({ idQuyetDinh, soHieu, maSinhVien, hoTen, ngaySinh: ngaySinhStr, thongTinDong: dongDaFormat });
    if (hopLe) {
      datHienThi(false);
      form.resetFields(); 
    }
  };

  return (
    <>
      <Button type="primary" onClick={() => { form.resetFields(); datHienThi(true); }} style={{ marginBottom: 16 }}>+ Cấp Phát Văn Bằng</Button>
      <Table bordered size="small" dataSource={danhSachVanBang} rowKey="id" columns={[
        { title: 'Số Vào Sổ', dataIndex: 'soVaoSo', align: 'center' as const, render: (so: number) => <Text type="danger" strong>{so}</Text> },
        { title: 'Số Hiệu', dataIndex: 'soHieu' },
        { title: 'Mã SV', dataIndex: 'maSinhVien' },
        { title: 'Họ Tên', dataIndex: 'hoTen' },
        { title: 'Số QĐ', render: (_: any, vb: any) => danhSachQuyetDinh.find((qd: any) => qd.id === vb.idQuyetDinh)?.soQuyetDinh },
        { title: 'Thông tin khác', render: (_: any, vb: any) => JSON.stringify(vb.thongTinDong) }
      ]} />

      <Modal title="Cấp Phát Văn Bằng Mới" visible={hienThi} width={700} onCancel={() => datHienThi(false)} onOk={() => form.submit()} destroyOnClose>
        <Form form={form} layout="vertical" onFinish={xuLyCapPhat}>
          <Row gutter={16}>
            <Col span={24}><Text type="secondary">Lưu ý: "Số vào sổ" sẽ được hệ thống cấp tự động khi ấn OK.</Text></Col>
            <Col span={12}><Form.Item name="idQuyetDinh" label="Thuộc QĐ Tốt nghiệp" rules={[{ required: true, message: 'Vui lòng chọn Quyết định!' }]}><Select>{danhSachQuyetDinh.map((qd: any) => <Select.Option key={qd.id} value={qd.id}>{qd.soQuyetDinh} (Sổ: {danhSachSo.find((s:any)=>s.id===qd.idSoVanBang)?.nam})</Select.Option>)}</Select></Form.Item></Col>
            
            <Col span={12}>
              <Form.Item name="maSinhVien" label="Mã sinh viên" rules={[
                { required: true, message: 'Nhập mã SV!' },
                { pattern: /^[a-zA-Z0-9]+$/, message: 'Mã SV không chứa khoảng trắng hay ký tự đặc biệt!' }
              ]}>
                <Input placeholder="VD: B24DCCC164" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item name="soHieu" label="Số hiệu văn bằng" rules={[
                { required: true, message: 'Nhập số hiệu!' },
                { pattern: /^[a-zA-Z0-9-]+$/, message: 'Số hiệu chỉ chứa chữ, số và dấu gạch ngang!' }
              ]}>
                <Input placeholder="VD: VB-2026-001" />
              </Form.Item>
            </Col>
            
            <Col span={12}>
              <Form.Item name="hoTen" label="Họ tên sinh viên" rules={[
                { required: true, message: 'Nhập họ tên!' },
                { pattern: REGEX_CHU_CAI_TIENG_VIET, message: 'Họ tên không được chứa số hay ký tự đặc biệt!' }
              ]}>
                <Input placeholder="VD: Nguyễn Văn Khánh" />
              </Form.Item>
            </Col>

            <Col span={12}><Form.Item name="ngaySinh" label="Ngày sinh" rules={[{ required: true, message: 'Chọn ngày sinh!' }]}><DatePicker format="DD/MM/YYYY" style={{width: '100%'}} /></Form.Item></Col>
          </Row>
          
          <hr style={{ margin: '10px 0', border: '0.5px solid #eee' }} />
          <Text strong>Các trường thông tin động (Từ cấu hình):</Text>
          <Row gutter={16} style={{ marginTop: 10 }}>
            {danhSachTruong.map((truong: any) => {
              const laTruongDiem = truong.tenTruong.toLowerCase().includes('điểm');

              return (
                <Col span={12} key={truong.id}>
                  <Form.Item 
                    name={truong.id} 
                    label={truong.tenTruong}
                    rules={[
                      { required: true, message: `Vui lòng nhập ${truong.tenTruong}!` },
                      ...(truong.kieuDuLieu === 'String' ? [{ 
                        pattern: REGEX_CHU_CAI_TIENG_VIET, 
                        message: `${truong.tenTruong} không được chứa số hay ký tự đặc biệt!` 
                      }] : []),
                      ...(laTruongDiem ? [{
                        type: 'number' as const,
                        min: 0,
                        max: 4,
                        message: 'Điểm trung bình phải từ 0.0 đến 4.0!'
                      }] : [])
                    ]}
                  >
                    {truong.kieuDuLieu === 'Number' ? (
                      <InputNumber 
                        style={{width:'100%'}} 
                        step={laTruongDiem ? 0.1 : 1}
                        placeholder={laTruongDiem ? "0.0 -> 4.0" : "Nhập số..."}
                      />
                    ) : truong.kieuDuLieu === 'Date' ? (
                      <DatePicker style={{width:'100%'}} format="DD/MM/YYYY" placeholder="Chọn ngày..." />
                    ) : (
                      <Input placeholder="Nhập văn bản..." />
                    )}
                  </Form.Item>
                </Col>
              );
            })}
          </Row>
        </Form>
      </Modal>
    </>
  );
};

export default TabVanBang;
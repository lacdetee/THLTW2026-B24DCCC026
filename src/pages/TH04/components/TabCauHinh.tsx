import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, Select } from 'antd';
import { useModel } from 'umi';

const TabCauHinh: React.FC = () => {
  const { danhSachTruong, luuTruongThongTin } = useModel('useModelVanBang' as any);
  const [hienThi, datHienThi] = useState(false);
  const [form] = Form.useForm();

  const luuTruong = (values: any) => {
    luuTruongThongTin([...danhSachTruong, { id: `TRUONG_${Date.now()}`, ...values }]);
    datHienThi(false);
  };

  return (
    <>
      <Button type="primary" onClick={() => { form.resetFields(); datHienThi(true); }} style={{ marginBottom: 16 }}>+ Thêm Trường Thông Tin</Button>
      <Table bordered size="small" dataSource={danhSachTruong} rowKey="id" columns={[
        { title: 'Tên Trường Hiển Thị', dataIndex: 'tenTruong' },
        { title: 'Kiểu Dữ Liệu (Control)', dataIndex: 'kieuDuLieu' },
        { title: 'Thao tác', align: 'center' as const, render: (_: any, tr: any) => <Button danger size="small" onClick={() => luuTruongThongTin(danhSachTruong.filter((t: any) => t.id !== tr.id))}>Xóa</Button> }
      ]} />

      <Modal title="Thêm Trường Vào Phụ Lục Bằng" visible={hienThi} onCancel={() => datHienThi(false)} onOk={() => form.submit()} destroyOnClose>
        <Form form={form} layout="vertical" onFinish={luuTruong}>
          <Form.Item name="tenTruong" label="Tên trường (VD: Dân tộc, Nơi sinh)" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="kieuDuLieu" label="Kiểu dữ liệu nhập" rules={[{ required: true }]}>
            <Select>
              <Select.Option value="String">Văn bản (String)</Select.Option>
              <Select.Option value="Number">Số (Number)</Select.Option>
              <Select.Option value="Date">Ngày tháng (Date)</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
export default TabCauHinh;
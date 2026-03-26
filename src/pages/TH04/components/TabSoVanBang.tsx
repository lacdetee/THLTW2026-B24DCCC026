import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, Row, Col, DatePicker, Select } from 'antd';
import { useModel } from 'umi';

const TabSoVanBang: React.FC = () => {
  const { danhSachSo, luuSoVanBang, danhSachQuyetDinh, luuQuyetDinh } = useModel('useModelVanBang' as any);
  const [form] = Form.useForm();
  const [modalType, setModalType] = useState<'So' | 'QuyetDinh' | null>(null);

  const xuLyLuu = (values: any) => {
    if (modalType === 'So') {
      const tonTai = danhSachSo.some((s: any) => s.nam === values.nam);
      if (tonTai) return alert('Sổ của năm này đã tồn tại!');
      luuSoVanBang([...danhSachSo, { id: `SO_${values.nam}`, nam: values.nam, soVaoSoHienTai: 0 }]);
    } else {
      luuQuyetDinh([...danhSachQuyetDinh, { id: `QD_${Date.now()}`, soQuyetDinh: values.soQuyetDinh, ngayBanHanh: values.ngayBanHanh.format('DD/MM/YYYY'), trichYeu: values.trichYeu, idSoVanBang: values.idSoVanBang, luotTraCuu: 0 }]);
    }
    setModalType(null);
  };

  return (
    <Row gutter={24}>
      <Col span={8}>
        <Button type="primary" onClick={() => { form.resetFields(); setModalType('So'); }} style={{ marginBottom: 16 }}>+ Mở Sổ Mới</Button>
        <Table bordered size="small" dataSource={danhSachSo} rowKey="id" columns={[
          { title: 'Năm Cấp', dataIndex: 'nam', align: 'center' as const },
          { title: 'Số hiện tại', dataIndex: 'soVaoSoHienTai', align: 'center' as const }
        ]} />
      </Col>

      <Col span={16}>
        <Button type="primary" onClick={() => { form.resetFields(); setModalType('QuyetDinh'); }} style={{ marginBottom: 16, background: '#52c41a', borderColor: '#52c41a' }}>+ Thêm Quyết Định</Button>
        <Table bordered size="small" dataSource={danhSachQuyetDinh} rowKey="id" columns={[
          { title: 'Số QĐ', dataIndex: 'soQuyetDinh' },
          { title: 'Ngày ban hành', dataIndex: 'ngayBanHanh' },
          { title: 'Trích yếu', dataIndex: 'trichYeu' },
          { title: 'Thuộc Sổ (Năm)', render: (_: any, qd: any) => danhSachSo.find((s: any) => s.id === qd.idSoVanBang)?.nam }
        ]} />
      </Col>

      <Modal title={modalType === 'So' ? 'Mở Sổ Văn Bằng' : 'Thêm Quyết Định'} visible={!!modalType} onCancel={() => setModalType(null)} onOk={() => form.submit()} destroyOnClose>
        <Form form={form} layout="vertical" onFinish={xuLyLuu}>
          {modalType === 'So' ? (
            <Form.Item name="nam" label="Năm phát hành sổ" rules={[{ required: true }]}><InputNumber min={2000} style={{ width: '100%' }} /></Form.Item>
          ) : (
            <>
              <Form.Item name="soQuyetDinh" label="Số Quyết Định" rules={[{ required: true }]}><Input /></Form.Item>
              <Form.Item name="idSoVanBang" label="Ghi vào Sổ năm" rules={[{ required: true }]}><Select>{danhSachSo.map((s: any) => <Select.Option key={s.id} value={s.id}>Sổ năm {s.nam}</Select.Option>)}</Select></Form.Item>
              <Form.Item name="ngayBanHanh" label="Ngày ban hành" rules={[{ required: true }]}><DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" /></Form.Item>
              <Form.Item name="trichYeu" label="Trích yếu" rules={[{ required: true }]}><Input.TextArea rows={2} /></Form.Item>
            </>
          )}
        </Form>
      </Modal>
    </Row>
  );
};
export default TabSoVanBang;
import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, Row, Col, message } from 'antd';
import { KhKienThuc, MonHoc } from '../types';

interface Props {
	danhSachKhoi: KhKienThuc[];
	danhSachMon: MonHoc[];
	luuDuLieu: (key: string, data: any, setter: any) => void;
	datDanhSachMon: any;
}

const QuanLyDanhMuc: React.FC<Props> = ({ danhSachKhoi, danhSachMon, luuDuLieu, datDanhSachMon }) => {
	const [hienThiModal, datHienThiModal] = useState(false);
	const [form] = Form.useForm();

	const xuLyLuuMon = (values: any) => {
		const monMoi: MonHoc = { id: `M_${Date.now()}`, ...values };
		luuDuLieu('DATA_MON_TH02', [...danhSachMon, monMoi], datDanhSachMon);
		datHienThiModal(false);
		message.success('Đã thêm môn học thành công!');
	};

	const xuLyXoaMon = (id: string) => {
		luuDuLieu(
			'DATA_MON_TH02',
			danhSachMon.filter((m) => m.id !== id),
			datDanhSachMon,
		);
		message.success('Đã xóa môn học!');
	};

	return (
		<Row gutter={24}>
			<Col span={10}>
				<Table
					size='small'
					bordered
					title={() => <b>Khối Kiến Thức (Mặc định)</b>}
					dataSource={danhSachKhoi}
					rowKey='id'
					columns={[{ title: 'Tên Khối', dataIndex: 'tenKhoi' }]}
					pagination={false}
				/>
			</Col>
			<Col span={14}>
				<Button
					type='primary'
					onClick={() => {
						form.resetFields();
						datHienThiModal(true);
					}}
					style={{ marginBottom: 16 }}
				>
					+ Thêm Môn Học
				</Button>
				<Table
					size='small'
					bordered
					dataSource={danhSachMon}
					rowKey='id'
					pagination={false}
					columns={[
						{ title: 'Mã Môn', dataIndex: 'maMon' },
						{ title: 'Tên Môn', dataIndex: 'tenMon' },
						{ title: 'Số TC', dataIndex: 'soTinChi' },
						{
							title: 'Thao tác',
							align: 'center' as const,
							render: (_: any, banGhi: MonHoc) => (
								<Button danger type='text' onClick={() => xuLyXoaMon(banGhi.id)}>
									Xóa
								</Button>
							),
						},
					]}
				/>
			</Col>

			<Modal
				title='Thêm Môn Học Mới'
				visible={hienThiModal}
				onCancel={() => datHienThiModal(false)}
				onOk={() => form.submit()}
				destroyOnClose
			>
				<Form form={form} layout='vertical' onFinish={xuLyLuuMon}>
					<Form.Item name='maMon' label='Mã môn học' rules={[{ required: true }]}>
						<Input placeholder='VD: INT1434' />
					</Form.Item>
					<Form.Item name='tenMon' label='Tên môn học' rules={[{ required: true }]}>
						<Input placeholder='VD: Lập trình Web' />
					</Form.Item>
					<Form.Item name='soTinChi' label='Số tín chỉ' rules={[{ required: true }]}>
						<InputNumber min={1} max={10} style={{ width: '100%' }} />
					</Form.Item>
				</Form>
			</Modal>
		</Row>
	);
};

export default QuanLyDanhMuc;

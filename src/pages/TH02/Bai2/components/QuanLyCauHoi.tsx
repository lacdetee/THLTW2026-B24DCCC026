import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, Select, Row, Col, Tag, message } from 'antd';
import { CauHoi, MonHoc, KhKienThuc, MucDo } from '../types';

interface Props {
	danhSachCauHoi: CauHoi[];
	danhSachMon: MonHoc[];
	danhSachKhoi: KhKienThuc[];
	luuDuLieu: (key: string, data: any, setter: any) => void;
	datDanhSachCauHoi: any;
}

const QuanLyCauHoi: React.FC<Props> = ({ danhSachCauHoi, danhSachMon, danhSachKhoi, luuDuLieu, datDanhSachCauHoi }) => {
	const [hienThiModal, datHienThiModal] = useState(false);
	const [form] = Form.useForm();
	const [timMon, datTimMon] = useState<string | undefined>(undefined);
	const [timMucDo, datTimMucDo] = useState<MucDo | undefined>(undefined);

	const xuLyLuu = (values: any) => {
		const cauHoiMoi: CauHoi = { id: `CH_${Date.now()}`, ...values };
		luuDuLieu('DATA_CAU_HOI', [...danhSachCauHoi, cauHoiMoi], datDanhSachCauHoi);
		datHienThiModal(false);
		message.success('Đã thêm câu hỏi vào ngân hàng!');
	};

	const xuLyXoa = (id: string) =>
		luuDuLieu(
			'DATA_CAU_HOI',
			danhSachCauHoi.filter((c) => c.id !== id),
			datDanhSachCauHoi,
		);

	const duLieuHienThi = danhSachCauHoi.filter(
		(ch) => (!timMon || ch.idMon === timMon) && (!timMucDo || ch.mucDo === timMucDo),
	);

	const cotBang = [
		{ title: 'Nội dung', dataIndex: 'noiDung', width: '40%' },
		{ title: 'Môn học', dataIndex: 'idMon', render: (id: string) => danhSachMon.find((m) => m.id === id)?.tenMon },
		{ title: 'Khối KT', dataIndex: 'idKhoi', render: (id: string) => danhSachKhoi.find((k) => k.id === id)?.tenKhoi },
		{
			title: 'Mức độ',
			dataIndex: 'mucDo',
			render: (md: string) => <Tag color={md === 'Dễ' ? 'green' : md === 'Khó' ? 'red' : 'orange'}>{md}</Tag>,
		},
		{
			title: 'Thao tác',
			align: 'center' as const,
			render: (_: any, banGhi: CauHoi) => (
				<Button danger onClick={() => xuLyXoa(banGhi.id)}>
					Xóa
				</Button>
			),
		},
	];

	return (
		<>
			<Row gutter={16} style={{ marginBottom: 16 }}>
				<Col span={6}>
					<Select placeholder='Lọc theo môn' style={{ width: '100%' }} allowClear onChange={datTimMon}>
						{danhSachMon.map((m) => (
							<Select.Option key={m.id} value={m.id}>
								{m.tenMon}
							</Select.Option>
						))}
					</Select>
				</Col>
				<Col span={6}>
					<Select placeholder='Lọc mức độ' style={{ width: '100%' }} allowClear onChange={datTimMucDo}>
						{['Dễ', 'Trung bình', 'Khó', 'Rất khó'].map((md) => (
							<Select.Option key={md} value={md}>
								{md}
							</Select.Option>
						))}
					</Select>
				</Col>
				<Col span={12} style={{ textAlign: 'right' }}>
					<Button
						type='primary'
						onClick={() => {
							form.resetFields();
							datHienThiModal(true);
						}}
					>
						+ Thêm Câu Hỏi
					</Button>
				</Col>
			</Row>

			<Table bordered dataSource={duLieuHienThi} columns={cotBang} rowKey='id' size='small' />

			<Modal
				title='Thêm Câu Hỏi Mới'
				visible={hienThiModal}
				onCancel={() => datHienThiModal(false)}
				onOk={() => form.submit()}
				destroyOnClose
			>
				<Form form={form} layout='vertical' onFinish={xuLyLuu}>
					<Form.Item name='idMon' label='Môn học' rules={[{ required: true }]}>
						<Select>
							{danhSachMon.map((m) => (
								<Select.Option key={m.id} value={m.id}>
									{m.tenMon}
								</Select.Option>
							))}
						</Select>
					</Form.Item>
					<Form.Item name='idKhoi' label='Khối kiến thức' rules={[{ required: true }]}>
						<Select>
							{danhSachKhoi.map((k) => (
								<Select.Option key={k.id} value={k.id}>
									{k.tenKhoi}
								</Select.Option>
							))}
						</Select>
					</Form.Item>
					<Form.Item name='mucDo' label='Mức độ' rules={[{ required: true }]}>
						<Select>
							{['Dễ', 'Trung bình', 'Khó', 'Rất khó'].map((md) => (
								<Select.Option key={md} value={md}>
									{md}
								</Select.Option>
							))}
						</Select>
					</Form.Item>
					<Form.Item name='noiDung' label='Nội dung câu hỏi' rules={[{ required: true }]}>
						<Input.TextArea rows={4} />
					</Form.Item>
				</Form>
			</Modal>
		</>
	);
};

export default QuanLyCauHoi;

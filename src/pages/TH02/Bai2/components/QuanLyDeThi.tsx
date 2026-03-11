import React, { useState } from 'react';
import {
	Table,
	Button,
	Space,
	Modal,
	Form,
	Input,
	Select,
	InputNumber,
	Row,
	Col,
	Typography,
	message,
	List,
	Tag,
} from 'antd';
import { CauHoi, MonHoc, KhKienThuc, CauTrucDe, DeThi, TieuChiDe } from '../types';

const { Text } = Typography;

interface Props {
	danhSachCauHoi: CauHoi[];
	danhSachMon: MonHoc[];
	danhSachKhoi: KhKienThuc[];
	danhSachCauTruc: CauTrucDe[];
	danhSachDeThi: DeThi[];
	luuDuLieu: (key: string, data: any, setter: any) => void;
	datDanhSachCauTruc: any;
	datDanhSachDeThi: any;
}

const QuanLyDeThi: React.FC<Props> = ({
	danhSachCauHoi,
	danhSachMon,
	danhSachKhoi,
	danhSachCauTruc,
	danhSachDeThi,
	luuDuLieu,
	datDanhSachCauTruc,
	datDanhSachDeThi,
}) => {
	const [hienThiModal, datHienThiModal] = useState(false);
	const [form] = Form.useForm();

	const tronMang = (mang: any[]) => {
		let m = mang.length,
			t,
			i;
		while (m) {
			i = Math.floor(Math.random() * m--);
			t = mang[m];
			mang[m] = mang[i];
			mang[i] = t;
		}
		return mang;
	};

	const sinhDeThi = (values: any) => {
		const { tenCauTruc, idMon, tieuChi } = values;
		let danhSachCauHoiChon: CauHoi[] = [];
		let coLoi = false;

		if (!tieuChi || tieuChi.length === 0) {
			message.error('Vui lòng thêm ít nhất 1 tiêu chí!');
			return;
		}

		for (let i = 0; i < tieuChi.length; i++) {
			const tc: TieuChiDe = tieuChi[i];
			const cauHoiPhuHop = danhSachCauHoi.filter(
				(ch) => ch.idMon === idMon && ch.idKhoi === tc.idKhoi && ch.mucDo === tc.mucDo,
			);

			if (cauHoiPhuHop.length < tc.soLuong) {
				const tenKhoi = danhSachKhoi.find((k) => k.id === tc.idKhoi)?.tenKhoi;
				message.error(
					`Lỗi: Không đủ câu hỏi cho khối "${tenKhoi}" mức độ "${tc.mucDo}". Yêu cầu: ${tc.soLuong}, Hiện có: ${cauHoiPhuHop.length}`,
				);
				coLoi = true;
				break;
			}
			danhSachCauHoiChon = [...danhSachCauHoiChon, ...tronMang([...cauHoiPhuHop]).slice(0, tc.soLuong)];
		}

		if (!coLoi) {
			const idCauTruc = `CT_${Date.now()}`;
			luuDuLieu(
				'DATA_CAU_TRUC',
				[...danhSachCauTruc, { id: idCauTruc, tenCauTruc, idMon, danhSachTieuChi: tieuChi }],
				datDanhSachCauTruc,
			);
			luuDuLieu(
				'DATA_DE_THI',
				[
					...danhSachDeThi,
					{
						id: `DE_${Date.now()}`,
						tenDeThi: `${tenCauTruc}`,
						idCauTruc,
						danhSachCauHoi: danhSachCauHoiChon,
						ngayTao: new Date().toLocaleDateString('vi-VN'),
					},
				],
				datDanhSachDeThi,
			);
			message.success('Đã tạo đề thi thành công!');
			datHienThiModal(false);
		}
	};

	return (
		<>
			<Button
				type='primary'
				onClick={() => {
					form.resetFields();
					datHienThiModal(true);
				}}
				style={{ marginBottom: 16 }}
			>
				+ Tạo Cấu Trúc Đề & Sinh Đề
			</Button>
			<Table
				bordered
				dataSource={danhSachDeThi}
				rowKey='id'
				size='small'
				columns={[
					{ title: 'Tên Đề Thi', dataIndex: 'tenDeThi' },
					{ title: 'Ngày tạo', dataIndex: 'ngayTao' },
					{ title: 'Số câu hỏi', render: (_, banGhi: DeThi) => `${banGhi.danhSachCauHoi.length} câu` },
					{
						title: 'Chi tiết đề thi',
						render: (_, banGhi: DeThi) => (
							<List
								size='small'
								dataSource={banGhi.danhSachCauHoi}
								renderItem={(ch, idx) => (
									<List.Item>
										Câu {idx + 1}: {ch.noiDung}{' '}
										<Tag color='blue' style={{ marginLeft: 10 }}>
											{ch.mucDo}
										</Tag>
									</List.Item>
								)}
							/>
						),
					},
				]}
			/>

			<Modal
				title='Tạo Cấu Trúc Đề & Sinh Đề Thi'
				visible={hienThiModal}
				onCancel={() => datHienThiModal(false)}
				onOk={() => form.submit()}
				width={800}
				destroyOnClose
			>
				<Form form={form} layout='vertical' onFinish={sinhDeThi}>
					<Row gutter={16}>
						<Col span={12}>
							<Form.Item name='tenCauTruc' label='Tên cấu trúc đề' rules={[{ required: true }]}>
								<Input placeholder='VD: Đề thi cuối kỳ Web' />
							</Form.Item>
						</Col>
						<Col span={12}>
							<Form.Item name='idMon' label='Môn học' rules={[{ required: true }]}>
								<Select>
									{danhSachMon.map((m) => (
										<Select.Option key={m.id} value={m.id}>
											{m.tenMon}
										</Select.Option>
									))}
								</Select>
							</Form.Item>
						</Col>
					</Row>

					<Text strong>Thiết lập tiêu chí lấy câu hỏi:</Text>
					<Form.List name='tieuChi'>
						{(fields, { add, remove }) => (
							<>
								{fields.map(({ key, name, ...restField }) => (
									<Space key={key} style={{ display: 'flex', marginBottom: 8 }} align='baseline'>
										<Form.Item
											{...restField}
											name={[name, 'idKhoi']}
											rules={[{ required: true, message: 'Chọn khối' }]}
										>
											<Select placeholder='Khối kiến thức' style={{ width: 200 }}>
												{danhSachKhoi.map((k) => (
													<Select.Option key={k.id} value={k.id}>
														{k.tenKhoi}
													</Select.Option>
												))}
											</Select>
										</Form.Item>
										<Form.Item
											{...restField}
											name={[name, 'mucDo']}
											rules={[{ required: true, message: 'Chọn mức độ' }]}
										>
											<Select placeholder='Mức độ' style={{ width: 150 }}>
												{['Dễ', 'Trung bình', 'Khó', 'Rất khó'].map((md) => (
													<Select.Option key={md} value={md}>
														{md}
													</Select.Option>
												))}
											</Select>
										</Form.Item>
										<Form.Item {...restField} name={[name, 'soLuong']} rules={[{ required: true, message: 'Nhập SL' }]}>
											<InputNumber placeholder='Số lượng' min={1} />
										</Form.Item>
										<Button type='text' danger onClick={() => remove(name)}>
											Xóa dòng
										</Button>
									</Space>
								))}
								<Form.Item>
									<Button type='dashed' onClick={() => add()} block>
										+ Thêm tiêu chí (Khối KT + Mức độ)
									</Button>
								</Form.Item>
							</>
						)}
					</Form.List>
				</Form>
			</Modal>
		</>
	);
};

export default QuanLyDeThi;

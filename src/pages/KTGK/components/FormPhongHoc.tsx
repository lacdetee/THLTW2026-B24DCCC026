import rules from '@/utils/rules';
import { Button, Card, Form, Input, InputNumber, Select, message } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

const NGUOI_PHU_TRACH_LIST = [
	'Nguyễn Văn A',
	'Trần Thị B',
	'Lê Văn C',
	'Phạm Thị D',
	'Hoàng Văn E',
];

const LOAI_PHONG_OPTIONS = [
	{ value: 'ly_thuyet', label: 'Lý thuyết' },
	{ value: 'thuc_hanh', label: 'Thực hành' },
	{ value: 'hoi_truong', label: 'Hội trường' },
];

const FormPhongHoc = () => {
	const [form] = Form.useForm();
	const { record, isEdit, setVisible, getDataPhongHoc } = useModel('phonghoc');

	useEffect(() => {
		if (isEdit && record) {
			form.setFieldsValue(record);
		} else {
			form.resetFields();
		}
	}, [record, isEdit]);

	const onFinish = async (values: PhongHoc.IRecord) => {
		const dataLocal: PhongHoc.IRecord[] = JSON.parse(localStorage.getItem('phonghoc') as string) || [];

		// Kiểm tra mã phòng trùng
		const isDuplicateMa = dataLocal.some(
			(item) =>
				item.maPhong.toLowerCase() === values.maPhong.toLowerCase() &&
				(!isEdit || item.maPhong !== record?.maPhong),
		);

		if (isDuplicateMa) {
			form.setFields([
				{
					name: 'maPhong',
					errors: ['Mã phòng đã tồn tại!'],
				},
			]);
			return;
		}

		// Kiểm tra tên phòng trùng
		const isDuplicateTen = dataLocal.some(
			(item) =>
				item.tenPhong.toLowerCase() === values.tenPhong.toLowerCase() &&
				(!isEdit || item.maPhong !== record?.maPhong),
		);

		if (isDuplicateTen) {
			form.setFields([
				{
					name: 'tenPhong',
					errors: ['Tên phòng đã tồn tại!'],
				},
			]);
			return;
		}

		if (isEdit && record) {
			// Chỉnh sửa
			const newData = dataLocal.map((item) =>
				item.maPhong === record.maPhong ? { ...item, ...values } : item,
			);
			localStorage.setItem('phonghoc', JSON.stringify(newData));
			message.success('Chỉnh sửa phòng học thành công!');
		} else {
			// Thêm mới
			localStorage.setItem('phonghoc', JSON.stringify([values, ...dataLocal]));
			message.success('Thêm mới phòng học thành công!');
		}

		setVisible(false);
		getDataPhongHoc();
		form.resetFields();
	};

	return (
		<Card title={isEdit ? 'Chỉnh sửa phòng học' : 'Thêm mới phòng học'}>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Form.Item
					name='maPhong'
					label='Mã phòng'
					rules={[
						...rules.required,
						...rules.text,
						...rules.length(10),
					]}
				>
					<Input placeholder='Nhập mã phòng' maxLength={10} disabled={isEdit} />
				</Form.Item>

				<Form.Item
					name='tenPhong'
					label='Tên phòng'
					rules={[
						...rules.required,
						...rules.text,
						...rules.length(50),
					]}
				>
					<Input placeholder='Nhập tên phòng' maxLength={50} />
				</Form.Item>

				<Form.Item
					name='nguoiPhuTrach'
					label='Người phụ trách'
					rules={[...rules.required]}
				>
					<Select placeholder='Chọn người phụ trách'>
						{NGUOI_PHU_TRACH_LIST.map((npt) => (
							<Select.Option key={npt} value={npt}>
								{npt}
							</Select.Option>
						))}
					</Select>
				</Form.Item>

				<Form.Item
					name='soChoNgoi'
					label='Số chỗ ngồi'
					rules={[...rules.required]}
				>
					<InputNumber
						placeholder='Nhập số chỗ ngồi (10 - 200)'
						min={10}
						max={200}
						style={{ width: '100%' }}
					/>
				</Form.Item>

				<Form.Item
					name='loaiPhong'
					label='Loại phòng'
					rules={[...rules.required]}
				>
					<Select placeholder='Chọn loại phòng'>
						{LOAI_PHONG_OPTIONS.map((lp) => (
							<Select.Option key={lp.value} value={lp.value}>
								{lp.label}
							</Select.Option>
						))}
					</Select>
				</Form.Item>

				<div className='form-footer'>
					<Button htmlType='submit' type='primary'>
						{isEdit ? 'Lưu lại' : 'Thêm mới'}
					</Button>
					<Button onClick={() => setVisible(false)}>Hủy</Button>
				</div>
			</Form>
		</Card>
	);
};

export default FormPhongHoc;

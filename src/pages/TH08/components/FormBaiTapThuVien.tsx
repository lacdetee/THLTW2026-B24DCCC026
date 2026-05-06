import rules from '@/utils/rules';
import { Button, Card, Form, Input, InputNumber, Select, message } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

const FormBaiTapThuVien = () => {
	const [form] = Form.useForm();
	const { record, isEdit, setVisible, getDataExercises } = useModel('fitness');

	useEffect(() => {
		if (isEdit && record) {
			form.setFieldsValue(record);
		} else {
			form.resetFields();
		}
	}, [record, isEdit]);

	const onFinish = async (values: any) => {
		const dataLocal: Fitness.IExercise[] = JSON.parse(localStorage.getItem('fitness_exercises') as string) || [];

		if (isEdit && record) {
			const newData = dataLocal.map((item) => item.id === record.id ? { ...item, ...values } : item);
			localStorage.setItem('fitness_exercises', JSON.stringify(newData));
			message.success('Cập nhật bài tập thành công!');
		} else {
			const newExercise: Fitness.IExercise = { ...values, id: `e-${Date.now()}` };
			localStorage.setItem('fitness_exercises', JSON.stringify([newExercise, ...dataLocal]));
			message.success('Thêm bài tập thành công!');
		}

		setVisible(false);
		getDataExercises();
		form.resetFields();
	};

	const muscleGroups: Fitness.MuscleGroup[] = ['Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core', 'Full Body'];

	return (
		<Card title={isEdit ? 'Chỉnh sửa bài tập' : 'Thêm bài tập mới'}>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Form.Item name='name' label='Tên bài tập' rules={[...rules.required]}>
					<Input placeholder='VD: Push-up' />
				</Form.Item>
				<Form.Item name='muscleGroup' label='Nhóm cơ' rules={[...rules.required]}>
					<Select placeholder='Chọn nhóm cơ'>
						{muscleGroups.map((g) => (
							<Select.Option key={g} value={g}>{g}</Select.Option>
						))}
					</Select>
				</Form.Item>
				<Form.Item name='difficulty' label='Mức độ khó' rules={[...rules.required]}>
					<Select placeholder='Chọn mức độ'>
						<Select.Option value='easy'>Dễ</Select.Option>
						<Select.Option value='medium'>Trung bình</Select.Option>
						<Select.Option value='hard'>Khó</Select.Option>
					</Select>
				</Form.Item>
				<Form.Item name='description' label='Mô tả ngắn' rules={[...rules.required]}>
					<Input.TextArea rows={2} placeholder='Mô tả bài tập' maxLength={200} showCount />
				</Form.Item>
				<Form.Item name='instructions' label='Hướng dẫn chi tiết' rules={[...rules.required]}>
					<Input.TextArea rows={4} placeholder='Hướng dẫn thực hiện chi tiết' />
				</Form.Item>
				<Form.Item name='caloriesPerHour' label='Calo đốt trung bình/giờ' rules={[...rules.required]}>
					<InputNumber min={0} max={2000} style={{ width: '100%' }} placeholder='VD: 400' />
				</Form.Item>
				<div className='form-footer'>
					<Button htmlType='submit' type='primary'>{isEdit ? 'Lưu lại' : 'Thêm mới'}</Button>
					<Button onClick={() => setVisible(false)}>Hủy</Button>
				</div>
			</Form>
		</Card>
	);
};

export default FormBaiTapThuVien;

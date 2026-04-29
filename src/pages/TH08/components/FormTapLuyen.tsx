import rules from '@/utils/rules';
import { Button, Card, DatePicker, Form, Input, InputNumber, Select, message } from 'antd';
import moment from 'moment';
import { useEffect } from 'react';
import { useModel } from 'umi';

const FormTapLuyen = () => {
	const [form] = Form.useForm();
	const { record, isEdit, setVisible, getDataWorkouts } = useModel('fitness');

	useEffect(() => {
		if (isEdit && record) {
			form.setFieldsValue({ ...record, date: moment(record.date) });
		} else {
			form.resetFields();
		}
	}, [record, isEdit]);

	const onFinish = async (values: any) => {
		const dataLocal: Fitness.IWorkout[] = JSON.parse(localStorage.getItem('fitness_workouts') as string) || [];
		const formData = { ...values, date: values.date.format('YYYY-MM-DD') };

		if (isEdit && record) {
			const newData = dataLocal.map((item) => item.id === record.id ? { ...item, ...formData } : item);
			localStorage.setItem('fitness_workouts', JSON.stringify(newData));
			message.success('Cập nhật buổi tập thành công!');
		} else {
			const newWorkout: Fitness.IWorkout = { ...formData, id: `w-${Date.now()}` };
			localStorage.setItem('fitness_workouts', JSON.stringify([newWorkout, ...dataLocal]));
			message.success('Thêm buổi tập thành công!');
		}

		setVisible(false);
		getDataWorkouts();
		form.resetFields();
	};

	return (
		<Card title={isEdit ? 'Chỉnh sửa buổi tập' : 'Thêm buổi tập mới'}>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Form.Item name='date' label='Ngày tập' rules={[...rules.required]} initialValue={moment()}>
					<DatePicker format='DD/MM/YYYY' style={{ width: '100%' }} />
				</Form.Item>
				<Form.Item name='type' label='Loại bài tập' rules={[...rules.required]}>
					<Select placeholder='Chọn loại bài tập'>
						{['Cardio', 'Strength', 'Yoga', 'HIIT', 'Other'].map((t) => (
							<Select.Option key={t} value={t}>{t}</Select.Option>
						))}
					</Select>
				</Form.Item>
				<Form.Item name='duration' label='Thời lượng (phút)' rules={[...rules.required]}>
					<InputNumber min={1} max={300} style={{ width: '100%' }} placeholder='Nhập thời lượng' />
				</Form.Item>
				<Form.Item name='calories' label='Calo đốt (kcal)' rules={[...rules.required]}>
					<InputNumber min={0} max={5000} style={{ width: '100%' }} placeholder='Nhập calo' />
				</Form.Item>
				<Form.Item name='note' label='Ghi chú'>
					<Input.TextArea rows={2} placeholder='Ghi chú buổi tập' maxLength={200} showCount />
				</Form.Item>
				<Form.Item name='status' label='Trạng thái' rules={[...rules.required]} initialValue='completed'>
					<Select>
						<Select.Option value='completed'>Hoàn thành</Select.Option>
						<Select.Option value='missed'>Bỏ lỡ</Select.Option>
					</Select>
				</Form.Item>
				<div className='form-footer'>
					<Button htmlType='submit' type='primary'>{isEdit ? 'Lưu lại' : 'Thêm mới'}</Button>
					<Button onClick={() => setVisible(false)}>Hủy</Button>
				</div>
			</Form>
		</Card>
	);
};

export default FormTapLuyen;

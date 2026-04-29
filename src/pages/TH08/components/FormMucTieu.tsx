import rules from '@/utils/rules';
import { Button, Card, DatePicker, Form, Input, InputNumber, Select, message } from 'antd';
import moment from 'moment';
import { useEffect } from 'react';
import { useModel } from 'umi';

const FormMucTieu = () => {
	const [form] = Form.useForm();
	const { record, isEdit, setVisibleDrawer, getDataGoals } = useModel('fitness');

	useEffect(() => {
		if (isEdit && record) {
			form.setFieldsValue({ ...record, deadline: moment(record.deadline) });
		} else {
			form.resetFields();
		}
	}, [record, isEdit]);

	const onFinish = async (values: any) => {
		const dataLocal: Fitness.IGoal[] = JSON.parse(localStorage.getItem('fitness_goals') as string) || [];
		const formData = { ...values, deadline: values.deadline.format('YYYY-MM-DD') };

		if (isEdit && record) {
			const newData = dataLocal.map((item) => item.id === record.id ? { ...item, ...formData } : item);
			localStorage.setItem('fitness_goals', JSON.stringify(newData));
			message.success('Cập nhật mục tiêu thành công!');
		} else {
			const newGoal: Fitness.IGoal = { ...formData, id: `g-${Date.now()}`, currentValue: formData.currentValue || 0 };
			localStorage.setItem('fitness_goals', JSON.stringify([newGoal, ...dataLocal]));
			message.success('Thêm mục tiêu thành công!');
		}

		setVisibleDrawer(false);
		getDataGoals();
		form.resetFields();
	};

	return (
		<Card title={isEdit ? 'Chỉnh sửa mục tiêu' : 'Thêm mục tiêu mới'} bordered={false}>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Form.Item name='name' label='Tên mục tiêu' rules={[...rules.required]}>
					<Input placeholder='VD: Giảm cân về 65kg' />
				</Form.Item>
				<Form.Item name='type' label='Loại mục tiêu' rules={[...rules.required]}>
					<Select placeholder='Chọn loại'>
						<Select.Option value='weight_loss'>Giảm cân</Select.Option>
						<Select.Option value='muscle_gain'>Tăng cơ</Select.Option>
						<Select.Option value='endurance'>Cải thiện sức bền</Select.Option>
						<Select.Option value='other'>Khác</Select.Option>
					</Select>
				</Form.Item>
				<Form.Item name='targetValue' label='Giá trị mục tiêu' rules={[...rules.required]}>
					<InputNumber min={0} style={{ width: '100%' }} placeholder='VD: 65' />
				</Form.Item>
				<Form.Item name='currentValue' label='Giá trị hiện tại' initialValue={0}>
					<InputNumber min={0} style={{ width: '100%' }} placeholder='VD: 70' />
				</Form.Item>
				<Form.Item name='unit' label='Đơn vị' rules={[...rules.required]}>
					<Input placeholder='VD: kg, km, ngày' />
				</Form.Item>
				<Form.Item name='deadline' label='Deadline' rules={[...rules.required]}>
					<DatePicker format='DD/MM/YYYY' style={{ width: '100%' }} />
				</Form.Item>
				<Form.Item name='status' label='Trạng thái' rules={[...rules.required]} initialValue='in_progress'>
					<Select>
						<Select.Option value='in_progress'>Đang thực hiện</Select.Option>
						<Select.Option value='achieved'>Đã đạt</Select.Option>
						<Select.Option value='cancelled'>Đã hủy</Select.Option>
					</Select>
				</Form.Item>
				<div className='form-footer'>
					<Button htmlType='submit' type='primary'>{isEdit ? 'Lưu lại' : 'Thêm mới'}</Button>
					<Button onClick={() => setVisibleDrawer(false)}>Hủy</Button>
				</div>
			</Form>
		</Card>
	);
};

export default FormMucTieu;

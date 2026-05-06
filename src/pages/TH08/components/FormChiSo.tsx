import rules from '@/utils/rules';
import { Button, Card, DatePicker, Form, InputNumber, message } from 'antd';
import moment from 'moment';
import { useEffect } from 'react';
import { useModel } from 'umi';

const FormChiSo = () => {
	const [form] = Form.useForm();
	const { record, isEdit, setVisible, getDataHealth } = useModel('fitness');

	useEffect(() => {
		if (isEdit && record) {
			form.setFieldsValue({ ...record, date: moment(record.date) });
		} else {
			form.resetFields();
		}
	}, [record, isEdit]);

	const handleValuesChange = (_: any, allValues: any) => {
		const { weight, height } = allValues;
		if (weight && height) {
			const heightM = height / 100;
			const bmi = parseFloat((weight / (heightM * heightM)).toFixed(2));
			form.setFieldsValue({ bmi });
		}
	};

	const onFinish = async (values: any) => {
		const dataLocal: Fitness.IHealthMetric[] = JSON.parse(localStorage.getItem('fitness_health') as string) || [];
		const heightM = values.height / 100;
		const bmi = parseFloat((values.weight / (heightM * heightM)).toFixed(2));
		const formData = { ...values, date: values.date.format('YYYY-MM-DD'), bmi };

		if (isEdit && record) {
			const newData = dataLocal.map((item) => item.id === record.id ? { ...item, ...formData } : item);
			localStorage.setItem('fitness_health', JSON.stringify(newData));
			message.success('Cập nhật chỉ số thành công!');
		} else {
			const newMetric: Fitness.IHealthMetric = { ...formData, id: `h-${Date.now()}` };
			localStorage.setItem('fitness_health', JSON.stringify([newMetric, ...dataLocal]));
			message.success('Thêm chỉ số thành công!');
		}

		setVisible(false);
		getDataHealth();
		form.resetFields();
	};

	return (
		<Card title={isEdit ? 'Chỉnh sửa chỉ số' : 'Thêm chỉ số mới'}>
			<Form onFinish={onFinish} form={form} layout='vertical' onValuesChange={handleValuesChange}>
				<Form.Item name='date' label='Ngày' rules={[...rules.required]} initialValue={moment()}>
					<DatePicker format='DD/MM/YYYY' style={{ width: '100%' }} />
				</Form.Item>
				<Form.Item name='weight' label='Cân nặng (kg)' rules={[...rules.required]}>
					<InputNumber min={20} max={300} step={0.1} style={{ width: '100%' }} placeholder='VD: 70' />
				</Form.Item>
				<Form.Item name='height' label='Chiều cao (cm)' rules={[...rules.required]}>
					<InputNumber min={100} max={250} style={{ width: '100%' }} placeholder='VD: 170' />
				</Form.Item>
				<Form.Item name='bmi' label='BMI (tự động tính)'>
					<InputNumber disabled style={{ width: '100%' }} />
				</Form.Item>
				<Form.Item name='heartRate' label='Nhịp tim lúc nghỉ (bpm)' rules={[...rules.required]}>
					<InputNumber min={30} max={200} style={{ width: '100%' }} placeholder='VD: 70' />
				</Form.Item>
				<Form.Item name='sleepHours' label='Giờ ngủ' rules={[...rules.required]}>
					<InputNumber min={0} max={24} step={0.5} style={{ width: '100%' }} placeholder='VD: 7.5' />
				</Form.Item>
				<div className='form-footer'>
					<Button htmlType='submit' type='primary'>{isEdit ? 'Lưu lại' : 'Thêm mới'}</Button>
					<Button onClick={() => setVisible(false)}>Hủy</Button>
				</div>
			</Form>
		</Card>
	);
};

export default FormChiSo;

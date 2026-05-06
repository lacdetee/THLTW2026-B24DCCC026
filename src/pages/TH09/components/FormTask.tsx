import rules from '@/utils/rules';
import { Button, Card, DatePicker, Form, Input, Select, message } from 'antd';
import moment from 'moment';
import { useEffect } from 'react';
import { useModel } from 'umi';

const TAG_OPTIONS = ['Frontend', 'Backend', 'Design', 'Testing', 'Bug', 'DevOps', 'Docs', 'Review', 'Other'];

const FormTask = () => {
	const [form] = Form.useForm();
	const { record, isEdit, setVisible, getDataTasks } = useModel('kanban');

	useEffect(() => {
		if (isEdit && record) {
			form.setFieldsValue({ ...record, deadline: moment(record.deadline) });
		} else {
			form.resetFields();
		}
	}, [record, isEdit]);

	const onFinish = async (values: any) => {
		const dataLocal: Kanban.ITask[] = JSON.parse(localStorage.getItem('kanban_tasks') as string) || [];
		const formData = { ...values, deadline: values.deadline.format('YYYY-MM-DD') };

		if (isEdit && record) {
			const newData = dataLocal.map((item) => item.id === record.id ? { ...item, ...formData } : item);
			localStorage.setItem('kanban_tasks', JSON.stringify(newData));
			message.success('Cập nhật task thành công!');
		} else {
			const newTask: Kanban.ITask = {
				...formData,
				id: `t-${Date.now()}`,
				createdAt: new Date().toISOString().split('T')[0],
			};
			localStorage.setItem('kanban_tasks', JSON.stringify([newTask, ...dataLocal]));
			message.success('Thêm task thành công!');
		}

		setVisible(false);
		getDataTasks();
		form.resetFields();
	};

	return (
		<Card title={isEdit ? 'Chỉnh sửa Task' : 'Thêm Task mới'}>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Form.Item name='name' label='Tên Task' rules={[...rules.required]}>
					<Input placeholder='Nhập tên công việc' />
				</Form.Item>
				<Form.Item name='description' label='Mô tả'>
					<Input.TextArea rows={3} placeholder='Mô tả chi tiết công việc' maxLength={500} showCount />
				</Form.Item>
				<Form.Item name='deadline' label='Deadline' rules={[...rules.required]}>
					<DatePicker format='DD/MM/YYYY' style={{ width: '100%' }} />
				</Form.Item>
				<Form.Item name='priority' label='Mức độ ưu tiên' rules={[...rules.required]} initialValue='medium'>
					<Select>
						<Select.Option value='high'>Cao</Select.Option>
						<Select.Option value='medium'>Trung bình</Select.Option>
						<Select.Option value='low'>Thấp</Select.Option>
					</Select>
				</Form.Item>
				<Form.Item name='tag' label='Tag' rules={[...rules.required]}>
					<Select placeholder='Chọn tag'>
						{TAG_OPTIONS.map((t) => (
							<Select.Option key={t} value={t}>{t}</Select.Option>
						))}
					</Select>
				</Form.Item>
				<Form.Item name='status' label='Trạng thái' rules={[...rules.required]} initialValue='todo'>
					<Select>
						<Select.Option value='todo'>Cần làm</Select.Option>
						<Select.Option value='in_progress'>Đang làm</Select.Option>
						<Select.Option value='done'>Hoàn thành</Select.Option>
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

export default FormTask;

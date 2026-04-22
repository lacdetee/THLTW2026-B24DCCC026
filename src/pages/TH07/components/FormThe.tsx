import rules from '@/utils/rules';
import { Button, Card, Form, Input, Select, message } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

const TAG_COLORS = [
	{ value: 'blue', label: 'Xanh dương' },
	{ value: 'cyan', label: 'Xanh cyan' },
	{ value: 'green', label: 'Xanh lá' },
	{ value: 'magenta', label: 'Hồng' },
	{ value: 'gold', label: 'Vàng' },
	{ value: 'purple', label: 'Tím' },
	{ value: 'red', label: 'Đỏ' },
	{ value: 'orange', label: 'Cam' },
	{ value: 'volcano', label: 'Đỏ cam' },
	{ value: 'geekblue', label: 'Xanh đậm' },
	{ value: 'lime', label: 'Xanh chanh' },
];

const FormThe = () => {
	const [form] = Form.useForm();
	const { recordTag, isEdit, setVisibleTag, getDataTags } = useModel('blog');

	useEffect(() => {
		if (isEdit && recordTag) {
			form.setFieldsValue(recordTag);
		} else {
			form.resetFields();
		}
	}, [recordTag, isEdit]);

	const onFinish = async (values: any) => {
		const dataLocal: Blog.ITag[] = JSON.parse(localStorage.getItem('blog_tags') as string) || [];


		const isDuplicate = dataLocal.some(
			(item) =>
				item.name.toLowerCase() === values.name.toLowerCase() &&
				(!isEdit || item.id !== recordTag?.id),
		);

		if (isDuplicate) {
			form.setFields([
				{
					name: 'name',
					errors: ['Tên thẻ đã tồn tại!'],
				},
			]);
			return;
		}

		if (isEdit && recordTag) {

			const newData = dataLocal.map((item) =>
				item.id === recordTag.id ? { ...item, ...values } : item,
			);
			localStorage.setItem('blog_tags', JSON.stringify(newData));
			message.success('Chỉnh sửa thẻ thành công!');
		} else {

			const newTag: Blog.ITag = {
				...values,
				id: `tag-${Date.now()}`,
			};
			localStorage.setItem('blog_tags', JSON.stringify([newTag, ...dataLocal]));
			message.success('Thêm thẻ mới thành công!');
		}

		setVisibleTag(false);
		getDataTags();
		form.resetFields();
	};

	return (
		<Card title={isEdit ? 'Chỉnh sửa thẻ' : 'Thêm thẻ mới'}>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Form.Item
					name='name'
					label='Tên thẻ'
					rules={[...rules.required]}
				>
					<Input placeholder='Nhập tên thẻ' maxLength={30} />
				</Form.Item>

				<Form.Item
					name='color'
					label='Màu sắc'
					rules={[...rules.required]}
				>
					<Select placeholder='Chọn màu cho thẻ'>
						{TAG_COLORS.map((c) => (
							<Select.Option key={c.value} value={c.value}>
								<div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
									<span
										style={{
											display: 'inline-block',
											width: 16,
											height: 16,
											borderRadius: 4,
											background: c.value,
										}}
									/>
									{c.label}
								</div>
							</Select.Option>
						))}
					</Select>
				</Form.Item>

				<div className='form-footer'>
					<Button htmlType='submit' type='primary'>
						{isEdit ? 'Lưu lại' : 'Thêm mới'}
					</Button>
					<Button onClick={() => setVisibleTag(false)}>Hủy</Button>
				</div>
			</Form>
		</Card>
	);
};

export default FormThe;

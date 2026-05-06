import rules from '@/utils/rules';
import { Button, Card, Form, Input, Select, message } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

const { TextArea } = Input;


const generateSlug = (title: string): string => {
	return title
		.toLowerCase()
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.replace(/đ/g, 'd')
		.replace(/Đ/g, 'd')
		.replace(/[^a-z0-9\s-]/g, '')
		.replace(/\s+/g, '-')
		.replace(/-+/g, '-')
		.trim();
};

const FormBaiViet = () => {
	const [form] = Form.useForm();
	const { tags, record, isEdit, setVisible, getDataPosts } = useModel('blog');

	useEffect(() => {
		if (isEdit && record) {
			form.setFieldsValue(record);
		} else {
			form.resetFields();
		}
	}, [record, isEdit]);


	const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const title = e.target.value;
		if (!isEdit) {
			form.setFieldsValue({ slug: generateSlug(title) });
		}
	};

	const onFinish = async (values: any) => {
		const dataLocal: Blog.IPost[] = JSON.parse(localStorage.getItem('blog_posts') as string) || [];


		const isDuplicateSlug = dataLocal.some(
			(item) =>
				item.slug.toLowerCase() === values.slug.toLowerCase() &&
				(!isEdit || item.id !== record?.id),
		);

		if (isDuplicateSlug) {
			form.setFields([
				{
					name: 'slug',
					errors: ['Slug đã tồn tại! Vui lòng chọn slug khác.'],
				},
			]);
			return;
		}

		const now = new Date().toISOString();

		if (isEdit && record) {

			const newData = dataLocal.map((item) =>
				item.id === record.id
					? { ...item, ...values, updatedAt: now }
					: item,
			);
			localStorage.setItem('blog_posts', JSON.stringify(newData));
			message.success('Chỉnh sửa bài viết thành công!');
		} else {

			const newPost: Blog.IPost = {
				...values,
				id: `post-${Date.now()}`,
				viewCount: 0,
				author: values.author || 'Nguyễn Văn A',
				createdAt: now,
				updatedAt: now,
			};
			localStorage.setItem('blog_posts', JSON.stringify([newPost, ...dataLocal]));
			message.success('Thêm bài viết mới thành công!');
		}

		setVisible(false);
		getDataPosts();
		form.resetFields();
	};

	return (
		<Card title={isEdit ? 'Chỉnh sửa bài viết' : 'Thêm bài viết mới'}>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Form.Item
					name='title'
					label='Tiêu đề'
					rules={[...rules.required]}
				>
					<Input
						placeholder='Nhập tiêu đề bài viết'
						onChange={handleTitleChange}
					/>
				</Form.Item>

				<Form.Item
					name='slug'
					label='Slug'
					rules={[...rules.required]}
				>
					<Input placeholder='slug-bai-viet' />
				</Form.Item>

				<Form.Item
					name='summary'
					label='Tóm tắt'
					rules={[...rules.required]}
				>
					<TextArea
						placeholder='Nhập tóm tắt bài viết'
						rows={2}
						maxLength={300}
						showCount
					/>
				</Form.Item>

				<Form.Item
					name='content'
					label='Nội dung (Markdown)'
					rules={[...rules.required]}
				>
					<TextArea
						placeholder='Viết nội dung bài viết bằng Markdown...'
						rows={8}
					/>
				</Form.Item>

				<Form.Item
					name='coverImage'
					label='Ảnh đại diện (URL)'
					rules={[...rules.required]}
				>
					<Input placeholder='https://picsum.photos/seed/example/800/400' />
				</Form.Item>

				<Form.Item
					name='author'
					label='Tác giả'
					initialValue='Nguyễn Văn A'
					rules={[...rules.required]}
				>
					<Input placeholder='Tên tác giả' />
				</Form.Item>

				<Form.Item
					name='tags'
					label='Thẻ'
					rules={[{ required: true, message: 'Vui lòng chọn ít nhất 1 thẻ' }]}
				>
					<Select
						mode='multiple'
						placeholder='Chọn thẻ cho bài viết'
						allowClear
					>
						{tags.map((tag: Blog.ITag) => (
							<Select.Option key={tag.id} value={tag.id}>
								{tag.name}
							</Select.Option>
						))}
					</Select>
				</Form.Item>

				<Form.Item
					name='status'
					label='Trạng thái'
					initialValue='draft'
					rules={[...rules.required]}
				>
					<Select placeholder='Chọn trạng thái'>
						<Select.Option value='draft'>Nháp</Select.Option>
						<Select.Option value='published'>Đã đăng</Select.Option>
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

export default FormBaiViet;

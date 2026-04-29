import { type IColumn } from '@/components/Table/typing';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Modal, Popconfirm, Table, Tag, Tooltip, message } from 'antd';
import { useMemo } from 'react';
import { useModel } from 'umi';
import { FormThe } from '.';

const QuanLyThe = () => {
	const {
		posts,
		tags,
		getDataTags,
		setRecordTag,
		setIsEdit,
		visibleTag,
		setVisibleTag,
	} = useModel('blog');


	const tagUsageCount = useMemo(() => {
		const countMap: Record<string, number> = {};
		tags.forEach((tag: Blog.ITag) => {
			countMap[tag.id] = posts.filter((post: Blog.IPost) => post.tags.includes(tag.id)).length;
		});
		return countMap;
	}, [tags, posts]);

	const handleDelete = (record: Blog.ITag) => {

		const usageCount = tagUsageCount[record.id] || 0;
		if (usageCount > 0) {
			message.warning(`Thẻ "${record.name}" đang được sử dụng bởi ${usageCount} bài viết. Không thể xóa!`);
			return;
		}

		const dataLocal: Blog.ITag[] = JSON.parse(localStorage.getItem('blog_tags') as string) || [];
		const newData = dataLocal.filter((item) => item.id !== record.id);
		localStorage.setItem('blog_tags', JSON.stringify(newData));
		message.success('Xóa thẻ thành công!');
		getDataTags();
	};

	const columns: IColumn<Blog.ITag>[] = [
		{
			title: 'Tên thẻ',
			dataIndex: 'name',
			key: 'name',
			width: 200,
			render: (name: string, record: Blog.ITag) => (
				<Tag color={record.color} style={{ fontSize: 14, padding: '4px 12px' }}>
					{name}
				</Tag>
			),
		},
		{
			title: 'Màu',
			dataIndex: 'color',
			key: 'color',
			width: 120,
			align: 'center',
			render: (color: string) => (
				<Tag color={color}>{color}</Tag>
			),
		},
		{
			title: 'Số bài viết sử dụng',
			key: 'usage',
			width: 180,
			align: 'center',
			render: (record: Blog.ITag) => (
				<span style={{ fontWeight: 500, fontSize: 16 }}>
					{tagUsageCount[record.id] || 0}
				</span>
			),
		},
		{
			title: 'Thao tác',
			align: 'center',
			width: 120,
			fixed: 'right',
			render: (record: Blog.ITag) => (
				<>
					<Tooltip title='Chỉnh sửa'>
						<Button
							onClick={() => {
								setRecordTag(record);
								setIsEdit(true);
								setVisibleTag(true);
							}}
							type='link'
							icon={<EditOutlined />}
						/>
					</Tooltip>
					<Tooltip title='Xóa'>
						<Popconfirm
							onConfirm={() => handleDelete(record)}
							title='Bạn có chắc chắn muốn xóa thẻ này?'
							placement='topLeft'
						>
							<Button danger type='link' icon={<DeleteOutlined />} />
						</Popconfirm>
					</Tooltip>
				</>
			),
		},
	];

	return (
		<div>

			<div style={{ marginBottom: 16, display: 'flex', justifyContent: 'flex-end' }}>
				<Button
					type='primary'
					icon={<PlusOutlined />}
					onClick={() => {
						setRecordTag(undefined);
						setIsEdit(false);
						setVisibleTag(true);
					}}
				>
					Thêm thẻ mới
				</Button>
			</div>

			<Table
				bordered
				dataSource={tags.map((item: Blog.ITag, index: number) => ({
					...item,
					key: item.id ?? index,
				}))}
				columns={columns as any}
				pagination={{
					showSizeChanger: true,
					pageSizeOptions: ['5', '10', '25'],
					showTotal: (total: number) => `Tổng số: ${total}`,
				}}
			/>

			<Modal
				destroyOnClose
				footer={false}
				title={null}
				visible={visibleTag}
				onCancel={() => setVisibleTag(false)}
				width={500}
				bodyStyle={{ padding: 0 }}
			>
				<FormThe />
			</Modal>
		</div>
	);
};

export default QuanLyThe;

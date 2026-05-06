import { type IColumn } from '@/components/Table/typing';
import { DeleteOutlined, EditOutlined, EyeOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Input, Modal, Popconfirm, Select, Table, Tag, Tooltip, message } from 'antd';
import { useMemo, useState } from 'react';
import { useModel } from 'umi';
import { FormBaiViet } from '.';

const QuanLyBaiViet = () => {
	const {
		posts,
		tags,
		getDataPosts,
		setRecord,
		setIsEdit,
		setVisible,
		visible,
		setActiveTab,
		setSelectedPostId,
	} = useModel('blog');

	const [searchText, setSearchText] = useState<string>('');
	const [filterStatus, setFilterStatus] = useState<string | undefined>(undefined);


	const filteredData = useMemo(() => {
		return posts.filter((item: Blog.IPost) => {
			const matchSearch =
				!searchText || item.title.toLowerCase().includes(searchText.toLowerCase());
			const matchStatus = !filterStatus || item.status === filterStatus;
			return matchSearch && matchStatus;
		});
	}, [posts, searchText, filterStatus]);

	const getTagInfo = (tagId: string) => {
		return tags.find((t: Blog.ITag) => t.id === tagId);
	};

	const handleDelete = (record: Blog.IPost) => {
		const dataLocal: Blog.IPost[] = JSON.parse(localStorage.getItem('blog_posts') as string) || [];
		const newData = dataLocal.filter((item) => item.id !== record.id);
		localStorage.setItem('blog_posts', JSON.stringify(newData));
		message.success('Xóa bài viết thành công!');
		getDataPosts();
	};

	const handleViewPost = (record: Blog.IPost) => {
		setSelectedPostId(record.id);
		setActiveTab('chi-tiet');
	};

	const formatDate = (dateStr: string) => {
		return new Date(dateStr).toLocaleDateString('vi-VN');
	};

	const columns: IColumn<Blog.IPost>[] = [
		{
			title: 'Tiêu đề',
			dataIndex: 'title',
			key: 'title',
			width: 280,
			ellipsis: true,
			render: (text: string, record: Blog.IPost) => (
				<a onClick={() => handleViewPost(record)} style={{ fontWeight: 500 }}>
					{text}
				</a>
			),
		},
		{
			title: 'Trạng thái',
			dataIndex: 'status',
			key: 'status',
			width: 120,
			align: 'center',
			render: (status: string) => (
				<Tag color={status === 'published' ? 'green' : 'orange'}>
					{status === 'published' ? 'Đã đăng' : 'Nháp'}
				</Tag>
			),
		},
		{
			title: 'Thẻ',
			dataIndex: 'tags',
			key: 'tags',
			width: 220,
			render: (tagIds: string[]) => (
				<>
					{tagIds.map((tagId: string) => {
						const tag = getTagInfo(tagId);
						return tag ? (
							<Tag key={tagId} color={tag.color} style={{ marginBottom: 2 }}>
								{tag.name}
							</Tag>
						) : null;
					})}
				</>
			),
		},
		{
			title: 'Lượt xem',
			dataIndex: 'viewCount',
			key: 'viewCount',
			width: 100,
			align: 'center',
			sorter: (a: Blog.IPost, b: Blog.IPost) => a.viewCount - b.viewCount,
		},
		{
			title: 'Ngày tạo',
			dataIndex: 'createdAt',
			key: 'createdAt',
			width: 120,
			align: 'center',
			render: (date: string) => formatDate(date),
			sorter: (a: Blog.IPost, b: Blog.IPost) =>
				new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
		},
		{
			title: 'Thao tác',
			align: 'center',
			width: 140,
			fixed: 'right',
			render: (record: Blog.IPost) => (
				<>
					<Tooltip title='Xem'>
						<Button
							onClick={() => handleViewPost(record)}
							type='link'
							icon={<EyeOutlined />}
						/>
					</Tooltip>
					<Tooltip title='Chỉnh sửa'>
						<Button
							onClick={() => {
								setRecord(record);
								setIsEdit(true);
								setVisible(true);
							}}
							type='link'
							icon={<EditOutlined />}
						/>
					</Tooltip>
					<Tooltip title='Xóa'>
						<Popconfirm
							onConfirm={() => handleDelete(record)}
							title='Bạn có chắc chắn muốn xóa bài viết này?'
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

			<div style={{ marginBottom: 16, display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
				<Input
					placeholder='Tìm kiếm theo tiêu đề'
					prefix={<SearchOutlined />}
					value={searchText}
					onChange={(e) => setSearchText(e.target.value)}
					style={{ width: 300 }}
					allowClear
				/>
				<Select
					placeholder='Lọc theo trạng thái'
					value={filterStatus}
					onChange={(val) => setFilterStatus(val)}
					style={{ width: 200 }}
					allowClear
				>
					<Select.Option value='published'>Đã đăng</Select.Option>
					<Select.Option value='draft'>Nháp</Select.Option>
				</Select>
				<Button
					type='primary'
					icon={<PlusOutlined />}
					onClick={() => {
						setRecord(undefined);
						setIsEdit(false);
						setVisible(true);
					}}
				>
					Thêm bài viết
				</Button>
			</div>

			<Table
				bordered
				dataSource={filteredData.map((item: Blog.IPost, index: number) => ({
					...item,
					key: item.id ?? index,
				}))}
				columns={columns as any}
				pagination={{
					showSizeChanger: true,
					pageSizeOptions: ['5', '10', '25', '50'],
					showTotal: (total: number) => `Tổng số: ${total}`,
				}}
			/>

			<Modal
				destroyOnClose
				footer={false}
				title={null}
				visible={visible}
				onCancel={() => setVisible(false)}
				width={700}
				bodyStyle={{ padding: 0 }}
			>
				<FormBaiViet />
			</Modal>
		</div>
	);
};

export default QuanLyBaiViet;

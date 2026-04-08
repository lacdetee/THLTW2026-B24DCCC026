import React, { useEffect, useState } from 'react';
import {
	Button,
	Card,
	Modal,
	Form,
	Input,
	InputNumber,
	Select,
	Rate,
	Table,
	Popconfirm,
	Space,
	Tag,
	Upload,
	message,
	Image,
	Tooltip,
} from 'antd';
import {
	PlusOutlined,
	EditOutlined,
	DeleteOutlined,
	UploadOutlined,
	SearchOutlined,
	EnvironmentOutlined,
	ClockCircleOutlined,
	StarFilled,
} from '@ant-design/icons';
import { useModel } from 'umi';

const { Option } = Select;
const { TextArea } = Input;

const formatVND = (val: number) => val.toLocaleString('vi-VN') + 'đ';

const typeLabels: Record<string, string> = {
	beach: '🏖️ Biển',
	mountain: '⛰️ Núi',
	city: '🏙️ Thành phố',
};

const typeColors: Record<string, string> = {
	beach: 'blue',
	mountain: 'green',
	city: 'orange',
};

const TabQuanTri: React.FC = () => {
	const { destinations, loadDestinations, addDestination, updateDestination, deleteDestination } =
		useModel('travelModel');
	const [form] = Form.useForm();
	const [visible, setVisible] = useState(false);
	const [editingId, setEditingId] = useState<string | null>(null);
	const [imageUrl, setImageUrl] = useState<string>('');
	const [search, setSearch] = useState('');

	useEffect(() => {
		loadDestinations();
	}, []);

	const openAdd = () => {
		form.resetFields();
		setEditingId(null);
		setImageUrl('');
		setVisible(true);
	};

	const openEdit = (record: Travel.Destination) => {
		setEditingId(record.id);
		setImageUrl(record.image);
		form.setFieldsValue({
			...record,
			costFood: record.costs.food,
			costAccommodation: record.costs.accommodation,
			costTransport: record.costs.transport,
			costSightseeing: record.costs.sightseeing,
		});
		setVisible(true);
	};

	const handleSubmit = () => {
		form.validateFields().then((values) => {
			const destData = {
				name: values.name,
				type: values.type,
				image: imageUrl || values.image || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
				rating: values.rating,
				description: values.description || '',
				visitDuration: values.visitDuration,
				location: values.location,
				travelTimeFromCenter: values.travelTimeFromCenter || 2,
				costs: {
					food: values.costFood || 0,
					accommodation: values.costAccommodation || 0,
					transport: values.costTransport || 0,
					sightseeing: values.costSightseeing || 0,
				},
			};

			if (editingId) {
				const existing = destinations.find((d) => d.id === editingId);
				if (existing) {
					updateDestination({ ...existing, ...destData });
				}
			} else {
				addDestination(destData as any);
			}
			setVisible(false);
		});
	};

	const handleUpload = (file: File) => {
		const reader = new FileReader();
		reader.onload = () => {
			setImageUrl(reader.result as string);
			message.success('Upload ảnh thành công!');
		};
		reader.readAsDataURL(file);
		return false;
	};

	const filtered = destinations.filter((d) =>
		search
			? d.name.toLowerCase().includes(search.toLowerCase()) ||
			  d.location.toLowerCase().includes(search.toLowerCase())
			: true,
	);

	const columns = [
		{
			title: 'Hình ảnh',
			dataIndex: 'image',
			width: 90,
			render: (url: string) => (
				<Image
					src={url}
					width={65}
					height={50}
					style={{ objectFit: 'cover', borderRadius: 10 }}
					fallback='https://via.placeholder.com/65x50?text=No+Image'
				/>
			),
		},
		{
			title: 'Tên điểm đến',
			dataIndex: 'name',
			sorter: (a: Travel.Destination, b: Travel.Destination) => a.name.localeCompare(b.name),
			render: (name: string, record: Travel.Destination) => (
				<div>
					<div style={{ fontWeight: 700, color: '#1a1a2e' }}>{name}</div>
					<div style={{ fontSize: 12, color: '#888' }}>
						<EnvironmentOutlined /> {record.location}
					</div>
				</div>
			),
		},
		{
			title: 'Loại',
			dataIndex: 'type',
			width: 120,
			filters: [
				{ text: '🏖️ Biển', value: 'beach' },
				{ text: '⛰️ Núi', value: 'mountain' },
				{ text: '🏙️ Thành phố', value: 'city' },
			],
			onFilter: (val: any, record: Travel.Destination) => record.type === val,
			render: (type: string) => (
				<Tag color={typeColors[type]} style={{ borderRadius: 8, fontWeight: 600 }}>
					{typeLabels[type]}
				</Tag>
			),
		},
		{
			title: 'Đánh giá',
			dataIndex: 'rating',
			width: 150,
			sorter: (a: Travel.Destination, b: Travel.Destination) => a.rating - b.rating,
			render: (val: number) => (
				<div>
					<Rate disabled value={val} allowHalf style={{ fontSize: 13 }} character={<StarFilled />} />
					<span style={{ marginLeft: 6, fontWeight: 700, color: '#fa8c16' }}>{val}</span>
				</div>
			),
		},
		{
			title: 'Thời gian',
			dataIndex: 'visitDuration',
			width: 100,
			sorter: (a: Travel.Destination, b: Travel.Destination) => a.visitDuration - b.visitDuration,
			render: (val: number) => (
				<Tag icon={<ClockCircleOutlined />} color='default' style={{ borderRadius: 8 }}>
					{val}h
				</Tag>
			),
		},
		{
			title: 'Tổng chi phí',
			key: 'totalCost',
			width: 140,
			sorter: (a: Travel.Destination, b: Travel.Destination) => {
				const costA = a.costs.food + a.costs.accommodation + a.costs.transport + a.costs.sightseeing;
				const costB = b.costs.food + b.costs.accommodation + b.costs.transport + b.costs.sightseeing;
				return costA - costB;
			},
			render: (_: any, r: Travel.Destination) => (
				<Tooltip
					title={
						<div>
							<div>🍜 Ăn uống: {formatVND(r.costs.food)}</div>
							<div>🏨 Lưu trú: {formatVND(r.costs.accommodation)}</div>
							<div>🚗 Di chuyển: {formatVND(r.costs.transport)}</div>
							<div>📸 Tham quan: {formatVND(r.costs.sightseeing)}</div>
						</div>
					}
				>
					<span style={{ fontWeight: 700, color: '#667eea', cursor: 'pointer' }}>
						{formatVND(r.costs.food + r.costs.accommodation + r.costs.transport + r.costs.sightseeing)}
					</span>
				</Tooltip>
			),
		},
		{
			title: 'Thao tác',
			key: 'action',
			width: 110,
			render: (_: any, record: Travel.Destination) => (
				<Space>
					<Tooltip title='Sửa'>
						<Button type='primary' ghost icon={<EditOutlined />} onClick={() => openEdit(record)} style={{ borderRadius: 8 }} size='small' />
					</Tooltip>
					<Popconfirm title='Xóa điểm đến này?' okText='Xóa' cancelText='Hủy' onConfirm={() => deleteDestination(record.id)}>
						<Tooltip title='Xóa'>
							<Button danger ghost icon={<DeleteOutlined />} style={{ borderRadius: 8 }} size='small' />
						</Tooltip>
					</Popconfirm>
				</Space>
			),
		},
	];

	return (
		<div>
			<div className='admin-toolbar'>
				<div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
					<Input
						placeholder='Tìm theo tên hoặc địa điểm...'
						prefix={<SearchOutlined style={{ color: '#667eea' }} />}
						style={{ width: 300, borderRadius: 10 }}
						allowClear
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						size='large'
					/>
					<span style={{ color: '#888', fontSize: 13 }}>
						{filtered.length}/{destinations.length} điểm đến
					</span>
				</div>
				<Button
					type='primary'
					icon={<PlusOutlined />}
					onClick={openAdd}
					size='large'
					style={{ borderRadius: 10, fontWeight: 700, padding: '0 28px' }}
				>
					Thêm điểm đến
				</Button>
			</div>

			<Card className='admin-table-card'>
				<Table
					dataSource={filtered}
					columns={columns as any}
					rowKey='id'
					pagination={{ pageSize: 10, showSizeChanger: true, showTotal: (total) => `Tổng ${total} điểm đến` }}
					scroll={{ x: 900 }}
				/>
			</Card>

			{/* Modal thêm/sửa */}
			<Modal
				title={editingId ? '✏️ Sửa điểm đến' : '✨ Thêm điểm đến mới'}
				visible={visible}
				onOk={handleSubmit}
				onCancel={() => setVisible(false)}
				okText={editingId ? 'Cập nhật' : 'Thêm mới'}
				cancelText='Hủy'
				width={680}
				destroyOnClose
			>
				<Form form={form} layout='vertical' requiredMark='optional'>
					<Form.Item name='name' label='Tên điểm đến' rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}>
						<Input placeholder='VD: Vịnh Hạ Long' style={{ borderRadius: 10 }} size='large' />
					</Form.Item>

					<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
						<Form.Item name='type' label='Loại hình' rules={[{ required: true, message: 'Chọn loại hình!' }]}>
							<Select placeholder='Chọn loại hình' size='large'>
								<Option value='beach'>🏖️ Biển đảo</Option>
								<Option value='mountain'>⛰️ Núi rừng</Option>
								<Option value='city'>🏙️ Thành phố</Option>
							</Select>
						</Form.Item>
						<Form.Item name='location' label='Địa điểm (tỉnh/thành)' rules={[{ required: true, message: 'Nhập địa điểm!' }]}>
							<Input placeholder='VD: Quảng Ninh' style={{ borderRadius: 10 }} size='large' />
						</Form.Item>
					</div>

					<Form.Item name='description' label='Mô tả chi tiết'>
						<TextArea rows={3} placeholder='Mô tả điểm đến...' style={{ borderRadius: 10 }} />
					</Form.Item>

					<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
						<Form.Item name='rating' label='Đánh giá' rules={[{ required: true, message: 'Cho đánh giá!' }]}>
							<Rate allowHalf character={<StarFilled />} />
						</Form.Item>
						<Form.Item name='visitDuration' label='Thời gian tham quan (giờ)' rules={[{ required: true }]}>
							<InputNumber min={1} max={24} style={{ width: '100%', borderRadius: 10 }} size='large' />
						</Form.Item>
						<Form.Item name='travelTimeFromCenter' label='TG di chuyển từ TT (giờ)'>
							<InputNumber min={0.5} max={12} step={0.5} style={{ width: '100%', borderRadius: 10 }} size='large' />
						</Form.Item>
					</div>

					<Form.Item label='Hình ảnh điểm đến'>
						<div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
							<Upload accept='image/*' showUploadList={false} beforeUpload={handleUpload as any}>
								<Button icon={<UploadOutlined />} size='large' style={{ borderRadius: 10 }}>
									Upload ảnh
								</Button>
							</Upload>
							<Input
								placeholder='Hoặc dán URL hình ảnh...'
								value={imageUrl}
								onChange={(e) => setImageUrl(e.target.value)}
								style={{ flex: 1, borderRadius: 10 }}
								size='large'
							/>
						</div>
						{imageUrl && (
							<img
								src={imageUrl}
								alt='preview'
								style={{ marginTop: 10, maxHeight: 130, borderRadius: 12, objectFit: 'cover', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
							/>
						)}
					</Form.Item>

					<div style={{ background: 'linear-gradient(135deg, #f8f9ff, #eef0ff)', borderRadius: 12, padding: 20, marginTop: 8 }}>
						<h4 style={{ marginBottom: 16, fontWeight: 700, color: '#333' }}>💰 Chi phí ước tính (VNĐ)</h4>
						<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
							<Form.Item name='costFood' label='🍜 Ăn uống'>
								<InputNumber min={0} step={50000} style={{ width: '100%', borderRadius: 10 }} formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} parser={(v) => Number(v?.replace(/,/g, '') || 0)} size='large' />
							</Form.Item>
							<Form.Item name='costAccommodation' label='🏨 Lưu trú'>
								<InputNumber min={0} step={50000} style={{ width: '100%', borderRadius: 10 }} formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} parser={(v) => Number(v?.replace(/,/g, '') || 0)} size='large' />
							</Form.Item>
							<Form.Item name='costTransport' label='🚗 Di chuyển'>
								<InputNumber min={0} step={50000} style={{ width: '100%', borderRadius: 10 }} formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} parser={(v) => Number(v?.replace(/,/g, '') || 0)} size='large' />
							</Form.Item>
							<Form.Item name='costSightseeing' label='📸 Tham quan'>
								<InputNumber min={0} step={50000} style={{ width: '100%', borderRadius: 10 }} formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} parser={(v) => Number(v?.replace(/,/g, '') || 0)} size='large' />
							</Form.Item>
						</div>
					</div>
				</Form>
			</Modal>
		</div>
	);
};

export default TabQuanTri;

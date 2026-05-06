import { type IColumn } from '@/components/Table/typing';
import { DeleteOutlined, EditOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Card, Input, Modal, Popconfirm, Select, Table, Tag, Tooltip, message } from 'antd';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import FormPhongHoc from './components/FormPhongHoc';

const NGUOI_PHU_TRACH_LIST = [
	'Nguyễn Văn A',
	'Trần Thị B',
	'Lê Văn C',
	'Phạm Thị D',
	'Hoàng Văn E',
];

const LOAI_PHONG_OPTIONS = [
	{ value: 'ly_thuyet', label: 'Lý thuyết', color: 'blue' },
	{ value: 'thuc_hanh', label: 'Thực hành', color: 'green' },
	{ value: 'hoi_truong', label: 'Hội trường', color: 'purple' },
];

const getLoaiPhongTag = (loaiPhong: string) => {
	const found = LOAI_PHONG_OPTIONS.find((item) => item.value === loaiPhong);
	return <Tag color={found?.color}>{found?.label ?? loaiPhong}</Tag>;
};

const PhongHocPage = () => {
	const {
		data,
		getDataPhongHoc,
		setVisible,
		setIsEdit,
		setRecord,
		visible,
	} = useModel('phonghoc');

	const [searchText, setSearchText] = useState<string>('');
	const [filterLoaiPhong, setFilterLoaiPhong] = useState<string | undefined>(undefined);
	const [filterNguoiPhuTrach, setFilterNguoiPhuTrach] = useState<string | undefined>(undefined);

	useEffect(() => {
		getDataPhongHoc();
	}, []);

	// Lọc dữ liệu
	const filteredData = data.filter((item: PhongHoc.IRecord) => {
		const matchSearch =
			!searchText ||
			item.maPhong.toLowerCase().includes(searchText.toLowerCase()) ||
			item.tenPhong.toLowerCase().includes(searchText.toLowerCase());
		const matchLoaiPhong = !filterLoaiPhong || item.loaiPhong === filterLoaiPhong;
		const matchNguoiPhuTrach = !filterNguoiPhuTrach || item.nguoiPhuTrach === filterNguoiPhuTrach;
		return matchSearch && matchLoaiPhong && matchNguoiPhuTrach;
	});

	const handleDelete = (record: PhongHoc.IRecord) => {
		if (record.soChoNgoi >= 30) {
			message.error('Không thể xóa phòng có từ 30 chỗ ngồi trở lên!');
			return;
		}
		const dataLocal: PhongHoc.IRecord[] = JSON.parse(localStorage.getItem('phonghoc') as string) || [];
		const newData = dataLocal.filter((item) => item.maPhong !== record.maPhong);
		localStorage.setItem('phonghoc', JSON.stringify(newData));
		message.success('Xóa phòng học thành công!');
		getDataPhongHoc();
	};

	const columns: IColumn<PhongHoc.IRecord>[] = [
		{
			title: 'Mã phòng',
			dataIndex: 'maPhong',
			key: 'maPhong',
			width: 120,
			align: 'center',
		},
		{
			title: 'Tên phòng',
			dataIndex: 'tenPhong',
			key: 'tenPhong',
			width: 220,
		},
		{
			title: 'Số chỗ ngồi',
			dataIndex: 'soChoNgoi',
			key: 'soChoNgoi',
			width: 140,
			align: 'center',
			sorter: (a: PhongHoc.IRecord, b: PhongHoc.IRecord) => a.soChoNgoi - b.soChoNgoi,
		},
		{
			title: 'Loại phòng',
			dataIndex: 'loaiPhong',
			key: 'loaiPhong',
			width: 140,
			align: 'center',
			render: (val: string) => getLoaiPhongTag(val),
		},
		{
			title: 'Người phụ trách',
			dataIndex: 'nguoiPhuTrach',
			key: 'nguoiPhuTrach',
			width: 180,
		},
		{
			title: 'Thao tác',
			align: 'center',
			width: 120,
			fixed: 'right',
			render: (record: PhongHoc.IRecord) => (
				<>
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
						{record.soChoNgoi >= 30 ? (
							<Button
								danger
								type='link'
								icon={<DeleteOutlined />}
								onClick={() => message.error('Không thể xóa phòng có từ 30 chỗ ngồi trở lên!')}
							/>
						) : (
							<Popconfirm
								onConfirm={() => handleDelete(record)}
								title='Bạn có chắc chắn muốn xóa phòng học này?'
								placement='topLeft'
							>
								<Button danger type='link' icon={<DeleteOutlined />} />
							</Popconfirm>
						)}
					</Tooltip>
				</>
			),
		},
	];

	return (
		<Card title='Quản lý phòng học'>
			{/* Bộ lọc */}
			<div style={{ marginBottom: 16, display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
				<Input
					placeholder='Tìm kiếm theo mã phòng, tên phòng'
					prefix={<SearchOutlined />}
					value={searchText}
					onChange={(e) => setSearchText(e.target.value)}
					style={{ width: 300 }}
					allowClear
				/>
				<Select
					placeholder='Lọc theo loại phòng'
					value={filterLoaiPhong}
					onChange={(val) => setFilterLoaiPhong(val)}
					style={{ width: 200 }}
					allowClear
				>
					{LOAI_PHONG_OPTIONS.map((lp) => (
						<Select.Option key={lp.value} value={lp.value}>
							{lp.label}
						</Select.Option>
					))}
				</Select>
				<Select
					placeholder='Lọc theo người phụ trách'
					value={filterNguoiPhuTrach}
					onChange={(val) => setFilterNguoiPhuTrach(val)}
					style={{ width: 200 }}
					allowClear
				>
					{NGUOI_PHU_TRACH_LIST.map((npt) => (
						<Select.Option key={npt} value={npt}>
							{npt}
						</Select.Option>
					))}
				</Select>
				<Button
					type='primary'
					onClick={() => {
						setRecord(undefined);
						setIsEdit(false);
						setVisible(true);
					}}
				>
					Thêm mới
				</Button>
			</div>

			<Table
				bordered
				dataSource={filteredData.map((item: PhongHoc.IRecord, index: number) => ({
					...item,
					key: item.maPhong ?? index,
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
				width={600}
				bodyStyle={{ padding: 0 }}
			>
				<FormPhongHoc />
			</Modal>
		</Card>
	);
};

export default PhongHocPage;

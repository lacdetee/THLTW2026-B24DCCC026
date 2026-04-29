import { type IColumn } from '@/components/Table/typing';
import { DeleteOutlined, EditOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, DatePicker, Input, Modal, Popconfirm, Select, Table, Tag, Tooltip, message } from 'antd';
import moment from 'moment';
import { useMemo, useState } from 'react';
import { useModel } from 'umi';
import { FormTapLuyen } from '.';

const { RangePicker } = DatePicker;

const WORKOUT_TYPE_COLORS: Record<string, string> = {
	Cardio: 'blue',
	Strength: 'red',
	Yoga: 'green',
	HIIT: 'orange',
	Other: 'default',
};

const NhatKyTapLuyen = () => {
	const { workouts, getDataWorkouts, setRecord, setIsEdit, visible, setVisible } = useModel('fitness');
	const [searchText, setSearchText] = useState('');
	const [filterType, setFilterType] = useState<string | undefined>(undefined);
	const [dateRange, setDateRange] = useState<[moment.Moment, moment.Moment] | null>(null);

	const filteredData = useMemo(() => {
		return workouts.filter((item: Fitness.IWorkout) => {
			const matchSearch = !searchText || item.note.toLowerCase().includes(searchText.toLowerCase()) || item.type.toLowerCase().includes(searchText.toLowerCase());
			const matchType = !filterType || item.type === filterType;
			const matchDate = !dateRange || (
				moment(item.date).isSameOrAfter(dateRange[0], 'day') &&
				moment(item.date).isSameOrBefore(dateRange[1], 'day')
			);
			return matchSearch && matchType && matchDate;
		});
	}, [workouts, searchText, filterType, dateRange]);

	const handleDelete = (record: Fitness.IWorkout) => {
		const dataLocal: Fitness.IWorkout[] = JSON.parse(localStorage.getItem('fitness_workouts') as string) || [];
		const newData = dataLocal.filter((item) => item.id !== record.id);
		localStorage.setItem('fitness_workouts', JSON.stringify(newData));
		message.success('Xóa buổi tập thành công!');
		getDataWorkouts();
	};

	const columns: IColumn<Fitness.IWorkout>[] = [
		{
			title: 'Ngày',
			dataIndex: 'date',
			key: 'date',
			width: 120,
			align: 'center',
			render: (date: string) => moment(date).format('DD/MM/YYYY'),
			sorter: (a: Fitness.IWorkout, b: Fitness.IWorkout) => new Date(a.date).getTime() - new Date(b.date).getTime(),
		},
		{
			title: 'Loại bài tập',
			dataIndex: 'type',
			key: 'type',
			width: 130,
			align: 'center',
			render: (type: string) => <Tag color={WORKOUT_TYPE_COLORS[type]}>{type}</Tag>,
		},
		{
			title: 'Thời lượng (phút)',
			dataIndex: 'duration',
			key: 'duration',
			width: 140,
			align: 'center',
			sorter: (a: Fitness.IWorkout, b: Fitness.IWorkout) => a.duration - b.duration,
		},
		{
			title: 'Calo đốt',
			dataIndex: 'calories',
			key: 'calories',
			width: 110,
			align: 'center',
			render: (val: number) => `${val} kcal`,
			sorter: (a: Fitness.IWorkout, b: Fitness.IWorkout) => a.calories - b.calories,
		},
		{
			title: 'Ghi chú',
			dataIndex: 'note',
			key: 'note',
			ellipsis: true,
		},
		{
			title: 'Trạng thái',
			dataIndex: 'status',
			key: 'status',
			width: 130,
			align: 'center',
			render: (status: string) => (
				<Tag color={status === 'completed' ? 'green' : 'red'}>
					{status === 'completed' ? 'Hoàn thành' : 'Bỏ lỡ'}
				</Tag>
			),
		},
		{
			title: 'Thao tác',
			align: 'center',
			width: 100,
			fixed: 'right',
			render: (record: Fitness.IWorkout) => (
				<>
					<Tooltip title='Sửa'>
						<Button
							onClick={() => { setRecord(record); setIsEdit(true); setVisible(true); }}
							type='link'
							icon={<EditOutlined />}
						/>
					</Tooltip>
					<Tooltip title='Xóa'>
						<Popconfirm onConfirm={() => handleDelete(record)} title='Xóa buổi tập này?' placement='topLeft'>
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
					placeholder='Tìm kiếm bài tập...'
					prefix={<SearchOutlined />}
					value={searchText}
					onChange={(e) => setSearchText(e.target.value)}
					style={{ width: 250 }}
					allowClear
				/>
				<Select
					placeholder='Loại bài tập'
					value={filterType}
					onChange={(val) => setFilterType(val)}
					style={{ width: 160 }}
					allowClear
				>
					{['Cardio', 'Strength', 'Yoga', 'HIIT', 'Other'].map((t) => (
						<Select.Option key={t} value={t}>{t}</Select.Option>
					))}
				</Select>
				<RangePicker
					value={dateRange as any}
					onChange={(vals: any) => setDateRange(vals)}
					format='DD/MM/YYYY'
				/>
				<Button
					type='primary'
					icon={<PlusOutlined />}
					onClick={() => { setRecord(undefined); setIsEdit(false); setVisible(true); }}
				>
					Thêm buổi tập
				</Button>
			</div>

			<Table
				bordered
				dataSource={filteredData.map((item: Fitness.IWorkout, index: number) => ({ ...item, key: item.id ?? index }))}
				columns={columns as any}
				pagination={{ showSizeChanger: true, pageSizeOptions: ['5', '10', '25'], showTotal: (total: number) => `Tổng: ${total}` }}
			/>

			<Modal destroyOnClose footer={false} title={null} visible={visible} onCancel={() => setVisible(false)} width={600} bodyStyle={{ padding: 0 }}>
				<FormTapLuyen />
			</Modal>
		</div>
	);
};

export default NhatKyTapLuyen;

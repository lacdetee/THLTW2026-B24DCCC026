import { type IColumn } from '@/components/Table/typing';
import { DeleteOutlined, EditOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Input, Modal, Popconfirm, Select, Table, Tag, Tooltip, message } from 'antd';
import moment from 'moment';
import { useMemo, useState } from 'react';
import { useModel } from 'umi';
import { FormTask } from '.';

const PRIORITY_COLORS: Record<string, string> = { high: 'red', medium: 'orange', low: 'green' };
const PRIORITY_LABELS: Record<string, string> = { high: 'Cao', medium: 'Trung bình', low: 'Thấp' };
const STATUS_COLORS: Record<string, string> = { todo: 'default', in_progress: 'processing', done: 'success' };
const STATUS_LABELS: Record<string, string> = { todo: 'Cần làm', in_progress: 'Đang làm', done: 'Hoàn thành' };

const TaskList = () => {
	const { tasks, updateTasks, setRecord, setIsEdit, visible, setVisible } = useModel('kanban');
	const [searchText, setSearchText] = useState('');
	const [filterStatus, setFilterStatus] = useState<string | undefined>(undefined);

	const filteredData = useMemo(() => {
		return tasks.filter((item: Kanban.ITask) => {
			const matchSearch = !searchText || item.name.toLowerCase().includes(searchText.toLowerCase());
			const matchStatus = !filterStatus || item.status === filterStatus;
			return matchSearch && matchStatus;
		});
	}, [tasks, searchText, filterStatus]);

	const handleDelete = (record: Kanban.ITask) => {
		const newTasks = tasks.filter((t: Kanban.ITask) => t.id !== record.id);
		updateTasks(newTasks);
		message.success('Xóa task thành công!');
	};

	const isOverdue = (task: Kanban.ITask) => {
		const today = new Date().toISOString().split('T')[0];
		return task.status !== 'done' && task.deadline < today;
	};

	const columns: IColumn<Kanban.ITask>[] = [
		{
			title: 'Tên Task',
			dataIndex: 'name',
			key: 'name',
			width: 220,
			ellipsis: true,
			render: (text: string, record: Kanban.ITask) => (
				<span style={{ fontWeight: 500, color: isOverdue(record) ? '#ff4d4f' : undefined }}>
					{text}
				</span>
			),
		},
		{
			title: 'Mô tả',
			dataIndex: 'description',
			key: 'description',
			width: 200,
			ellipsis: true,
		},
		{
			title: 'Deadline',
			dataIndex: 'deadline',
			key: 'deadline',
			width: 120,
			align: 'center',
			render: (date: string, record: Kanban.ITask) => (
				<span style={{ color: isOverdue(record) ? '#ff4d4f' : undefined, fontWeight: isOverdue(record) ? 600 : 400 }}>
					{moment(date).format('DD/MM/YYYY')}
				</span>
			),
			sorter: (a: Kanban.ITask, b: Kanban.ITask) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime(),
		},
		{
			title: 'Ưu tiên',
			dataIndex: 'priority',
			key: 'priority',
			width: 120,
			align: 'center',
			render: (priority: string) => <Tag color={PRIORITY_COLORS[priority]}>{PRIORITY_LABELS[priority]}</Tag>,
		},
		{
			title: 'Tag',
			dataIndex: 'tag',
			key: 'tag',
			width: 110,
			align: 'center',
			render: (tag: string) => <Tag>{tag}</Tag>,
		},
		{
			title: 'Trạng thái',
			dataIndex: 'status',
			key: 'status',
			width: 130,
			align: 'center',
			render: (status: string) => <Tag color={STATUS_COLORS[status]}>{STATUS_LABELS[status]}</Tag>,
		},
		{
			title: 'Thao tác',
			align: 'center',
			width: 100,
			fixed: 'right',
			render: (record: Kanban.ITask) => (
				<>
					<Tooltip title='Sửa'>
						<Button
							onClick={() => { setRecord(record); setIsEdit(true); setVisible(true); }}
							type='link'
							icon={<EditOutlined />}
						/>
					</Tooltip>
					<Tooltip title='Xóa'>
						<Popconfirm onConfirm={() => handleDelete(record)} title='Xóa task này?' placement='topLeft'>
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
					placeholder='Tìm kiếm theo tên task...'
					prefix={<SearchOutlined />}
					value={searchText}
					onChange={(e) => setSearchText(e.target.value)}
					style={{ width: 280 }}
					allowClear
				/>
				<Select
					placeholder='Lọc theo trạng thái'
					value={filterStatus}
					onChange={(val) => setFilterStatus(val)}
					style={{ width: 180 }}
					allowClear
				>
					<Select.Option value='todo'>Cần làm</Select.Option>
					<Select.Option value='in_progress'>Đang làm</Select.Option>
					<Select.Option value='done'>Hoàn thành</Select.Option>
				</Select>
				<Button
					type='primary'
					icon={<PlusOutlined />}
					onClick={() => { setRecord(undefined); setIsEdit(false); setVisible(true); }}
				>
					Thêm Task
				</Button>
			</div>

			<Table
				bordered
				dataSource={filteredData.map((item: Kanban.ITask, index: number) => ({ ...item, key: item.id ?? index }))}
				columns={columns as any}
				pagination={{ showSizeChanger: true, pageSizeOptions: ['5', '10', '25'], showTotal: (total: number) => `Tổng: ${total}` }}
			/>

			<Modal destroyOnClose footer={false} title={null} visible={visible} onCancel={() => setVisible(false)} width={600} bodyStyle={{ padding: 0 }}>
				<FormTask />
			</Modal>
		</div>
	);
};

export default TaskList;

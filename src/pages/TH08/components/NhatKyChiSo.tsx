import { type IColumn } from '@/components/Table/typing';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Modal, Popconfirm, Table, Tag, Tooltip, message } from 'antd';
import moment from 'moment';
import { useModel } from 'umi';
import { FormChiSo } from '.';

const getBmiCategory = (bmi: number): { label: string; color: string } => {
	if (bmi < 18.5) return { label: 'Thiếu cân', color: 'blue' };
	if (bmi <= 24.9) return { label: 'Bình thường', color: 'green' };
	if (bmi <= 29.9) return { label: 'Thừa cân', color: 'gold' };
	return { label: 'Béo phì', color: 'red' };
};

const NhatKyChiSo = () => {
	const { healthMetrics, getDataHealth, setRecord, setIsEdit, visible, setVisible } = useModel('fitness');

	const handleDelete = (record: Fitness.IHealthMetric) => {
		const dataLocal: Fitness.IHealthMetric[] = JSON.parse(localStorage.getItem('fitness_health') as string) || [];
		const newData = dataLocal.filter((item) => item.id !== record.id);
		localStorage.setItem('fitness_health', JSON.stringify(newData));
		message.success('Xóa chỉ số thành công!');
		getDataHealth();
	};

	const columns: IColumn<Fitness.IHealthMetric>[] = [
		{
			title: 'Ngày',
			dataIndex: 'date',
			key: 'date',
			width: 120,
			align: 'center',
			render: (date: string) => moment(date).format('DD/MM/YYYY'),
			sorter: (a: Fitness.IHealthMetric, b: Fitness.IHealthMetric) => new Date(a.date).getTime() - new Date(b.date).getTime(),
		},
		{
			title: 'Cân nặng (kg)',
			dataIndex: 'weight',
			key: 'weight',
			width: 130,
			align: 'center',
			sorter: (a: Fitness.IHealthMetric, b: Fitness.IHealthMetric) => a.weight - b.weight,
		},
		{
			title: 'Chiều cao (cm)',
			dataIndex: 'height',
			key: 'height',
			width: 130,
			align: 'center',
		},
		{
			title: 'BMI',
			dataIndex: 'bmi',
			key: 'bmi',
			width: 180,
			align: 'center',
			render: (bmi: number) => {
				const cat = getBmiCategory(bmi);
				return (
					<>
						<span style={{ fontWeight: 600, marginRight: 8 }}>{bmi.toFixed(1)}</span>
						<Tag color={cat.color}>{cat.label}</Tag>
					</>
				);
			},
			sorter: (a: Fitness.IHealthMetric, b: Fitness.IHealthMetric) => a.bmi - b.bmi,
		},
		{
			title: 'Nhịp tim (bpm)',
			dataIndex: 'heartRate',
			key: 'heartRate',
			width: 130,
			align: 'center',
		},
		{
			title: 'Giờ ngủ',
			dataIndex: 'sleepHours',
			key: 'sleepHours',
			width: 100,
			align: 'center',
			render: (val: number) => `${val}h`,
		},
		{
			title: 'Thao tác',
			align: 'center',
			width: 100,
			fixed: 'right',
			render: (record: Fitness.IHealthMetric) => (
				<>
					<Tooltip title='Sửa'>
						<Button
							onClick={() => { setRecord(record); setIsEdit(true); setVisible(true); }}
							type='link'
							icon={<EditOutlined />}
						/>
					</Tooltip>
					<Tooltip title='Xóa'>
						<Popconfirm onConfirm={() => handleDelete(record)} title='Xóa chỉ số này?' placement='topLeft'>
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
					onClick={() => { setRecord(undefined); setIsEdit(false); setVisible(true); }}
				>
					Thêm chỉ số
				</Button>
			</div>

			<Table
				bordered
				dataSource={healthMetrics.map((item: Fitness.IHealthMetric, index: number) => ({ ...item, key: item.id ?? index }))}
				columns={columns as any}
				pagination={{ showSizeChanger: true, pageSizeOptions: ['5', '10', '25'], showTotal: (total: number) => `Tổng: ${total}` }}
			/>

			<Modal destroyOnClose footer={false} title={null} visible={visible} onCancel={() => setVisible(false)} width={600} bodyStyle={{ padding: 0 }}>
				<FormChiSo />
			</Modal>
		</div>
	);
};

export default NhatKyChiSo;

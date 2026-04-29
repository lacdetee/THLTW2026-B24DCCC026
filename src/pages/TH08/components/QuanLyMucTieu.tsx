import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Card, Col, Drawer, Empty, InputNumber, Popconfirm, Progress, Row, Segmented, Tag, Typography, message } from 'antd';
import { useMemo, useState } from 'react';
import { useModel } from 'umi';
import { FormMucTieu } from '.';

const { Title, Text } = Typography;

const GOAL_TYPE_LABELS: Record<string, string> = {
	weight_loss: 'Giảm cân',
	muscle_gain: 'Tăng cơ',
	endurance: 'Sức bền',
	other: 'Khác',
};

const GOAL_TYPE_COLORS: Record<string, string> = {
	weight_loss: 'magenta',
	muscle_gain: 'blue',
	endurance: 'green',
	other: 'default',
};

const STATUS_LABELS: Record<string, string> = {
	in_progress: 'Đang thực hiện',
	achieved: 'Đã đạt',
	cancelled: 'Đã hủy',
};

const STATUS_COLORS: Record<string, string> = {
	in_progress: 'processing',
	achieved: 'success',
	cancelled: 'default',
};

const QuanLyMucTieu = () => {
	const { goals, getDataGoals, setRecord, setIsEdit, visibleDrawer, setVisibleDrawer } = useModel('fitness');
	const [filterStatus, setFilterStatus] = useState<string>('all');

	const filteredGoals = useMemo(() => {
		if (filterStatus === 'all') return goals;
		return goals.filter((g: Fitness.IGoal) => g.status === filterStatus);
	}, [goals, filterStatus]);

	const handleDelete = (record: Fitness.IGoal) => {
		const dataLocal: Fitness.IGoal[] = JSON.parse(localStorage.getItem('fitness_goals') as string) || [];
		const newData = dataLocal.filter((item) => item.id !== record.id);
		localStorage.setItem('fitness_goals', JSON.stringify(newData));
		message.success('Xóa mục tiêu thành công!');
		getDataGoals();
	};

	const handleUpdateCurrent = (goalId: string, newValue: number) => {
		const dataLocal: Fitness.IGoal[] = JSON.parse(localStorage.getItem('fitness_goals') as string) || [];
		const newData = dataLocal.map((item) => {
			if (item.id === goalId) {
				const updated = { ...item, currentValue: newValue };
				if (newValue >= item.targetValue && item.type !== 'weight_loss') {
					updated.status = 'achieved';
				}
				if (item.type === 'weight_loss' && newValue <= item.targetValue) {
					updated.status = 'achieved';
				}
				return updated;
			}
			return item;
		});
		localStorage.setItem('fitness_goals', JSON.stringify(newData));
		getDataGoals();
	};

	const getPercent = (goal: Fitness.IGoal) => {
		if (goal.type === 'weight_loss') {
			const startWeight = 72;
			const totalToLose = startWeight - goal.targetValue;
			const lost = startWeight - goal.currentValue;
			return Math.min(Math.max(Math.round((lost / totalToLose) * 100), 0), 100);
		}
		return Math.min(Math.round((goal.currentValue / goal.targetValue) * 100), 100);
	};

	return (
		<div>
			<div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
				<Segmented
					options={[
						{ label: 'Tất cả', value: 'all' },
						{ label: 'Đang thực hiện', value: 'in_progress' },
						{ label: 'Đã đạt', value: 'achieved' },
						{ label: 'Đã hủy', value: 'cancelled' },
					]}
					value={filterStatus}
					onChange={(val) => setFilterStatus(val as string)}
				/>
				<Button
					type='primary'
					icon={<PlusOutlined />}
					onClick={() => { setRecord(undefined); setIsEdit(false); setVisibleDrawer(true); }}
				>
					Thêm mục tiêu
				</Button>
			</div>

			{filteredGoals.length === 0 ? (
				<Empty description='Không có mục tiêu nào' style={{ padding: 60 }} />
			) : (
				<Row gutter={[16, 16]}>
					{filteredGoals.map((goal: Fitness.IGoal) => {
						const percent = getPercent(goal);
						return (
							<Col xs={24} sm={12} lg={8} key={goal.id}>
								<Card
									style={{ borderRadius: 12, height: '100%' }}
									actions={[
										<Popconfirm key='delete' title='Xóa mục tiêu này?' onConfirm={() => handleDelete(goal)}>
											<Button type='text' danger icon={<DeleteOutlined />} size='small'>Xóa</Button>
										</Popconfirm>,
										<Button
											key='edit'
											type='text'
											icon={<EditOutlined />}
											size='small'
											onClick={() => { setRecord(goal); setIsEdit(true); setVisibleDrawer(true); }}
										>
											Sửa
										</Button>,
									]}
								>
									<div style={{ marginBottom: 12 }}>
										<Title level={5} style={{ margin: 0 }}>{goal.name}</Title>
										<div style={{ marginTop: 8 }}>
											<Tag color={GOAL_TYPE_COLORS[goal.type]}>{GOAL_TYPE_LABELS[goal.type]}</Tag>
											<Tag color={STATUS_COLORS[goal.status]}>{STATUS_LABELS[goal.status]}</Tag>
										</div>
									</div>

									<Progress
										percent={percent}
										status={goal.status === 'achieved' ? 'success' : goal.status === 'cancelled' ? 'exception' : 'active'}
										strokeWidth={10}
										style={{ marginBottom: 12 }}
									/>

									<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
										<Text type='secondary'>Hiện tại:</Text>
										<InputNumber
											size='small'
											value={goal.currentValue}
											min={0}
											step={0.5}
											style={{ width: 100 }}
											onChange={(val) => val !== null && handleUpdateCurrent(goal.id, val)}
											disabled={goal.status !== 'in_progress'}
										/>
										<Text type='secondary'>/ {goal.targetValue} {goal.unit}</Text>
									</div>

									<Text type='secondary' style={{ fontSize: 12 }}>
										Deadline: {new Date(goal.deadline).toLocaleDateString('vi-VN')}
									</Text>
								</Card>
							</Col>
						);
					})}
				</Row>
			)}

			<Drawer
				title={null}
				visible={visibleDrawer}
				onClose={() => setVisibleDrawer(false)}
				width={480}
				destroyOnClose
				bodyStyle={{ padding: 0 }}
			>
				<FormMucTieu />
			</Drawer>
		</div>
	);
};

export default QuanLyMucTieu;

import { CarryOutOutlined, CheckCircleOutlined, ClockCircleOutlined, WarningOutlined } from '@ant-design/icons';
import { Card, Col, Row, Statistic, Tag, Timeline, Typography } from 'antd';
import { useMemo } from 'react';
import { useModel } from 'umi';

const { Title, Text } = Typography;

const PRIORITY_COLORS: Record<string, string> = { high: 'red', medium: 'orange', low: 'green' };
const PRIORITY_LABELS: Record<string, string> = { high: 'Cao', medium: 'Trung bình', low: 'Thấp' };
const STATUS_LABELS: Record<string, string> = { todo: 'Cần làm', in_progress: 'Đang làm', done: 'Hoàn thành' };

const Dashboard = () => {
	const { tasks } = useModel('kanban');

	const totalTasks = tasks.length;
	const completedTasks = useMemo(() => tasks.filter((t: Kanban.ITask) => t.status === 'done').length, [tasks]);
	const overdueTasks = useMemo(() => {
		const today = new Date().toISOString().split('T')[0];
		return tasks.filter((t: Kanban.ITask) => t.status !== 'done' && t.deadline < today).length;
	}, [tasks]);
	const inProgressTasks = useMemo(() => tasks.filter((t: Kanban.ITask) => t.status === 'in_progress').length, [tasks]);

	const recentTasks = useMemo(() => {
		return [...tasks]
			.sort((a: Kanban.ITask, b: Kanban.ITask) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
			.slice(0, 6);
	}, [tasks]);

	const tasksByPriority = useMemo(() => {
		return {
			high: tasks.filter((t: Kanban.ITask) => t.priority === 'high' && t.status !== 'done').length,
			medium: tasks.filter((t: Kanban.ITask) => t.priority === 'medium' && t.status !== 'done').length,
			low: tasks.filter((t: Kanban.ITask) => t.priority === 'low' && t.status !== 'done').length,
		};
	}, [tasks]);

	return (
		<div>
			<Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
				<Col xs={24} sm={12} lg={6}>
					<Card style={{ borderRadius: 12, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }} bodyStyle={{ padding: 20 }}>
						<Statistic
							title={<span style={{ color: 'rgba(255,255,255,0.85)' }}>Tổng số Task</span>}
							value={totalTasks}
							prefix={<CarryOutOutlined />}
							valueStyle={{ color: 'white', fontSize: 28, fontWeight: 700 }}
						/>
					</Card>
				</Col>
				<Col xs={24} sm={12} lg={6}>
					<Card style={{ borderRadius: 12, background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' }} bodyStyle={{ padding: 20 }}>
						<Statistic
							title={<span style={{ color: 'rgba(255,255,255,0.85)' }}>Hoàn thành</span>}
							value={completedTasks}
							prefix={<CheckCircleOutlined />}
							valueStyle={{ color: 'white', fontSize: 28, fontWeight: 700 }}
						/>
					</Card>
				</Col>
				<Col xs={24} sm={12} lg={6}>
					<Card style={{ borderRadius: 12, background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' }} bodyStyle={{ padding: 20 }}>
						<Statistic
							title={<span style={{ color: 'rgba(255,255,255,0.85)' }}>Quá hạn</span>}
							value={overdueTasks}
							prefix={<WarningOutlined />}
							valueStyle={{ color: 'white', fontSize: 28, fontWeight: 700 }}
						/>
					</Card>
				</Col>
				<Col xs={24} sm={12} lg={6}>
					<Card style={{ borderRadius: 12, background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }} bodyStyle={{ padding: 20 }}>
						<Statistic
							title={<span style={{ color: 'rgba(255,255,255,0.85)' }}>Đang thực hiện</span>}
							value={inProgressTasks}
							prefix={<ClockCircleOutlined />}
							valueStyle={{ color: 'white', fontSize: 28, fontWeight: 700 }}
						/>
					</Card>
				</Col>
			</Row>

			<Row gutter={[16, 16]}>
				<Col xs={24} lg={12}>
					<Card title={<Title level={4} style={{ margin: 0 }}>Task theo mức độ ưu tiên</Title>} style={{ borderRadius: 12, height: '100%' }}>
						<div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
							{(['high', 'medium', 'low'] as Kanban.Priority[]).map((p) => (
								<div key={p} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
									<Tag color={PRIORITY_COLORS[p]} style={{ minWidth: 90, textAlign: 'center', fontSize: 14, padding: '4px 12px' }}>
										{PRIORITY_LABELS[p]}
									</Tag>
									<div style={{ flex: 1, background: '#f0f0f0', borderRadius: 8, height: 24, overflow: 'hidden' }}>
										<div
											style={{
												width: `${totalTasks > 0 ? (tasksByPriority[p] / totalTasks) * 100 : 0}%`,
												height: '100%',
												background: PRIORITY_COLORS[p] === 'red' ? '#ff4d4f' : PRIORITY_COLORS[p] === 'orange' ? '#faad14' : '#52c41a',
												borderRadius: 8,
												transition: 'width 0.3s',
											}}
										/>
									</div>
									<Text strong style={{ minWidth: 30, textAlign: 'right' }}>{tasksByPriority[p]}</Text>
								</div>
							))}
						</div>
					</Card>
				</Col>
				<Col xs={24} lg={12}>
					<Card title={<Title level={4} style={{ margin: 0 }}>Task gần đây</Title>} style={{ borderRadius: 12, height: '100%' }}>
						<Timeline>
							{recentTasks.map((t: Kanban.ITask) => (
								<Timeline.Item
									key={t.id}
									color={t.status === 'done' ? 'green' : t.status === 'in_progress' ? 'blue' : 'gray'}
								>
									<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 4 }}>
										<div>
											<Text strong>{t.name}</Text>
											<Tag color={PRIORITY_COLORS[t.priority]} style={{ marginLeft: 8 }}>{PRIORITY_LABELS[t.priority]}</Tag>
											<Tag>{t.tag}</Tag>
										</div>
										<Text type='secondary' style={{ fontSize: 12 }}>
											{STATUS_LABELS[t.status]} | {new Date(t.deadline).toLocaleDateString('vi-VN')}
										</Text>
									</div>
								</Timeline.Item>
							))}
						</Timeline>
					</Card>
				</Col>
			</Row>
		</div>
	);
};

export default Dashboard;

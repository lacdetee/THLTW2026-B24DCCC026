import { CalendarOutlined, FireOutlined, ThunderboltOutlined, TrophyOutlined } from '@ant-design/icons';
import { Card, Col, Row, Statistic, Tag, Timeline, Typography } from 'antd';
import { type ApexOptions } from 'apexcharts';
import { useMemo } from 'react';
import Chart from 'react-apexcharts';
import { useModel } from 'umi';

const { Title, Text } = Typography;

const WORKOUT_TYPE_COLORS: Record<string, string> = {
	Cardio: 'blue',
	Strength: 'red',
	Yoga: 'green',
	HIIT: 'orange',
	Other: 'default',
};

const Dashboard = () => {
	const { workouts, healthMetrics, goals } = useModel('fitness');

	const currentMonth = useMemo(() => {
		const now = new Date();
		return { year: now.getFullYear(), month: now.getMonth() };
	}, []);

	const monthWorkouts = useMemo(() => {
		return workouts.filter((w: Fitness.IWorkout) => {
			const d = new Date(w.date);
			return d.getFullYear() === currentMonth.year && d.getMonth() === currentMonth.month && w.status === 'completed';
		});
	}, [workouts, currentMonth]);

	const totalCalories = useMemo(() => {
		return monthWorkouts.reduce((sum: number, w: Fitness.IWorkout) => sum + w.calories, 0);
	}, [monthWorkouts]);

	const streak = useMemo(() => {
		const completed = workouts
			.filter((w: Fitness.IWorkout) => w.status === 'completed')
			.map((w: Fitness.IWorkout) => w.date)
			.sort()
			.reverse();
		if (completed.length === 0) return 0;
		let count = 1;
		for (let i = 0; i < completed.length - 1; i++) {
			const curr = new Date(completed[i]);
			const prev = new Date(completed[i + 1]);
			const diff = (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24);
			if (diff <= 2) count++;
			else break;
		}
		return count;
	}, [workouts]);

	const goalPercent = useMemo(() => {
		if (goals.length === 0) return 0;
		const achieved = goals.filter((g: Fitness.IGoal) => g.status === 'achieved').length;
		return Math.round((achieved / goals.length) * 100);
	}, [goals]);

	const weeklyData = useMemo(() => {
		const weeks = ['Tuần 1', 'Tuần 2', 'Tuần 3', 'Tuần 4'];
		const counts = [0, 0, 0, 0];
		monthWorkouts.forEach((w: Fitness.IWorkout) => {
			const day = new Date(w.date).getDate();
			const weekIndex = Math.min(Math.floor((day - 1) / 7), 3);
			counts[weekIndex]++;
		});
		return { weeks, counts };
	}, [monthWorkouts]);

	const weightData = useMemo(() => {
		const sorted = [...healthMetrics].sort((a: Fitness.IHealthMetric, b: Fitness.IHealthMetric) =>
			new Date(a.date).getTime() - new Date(b.date).getTime()
		);
		return {
			dates: sorted.map((h: Fitness.IHealthMetric) => new Date(h.date).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })),
			weights: sorted.map((h: Fitness.IHealthMetric) => h.weight),
		};
	}, [healthMetrics]);

	const recentWorkouts = useMemo(() => {
		return [...workouts]
			.sort((a: Fitness.IWorkout, b: Fitness.IWorkout) => new Date(b.date).getTime() - new Date(a.date).getTime())
			.slice(0, 5);
	}, [workouts]);

	const barOptions: ApexOptions = {
		chart: { toolbar: { show: false } },
		xaxis: { categories: weeklyData.weeks },
		plotOptions: { bar: { borderRadius: 6, columnWidth: '50%' } },
		colors: ['#1890ff'],
		dataLabels: { enabled: true },
		yaxis: { labels: { formatter: (val: number) => `${val}` } },
	};

	const lineOptions: ApexOptions = {
		chart: { toolbar: { show: false } },
		xaxis: { categories: weightData.dates },
		stroke: { curve: 'smooth', width: 3 },
		colors: ['#52c41a'],
		markers: { size: 5 },
		yaxis: {
			labels: { formatter: (val: number) => `${val}kg` },
			min: Math.min(...weightData.weights) - 2,
			max: Math.max(...weightData.weights) + 2,
		},
	};

	const formatDate = (dateStr: string) => {
		return new Date(dateStr).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
	};

	return (
		<div>
			<Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
				<Col xs={24} sm={12} lg={6}>
					<Card style={{ borderRadius: 12, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }} bodyStyle={{ padding: 20 }}>
						<Statistic
							title={<span style={{ color: 'rgba(255,255,255,0.85)' }}>Buổi tập trong tháng</span>}
							value={monthWorkouts.length}
							prefix={<CalendarOutlined />}
							valueStyle={{ color: 'white', fontSize: 28, fontWeight: 700 }}
							suffix='buổi'
						/>
					</Card>
				</Col>
				<Col xs={24} sm={12} lg={6}>
					<Card style={{ borderRadius: 12, background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }} bodyStyle={{ padding: 20 }}>
						<Statistic
							title={<span style={{ color: 'rgba(255,255,255,0.85)' }}>Calo đã đốt</span>}
							value={totalCalories}
							prefix={<FireOutlined />}
							valueStyle={{ color: 'white', fontSize: 28, fontWeight: 700 }}
							suffix='kcal'
						/>
					</Card>
				</Col>
				<Col xs={24} sm={12} lg={6}>
					<Card style={{ borderRadius: 12, background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }} bodyStyle={{ padding: 20 }}>
						<Statistic
							title={<span style={{ color: 'rgba(255,255,255,0.85)' }}>Chuỗi ngày tập</span>}
							value={streak}
							prefix={<ThunderboltOutlined />}
							valueStyle={{ color: 'white', fontSize: 28, fontWeight: 700 }}
							suffix='ngày'
						/>
					</Card>
				</Col>
				<Col xs={24} sm={12} lg={6}>
					<Card style={{ borderRadius: 12, background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' }} bodyStyle={{ padding: 20 }}>
						<Statistic
							title={<span style={{ color: 'rgba(255,255,255,0.85)' }}>Mục tiêu hoàn thành</span>}
							value={goalPercent}
							prefix={<TrophyOutlined />}
							valueStyle={{ color: 'white', fontSize: 28, fontWeight: 700 }}
							suffix='%'
						/>
					</Card>
				</Col>
			</Row>

			<Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
				<Col xs={24} lg={12}>
					<Card title='Số buổi tập theo tuần' style={{ borderRadius: 12 }}>
						<Chart options={barOptions} series={[{ name: 'Buổi tập', data: weeklyData.counts }]} type='bar' height={280} />
					</Card>
				</Col>
				<Col xs={24} lg={12}>
					<Card title='Thay đổi cân nặng' style={{ borderRadius: 12 }}>
						{weightData.weights.length > 0 ? (
							<Chart options={lineOptions} series={[{ name: 'Cân nặng', data: weightData.weights }]} type='line' height={280} />
						) : (
							<div style={{ textAlign: 'center', padding: 60, color: '#999' }}>Chưa có dữ liệu</div>
						)}
					</Card>
				</Col>
			</Row>

			<Card title={<Title level={4} style={{ margin: 0 }}>5 buổi tập gần nhất</Title>} style={{ borderRadius: 12 }}>
				<Timeline>
					{recentWorkouts.map((w: Fitness.IWorkout) => (
						<Timeline.Item
							key={w.id}
							color={w.status === 'completed' ? 'green' : 'red'}
						>
							<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
								<div>
									<Text strong>{w.note || w.type}</Text>
									<Tag color={WORKOUT_TYPE_COLORS[w.type]} style={{ marginLeft: 8 }}>{w.type}</Tag>
									{w.status === 'missed' && <Tag color='red'>Bỏ lỡ</Tag>}
								</div>
								<div style={{ color: '#999', fontSize: 13 }}>
									<span>{formatDate(w.date)}</span>
									<span style={{ margin: '0 8px' }}>|</span>
									<span>{w.duration} phút</span>
									<span style={{ margin: '0 8px' }}>|</span>
									<span>{w.calories} kcal</span>
								</div>
							</div>
						</Timeline.Item>
					))}
				</Timeline>
			</Card>
		</div>
	);
};

export default Dashboard;

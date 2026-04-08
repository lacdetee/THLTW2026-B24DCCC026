import React, { useEffect } from 'react';
import { Card, Empty, Table, Tag } from 'antd';
import {
	EnvironmentOutlined,
	DollarOutlined,
	CalendarOutlined,
	RiseOutlined,
} from '@ant-design/icons';
import { useModel } from 'umi';
import Chart from 'react-apexcharts';

const formatVND = (val: number) => val.toLocaleString('vi-VN') + 'đ';

const TabThongKe: React.FC = () => {
	const {
		destinations,
		itineraries,
		loadDestinations,
		loadItineraries,
		getMonthlyStats,
		getPopularDestinations,
		getTotalRevenue,
		getRevenueByCat,
	} = useModel('travelModel');

	useEffect(() => {
		loadDestinations();
		loadItineraries();
	}, []);

	const monthlyStats = getMonthlyStats();
	const popularDest = getPopularDestinations();
	const totalRevenue = getTotalRevenue();
	const revByCat = getRevenueByCat();

	const totalDestUsed = new Set(
		itineraries.flatMap((i) => i.days.flatMap((d) => d.items.map((item) => item.destinationId))),
	).size;

	const avgCostPerTrip = itineraries.length > 0 ? Math.round(totalRevenue / itineraries.length) : 0;

	const barOptions: ApexCharts.ApexOptions = {
		chart: { type: 'bar', toolbar: { show: false }, animations: { enabled: true, speed: 800 } },
		xaxis: {
			categories: monthlyStats.map((m) => {
				const [y, mo] = m.month.split('-');
				return `T${mo}/${y}`;
			}),
		},
		colors: ['#667eea'],
		plotOptions: { bar: { borderRadius: 8, columnWidth: '50%' } },
		title: { text: '📅 Lịch trình tạo theo tháng', style: { fontSize: '16px', fontWeight: '800' } },
		grid: { borderColor: '#f0f0f0' },
	};
	const barSeries = [{ name: 'Số lịch trình', data: monthlyStats.map((m) => m.count) }];

	const pieOptions: ApexCharts.ApexOptions = {
		chart: { type: 'pie', animations: { enabled: true, speed: 800 } },
		labels: popularDest.slice(0, 8).map((d) => d.name),
		colors: ['#667eea', '#764ba2', '#fa8c16', '#52c41a', '#1890ff', '#f5576c', '#43e97b', '#4facfe'],
		legend: { position: 'bottom', fontSize: '13px' },
		title: { text: '📍 Điểm đến phổ biến', style: { fontSize: '16px', fontWeight: '800' } },
		stroke: { width: 2 },
	};
	const pieSeries = popularDest.slice(0, 8).map((d) => d.count);

	const revDonutOptions: ApexCharts.ApexOptions = {
		chart: { type: 'donut', animations: { enabled: true, speed: 800 } },
		labels: ['Ăn uống', 'Lưu trú', 'Di chuyển', 'Tham quan'],
		colors: ['#fa8c16', '#722ed1', '#1890ff', '#52c41a'],
		legend: { position: 'bottom', fontSize: '13px' },
		title: { text: '💰 Doanh thu theo hạng mục', style: { fontSize: '16px', fontWeight: '800' } },
		tooltip: { y: { formatter: (val: number) => formatVND(val) } },
		plotOptions: {
			pie: {
				donut: {
					size: '55%',
					labels: {
						show: true,
						total: {
							show: true,
							label: 'Tổng',
							fontSize: '14px',
							fontWeight: '700',
							formatter: () => formatVND(totalRevenue),
						},
					},
				},
			},
		},
		stroke: { width: 2 },
	};
	const revDonutSeries = [revByCat.food, revByCat.accommodation, revByCat.transport, revByCat.sightseeing];

	const lineOptions: ApexCharts.ApexOptions = {
		chart: { type: 'area', toolbar: { show: false }, animations: { enabled: true, speed: 800 } },
		xaxis: {
			categories: monthlyStats.map((m) => {
				const [y, mo] = m.month.split('-');
				return `T${mo}/${y}`;
			}),
		},
		colors: ['#764ba2'],
		stroke: { curve: 'smooth', width: 3 },
		fill: { type: 'gradient', gradient: { shadeIntensity: 1, opacityFrom: 0.5, opacityTo: 0.05 } },
		title: { text: '📈 Xu hướng hoạt động', style: { fontSize: '16px', fontWeight: '800' } },
		grid: { borderColor: '#f0f0f0' },
	};
	const lineSeries = [{ name: 'Lịch trình', data: monthlyStats.map((m) => m.count) }];

	const topDestColumns = [
		{
			title: '#',
			key: 'rank',
			width: 50,
			render: (_: any, __: any, idx: number) => (
				<span style={{ fontWeight: 800, color: idx < 3 ? '#fa8c16' : '#888' }}>
					{idx < 3 ? ['🥇', '🥈', '🥉'][idx] : idx + 1}
				</span>
			),
		},
		{
			title: 'Điểm đến',
			dataIndex: 'name',
			render: (name: string) => <span style={{ fontWeight: 700 }}>{name}</span>,
		},
		{
			title: 'Lượt chọn',
			dataIndex: 'count',
			render: (count: number) => (
				<Tag color='blue' style={{ borderRadius: 8, fontWeight: 700 }}>
					{count} lượt
				</Tag>
			),
		},
	];

	return (
		<div>
			{/* Stat cards */}
			<div className='stats-grid'>
				<div className='stats-card purple'>
					<CalendarOutlined style={{ fontSize: 28, color: '#667eea', marginBottom: 10 }} />
					<div className='stats-card-value'>{itineraries.length}</div>
					<div className='stats-card-label'>Tổng lịch trình</div>
				</div>
				<div className='stats-card blue'>
					<EnvironmentOutlined style={{ fontSize: 28, color: '#4facfe', marginBottom: 10 }} />
					<div className='stats-card-value'>{destinations.length}</div>
					<div className='stats-card-label'>Điểm đến ({totalDestUsed} đang sử dụng)</div>
				</div>
				<div className='stats-card green'>
					<DollarOutlined style={{ fontSize: 28, color: '#43e97b', marginBottom: 10 }} />
					<div className='stats-card-value'>{formatVND(totalRevenue)}</div>
					<div className='stats-card-label'>Tổng doanh thu dự kiến</div>
				</div>
				<div className='stats-card orange'>
					<RiseOutlined style={{ fontSize: 28, color: '#f5576c', marginBottom: 10 }} />
					<div className='stats-card-value'>{formatVND(avgCostPerTrip)}</div>
					<div className='stats-card-label'>Trung bình/lịch trình</div>
				</div>
			</div>

			{itineraries.length === 0 ? (
				<Card style={{ borderRadius: 16, textAlign: 'center', padding: 40 }}>
					<Empty description='Chưa có dữ liệu thống kê. Hãy tạo lịch trình trước!' />
				</Card>
			) : (
				<>
					<div className='budget-charts-row'>
						<div className='budget-chart-card'>
							<Chart options={barOptions} series={barSeries} type='bar' height={320} />
						</div>
						<div className='budget-chart-card'>
							<Chart options={pieOptions} series={pieSeries} type='pie' height={320} />
						</div>
					</div>
					<div className='budget-charts-row'>
						<div className='budget-chart-card'>
							<Chart options={revDonutOptions} series={revDonutSeries} type='donut' height={320} />
						</div>
						<div className='budget-chart-card'>
							<Chart options={lineOptions} series={lineSeries} type='area' height={320} />
						</div>
					</div>

					<div className='budget-detail-card' style={{ marginTop: 8 }}>
						<h3 style={{ padding: '20px 24px 0' }}>🏆 Bảng xếp hạng điểm đến phổ biến</h3>
						<Table
							dataSource={popularDest}
							columns={topDestColumns}
							rowKey='destinationId'
							pagination={false}
							size='middle'
							style={{ padding: '0 8px 16px' }}
						/>
					</div>
				</>
			)}
		</div>
	);
};

export default TabThongKe;

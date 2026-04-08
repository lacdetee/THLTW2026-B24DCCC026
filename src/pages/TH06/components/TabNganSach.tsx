import React, { useEffect, useState } from 'react';
import { Alert, Card, Select, Table, Progress, Empty, Tag } from 'antd';
import {
	DollarOutlined,
	CoffeeOutlined,
	CarOutlined,
	HomeOutlined,
	CameraOutlined,
	WarningOutlined,
	CheckCircleOutlined,
} from '@ant-design/icons';
import { useModel } from 'umi';
import Chart from 'react-apexcharts';

const { Option } = Select;

const formatVND = (val: number) => val.toLocaleString('vi-VN') + 'đ';

const catLabels: Record<string, string> = {
	food: 'Ăn uống',
	accommodation: 'Lưu trú',
	transport: 'Di chuyển',
	sightseeing: 'Tham quan',
};

const catIcons: Record<string, React.ReactNode> = {
	food: <CoffeeOutlined />,
	accommodation: <HomeOutlined />,
	transport: <CarOutlined />,
	sightseeing: <CameraOutlined />,
};

const catColors: Record<string, string> = {
	food: '#fa8c16',
	accommodation: '#722ed1',
	transport: '#1890ff',
	sightseeing: '#52c41a',
};

const TabNganSach: React.FC = () => {
	const { itineraries, loadDestinations, loadItineraries, calcItineraryCost } =
		useModel('travelModel');
	const [selectedId, setSelectedId] = useState<string | undefined>();

	useEffect(() => {
		loadDestinations();
		loadItineraries();
	}, []);

	useEffect(() => {
		if (itineraries.length > 0 && !selectedId) {
			setSelectedId(itineraries[0].id);
		}
	}, [itineraries]);

	const selected = itineraries.find((i) => i.id === selectedId);
	const cost = selected ? calcItineraryCost(selected) : null;
	const isOverBudget = selected && cost ? cost.total > selected.totalBudget : false;
	const budgetPercent = selected && cost && selected.totalBudget > 0
		? Math.round((cost.total / selected.totalBudget) * 100)
		: 0;
	const remaining = selected ? selected.totalBudget - (cost?.total || 0) : 0;

	const donutOptions: ApexCharts.ApexOptions = {
		chart: { type: 'donut', animations: { enabled: true, speed: 800, dynamicAnimation: { speed: 400 } } },
		labels: ['Ăn uống', 'Lưu trú', 'Di chuyển', 'Tham quan'],
		colors: ['#fa8c16', '#722ed1', '#1890ff', '#52c41a'],
		legend: { position: 'bottom', fontSize: '13px' },
		plotOptions: {
			pie: {
				donut: {
					size: '60%',
					labels: {
						show: true,
						total: {
							show: true,
							label: 'Tổng chi phí',
							fontSize: '14px',
							fontWeight: '700',
							formatter: () => formatVND(cost?.total || 0),
						},
					},
				},
			},
		},
		tooltip: { y: { formatter: (val: number) => formatVND(val) } },
		stroke: { width: 2 },
	};
	const donutSeries = cost ? [cost.food, cost.accommodation, cost.transport, cost.sightseeing] : [];

	const barOptions: ApexCharts.ApexOptions = {
		chart: { type: 'bar', toolbar: { show: false }, animations: { enabled: true, speed: 800 } },
		xaxis: { categories: ['Ăn uống', 'Lưu trú', 'Di chuyển', 'Tham quan'] },
		colors: ['#667eea'],
		plotOptions: { bar: { borderRadius: 8, columnWidth: '50%', distributed: true } },
		tooltip: { y: { formatter: (val: number) => formatVND(val) } },
		legend: { show: false },
	};
	const barSeries = [
		{
			name: 'Chi phí',
			data: cost
				? [
						{ x: 'Ăn uống', y: cost.food, fillColor: '#fa8c16' },
						{ x: 'Lưu trú', y: cost.accommodation, fillColor: '#722ed1' },
						{ x: 'Di chuyển', y: cost.transport, fillColor: '#1890ff' },
						{ x: 'Tham quan', y: cost.sightseeing, fillColor: '#52c41a' },
				  ]
				: [],
		},
	];

	const tableData = cost
		? Object.entries(cost)
				.filter(([key]) => key !== 'total')
				.map(([key, value]) => ({
					key,
					category: catLabels[key],
					icon: catIcons[key],
					amount: value,
					percent: cost.total > 0 ? Math.round((value / cost.total) * 100) : 0,
					color: catColors[key],
				}))
		: [];

	const columns = [
		{
			title: 'Hạng mục',
			key: 'category',
			render: (_: any, r: any) => (
				<span style={{ fontWeight: 600 }}>
					{r.icon} &nbsp;{r.category}
				</span>
			),
		},
		{
			title: 'Số tiền',
			dataIndex: 'amount',
			render: (v: number) => <b style={{ color: '#1a1a2e' }}>{formatVND(v)}</b>,
		},
		{
			title: 'Tỷ lệ',
			key: 'percent',
			render: (_: any, r: any) => (
				<div style={{ minWidth: 120 }}>
					<Progress percent={r.percent} strokeColor={r.color} size='small' />
				</div>
			),
		},
	];

	return (
		<div>
			{/* Chọn lịch trình */}
			<div style={{ marginBottom: 28, display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
				<span style={{ fontWeight: 700, fontSize: 15, color: '#333' }}>📋 Chọn lịch trình:</span>
				<Select
					style={{ minWidth: 280 }}
					value={selectedId}
					onChange={setSelectedId}
					placeholder='Chọn lịch trình'
					size='large'
				>
					{itineraries.map((itin) => (
						<Option key={itin.id} value={itin.id}>
							{itin.name} ({itin.days.length} ngày)
						</Option>
					))}
				</Select>
			</div>

			{!selected ? (
				<Card style={{ borderRadius: 16, textAlign: 'center', padding: 40 }}>
					<Empty description='Chưa có lịch trình nào. Hãy tạo lịch trình trước!' />
				</Card>
			) : (
				<>
					{isOverBudget && (
						<Alert
							message='⚠️ Cảnh báo vượt ngân sách!'
							description={
								<span>
									Chi phí dự kiến (<b>{formatVND(cost?.total || 0)}</b>) đã vượt ngân sách đặt ra (
									<b>{formatVND(selected.totalBudget)}</b>) là{' '}
									<b style={{ color: '#ff4d4f' }}>{formatVND((cost?.total || 0) - selected.totalBudget)}</b>.
								</span>
							}
							type='error'
							showIcon
							icon={<WarningOutlined />}
							style={{ marginBottom: 28, borderRadius: 16 }}
							closable
						/>
					)}

					{!isOverBudget && cost && cost.total > 0 && budgetPercent <= 80 && (
						<Alert
							message='✅ Ngân sách trong tầm kiểm soát'
							description={`Bạn vẫn còn ${formatVND(remaining)} trong ngân sách. Tuyệt vời!`}
							type='success'
							showIcon
							icon={<CheckCircleOutlined />}
							style={{ marginBottom: 28, borderRadius: 16 }}
							closable
						/>
					)}

					{/* Summary cards */}
					<div className='budget-summary-cards'>
						<div className='budget-stat-card'>
							<div className='budget-stat-icon'><DollarOutlined style={{ color: '#667eea' }} /></div>
							<div className='budget-stat-value'>{formatVND(cost?.total || 0)}</div>
							<div className='budget-stat-label'>Tổng chi phí dự kiến</div>
						</div>
						<div className='budget-stat-card'>
							<div className='budget-stat-icon'>💳</div>
							<div className='budget-stat-value'>{formatVND(selected.totalBudget)}</div>
							<div className='budget-stat-label'>Ngân sách đặt ra</div>
						</div>
						<div className='budget-stat-card'>
							<div className='budget-stat-icon'>{isOverBudget ? '🔴' : '🟢'}</div>
							<div className='budget-stat-value' style={{ color: isOverBudget ? '#ff4d4f' : '#52c41a' }}>
								{formatVND(Math.abs(remaining))}
							</div>
							<div className='budget-stat-label'>{isOverBudget ? 'Vượt ngân sách' : 'Còn lại'}</div>
						</div>
						<div className='budget-stat-card'>
							<div className='budget-stat-icon'>📊</div>
							<div className='budget-stat-value'>
								<Tag
									color={budgetPercent > 100 ? 'red' : budgetPercent > 80 ? 'orange' : 'green'}
									style={{ fontSize: 16, padding: '4px 12px', borderRadius: 8, fontWeight: 800 }}
								>
									{budgetPercent}%
								</Tag>
							</div>
							<div className='budget-stat-label'>Đã sử dụng</div>
						</div>
					</div>

					{/* Budget progress */}
					<div className='budget-progress-card'>
						<h3>📈 Tiến độ ngân sách</h3>
						<Progress
							percent={Math.min(budgetPercent, 100)}
							status={isOverBudget ? 'exception' : budgetPercent > 80 ? 'active' : 'normal'}
							strokeColor={isOverBudget ? '#ff4d4f' : { from: '#667eea', to: '#764ba2' }}
							strokeWidth={20}
							style={{ marginBottom: 10 }}
						/>
						<div style={{ display: 'flex', justifyContent: 'space-between', color: '#888', fontSize: 13, fontWeight: 600 }}>
							<span>0đ</span>
							<span style={{ color: budgetPercent > 80 ? '#fa8c16' : '#667eea', fontWeight: 700 }}>
								{budgetPercent}% sử dụng
							</span>
							<span>{formatVND(selected.totalBudget)}</span>
						</div>

						<div className='budget-cat-bars'>
							{cost && [
								{ key: 'food', label: 'Ăn uống', value: cost.food, icon: '🍜', cls: 'food' },
								{ key: 'accommodation', label: 'Lưu trú', value: cost.accommodation, icon: '🏨', cls: 'accommodation' },
								{ key: 'transport', label: 'Di chuyển', value: cost.transport, icon: '🚗', cls: 'transport' },
								{ key: 'sightseeing', label: 'Tham quan', value: cost.sightseeing, icon: '📸', cls: 'sightseeing' },
							].map((item) => (
								<div key={item.key} className='budget-cat-item'>
									<div className={`budget-cat-icon ${item.cls}`}>{item.icon}</div>
									<div className='budget-cat-info'>
										<div className='budget-cat-name'>{item.label}</div>
										<Progress
											percent={cost.total > 0 ? Math.round((item.value / cost.total) * 100) : 0}
											strokeColor={catColors[item.key]}
											size='small'
											showInfo={false}
										/>
									</div>
									<div className='budget-cat-amount'>{formatVND(item.value)}</div>
								</div>
							))}
						</div>
					</div>

					{/* Charts */}
					<div className='budget-charts-row'>
						<div className='budget-chart-card'>
							<h3>📊 Phân bổ chi phí</h3>
							{cost && cost.total > 0 ? (
								<Chart options={donutOptions} series={donutSeries} type='donut' height={320} />
							) : (
								<Empty description='Chưa có dữ liệu chi phí' />
							)}
						</div>
						<div className='budget-chart-card'>
							<h3>📈 Chi phí theo hạng mục</h3>
							{cost && cost.total > 0 ? (
								<Chart options={barOptions} series={barSeries} type='bar' height={320} />
							) : (
								<Empty description='Chưa có dữ liệu chi phí' />
							)}
						</div>
					</div>

					{/* Chi tiết bảng */}
					<div className='budget-detail-card'>
						<h3>📋 Chi tiết ngân sách</h3>
						<Table dataSource={tableData} columns={columns} pagination={false} size='middle' />
					</div>
				</>
			)}
		</div>
	);
};

export default TabNganSach;

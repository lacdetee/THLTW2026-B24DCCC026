import React, { useEffect, useState } from 'react';
import { Button, Card, Modal, Input, InputNumber, Select, message, Popconfirm, Empty, Tooltip, Badge } from 'antd';
import {
	PlusOutlined,
	DeleteOutlined,
	EnvironmentOutlined,
	ClockCircleOutlined,
	DollarOutlined,
	CarOutlined,
	ArrowUpOutlined,
	ArrowDownOutlined,
	CalendarOutlined,
} from '@ant-design/icons';
import { useModel } from 'umi';

const { Option } = Select;

const formatVND = (val: number) => val.toLocaleString('vi-VN') + 'đ';

const typeLabels: Record<string, string> = {
	beach: '🏖️ Biển',
	mountain: '⛰️ Núi',
	city: '🏙️ Thành phố',
};

const TabLichTrinh: React.FC = () => {
	const {
		destinations,
		itineraries,
		loadDestinations,
		loadItineraries,
		addItinerary,
		updateItinerary,
		deleteItinerary,
		calcItineraryCost,
		calcTotalDuration,
		calcTotalTravelTime,
		getTravelTimeBetween,
	} = useModel('travelModel');

	const [current, setCurrent] = useState<Travel.Itinerary | null>(null);
	const [showCreate, setShowCreate] = useState(false);
	const [newName, setNewName] = useState('');
	const [newBudget, setNewBudget] = useState<number>(5000000);
	const [addingToDay, setAddingToDay] = useState<number | null>(null);
	const [selectedDest, setSelectedDest] = useState<string | undefined>();

	useEffect(() => {
		loadDestinations();
		loadItineraries();
	}, []);

	useEffect(() => {
		if (current) {
			const updated = itineraries.find((i) => i.id === current.id);
			if (updated) setCurrent(updated);
		}
	}, [itineraries]);

	const handleCreate = () => {
		if (!newName.trim()) {
			message.warning('Vui lòng nhập tên lịch trình!');
			return;
		}
		const itin = addItinerary({
			name: newName,
			days: [{ dayNumber: 1, items: [] }],
			totalBudget: newBudget,
		});
		setCurrent(itin);
		setShowCreate(false);
		setNewName('');
		setNewBudget(5000000);
	};

	const addDay = () => {
		if (!current) return;
		const updated = {
			...current,
			days: [...current.days, { dayNumber: current.days.length + 1, items: [] }],
		};
		updateItinerary(updated);
		setCurrent(updated);
	};

	const removeDay = (dayIdx: number) => {
		if (!current) return;
		const days = current.days.filter((_, i) => i !== dayIdx).map((d, i) => ({ ...d, dayNumber: i + 1 }));
		const updated = { ...current, days };
		updateItinerary(updated);
		setCurrent(updated);
	};

	const addDestToDay = (dayIdx: number) => {
		if (!current || !selectedDest) return;
		const days = [...current.days];
		days[dayIdx] = {
			...days[dayIdx],
			items: [...days[dayIdx].items, { destinationId: selectedDest, order: days[dayIdx].items.length }],
		};
		const updated = { ...current, days };
		updateItinerary(updated);
		setCurrent(updated);
		setSelectedDest(undefined);
		setAddingToDay(null);
		message.success('Đã thêm điểm đến!');
	};

	const removeItemFromDay = (dayIdx: number, itemIdx: number) => {
		if (!current) return;
		const days = [...current.days];
		days[dayIdx] = {
			...days[dayIdx],
			items: days[dayIdx].items.filter((_, i) => i !== itemIdx).map((item, i) => ({ ...item, order: i })),
		};
		const updated = { ...current, days };
		updateItinerary(updated);
		setCurrent(updated);
	};

	const moveItem = (dayIdx: number, fromIdx: number, direction: 'up' | 'down') => {
		if (!current) return;
		const days = [...current.days];
		const items = [...days[dayIdx].items];
		const toIdx = direction === 'up' ? fromIdx - 1 : fromIdx + 1;
		if (toIdx < 0 || toIdx >= items.length) return;
		[items[fromIdx], items[toIdx]] = [items[toIdx], items[fromIdx]];
		items.forEach((it, i) => (it.order = i));
		days[dayIdx] = { ...days[dayIdx], items };
		const updated = { ...current, days };
		updateItinerary(updated);
		setCurrent(updated);
	};

	const getDestById = (id: string) => destinations.find((d) => d.id === id);

	const cost = current ? calcItineraryCost(current) : null;
	const duration = current ? calcTotalDuration(current) : 0;
	const travelTime = current ? calcTotalTravelTime(current) : 0;
	const isOverBudget = current && cost ? cost.total > current.totalBudget : false;

	const totalDestCount = current
		? current.days.reduce((sum, day) => sum + day.items.length, 0)
		: 0;

	return (
		<div>
			{/* Danh sách lịch trình */}
			<div className='itin-tag-list'>
				<Button
					type='primary'
					icon={<PlusOutlined />}
					onClick={() => setShowCreate(true)}
					style={{ borderRadius: 25, height: 40, fontWeight: 700, padding: '0 24px' }}
				>
					Tạo lịch trình mới
				</Button>
				{itineraries.map((itin) => (
					<div
						key={itin.id}
						className={`itin-tag ${current?.id === itin.id ? 'active' : ''}`}
						onClick={() => setCurrent(current?.id === itin.id ? null : itin)}
					>
						{itin.name}
					</div>
				))}
			</div>

			{current ? (
				<>
					{/* Summary bar */}
					<div className='itin-summary-bar'>
						<div className='itin-summary-item'>
							<div className='itin-summary-label'>Lịch trình</div>
							<div className='itin-summary-value'>{current.name}</div>
						</div>
						<div className='itin-summary-item'>
							<div className='itin-summary-label'>Số ngày</div>
							<div className='itin-summary-value'>
								<CalendarOutlined style={{ marginRight: 4, fontSize: 16 }} />
								{current.days.length}
							</div>
						</div>
						<div className='itin-summary-item'>
							<div className='itin-summary-label'>Điểm đến</div>
							<div className='itin-summary-value'>
								<EnvironmentOutlined style={{ marginRight: 4, fontSize: 16 }} />
								{totalDestCount}
							</div>
						</div>
						<div className='itin-summary-item'>
							<div className='itin-summary-label'>Tham quan</div>
							<div className='itin-summary-value'>
								<ClockCircleOutlined style={{ marginRight: 4, fontSize: 16 }} />
								{duration}h
							</div>
						</div>
						<div className='itin-summary-item'>
							<div className='itin-summary-label'>Di chuyển</div>
							<div className='itin-summary-value' style={{ color: '#667eea' }}>
								<CarOutlined style={{ marginRight: 4, fontSize: 16 }} />
								~{travelTime}h
							</div>
						</div>
						<div className='itin-summary-item'>
							<div className='itin-summary-label'>Tổng chi phí</div>
							<div className='itin-summary-value' style={{ color: isOverBudget ? '#ff4d4f' : '#52c41a' }}>
								<DollarOutlined style={{ marginRight: 4, fontSize: 16 }} />
								{formatVND(cost?.total || 0)}
							</div>
						</div>
						<div className='itin-summary-item'>
							<div className='itin-summary-label'>Ngân sách</div>
							<div className='itin-summary-value'>{formatVND(current.totalBudget)}</div>
						</div>
						<Popconfirm title='Xóa lịch trình này?' onConfirm={() => { deleteItinerary(current.id); setCurrent(null); }}>
							<Button danger size='small' icon={<DeleteOutlined />} style={{ borderRadius: 8 }}>Xóa</Button>
						</Popconfirm>
					</div>

					{/* Day cards */}
					<div className='itinerary-container'>
						<div className='itinerary-sidebar'>
							<h3>📍 Điểm đến có sẵn</h3>
							{destinations.map((d) => (
								<div key={d.id} className='sidebar-dest-item'>
									<img src={d.image} alt={d.name} loading='lazy' />
									<div className='sidebar-dest-info'>
										<div className='sidebar-dest-name'>{d.name}</div>
										<div className='sidebar-dest-loc'>
											<EnvironmentOutlined /> {d.location} · {typeLabels[d.type]}
										</div>
									</div>
								</div>
							))}
						</div>

						<div className='itinerary-main'>
							{current.days.map((day, dayIdx) => (
								<div key={dayIdx} className='itinerary-day-card' style={{ animationDelay: `${dayIdx * 0.1}s` }}>
									<div className='day-header'>
										<span>
											<CalendarOutlined style={{ marginRight: 8 }} />
											Ngày {day.dayNumber}
											{day.items.length > 0 && (
												<Badge
													count={day.items.length}
													style={{ marginLeft: 10, backgroundColor: 'rgba(255,255,255,0.3)' }}
												/>
											)}
										</span>
										<div style={{ display: 'flex', gap: 8 }}>
											<Button
												size='small'
												ghost
												onClick={() => setAddingToDay(addingToDay === dayIdx ? null : dayIdx)}
												icon={<PlusOutlined />}
												style={{ borderRadius: 8 }}
											>
												Thêm
											</Button>
											{current.days.length > 1 && (
												<Popconfirm title='Xóa ngày này?' onConfirm={() => removeDay(dayIdx)}>
													<Button size='small' ghost danger icon={<DeleteOutlined />} style={{ borderRadius: 8 }} />
												</Popconfirm>
											)}
										</div>
									</div>

									{addingToDay === dayIdx && (
										<div style={{ padding: 14, background: 'linear-gradient(135deg, #f6f8ff, #eef0ff)', display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
											<Select
												showSearch
												placeholder='🔍 Tìm và chọn điểm đến...'
												style={{ flex: 1, minWidth: 200 }}
												value={selectedDest}
												onChange={setSelectedDest}
												optionFilterProp='children'
											>
												{destinations.map((d) => (
													<Option key={d.id} value={d.id}>
														{d.name} ({d.location}) - {typeLabels[d.type]}
													</Option>
												))}
											</Select>
											<Button type='primary' onClick={() => addDestToDay(dayIdx)} style={{ borderRadius: 8 }}>
												Thêm vào ngày {day.dayNumber}
											</Button>
										</div>
									)}

									<div className='day-items'>
										{day.items.length === 0 ? (
											<div className='day-empty'>
												📭 Chưa có điểm đến. Nhấn "Thêm" để bắt đầu lên kế hoạch.
											</div>
										) : (
											day.items.map((item, itemIdx) => {
												const dest = getDestById(item.destinationId);
												if (!dest) return null;
												const itemCost = dest.costs.food + dest.costs.accommodation + dest.costs.transport + dest.costs.sightseeing;
												const nextItem = day.items[itemIdx + 1];
												const nextDest = nextItem ? getDestById(nextItem.destinationId) : null;
												const travelToNext = nextDest ? getTravelTimeBetween(item.destinationId, nextItem.destinationId) : 0;

												return (
													<React.Fragment key={itemIdx}>
														<div className='day-item'>
															<img src={dest.image} alt={dest.name} loading='lazy' />
															<div className='day-item-info'>
																<div className='day-item-name'>{dest.name}</div>
																<div className='day-item-meta'>
																	<span><ClockCircleOutlined /> {dest.visitDuration}h tham quan</span>
																	<span><DollarOutlined /> {formatVND(itemCost)}</span>
																	<span><EnvironmentOutlined /> {dest.location}</span>
																</div>
															</div>
															<div style={{ display: 'flex', gap: 4 }}>
																<Tooltip title='Di chuyển lên'>
																	<Button size='small' disabled={itemIdx === 0} onClick={() => moveItem(dayIdx, itemIdx, 'up')} icon={<ArrowUpOutlined />} style={{ borderRadius: 8 }} />
																</Tooltip>
																<Tooltip title='Di chuyển xuống'>
																	<Button size='small' disabled={itemIdx === day.items.length - 1} onClick={() => moveItem(dayIdx, itemIdx, 'down')} icon={<ArrowDownOutlined />} style={{ borderRadius: 8 }} />
																</Tooltip>
																<Popconfirm title='Xóa điểm đến này?' onConfirm={() => removeItemFromDay(dayIdx, itemIdx)}>
																	<Button size='small' danger icon={<DeleteOutlined />} style={{ borderRadius: 8 }} />
																</Popconfirm>
															</div>
														</div>
														{nextDest && travelToNext > 0 && (
															<div className='day-travel-time'>
																<CarOutlined /> Di chuyển ~{travelToNext}h đến {nextDest.name}
															</div>
														)}
													</React.Fragment>
												);
											})
										)}
									</div>
								</div>
							))}

							<Button
								type='dashed'
								block
								onClick={addDay}
								icon={<PlusOutlined />}
								style={{ borderRadius: 16, height: 48, fontWeight: 700, fontSize: 15 }}
							>
								+ Thêm ngày mới
							</Button>
						</div>
					</div>
				</>
			) : (
				<Card style={{ textAlign: 'center', borderRadius: 16, padding: 40 }}>
					<Empty
						description={
							<span style={{ fontSize: 16 }}>
								Chọn một lịch trình bên trên hoặc tạo mới để bắt đầu lên kế hoạch 🗺️
							</span>
						}
					/>
				</Card>
			)}

			{/* Modal tạo mới */}
			<Modal
				title='✨ Tạo lịch trình mới'
				visible={showCreate}
				onOk={handleCreate}
				onCancel={() => setShowCreate(false)}
				okText='Tạo lịch trình'
				cancelText='Hủy'
			>
				<div style={{ marginBottom: 20 }}>
					<label style={{ display: 'block', fontWeight: 700, marginBottom: 8, color: '#333' }}>Tên lịch trình</label>
					<Input
						placeholder='VD: Du lịch Đà Nẵng - Hội An 3 ngày'
						value={newName}
						onChange={(e) => setNewName(e.target.value)}
						style={{ borderRadius: 10 }}
						size='large'
					/>
				</div>
				<div>
					<label style={{ display: 'block', fontWeight: 700, marginBottom: 8, color: '#333' }}>Ngân sách dự kiến (VNĐ)</label>
					<InputNumber
						style={{ width: '100%', borderRadius: 10 }}
						size='large'
						min={0}
						step={1000000}
						value={newBudget}
						onChange={(v) => setNewBudget(v || 0)}
						formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
						parser={(v) => Number(v?.replace(/,/g, '') || 0)}
					/>
				</div>
			</Modal>
		</div>
	);
};

export default TabLichTrinh;

import React, { useEffect, useState, useMemo } from 'react';
import { Card, Col, Row, Select, Rate, Slider, Tag, Empty, Input, Tooltip } from 'antd';
import { EnvironmentOutlined, SearchOutlined, ClockCircleOutlined, StarFilled } from '@ant-design/icons';
import { useModel } from 'umi';

const { Option } = Select;

const typeLabels: Record<string, string> = {
	beach: '🏖️ Biển',
	mountain: '⛰️ Núi',
	city: '🏙️ Thành phố',
};

const formatVND = (val: number) => val.toLocaleString('vi-VN') + 'đ';

const TabKhamPha: React.FC = () => {
	const { destinations, loadDestinations } = useModel('travelModel');
	const [filterType, setFilterType] = useState<string>('all');
	const [filterRating, setFilterRating] = useState<number>(0);
	const [priceRange, setPriceRange] = useState<[number, number]>([0, 3000000]);
	const [sortBy, setSortBy] = useState<string>('rating');
	const [searchText, setSearchText] = useState('');

	useEffect(() => {
		loadDestinations();
	}, []);

	const totalCost = (d: Travel.Destination) =>
		d.costs.food + d.costs.accommodation + d.costs.transport + d.costs.sightseeing;

	const filtered = useMemo(
		() =>
			destinations
				.filter((d) => {
					if (filterType !== 'all' && d.type !== filterType) return false;
					if (d.rating < filterRating) return false;
					const cost = totalCost(d);
					if (cost < priceRange[0] || cost > priceRange[1]) return false;
					if (searchText && !d.name.toLowerCase().includes(searchText.toLowerCase()) && !d.location.toLowerCase().includes(searchText.toLowerCase()))
						return false;
					return true;
				})
				.sort((a, b) => {
					if (sortBy === 'rating') return b.rating - a.rating;
					if (sortBy === 'price-asc') return totalCost(a) - totalCost(b);
					if (sortBy === 'price-desc') return totalCost(b) - totalCost(a);
					if (sortBy === 'name') return a.name.localeCompare(b.name);
					return 0;
				}),
		[destinations, filterType, filterRating, priceRange, sortBy, searchText],
	);

	return (
		<div>
			{/* Filter Bar */}
			<div className='th6-filter-bar'>
				<div className='filter-item'>
					<span className='filter-label'>Tìm kiếm</span>
					<Input
						placeholder='Tên điểm đến hoặc địa điểm...'
						prefix={<SearchOutlined style={{ color: '#667eea' }} />}
						value={searchText}
						onChange={(e) => setSearchText(e.target.value)}
						allowClear
						style={{ borderRadius: 10 }}
					/>
				</div>
				<div className='filter-item'>
					<span className='filter-label'>Loại hình</span>
					<Select value={filterType} onChange={setFilterType} style={{ width: '100%' }}>
						<Option value='all'>🌐 Tất cả</Option>
						<Option value='beach'>🏖️ Biển đảo</Option>
						<Option value='mountain'>⛰️ Núi rừng</Option>
						<Option value='city'>🏙️ Thành phố</Option>
					</Select>
				</div>
				<div className='filter-item'>
					<span className='filter-label'>Đánh giá tối thiểu</span>
					<Rate
						allowHalf
						value={filterRating}
						onChange={setFilterRating}
						character={<StarFilled />}
					/>
				</div>
				<div className='filter-item' style={{ minWidth: 220 }}>
					<span className='filter-label'>Khoảng giá (VNĐ/ngày)</span>
					<Slider
						range
						min={0}
						max={3000000}
						step={100000}
						value={priceRange}
						onChange={(val: any) => setPriceRange(val)}
						tipFormatter={(val) => formatVND(val || 0)}
					/>
				</div>
				<div className='filter-item'>
					<span className='filter-label'>Sắp xếp</span>
					<Select value={sortBy} onChange={setSortBy} style={{ width: '100%' }}>
						<Option value='rating'>⭐ Đánh giá cao nhất</Option>
						<Option value='price-asc'>💰 Giá thấp → cao</Option>
						<Option value='price-desc'>💸 Giá cao → thấp</Option>
						<Option value='name'>🔤 Tên A → Z</Option>
					</Select>
				</div>
			</div>

			{/* Kết quả */}
			<div className='result-count'>
				Tìm thấy <b>{filtered.length}</b> điểm đến
			</div>

			{filtered.length === 0 ? (
				<Card style={{ borderRadius: 16, textAlign: 'center', padding: 40 }}>
					<Empty description='Không tìm thấy điểm đến phù hợp. Thử điều chỉnh bộ lọc.' />
				</Card>
			) : (
				<Row gutter={[20, 24]}>
					{filtered.map((dest) => (
						<Col xs={24} sm={12} md={8} lg={6} key={dest.id} className='dest-card-col'>
							<Card
								className='dest-card'
								hoverable
								cover={<img alt={dest.name} src={dest.image} loading='lazy' />}
							>
								<Tag className={`dest-card-type ${dest.type}`}>{typeLabels[dest.type]}</Tag>
								<div className='dest-card-name'>{dest.name}</div>
								<div className='dest-card-location'>
									<EnvironmentOutlined /> {dest.location}
								</div>
								<div className='dest-card-desc'>
									{dest.description.length > 70
										? dest.description.slice(0, 70) + '...'
										: dest.description}
								</div>
								<Tooltip title={`Thời gian tham quan: ${dest.visitDuration} giờ`}>
									<Tag icon={<ClockCircleOutlined />} color='default' style={{ marginBottom: 8, borderRadius: 8 }}>
										{dest.visitDuration}h tham quan
									</Tag>
								</Tooltip>
								<div className='dest-card-footer'>
									<Rate disabled value={dest.rating} allowHalf style={{ fontSize: 13 }} />
									<span className='dest-card-cost'>{formatVND(totalCost(dest))}</span>
								</div>
							</Card>
						</Col>
					))}
				</Row>
			)}
		</div>
	);
};

export default TabKhamPha;

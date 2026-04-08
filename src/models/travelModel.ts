import { useState, useCallback } from 'react';
import { message } from 'antd';

const DESTINATIONS_KEY = 'th6_destinations';
const ITINERARIES_KEY = 'th6_itineraries';

/** Dữ liệu mẫu điểm đến */
const sampleDestinations: Travel.Destination[] = [
	{
		id: '1',
		name: 'Vịnh Hạ Long',
		type: 'beach',
		image: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=400&h=300&fit=crop',
		rating: 4.8,
		description: 'Di sản thiên nhiên thế giới được UNESCO công nhận với hàng nghìn đảo đá vôi nổi trên mặt nước xanh ngọc bích. Nơi đây có hang động đẹp, làng chài yên bình và cảnh hoàng hôn tuyệt mỹ.',
		visitDuration: 8,
		costs: { food: 300000, accommodation: 800000, transport: 500000, sightseeing: 250000 },
		location: 'Quảng Ninh',
		createdAt: '2024-01-01',
		travelTimeFromCenter: 4,
	},
	{
		id: '2',
		name: 'Phố cổ Hội An',
		type: 'city',
		image: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=400&h=300&fit=crop',
		rating: 4.7,
		description: 'Phố cổ được UNESCO công nhận với kiến trúc cổ kính, đèn lồng rực rỡ và ẩm thực đặc sắc. Về đêm, phố cổ lung linh ánh đèn lồng phản chiếu trên sông Thu Bồn.',
		visitDuration: 6,
		costs: { food: 200000, accommodation: 500000, transport: 100000, sightseeing: 150000 },
		location: 'Quảng Nam',
		createdAt: '2024-01-02',
		travelTimeFromCenter: 1,
	},
	{
		id: '3',
		name: 'Sapa',
		type: 'mountain',
		image: 'https://images.unsplash.com/photo-1570366583862-f91883984fde?w=400&h=300&fit=crop',
		rating: 4.6,
		description: 'Thị trấn trong mây với ruộng bậc thang tuyệt đẹp và văn hóa dân tộc đa dạng. Trek qua các bản làng người Hmong, Dao và chinh phục đỉnh Fansipan.',
		visitDuration: 10,
		costs: { food: 250000, accommodation: 600000, transport: 400000, sightseeing: 200000 },
		location: 'Lào Cai',
		createdAt: '2024-01-03',
		travelTimeFromCenter: 5,
	},
	{
		id: '4',
		name: 'Đà Lạt',
		type: 'mountain',
		image: 'https://images.unsplash.com/photo-1555217851-6141535bd771?w=400&h=300&fit=crop',
		rating: 4.5,
		description: 'Thành phố ngàn hoa với khí hậu mát mẻ quanh năm, kiến trúc Pháp cổ điển và vô số quán cafe view đẹp. Thiên đường cho những tâm hồn yêu thiên nhiên.',
		visitDuration: 6,
		costs: { food: 200000, accommodation: 450000, transport: 300000, sightseeing: 150000 },
		location: 'Lâm Đồng',
		createdAt: '2024-01-04',
		travelTimeFromCenter: 1.5,
	},
	{
		id: '5',
		name: 'Phú Quốc',
		type: 'beach',
		image: 'https://images.unsplash.com/photo-1540202403-b7abd6747a18?w=400&h=300&fit=crop',
		rating: 4.4,
		description: 'Đảo ngọc với bãi biển hoang sơ, nước trong vắt và resort sang trọng. Trải nghiệm lặn biển ngắm san hô, câu mực đêm và thưởng thức hải sản tươi sống.',
		visitDuration: 8,
		costs: { food: 350000, accommodation: 1000000, transport: 600000, sightseeing: 300000 },
		location: 'Kiên Giang',
		createdAt: '2024-01-05',
		travelTimeFromCenter: 1,
	},
	{
		id: '6',
		name: 'Huế',
		type: 'city',
		image: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=400&h=300&fit=crop',
		rating: 4.3,
		description: 'Cố đô triều Nguyễn với Đại Nội uy nghiêm, lăng tẩm các vua và ẩm thực cung đình nổi tiếng. Sông Hương thơ mộng chảy qua lòng thành phố.',
		visitDuration: 7,
		costs: { food: 180000, accommodation: 400000, transport: 200000, sightseeing: 200000 },
		location: 'Thừa Thiên Huế',
		createdAt: '2024-01-06',
		travelTimeFromCenter: 2,
	},
	{
		id: '7',
		name: 'Nha Trang',
		type: 'beach',
		image: 'https://images.unsplash.com/photo-1573790387438-4da905039392?w=400&h=300&fit=crop',
		rating: 4.3,
		description: 'Thành phố biển sôi động với bãi tắm dài tuyệt đẹp, đảo Vinpearl và tháp Bà Ponagar cổ kính. Thiên đường của các hoạt động thể thao biển.',
		visitDuration: 6,
		costs: { food: 250000, accommodation: 700000, transport: 350000, sightseeing: 250000 },
		location: 'Khánh Hòa',
		createdAt: '2024-01-07',
		travelTimeFromCenter: 1,
	},
	{
		id: '8',
		name: 'Hà Giang',
		type: 'mountain',
		image: 'https://images.unsplash.com/photo-1583417267826-aebc4d1542e1?w=400&h=300&fit=crop',
		rating: 4.7,
		description: 'Cao nguyên đá hùng vĩ với đèo Mã Pí Lèng ngoạn mục, cung đường phượt đẹp nhất Việt Nam. Hoa tam giác mạch nở tím cả vùng trời mỗi dịp thu về.',
		visitDuration: 12,
		costs: { food: 200000, accommodation: 350000, transport: 500000, sightseeing: 100000 },
		location: 'Hà Giang',
		createdAt: '2024-01-08',
		travelTimeFromCenter: 6,
	},
	{
		id: '9',
		name: 'Đà Nẵng',
		type: 'city',
		image: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=400&h=300&fit=crop',
		rating: 4.5,
		description: 'Thành phố đáng sống nhất Việt Nam với cầu Rồng phun lửa, bán đảo Sơn Trà hoang sơ và Bà Nà Hills kỳ ảo trong mây.',
		visitDuration: 5,
		costs: { food: 220000, accommodation: 550000, transport: 150000, sightseeing: 200000 },
		location: 'Đà Nẵng',
		createdAt: '2024-01-09',
		travelTimeFromCenter: 1,
	},
	{
		id: '10',
		name: 'Mũi Né',
		type: 'beach',
		image: 'https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?w=400&h=300&fit=crop',
		rating: 4.2,
		description: 'Thiên đường đồi cát với bãi biển dài và gió biển lý tưởng cho lướt ván. Suối Tiên, đồi cát bay và làng chài đầy sắc màu.',
		visitDuration: 5,
		costs: { food: 200000, accommodation: 500000, transport: 250000, sightseeing: 100000 },
		location: 'Bình Thuận',
		createdAt: '2024-01-10',
		travelTimeFromCenter: 1.5,
	},
];

/** Dữ liệu mẫu lịch trình */
const sampleItineraries: Travel.Itinerary[] = [
	{
		id: 'it1',
		name: 'Du lịch Miền Bắc 3 ngày',
		days: [
			{ dayNumber: 1, items: [{ destinationId: '1', order: 0 }] },
			{ dayNumber: 2, items: [{ destinationId: '3', order: 0 }] },
			{ dayNumber: 3, items: [{ destinationId: '8', order: 0 }] },
		],
		totalBudget: 10000000,
		createdAt: '2024-06-15',
		updatedAt: '2024-06-15',
	},
	{
		id: 'it2',
		name: 'Khám phá Miền Trung',
		days: [
			{ dayNumber: 1, items: [{ destinationId: '6', order: 0 }] },
			{ dayNumber: 2, items: [{ destinationId: '2', order: 0 }, { destinationId: '7', order: 1 }] },
		],
		totalBudget: 8000000,
		createdAt: '2024-07-20',
		updatedAt: '2024-07-20',
	},
	{
		id: 'it3',
		name: 'Nghỉ dưỡng biển đảo',
		days: [
			{ dayNumber: 1, items: [{ destinationId: '5', order: 0 }] },
			{ dayNumber: 2, items: [{ destinationId: '5', order: 0 }, { destinationId: '7', order: 1 }] },
		],
		totalBudget: 15000000,
		createdAt: '2024-08-10',
		updatedAt: '2024-08-10',
	},
	{
		id: 'it4',
		name: 'Tour Tây Bắc mạo hiểm',
		days: [
			{ dayNumber: 1, items: [{ destinationId: '3', order: 0 }] },
			{ dayNumber: 2, items: [{ destinationId: '8', order: 0 }] },
			{ dayNumber: 3, items: [{ destinationId: '3', order: 0 }, { destinationId: '8', order: 1 }] },
		],
		totalBudget: 7000000,
		createdAt: '2024-09-05',
		updatedAt: '2024-09-05',
	},
	{
		id: 'it5',
		name: 'Đà Lạt - Nha Trang',
		days: [
			{ dayNumber: 1, items: [{ destinationId: '4', order: 0 }] },
			{ dayNumber: 2, items: [{ destinationId: '7', order: 0 }] },
		],
		totalBudget: 6000000,
		createdAt: '2025-01-12',
		updatedAt: '2025-01-12',
	},
	{
		id: 'it6',
		name: 'Vòng quanh miền biển',
		days: [
			{ dayNumber: 1, items: [{ destinationId: '7', order: 0 }] },
			{ dayNumber: 2, items: [{ destinationId: '10', order: 0 }] },
			{ dayNumber: 3, items: [{ destinationId: '5', order: 0 }] },
		],
		totalBudget: 12000000,
		createdAt: '2025-02-18',
		updatedAt: '2025-02-18',
	},
	{
		id: 'it7',
		name: 'City Tour 2 ngày',
		days: [
			{ dayNumber: 1, items: [{ destinationId: '9', order: 0 }, { destinationId: '2', order: 1 }] },
			{ dayNumber: 2, items: [{ destinationId: '6', order: 0 }] },
		],
		totalBudget: 5000000,
		createdAt: '2025-03-25',
		updatedAt: '2025-03-25',
	},
];

/** Tính thời gian di chuyển ước lượng giữa 2 điểm đến (giờ) */
const estimateTravelTime = (from: Travel.Destination, to: Travel.Destination): number => {
	if (from.id === to.id) return 0;
	// Sử dụng tổng thời gian di chuyển từ trung tâm để ước lượng
	const base = Math.abs((from.travelTimeFromCenter || 2) - (to.travelTimeFromCenter || 2));
	const sameRegion = from.type === to.type ? 0.5 : 1;
	return Math.max(1, Math.round((base + sameRegion) * 10) / 10);
};

export default () => {
	const [destinations, setDestinations] = useState<Travel.Destination[]>([]);
	const [itineraries, setItineraries] = useState<Travel.Itinerary[]>([]);
	const [loading, setLoading] = useState(false);

	// ===== Load data =====
	const loadDestinations = useCallback(() => {
		const raw = localStorage.getItem(DESTINATIONS_KEY);
		if (raw) {
			setDestinations(JSON.parse(raw));
		} else {
			localStorage.setItem(DESTINATIONS_KEY, JSON.stringify(sampleDestinations));
			setDestinations(sampleDestinations);
		}
	}, []);

	const loadItineraries = useCallback(() => {
		const raw = localStorage.getItem(ITINERARIES_KEY);
		if (raw) {
			setItineraries(JSON.parse(raw));
		} else {
			localStorage.setItem(ITINERARIES_KEY, JSON.stringify(sampleItineraries));
			setItineraries(sampleItineraries);
		}
	}, []);

	// ===== Destination CRUD =====
	const saveDestinations = (list: Travel.Destination[]) => {
		localStorage.setItem(DESTINATIONS_KEY, JSON.stringify(list));
		setDestinations(list);
	};

	const addDestination = (dest: Omit<Travel.Destination, 'id' | 'createdAt'>) => {
		const newDest: Travel.Destination = {
			...dest,
			id: Date.now().toString(),
			createdAt: new Date().toISOString().slice(0, 10),
		};
		const updated = [...destinations, newDest];
		saveDestinations(updated);
		message.success('Thêm điểm đến thành công!');
	};

	const updateDestination = (dest: Travel.Destination) => {
		const updated = destinations.map((d) => (d.id === dest.id ? dest : d));
		saveDestinations(updated);
		message.success('Cập nhật điểm đến thành công!');
	};

	const deleteDestination = (id: string) => {
		const updated = destinations.filter((d) => d.id !== id);
		saveDestinations(updated);
		message.success('Xóa điểm đến thành công!');
	};

	// ===== Itinerary CRUD =====
	const saveItineraries = (list: Travel.Itinerary[]) => {
		localStorage.setItem(ITINERARIES_KEY, JSON.stringify(list));
		setItineraries(list);
	};

	const addItinerary = (itin: Omit<Travel.Itinerary, 'id' | 'createdAt' | 'updatedAt'>) => {
		const now = new Date().toISOString().slice(0, 10);
		const newItin: Travel.Itinerary = {
			...itin,
			id: Date.now().toString(),
			createdAt: now,
			updatedAt: now,
		};
		const updated = [...itineraries, newItin];
		saveItineraries(updated);
		message.success('Tạo lịch trình thành công!');
		return newItin;
	};

	const updateItinerary = (itin: Travel.Itinerary) => {
		itin.updatedAt = new Date().toISOString().slice(0, 10);
		const updated = itineraries.map((i) => (i.id === itin.id ? itin : i));
		saveItineraries(updated);
	};

	const deleteItinerary = (id: string) => {
		const updated = itineraries.filter((i) => i.id !== id);
		saveItineraries(updated);
		message.success('Xóa lịch trình thành công!');
	};

	// ===== Tính toán =====
	const calcItineraryCost = (itin: Travel.Itinerary) => {
		let food = 0, accommodation = 0, transport = 0, sightseeing = 0;
		itin.days.forEach((day) => {
			day.items.forEach((item) => {
				const dest = destinations.find((d) => d.id === item.destinationId);
				if (dest) {
					food += dest.costs.food;
					accommodation += dest.costs.accommodation;
					transport += dest.costs.transport;
					sightseeing += dest.costs.sightseeing;
				}
			});
		});
		return { food, accommodation, transport, sightseeing, total: food + accommodation + transport + sightseeing };
	};

	const calcTotalDuration = (itin: Travel.Itinerary) => {
		let total = 0;
		itin.days.forEach((day) => {
			day.items.forEach((item) => {
				const dest = destinations.find((d) => d.id === item.destinationId);
				if (dest) total += dest.visitDuration;
			});
		});
		return total;
	};

	/** Tính thời gian di chuyển giữa các điểm trong một ngày */
	const calcDayTravelTime = (day: Travel.ItineraryDay) => {
		let totalTravel = 0;
		for (let i = 0; i < day.items.length - 1; i++) {
			const from = destinations.find((d) => d.id === day.items[i].destinationId);
			const to = destinations.find((d) => d.id === day.items[i + 1].destinationId);
			if (from && to) {
				totalTravel += estimateTravelTime(from, to);
			}
		}
		return totalTravel;
	};

	/** Tính tổng thời gian di chuyển cho cả lịch trình */
	const calcTotalTravelTime = (itin: Travel.Itinerary) => {
		let total = 0;
		itin.days.forEach((day) => {
			total += calcDayTravelTime(day);
		});
		return total;
	};

	/** Lấy thời gian di chuyển giữa 2 điểm cụ thể */
	const getTravelTimeBetween = (fromId: string, toId: string) => {
		const from = destinations.find((d) => d.id === fromId);
		const to = destinations.find((d) => d.id === toId);
		if (from && to) return estimateTravelTime(from, to);
		return 0;
	};

	// ===== Thống kê =====
	const getMonthlyStats = (): Travel.MonthlyStats[] => {
		const map: Record<string, number> = {};
		itineraries.forEach((itin) => {
			const month = itin.createdAt.slice(0, 7);
			map[month] = (map[month] || 0) + 1;
		});
		return Object.entries(map)
			.map(([month, count]) => ({ month, count }))
			.sort((a, b) => a.month.localeCompare(b.month));
	};

	const getPopularDestinations = (): Travel.PopularDestination[] => {
		const map: Record<string, number> = {};
		itineraries.forEach((itin) => {
			itin.days.forEach((day) => {
				day.items.forEach((item) => {
					map[item.destinationId] = (map[item.destinationId] || 0) + 1;
				});
			});
		});
		return Object.entries(map)
			.map(([destinationId, count]) => {
				const dest = destinations.find((d) => d.id === destinationId);
				return { destinationId, name: dest?.name || 'Không xác định', count };
			})
			.sort((a, b) => b.count - a.count);
	};

	const getTotalRevenue = () => {
		let total = 0;
		itineraries.forEach((itin) => {
			const cost = calcItineraryCost(itin);
			total += cost.total;
		});
		return total;
	};

	const getRevenueByCat = () => {
		let food = 0, accommodation = 0, transport = 0, sightseeing = 0;
		itineraries.forEach((itin) => {
			const cost = calcItineraryCost(itin);
			food += cost.food;
			accommodation += cost.accommodation;
			transport += cost.transport;
			sightseeing += cost.sightseeing;
		});
		return { food, accommodation, transport, sightseeing };
	};

	return {
		destinations,
		itineraries,
		loading,
		setLoading,
		loadDestinations,
		loadItineraries,
		addDestination,
		updateDestination,
		deleteDestination,
		addItinerary,
		updateItinerary,
		deleteItinerary,
		calcItineraryCost,
		calcTotalDuration,
		calcDayTravelTime,
		calcTotalTravelTime,
		getTravelTimeBetween,
		getMonthlyStats,
		getPopularDestinations,
		getTotalRevenue,
		getRevenueByCat,
	};
};

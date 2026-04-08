export interface CostBreakdown {
	food: number;
	accommodation: number;
	transport: number;
	sightseeing: number;
}

export interface Destination {
	id: string;
	name: string;
	type: 'beach' | 'mountain' | 'city';
	image: string;
	rating: number;
	description: string;
	visitDuration: number;
	location: string;
	travelTimeFromCenter: number;
	costs: CostBreakdown;
}

export interface ItineraryItem {
	destinationId: string;
	order: number;
}

export interface ItineraryDay {
	dayNumber: number;
	items: ItineraryItem[];
}

export interface Itinerary {
	id: string;
	name: string;
	days: ItineraryDay[];
	totalBudget: number;
	createdAt: string;
}

export interface ItineraryCostResult {
	food: number;
	accommodation: number;
	transport: number;
	sightseeing: number;
	total: number;
}

export interface TripRequest {
  from: string;
  destination: string;
  budget: number;
  days: number;
  people: number;
  travelType: 'Solo' | 'Couple' | 'Family' | 'Friends' | 'Business';
}

export interface Activity {
  time: string;
  title: string;
  description: string;
  cost: number;
  location: string;
}

export interface ItineraryDay {
  dayNumber: number;
  theme: string;
  activities: Activity[];
}

export interface Hotel {
  name: string;
  rating: number;
  pricePerNight: number;
  description: string;
  address: string;
  tags: string[];
}

export interface Restaurant {
  name: string;
  rating: number;
  priceLevel: '₹' | '₹₹' | '₹₹₹' | '₹₹₹₹';
  cuisine: string;
  description: string;
  address: string;
}

export interface WeatherDay {
  day: string;
  temp: number;
  condition: string;
}

export interface WeatherInfo {
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  forecast: WeatherDay[];
}

export interface BudgetBreakdown {
  accommodation: number;
  food: number;
  activities: number;
  transport: number;
  miscellaneous: number;
  total: number;
}

export interface TripPlan {
  id: string;
  userId: string;
  request: TripRequest;
  destinationDetails: string;
  itinerary: ItineraryDay[];
  hotels: Hotel[];
  restaurants: Restaurant[];
  weather: WeatherInfo;
  budgetBreakdown: BudgetBreakdown;
  createdAt: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  fullName: string;
  preferences?: string;
  homeCity?: string;
  avatarUrl?: string;
}

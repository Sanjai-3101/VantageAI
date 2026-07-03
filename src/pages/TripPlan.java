package src.pages;

import java.util.List;

/**
 * Java model equivalent to TripPlan and nested interfaces in types.ts.
 */
public class TripPlan {
    public String id;
    public String userId;
    public TripRequest request;
    public String destinationDetails;
    public List<ItineraryDay> itinerary;
    public List<Hotel> hotels;
    public List<Restaurant> restaurants;
    public WeatherInfo weather;
    public BudgetBreakdown budgetBreakdown;
    public String createdAt;

    public static class TripRequest {
        public String from;
        public String destination;
        public double budget;
        public int days;
        public int people;
        public String travelType; // 'Solo' | 'Couple' | 'Family' | 'Friends' | 'Business'
    }

    public static class Activity {
        public String time;
        public String title;
        public String description;
        public double cost;
        public String location;
    }

    public static class ItineraryDay {
        public int dayNumber;
        public String theme;
        public List<Activity> activities;
    }

    public static class Hotel {
        public String name;
        public double rating;
        public double pricePerNight;
        public String description;
        public String address;
        public List<String> tags;
    }

    public static class Restaurant {
        public String name;
        public double rating;
        public String priceLevel; // '₹' | '₹₹' | '₹₹₹' | '₹₹₹₹'
        public String cuisine;
        public String description;
        public String address;
    }

    public static class WeatherDay {
        public String day;
        public double temp;
        public String condition;
    }

    public static class WeatherInfo {
        public double temperature;
        public String condition;
        public double humidity;
        public double windSpeed;
        public List<WeatherDay> forecast;
    }

    public static class BudgetBreakdown {
        public double accommodation;
        public double food;
        public double activities;
        public double transport;
        public double miscellaneous;
        public double total;
    }
}

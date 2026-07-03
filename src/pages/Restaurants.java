package src.pages;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CompletableFuture;

/**
 * Java translation of Restaurants.tsx.
 * Provides fine-dining recommendations across multiple global locations.
 */
public class Restaurants {
    private String destination = "";
    private String cuisine = "";
    private List<TripPlan.Restaurant> restaurants = new ArrayList<>();
    private boolean isLoading = false;
    private String error = null;

    private final HttpClient httpClient;

    public Restaurants() {
        this.httpClient = HttpClient.newBuilder().build();
    }

    public String getDestination() { return destination; }
    public void setDestination(String destination) { this.destination = destination; }

    public String getCuisine() { return cuisine; }
    public void setCuisine(String cuisine) { this.cuisine = cuisine; }

    public List<TripPlan.Restaurant> getRestaurants() { return restaurants; }
    public boolean isLoading() { return isLoading; }
    public String getError() { return error; }

    public CompletableFuture<Void> handleSearch() {
        if (destination.isEmpty()) {
            this.error = "Please specify a destination.";
            return CompletableFuture.completedFuture(null);
        }

        this.isLoading = true;
        this.error = null;
        this.restaurants.clear();

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create("/api/restaurants?destination=" + destination + "&cuisine=" + cuisine))
                .GET()
                .build();

        return httpClient.sendAsync(request, HttpResponse.BodyHandlers.ofString())
                .thenAccept(response -> {
                    this.isLoading = false;
                    if (response.statusCode() == 200) {
                        this.restaurants = parseRestaurantsList(response.body());
                    } else {
                        this.error = "Could not discover any culinary options.";
                    }
                })
                .exceptionally(ex -> {
                    this.isLoading = false;
                    this.error = "Failed to query dining records: " + ex.getMessage();
                    return null;
                });
    }

    private List<TripPlan.Restaurant> parseRestaurantsList(String json) {
        return new ArrayList<>();
    }
}

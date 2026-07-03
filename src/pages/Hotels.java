package src.pages;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CompletableFuture;

/**
 * Java translation of Hotels.tsx.
 * Queries elite accommodation providers corresponding to a specified budget tier.
 */
public class Hotels {
    private String destination = "";
    private String budgetTier = "Moderate"; // Budget, Moderate, Luxury
    private List<TripPlan.Hotel> hotels = new ArrayList<>();
    private boolean isLoading = false;
    private String error = null;

    private final HttpClient httpClient;

    public Hotels() {
        this.httpClient = HttpClient.newBuilder().build();
    }

    public String getDestination() { return destination; }
    public void setDestination(String destination) { this.destination = destination; }

    public String getBudgetTier() { return budgetTier; }
    public void setBudgetTier(String budgetTier) { this.budgetTier = budgetTier; }

    public List<TripPlan.Hotel> getHotels() { return hotels; }
    public boolean isLoading() { return isLoading; }
    public String getError() { return error; }

    public CompletableFuture<Void> handleSearch() {
        if (destination.isEmpty()) {
            this.error = "Please enter a destination to find hotels.";
            return CompletableFuture.completedFuture(null);
        }

        this.isLoading = true;
        this.error = null;
        this.hotels.clear();

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create("/api/hotels?destination=" + destination + "&budgetTier=" + budgetTier))
                .GET()
                .build();

        return httpClient.sendAsync(request, HttpResponse.BodyHandlers.ofString())
                .thenAccept(response -> {
                    this.isLoading = false;
                    if (response.statusCode() == 200) {
                        this.hotels = parseHotelsList(response.body());
                    } else {
                        this.error = "No hotels found matching your search.";
                    }
                })
                .exceptionally(ex -> {
                    this.isLoading = false;
                    this.error = "Error querying hotel directory: " + ex.getMessage();
                    return null;
                });
    }

    private List<TripPlan.Hotel> parseHotelsList(String json) {
        // Mock list mapping
        return new ArrayList<>();
    }
}

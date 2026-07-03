package src.pages;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.concurrent.CompletableFuture;

/**
 * Java translation of Planner.tsx.
 * Provides the interactive inputs (budget in INR, days, travelers) and connects
 * with the Gemini endpoint to orchestrate tailored luxury itineraries.
 */
public class Planner {
    private final UserProfile user;
    private final NavigationManager navigationManager;
    private final HttpClient httpClient;

    // Input States
    private String from = "";
    private String destination = "";
    private String budget = "150000"; // Default budget in INR
    private int days = 5;
    private int people = 2;
    private String travelType = "Couple"; // Solo, Couple, Family, Friends, Business
    
    // Status States
    private boolean isLoading = false;
    private String error = null;
    private TripPlan generatedTrip = null;

    public interface NavigationManager {
        void setCurrentPage(String page);
        void onTripSaved();
    }

    public Planner(UserProfile user, NavigationManager navigationManager) {
        this.user = user;
        this.navigationManager = navigationManager;
        this.httpClient = HttpClient.newBuilder().build();
    }

    // Getters and Setters
    public String getFrom() { return from; }
    public void setFrom(String from) { this.from = from; }

    public String getDestination() { return destination; }
    public void setDestination(String destination) { this.destination = destination; }

    public String getBudget() { return budget; }
    public void setBudget(String budget) { this.budget = budget; }

    public int getDays() { return days; }
    public void setDays(int days) { this.days = days; }

    public int getPeople() { return people; }
    public void setPeople(int people) { this.people = people; }

    public String getTravelType() { return travelType; }
    public void setTravelType(String travelType) { this.travelType = travelType; }

    public boolean isLoading() { return isLoading; }
    public String getError() { return error; }
    public TripPlan getGeneratedTrip() { return generatedTrip; }

    /**
     * Dispatches the API call to server.ts, executing the model query
     * and receiving the structured trip plan back in INR.
     */
    public CompletableFuture<Void> handleGenerate() {
        if (from.isEmpty() || destination.isEmpty() || budget.isEmpty()) {
            this.error = "Please supply origin, destination, and budget parameters.";
            return CompletableFuture.completedFuture(null);
        }

        this.isLoading = true;
        this.error = null;
        this.generatedTrip = null;

        String requestBody = String.format(
            "{\"from\":\"%s\",\"destination\":\"%s\",\"budget\":%s,\"days\":%d,\"people\":%d,\"travelType\":\"%s\"}",
            from, destination, budget, days, people, travelType
        );

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create("/api/generate-trip"))
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(requestBody))
                .build();

        return httpClient.sendAsync(request, HttpResponse.BodyHandlers.ofString())
                .thenAccept(response -> {
                    this.isLoading = false;
                    if (response.statusCode() == 200) {
                        this.generatedTrip = parseTripPlan(response.body());
                    } else {
                        this.error = "Failed to construct the itinerary. Please adjust limits and try again.";
                    }
                })
                .exceptionally(ex -> {
                    this.isLoading = false;
                    this.error = "Connection anomaly: " + ex.getMessage();
                    return null;
                });
    }

    public CompletableFuture<Void> handleSaveTrip() {
        if (generatedTrip == null || user == null) {
            this.error = "User session or generated itinerary missing.";
            return CompletableFuture.completedFuture(null);
        }

        this.isLoading = true;

        // Associate current user with the plan before saving
        generatedTrip.userId = user.uid;

        // In a real implementation, we would serialize generatedTrip back to JSON
        String requestBody = "{}"; // Serialized representation

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create("/api/trips"))
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(requestBody))
                .build();

        return httpClient.sendAsync(request, HttpResponse.BodyHandlers.ofString())
                .thenAccept(response -> {
                    this.isLoading = false;
                    if (response.statusCode() == 200) {
                        navigationManager.onTripSaved();
                        navigationManager.setCurrentPage("dashboard");
                    } else {
                        this.error = "Could not register trip with the database.";
                    }
                })
                .exceptionally(ex -> {
                    this.isLoading = false;
                    this.error = "Save failed: " + ex.getMessage();
                    return null;
                });
    }

    private TripPlan parseTripPlan(String json) {
        // Mock parser representation
        return new TripPlan();
    }
}

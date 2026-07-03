package src.pages;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CompletableFuture;

/**
 * Java translation of SavedTrips.tsx.
 * Supports viewing details of, editing, or deleting pre-saved itineraries.
 */
public class SavedTrips {
    private final UserProfile user;
    private final NavigationManager navigationManager;
    private final HttpClient httpClient;

    private List<TripPlan> savedTrips = new ArrayList<>();
    private TripPlan selectedTrip = null;
    private boolean isLoading = false;
    private String error = null;

    public interface NavigationManager {
        void setCurrentPage(String page);
    }

    public SavedTrips(UserProfile user, TripPlan selectedTrip, NavigationManager navigationManager) {
        this.user = user;
        this.selectedTrip = selectedTrip;
        this.navigationManager = navigationManager;
        this.httpClient = HttpClient.newBuilder().build();
        fetchSavedTrips();
    }

    public List<TripPlan> getSavedTrips() { return savedTrips; }
    public TripPlan getSelectedTrip() { return selectedTrip; }
    public void setSelectedTrip(TripPlan selectedTrip) { this.selectedTrip = selectedTrip; }

    public boolean isLoading() { return isLoading; }
    public String getError() { return error; }

    public CompletableFuture<Void> fetchSavedTrips() {
        if (user == null) {
            this.error = "Authentication required.";
            return CompletableFuture.completedFuture(null);
        }

        this.isLoading = true;
        this.error = null;

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create("/api/trips?userId=" + user.uid))
                .GET()
                .build();

        return httpClient.sendAsync(request, HttpResponse.BodyHandlers.ofString())
                .thenAccept(response -> {
                    this.isLoading = false;
                    if (response.statusCode() == 200) {
                        this.savedTrips = parseTripsList(response.body());
                        if (selectedTrip == null && !savedTrips.isEmpty()) {
                            this.selectedTrip = savedTrips.get(0);
                        }
                    } else {
                        this.error = "Error receiving archived itineraries.";
                    }
                })
                .exceptionally(ex -> {
                    this.isLoading = false;
                    this.error = "Error loading itineraries: " + ex.getMessage();
                    return null;
                });
    }

    public CompletableFuture<Void> handleDeleteTrip() {
        if (selectedTrip == null) return CompletableFuture.completedFuture(null);

        this.isLoading = true;
        this.error = null;

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create("/api/trips?id=" + selectedTrip.id))
                .DELETE()
                .build();

        return httpClient.sendAsync(request, HttpResponse.BodyHandlers.ofString())
                .thenAccept(response -> {
                    this.isLoading = false;
                    if (response.statusCode() == 200) {
                        this.selectedTrip = null;
                        fetchSavedTrips();
                    } else {
                        this.error = "Trip removal was unsuccessful.";
                    }
                })
                .exceptionally(ex -> {
                    this.isLoading = false;
                    this.error = "Delete query aborted: " + ex.getMessage();
                    return null;
                });
    }

    private List<TripPlan> parseTripsList(String json) {
        return new ArrayList<>();
    }
}

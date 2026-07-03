package src.pages;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.concurrent.CompletableFuture;

/**
 * Java translation of Weather.tsx.
 * Resolves meteorology forecasts utilizing smart AI models for the destination city.
 */
public class Weather {
    private String destination = "";
    private TripPlan.WeatherInfo weatherInfo = null;
    private boolean isLoading = false;
    private String error = null;

    private final HttpClient httpClient;

    public Weather() {
        this.httpClient = HttpClient.newBuilder().build();
    }

    public String getDestination() { return destination; }
    public void setDestination(String destination) { this.destination = destination; }

    public TripPlan.WeatherInfo getWeatherInfo() { return weatherInfo; }
    public boolean isLoading() { return isLoading; }
    public String getError() { return error; }

    public CompletableFuture<Void> handleSearch() {
        if (destination.isEmpty()) {
            this.error = "Please state a destination city.";
            return CompletableFuture.completedFuture(null);
        }

        this.isLoading = true;
        this.error = null;
        this.weatherInfo = null;

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create("/api/weather?destination=" + destination))
                .GET()
                .build();

        return httpClient.sendAsync(request, HttpResponse.BodyHandlers.ofString())
                .thenAccept(response -> {
                    this.isLoading = false;
                    if (response.statusCode() == 200) {
                        this.weatherInfo = parseWeatherInfo(response.body());
                    } else {
                        this.error = "Meteorology insights not accessible for this location.";
                    }
                })
                .exceptionally(ex -> {
                    this.isLoading = false;
                    this.error = "Forecast loading failure: " + ex.getMessage();
                    return null;
                });
    }

    private TripPlan.WeatherInfo parseWeatherInfo(String json) {
        return new TripPlan.WeatherInfo();
    }
}

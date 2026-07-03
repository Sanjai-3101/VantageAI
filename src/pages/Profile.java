package src.pages;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.concurrent.CompletableFuture;

/**
 * Java translation of Profile.tsx.
 * Provides preference management (travel style, home base city) and user state updates.
 */
public class Profile {
    private final UserProfile user;
    private final AuthListener authListener;
    private final HttpClient httpClient;

    // Field States
    private String fullName = "";
    private String homeCity = "";
    private String preferences = "";
    private boolean isEditing = false;
    private boolean isSaving = false;
    private String message = null;
    private String error = null;

    public interface AuthListener {
        void onProfileUpdate(UserProfile updatedProfile);
    }

    public Profile(UserProfile user, AuthListener authListener) {
        this.user = user;
        this.authListener = authListener;
        this.httpClient = HttpClient.newBuilder().build();

        if (user != null) {
            this.fullName = user.fullName;
            this.homeCity = user.homeCity != null ? user.homeCity : "";
            this.preferences = user.preferences != null ? user.preferences : "";
        }
    }

    // Getters and Setters
    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getHomeCity() { return homeCity; }
    public void setHomeCity(String homeCity) { this.homeCity = homeCity; }

    public String getPreferences() { return preferences; }
    public void setPreferences(String preferences) { this.preferences = preferences; }

    public boolean isEditing() { return isEditing; }
    public void setEditing(boolean editing) { this.isEditing = editing; }

    public boolean isSaving() { return isSaving; }
    public String getMessage() { return message; }
    public String getError() { return error; }

    public CompletableFuture<Void> handleSave() {
        if (user == null) {
            this.error = "No session found.";
            return CompletableFuture.completedFuture(null);
        }

        this.isSaving = true;
        this.message = null;
        this.error = null;

        String requestBody = String.format(
            "{\"uid\":\"%s\",\"fullName\":\"%s\",\"homeCity\":\"%s\",\"preferences\":\"%s\"}",
            user.uid, fullName, homeCity, preferences
        );

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create("/api/profile"))
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(requestBody))
                .build();

        return httpClient.sendAsync(request, HttpResponse.BodyHandlers.ofString())
                .thenAccept(response -> {
                    this.isSaving = false;
                    if (response.statusCode() == 200) {
                        this.user.fullName = fullName;
                        this.user.homeCity = homeCity;
                        this.user.preferences = preferences;
                        authListener.onProfileUpdate(user);
                        this.isEditing = false;
                        this.message = "Profile successfully saved to secure cluster!";
                    } else {
                        this.error = "Failure writing profile changes to DB.";
                    }
                })
                .exceptionally(ex -> {
                    this.isSaving = false;
                    this.error = "Connection timeout: " + ex.getMessage();
                    return null;
                });
    }
}

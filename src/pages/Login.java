package src.pages;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.concurrent.CompletableFuture;

/**
 * Java translation of Login.tsx.
 * Manages user credentials, authentication calls, and state management.
 */
public class Login {
    private String email = "";
    private String password = "";
    private boolean isLoading = false;
    private String error = null;

    private final NavigationManager navigationManager;
    private final AuthListener authListener;
    private final HttpClient httpClient;

    public interface NavigationManager {
        void setCurrentPage(String page);
    }

    public interface AuthListener {
        void onLoginSuccess(UserProfile user);
    }

    public Login(NavigationManager navigationManager, AuthListener authListener) {
        this.navigationManager = navigationManager;
        this.authListener = authListener;
        this.httpClient = HttpClient.newBuilder().build();
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getEmail() {
        return email;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getPassword() {
        return password;
    }

    public boolean isLoading() {
        return isLoading;
    }

    public String getError() {
        return error;
    }

    public CompletableFuture<Void> handleSubmit() {
        if (email.isEmpty() || password.isEmpty()) {
            this.error = "Please fill in all fields";
            return CompletableFuture.completedFuture(null);
        }

        this.isLoading = true;
        this.error = null;

        String requestBody = String.format("{\"email\":\"%s\",\"password\":\"%s\"}", email, password);

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create("/api/auth/login"))
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(requestBody))
                .build();

        return httpClient.sendAsync(request, HttpResponse.BodyHandlers.ofString())
                .thenAccept(response -> {
                    this.isLoading = false;
                    if (response.statusCode() == 200) {
                        // Assuming a JSON library or custom parser is used for parsing
                        UserProfile user = parseUserProfile(response.body());
                        authListener.onLoginSuccess(user);
                        navigationManager.setCurrentPage("dashboard");
                    } else {
                        this.error = "Invalid email or password";
                    }
                })
                .exceptionally(ex -> {
                    this.isLoading = false;
                    this.error = "An error occurred during authentication: " + ex.getMessage();
                    return null;
                });
    }

    private UserProfile parseUserProfile(String json) {
        // Simple manual parsing for demo safety
        UserProfile profile = new UserProfile();
        profile.uid = extractJsonField(json, "uid");
        profile.email = extractJsonField(json, "email");
        profile.fullName = extractJsonField(json, "fullName");
        return profile;
    }

    private String extractJsonField(String json, String field) {
        String pattern = "\"" + field + "\":\"";
        int start = json.indexOf(pattern);
        if (start == -1) return "";
        start += pattern.length();
        int end = json.indexOf("\"", start);
        if (end == -1) return "";
        return json.substring(start, end);
    }
}

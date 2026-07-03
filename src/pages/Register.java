package src.pages;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.concurrent.CompletableFuture;

/**
 * Java translation of Register.tsx.
 * Handles new user registration, credential storage dispatch, and state handling.
 */
public class Register {
    private String fullName = "";
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
        void onRegisterSuccess(UserProfile user);
    }

    public Register(NavigationManager navigationManager, AuthListener authListener) {
        this.navigationManager = navigationManager;
        this.authListener = authListener;
        this.httpClient = HttpClient.newBuilder().build();
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getFullName() {
        return fullName;
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
        if (fullName.isEmpty() || email.isEmpty() || password.isEmpty()) {
            this.error = "Please fill in all fields";
            return CompletableFuture.completedFuture(null);
        }

        this.isLoading = true;
        this.error = null;

        String requestBody = String.format(
            "{\"email\":\"%s\",\"password\":\"%s\",\"fullName\":\"%s\"}", 
            email, password, fullName
        );

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create("/api/auth/register"))
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(requestBody))
                .build();

        return httpClient.sendAsync(request, HttpResponse.BodyHandlers.ofString())
                .thenAccept(response -> {
                    this.isLoading = false;
                    if (response.statusCode() == 200) {
                        UserProfile user = parseUserProfile(response.body());
                        authListener.onRegisterSuccess(user);
                        navigationManager.setCurrentPage("dashboard");
                    } else {
                        this.error = "Registration failed. User might already exist.";
                    }
                })
                .exceptionally(ex -> {
                    this.isLoading = false;
                    this.error = "An error occurred during registration: " + ex.getMessage();
                    return null;
                });
    }

    private UserProfile parseUserProfile(String json) {
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

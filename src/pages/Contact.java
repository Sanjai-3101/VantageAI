package src.pages;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.concurrent.CompletableFuture;

/**
 * Java translation of Contact.tsx.
 * Forwards user inquiries and premium requests to the support queue.
 */
public class Contact {
    private String name = "";
    private String email = "";
    private String subject = "General Inquiry";
    private String message = "";
    
    private boolean isSubmitting = false;
    private String successMsg = null;
    private String errorMsg = null;

    private final HttpClient httpClient;

    public Contact() {
        this.httpClient = HttpClient.newBuilder().build();
    }

    // Getters and Setters
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public boolean isSubmitting() { return isSubmitting; }
    public String getSuccessMsg() { return successMsg; }
    public String getErrorMsg() { return errorMsg; }

    public CompletableFuture<Void> handleSubmit() {
        if (name.isEmpty() || email.isEmpty() || message.isEmpty()) {
            this.errorMsg = "Please fill in all required fields.";
            return CompletableFuture.completedFuture(null);
        }

        this.isSubmitting = true;
        this.successMsg = null;
        this.errorMsg = null;

        String requestBody = String.format(
            "{\"name\":\"%s\",\"email\":\"%s\",\"subject\":\"%s\",\"message\":\"%s\"}",
            name, email, subject, message
        );

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create("/api/contact"))
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(requestBody))
                .build();

        return httpClient.sendAsync(request, HttpResponse.BodyHandlers.ofString())
                .thenAccept(response -> {
                    this.isSubmitting = false;
                    if (response.statusCode() == 200) {
                        this.successMsg = "Inquiry sent successfully. Our elite advisors will contact you shortly.";
                        this.name = "";
                        this.email = "";
                        this.message = "";
                    } else {
                        this.errorMsg = "Unable to dispatch message at this time.";
                    }
                })
                .exceptionally(ex -> {
                    this.isSubmitting = false;
                    this.errorMsg = "Network latency error: " + ex.getMessage();
                    return null;
                });
    }
}

package src.pages;

import java.util.ArrayList;
import java.util.List;

/**
 * Java equivalent of Home.tsx.
 * Represents the main landing portal of VantageAI, displaying the curated travel
 * options, modern features, and providing redirection metrics based on authentication status.
 */
public class Home {
    private final NavigationManager navigationManager;
    private final UserProfile currentUser;
    private final List<FeaturedDestination> featuredDestinations;

    public interface NavigationManager {
        void setCurrentPage(String page);
    }

    public static class UserProfile {
        public String uid;
        public String fullName;
        public String email;
    }

    public static class FeaturedDestination {
        public String name;
        public String cost;
        public String duration;
        public String image;
        public String description;

        public FeaturedDestination(String name, String cost, String duration, String image, String description) {
            this.name = name;
            this.cost = cost;
            this.duration = duration;
            this.image = image;
            this.description = description;
        }
    }

    public Home(NavigationManager navigationManager, UserProfile currentUser) {
        this.navigationManager = navigationManager;
        this.currentUser = currentUser;
        this.featuredDestinations = new ArrayList<>();
        initializeFeaturedDestinations();
    }

    private void initializeFeaturedDestinations() {
        featuredDestinations.add(new FeaturedDestination(
            "Kyoto Eternal Autumn", 
            "₹1,25,000", 
            "7 Days", 
            "kyoto_autumn", 
            "A serene journey through vermillion temples, Gion district streets, and bamboo canopies."
        ));
        featuredDestinations.add(new FeaturedDestination(
            "Swiss Alpenglow Luxury", 
            "₹3,40,000", 
            "6 Days", 
            "swiss_alps", 
            "A high-altitude retreat featuring panoramic train routes and elite mountain chalets."
        ));
        featuredDestinations.add(new FeaturedDestination(
            "Amalfi Coastline Serenity", 
            "₹2,80,000", 
            "8 Days", 
            "amalfi_coast", 
            "Vibrant cliffside dining coupled with private yacht excursions along the historic Italian shore."
        ));
    }

    public List<FeaturedDestination> getFeaturedDestinations() {
        return featuredDestinations;
    }

    public void handlePrimaryAction() {
        if (currentUser != null) {
            navigationManager.setCurrentPage("planner");
        } else {
            navigationManager.setCurrentPage("login");
        }
    }

    public void handleSecondaryAction() {
        if (currentUser != null) {
            navigationManager.setCurrentPage("dashboard");
        } else {
            navigationManager.setCurrentPage("register");
        }
    }
}

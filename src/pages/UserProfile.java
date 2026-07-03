package src.pages;

/**
 * Java model equivalent to UserProfile interface in types.ts.
 */
public class UserProfile {
    public String uid;
    public String email;
    public String fullName;
    public String preferences;
    public String homeCity;
    public String avatarUrl;

    public UserProfile() {}

    public UserProfile(String uid, String email, String fullName) {
        this.uid = uid;
        this.email = email;
        this.fullName = fullName;
    }
}

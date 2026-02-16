package com.cradlers.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DBRef;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * User entity representing a user in the system
 */
@Document(collection = "users")
public class User {
    
    @Id
    private String id;
    
    @Indexed(unique = true)
    private String phone;
    
    private String email;
    
    /** Role: ADMIN, VENDOR, or DOCTOR. Null = customer (no role stored). */
    private String role;
    
    @DBRef(lazy = true)
    private List<Address> addresses = new ArrayList<>();
    
    @CreatedDate
    private LocalDateTime createdAt;

    public User() {
        this.createdAt = LocalDateTime.now();
    }

    public User(String phone) {
        this.phone = phone;
        this.createdAt = LocalDateTime.now();
    }

    public User(String phone, String role) {
        this.phone = phone;
        this.role = (role != null && !role.isBlank()) ? role.trim().toUpperCase() : null;
        this.createdAt = LocalDateTime.now();
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public List<Address> getAddresses() {
        return addresses;
    }

    public void setAddresses(List<Address> addresses) {
        this.addresses = addresses;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public String getRole() {
        return role; // null = customer
    }

    public void setRole(String role) {
        this.role = (role != null && !role.isBlank()) ? role.trim().toUpperCase() : null;
    }
}

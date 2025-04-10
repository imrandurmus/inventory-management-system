package group15.backend.model;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
public class Announcement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, length = 1000)
    private String content;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;


    @ManyToOne
    @JoinColumn(name = "posted_by_id", nullable = false)
    private Employee postedBy;

    public Announcement() {}

    public Announcement(String title, String content, Employee postedBy) {
        this.title = title;
        this.content = content;
        this.createdAt = LocalDateTime.now();
        this.postedBy = postedBy;
    }


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public Employee getPostedBy() {
        return postedBy;
    }

    public void setPostedBy(Employee postedBy) {
        this.postedBy = postedBy;
    }
}

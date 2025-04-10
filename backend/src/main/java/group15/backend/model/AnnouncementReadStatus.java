package group15.backend.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "announcement_read_status")
public class AnnouncementReadStatus {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    private Employee employee;

    @ManyToOne(optional = false)
    private Announcement announcement;

    @Column(name = "`read`", nullable = false)
    private boolean read = false;

    @Column(nullable = false)
    private LocalDateTime readAt;

    public AnnouncementReadStatus() {}

    public AnnouncementReadStatus(Employee employee, Announcement announcement) {
        this.employee = employee;
        this.announcement = announcement;
        this.read = true;
        this.readAt = LocalDateTime.now();
    }

    @PrePersist
    protected void onCreate() {
        if (this.readAt == null) {
            this.readAt = LocalDateTime.now();
        }
    }

    // Getters
    public Long getId() {
        return id;
    }

    public Employee getEmployee() {
        return employee;
    }

    public Announcement getAnnouncement() {
        return announcement;
    }

    public boolean isRead() {
        return read;
    }

    public LocalDateTime getReadAt() {
        return readAt;
    }

    // Setters
    public void setId(Long id) {
        this.id = id;
    }

    public void setEmployee(Employee employee) {
        this.employee = employee;
    }

    public void setAnnouncement(Announcement announcement) {
        this.announcement = announcement;
    }

    public void setRead(boolean read) {
        this.read = read;
    }

    public void setReadAt(LocalDateTime readAt) {
        this.readAt = readAt;
    }

    // Equals & hashCode based on employee + announcement
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof AnnouncementReadStatus)) return false;
        AnnouncementReadStatus other = (AnnouncementReadStatus) o;
        return employee.equals(other.employee) && announcement.equals(other.announcement);
    }

    @Override
    public int hashCode() {
        return employee.hashCode() + announcement.hashCode();
    }
}

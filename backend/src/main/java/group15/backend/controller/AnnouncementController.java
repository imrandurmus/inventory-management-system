package group15.backend.controller;

import group15.backend.model.*;
import group15.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/announcements")
public class AnnouncementController {

    @Autowired
    private AnnouncementRepository announcementRepo;

    @Autowired
    private EmployeeRepository employeeRepo;

    @Autowired
    private AnnouncementReadStatusRepository readRepo;

    private Employee getCurrentEmployee() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return employeeRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Authenticated employee not found"));
    }
// Get default manager for postedBy
private Employee getDefaultManager() {
    return employeeRepo.findByEmail("alice@company.com")
            .orElseThrow(() -> new RuntimeException("Default manager not found. Please ensure 'alice@company.com' exists."));
}


// 1. Post announcement (open, but sets manager as postedBy)
@PostMapping
public ResponseEntity<?> createAnnouncement(@RequestBody Announcement announcement) {
    Employee manager = getDefaultManager();
    announcement.setPostedBy(manager);
    Announcement saved = announcementRepo.save(announcement);
    return ResponseEntity.status(HttpStatus.CREATED).body(saved);
}

{/**
    // 1. Post announcement (Manager only)
    @PostMapping
    public ResponseEntity<?> createAnnouncement(@RequestBody Announcement announcement) {
        Employee current = getCurrentEmployee();
        if (current.getRole() != Role.MANAGER) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Only managers can post announcements.");
        }
        announcement.setPostedBy(current);
        Announcement saved = announcementRepo.save(announcement);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }
 */}


// 2. Get all announcements (Everyone)
@GetMapping
public ResponseEntity<List<Announcement>> getAll() {
    return ResponseEntity.ok(announcementRepo.findAll());
}


 // 3. Get announcement by ID (for modal)
 @GetMapping("/{id}")
 public ResponseEntity<?> getAnnouncementById(@PathVariable Long id) {
     Optional<Announcement> announcementOpt = announcementRepo.findById(id);
     if (announcementOpt.isEmpty()) {
         return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Announcement not found.");
     }
     return ResponseEntity.ok(announcementOpt.get());
 }

    
    // 4. Get unread announcements (requires auth)
    @GetMapping("/unread")
    public ResponseEntity<List<Announcement>> getUnreadAnnouncements() {
        Employee current = getCurrentEmployee();
        List<Long> readIds = readRepo.findByEmployee(current)
                .stream()
                .filter(AnnouncementReadStatus::isRead)
                .map(read -> read.getAnnouncement().getId())
                .collect(Collectors.toList());
        List<Announcement> unread = announcementRepo.findAll()
                .stream()
                .filter(a -> !readIds.contains(a.getId()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(unread);
    }

   // 5. Get unread announcement count (requires auth)
   @GetMapping("/unread-count")
   public ResponseEntity<?> getUnreadCount() {
       Employee current = getCurrentEmployee();
       List<Long> readIds = readRepo.findByEmployee(current)
               .stream()
               .filter(AnnouncementReadStatus::isRead)
               .map(read -> read.getAnnouncement().getId())
               .collect(Collectors.toList());
       long unreadCount = announcementRepo.findAll()
               .stream()
               .filter(a -> !readIds.contains(a.getId()))
               .count();
       return ResponseEntity.ok(new UnreadCountResponse(unreadCount));
   }

    // 6. Mark announcement as read (requires auth)
    @PostMapping("/{id}/read")
    public ResponseEntity<?> markAsRead(@PathVariable Long id) {
        Employee current = getCurrentEmployee();
        Optional<Announcement> announcementOpt = announcementRepo.findById(id);
        if (announcementOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Announcement not found.");
        }
        Announcement announcement = announcementOpt.get();
        Optional<AnnouncementReadStatus> readStatusOpt = readRepo.findByEmployeeAndAnnouncement(current, announcement);
        if (readStatusOpt.isEmpty()) {
            AnnouncementReadStatus readStatus = new AnnouncementReadStatus();
            readStatus.setEmployee(current);
            readStatus.setAnnouncement(announcement);
            readStatus.setRead(true);
            readRepo.save(readStatus);
        } else {
            AnnouncementReadStatus readStatus = readStatusOpt.get();
            if (!readStatus.isRead()) {
                readStatus.setRead(true);
                readRepo.save(readStatus);
            }
        }
        return ResponseEntity.ok().build();
    }

    // Helper class for unread count response
    // DTO for unread count
    private static class UnreadCountResponse {
        private final long count;

        public UnreadCountResponse(long count) {
            this.count = count;
        }

        public long getCount() {
            return count;
        }
    }
}
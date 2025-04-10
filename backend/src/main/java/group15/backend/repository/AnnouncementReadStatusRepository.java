package group15.backend.repository;

import group15.backend.model.Announcement;
import group15.backend.model.AnnouncementReadStatus;
import group15.backend.model.Employee;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AnnouncementReadStatusRepository extends JpaRepository<AnnouncementReadStatus, Long> {
    List<AnnouncementReadStatus> findByEmployeeAndReadFalse(Employee employee);
    Optional<AnnouncementReadStatus> findByEmployeeAndAnnouncement(Employee employee, Announcement announcement);
    List<AnnouncementReadStatus> findByEmployee(Employee employee);
}

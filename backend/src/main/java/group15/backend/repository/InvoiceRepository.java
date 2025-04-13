// src/main/java/group15/backend/repository/InvoiceRepository.java
package group15.backend.repository;

import group15.backend.model.Invoice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface InvoiceRepository extends JpaRepository<Invoice, Long> {
}
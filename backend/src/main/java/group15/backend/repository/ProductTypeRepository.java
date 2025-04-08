package group15.backend.repository;

import group15.backend.model.ProductType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;


@Repository
public interface ProductTypeRepository extends JpaRepository<ProductType, Long> {
    boolean existsByName(String name);
    Optional<ProductType> findByName(String name);
}

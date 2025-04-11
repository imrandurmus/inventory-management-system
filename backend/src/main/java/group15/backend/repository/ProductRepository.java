package group15.backend.repository;

import group15.backend.model.Product;
import group15.backend.model.ProductType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Set;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {


    @Query("""
    SELECT p
    FROM Product p
    WHERE
        (:query IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :query, '%'))
         OR LOWER(p.description) LIKE LOWER(CONCAT('%', :query, '%')))
    AND
        (:minPrice IS NULL OR p.price >= :minPrice)
    AND
        (:maxPrice IS NULL OR p.price <= :maxPrice)
    AND
        (:inStock IS NULL OR (:inStock = true AND p.quantity > 0))
    AND
        (:maxQuantity IS NULL OR p.quantity <= :maxQuantity)
    AND
        (:productTypeId IS NULL OR p.productType.id = :productTypeId)
""")
    Page<Product> filterProducts(
            @Param("query") String query,
            @Param("minPrice") BigDecimal minPrice,
            @Param("maxPrice") BigDecimal maxPrice,
            @Param("inStock") Boolean inStock,
            @Param("maxQuantity") Integer maxQuantity,
            @Param("productTypeId") Long productTypeId,
            Pageable pageable
    );



    Page<Product> findByProductTypeIn(Set<ProductType> types, Pageable pageable);

    Page<Product> findByNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(String name, String description, Pageable pageable);

    Page<Product> findByPriceBetween(BigDecimal min, BigDecimal max, Pageable pageable);

    Page<Product> findByPriceGreaterThan(BigDecimal price, Pageable pageable);

    Page<Product> findByQuantityGreaterThan(int quantity, Pageable pageable);

    Page<Product> findByQuantityLessThan(int quantity, Pageable pageable);

    Page<Product> findAll(Pageable pageable);
}

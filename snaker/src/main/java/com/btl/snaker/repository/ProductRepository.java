package com.btl.snaker.repository;

import com.btl.snaker.entity.Brand;
import com.btl.snaker.entity.Category;
import com.btl.snaker.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {
    @Query(value = "SELECT * FROM product p WHERE " +
            "(?1 IS NULL OR p.category_id = ?1) AND " +
            "(?2 IS NULL OR p.brand_id = ?2) AND " +
            "(?3 IS NULL OR p.name LIKE %?3%) AND " +
            "(?4 IS NULL OR p.price >= ?4) AND " +
            "(?5 IS NULL OR p.price <= ?5)",
            nativeQuery = true)
    List<Product> findByCategoryIdAndBrandIdAndNameAndPriceBetween(Long categoryId,
                                                                   Long brandId,
                                                                   String name,
                                                                   Long priceFrom,
                                                                   Long priceTo);
    Product findById(long id);
}

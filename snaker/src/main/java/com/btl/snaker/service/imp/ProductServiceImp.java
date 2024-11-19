package com.btl.snaker.service.imp;

import com.btl.snaker.dto.PageProductDTO;
import com.btl.snaker.dto.ProductDTO;
import com.btl.snaker.payload.ResponseData;
import com.btl.snaker.payload.request.AddSizeRequest;
import com.btl.snaker.payload.request.CreateProductRequest;
import com.btl.snaker.payload.request.UpdateProductRequest;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ProductServiceImp {
    Boolean createProduct(CreateProductRequest createProductRequest);
    ResponseData addOrUpdateSizeProduct(AddSizeRequest addSizeRequest);
    ResponseData updateProduct(UpdateProductRequest updateProductRequest);
    ResponseData deleteProduct(long id);
    List<ProductDTO> getAllProducts();
    ProductDTO getProductById(long id);
    List<ProductDTO> getProducts(Long categoryId, Long brandId, String name, Long priceFrom, Long priceTo);
}

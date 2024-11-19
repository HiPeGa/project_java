package com.btl.snaker.service;

import com.btl.snaker.dto.PageProductDTO;
import com.btl.snaker.dto.ProductDTO;
import com.btl.snaker.entity.Brand;
import com.btl.snaker.entity.Category;
import com.btl.snaker.entity.Product;
import com.btl.snaker.entity.ProductSize;
import com.btl.snaker.mapper.ProductMapper;
import com.btl.snaker.payload.ResponseData;
import com.btl.snaker.payload.request.AddSizeRequest;
import com.btl.snaker.payload.request.CreateProductRequest;
import com.btl.snaker.payload.request.UpdateProductRequest;
import com.btl.snaker.repository.BrandRepository;
import com.btl.snaker.repository.CategoryRepository;
import com.btl.snaker.repository.ProductRepository;
import com.btl.snaker.repository.ProductSizeRepository;
import com.btl.snaker.service.imp.FileServiceImp;
import com.btl.snaker.service.imp.ProductServiceImp;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Service
public class ProductService implements ProductServiceImp {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private BrandRepository brandRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private FileServiceImp fileServiceImp;

    @Autowired
    private ProductSizeRepository productSizeRepository;

    @Override
    public Boolean createProduct(CreateProductRequest createProductRequest) {
        boolean isSuccess = false;
        try {
            Product product = new Product();
            product.setName(createProductRequest.getName());
            product.setDescription(createProductRequest.getDescription());
            product.setPrice(createProductRequest.getPrice());

            Brand brand = brandRepository.findById(createProductRequest.getBrandId());
            product.setBrand(brand);
            Category category = categoryRepository.findById(createProductRequest.getCategoryId());
            product.setCategory(category);

            product.setGender(createProductRequest.getGender());

            ResponseData responseUploadImage = fileServiceImp.uploadFileCloudinary(createProductRequest.getMultipartFile());
            product.setImage(responseUploadImage.getData().toString());

            product.setCreatedAt(new Date());

            List<ProductSize> productSizes = new ArrayList<>();

            for (Integer size : createProductRequest.getSizes()) {
                ProductSize productSize = new ProductSize();
                productSize.setSize(size);
                productSize.setProduct(product);
                productSize.setStock(1);
                productSizes.add(productSize);
            }

            product.setProductSizes(productSizes);
            productRepository.save(product);
            isSuccess = true;
        } catch (Exception e) {
            e.printStackTrace();
            isSuccess = false;
        }
        return isSuccess;
    }

    @Override
    public ResponseData addOrUpdateSizeProduct(AddSizeRequest addSizeRequest) {
        ResponseData responseData = new ResponseData();
        try {
            Product product = productRepository.findById(addSizeRequest.getProductId());
            if(product == null){
                responseData.setSuccess(false);
                responseData.setDescription("Product Not Found");
                return responseData;
            }
            ProductSize productSize = productSizeRepository.findByProductAndSize(product, addSizeRequest.getSize());
            if(productSize != null){
                if(productSize.getStock() == null){
                    productSize.setStock(addSizeRequest.getQuantity());
                }
                else{
                    productSize.setStock(productSize.getStock() + addSizeRequest.getQuantity());
                }
            }
            else{
                productSize = new ProductSize();
                productSize.setSize(addSizeRequest.getSize());
                productSize.setProduct(product);
                productSize.setStock(addSizeRequest.getQuantity());
                productSizeRepository.save(productSize);
            }
            productSizeRepository.save(productSize);
            responseData.setSuccess(true);
            responseData.setDescription("Success");
        } catch (Exception e) {
            e.printStackTrace();
            responseData.setSuccess(false);
            responseData.setDescription("Fail");
        }
        return responseData;
    }


    @Override
    public ResponseData updateProduct(UpdateProductRequest updateProductRequest) {
        ResponseData responseData = new ResponseData();
        try {
            Product product = productRepository.findById(updateProductRequest.getProductId());
            if(product == null){
                responseData.setSuccess(false);
                responseData.setDescription("Product Not Found");
                return responseData;
            }
            product.setName(updateProductRequest.getName());
            product.setDescription(updateProductRequest.getDescription());
            product.setPrice(updateProductRequest.getPrice());
            Brand brand = brandRepository.findById(updateProductRequest.getBrandId());
            product.setBrand(brand);
            Category category = categoryRepository.findById(updateProductRequest.getCategoryId());
            product.setCategory(category);
            product.setGender(updateProductRequest.getGender());
            if(updateProductRequest.getMultipartFile() != null){
                ResponseData responseDataImage = fileServiceImp.uploadFileCloudinary(updateProductRequest.getMultipartFile());
                product.setImage(responseDataImage.getData().toString());
            }
            else{
                product.setImage(updateProductRequest.getOldImage());
            }
            productRepository.save(product);
            responseData.setSuccess(true);
            responseData.setDescription("Success");
        } catch (Exception e) {
            e.printStackTrace();
            responseData.setSuccess(false);
            responseData.setDescription("Fail");
        }
        return responseData;
    }

    @Override
    public ResponseData deleteProduct(long id) {
        ResponseData responseData = new ResponseData();
        try {
            Product product = productRepository.findById(id);
            if(product == null){
                responseData.setSuccess(false);
                responseData.setDescription("Product Not Found");
                return responseData;
            }
            productRepository.delete(product);
            responseData.setSuccess(true);
            responseData.setDescription("Success");
        } catch (Exception e) {
            e.printStackTrace();
            responseData.setSuccess(false);
            responseData.setDescription("Fail");
        }
        return responseData;
    }

    @Override
    public List<ProductDTO> getAllProducts() {
        return ProductMapper.productListToProductDTOList(productRepository.findAll());
    }

    @Override
    public ProductDTO getProductById(long id) {
        Product product = productRepository.findById(id);
        return ProductMapper.productToProductDTO(product);
    }

    @Override
    public List<ProductDTO> getProducts(Long categoryId, Long brandId, String name, Long priceFrom, Long priceTo) {
        return ProductMapper.productListToProductDTOList(productRepository.findByCategoryIdAndBrandIdAndNameAndPriceBetween(categoryId, brandId, name, priceFrom, priceTo));
    }
}

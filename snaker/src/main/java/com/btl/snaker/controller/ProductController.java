package com.btl.snaker.controller;

import com.btl.snaker.dto.PageProductDTO;
import com.btl.snaker.dto.ProductDTO;
import com.btl.snaker.payload.ResponseData;
import com.btl.snaker.payload.request.AddSizeRequest;
import com.btl.snaker.payload.request.CreateProductRequest;
import com.btl.snaker.payload.request.UpdateProductRequest;
import com.btl.snaker.service.imp.ProductServiceImp;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@CrossOrigin("*")
@RestController
@RequestMapping("/product")
public class ProductController {

    @Autowired
    private ProductServiceImp productServiceImp;

    @GetMapping("/get/all")
    public ResponseEntity<?> getAllProducts() {
        ResponseData responseData = new ResponseData();
        responseData.setData(productServiceImp.getAllProducts());
        responseData.setSuccess(true);
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }

    @GetMapping("/get/{id}")
    public ResponseEntity<?> getProductById(@PathVariable long id) {
        return new ResponseEntity<>(productServiceImp.getProductById(id), HttpStatus.OK);
    }

    @GetMapping("/get/search")
    public ResponseEntity<?> getProductsByName(
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) Long brandId,
            @RequestParam(required = false) String name,
            @RequestParam(required = false) Long priceFrom,
            @RequestParam(required = false) Long priceTo) {
        ResponseData responseData = new ResponseData();
        try {
            List<ProductDTO> productDTOS = productServiceImp.getProducts(categoryId, brandId, name, priceFrom, priceTo);
            responseData.setData(productDTOS);
            responseData.setSuccess(true);
            responseData.setDescription("Success");
        } catch (Exception e) {
            responseData.setSuccess(false);
            responseData.setDescription("Fail");
        }
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }

    @PostMapping("/admin/create")
    public ResponseEntity<?> createProduct(
            @RequestParam("multipartFile") MultipartFile multipartFile,
            @RequestParam("name") String name,
            @RequestParam("description") String description,
            @RequestParam("brandId") long brandId,
            @RequestParam("categoryId") long categoryId,
            @RequestParam("gender") String gender,
            @RequestParam("price") Long price,
            @RequestParam("sizes") List<Integer> sizes) {
        CreateProductRequest createProductRequest = new CreateProductRequest();
        createProductRequest.setMultipartFile(multipartFile);
        createProductRequest.setName(name);
        createProductRequest.setDescription(description);
        createProductRequest.setBrandId(brandId);
        createProductRequest.setCategoryId(categoryId);
        createProductRequest.setGender(gender);
        createProductRequest.setPrice(price);
        createProductRequest.setSizes(sizes);
        ResponseData responseData = new ResponseData();
        try {
            Boolean isAdded = productServiceImp.createProduct(createProductRequest);
            if(isAdded){
                responseData.setSuccess(true);
                responseData.setData("Success");
            }
            else{
                responseData.setSuccess(false);
                responseData.setData("Fail");
            }
        } catch (Exception e) {
            responseData.setSuccess(false);
            responseData.setData(e.getMessage());
        }
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }

    @PostMapping("/admin/add/{id}")
    public ResponseEntity<?> addSizeProduct(
            @PathVariable long id,
            @RequestBody AddSizeRequest addSizeRequest) {
        addSizeRequest.setProductId(id);
        ResponseData responseData = productServiceImp.addOrUpdateSizeProduct(addSizeRequest);
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }

    @PostMapping("/admin/update")
    public ResponseEntity<?> updateProduct(
            @RequestParam("productId") Long productId,
            @RequestParam("name") String name,
            @RequestParam("description") String description,
            @RequestParam("price") Long price,
            @RequestParam("brandId") Long brandId,
            @RequestParam("categoryId") Long categoryId,
            @RequestParam("gender") String gender,
            @RequestParam(value = "multipartFile", required = false) MultipartFile multipartFile,
            @RequestParam(value = "oldImage", required = false) String oldImage) {
        UpdateProductRequest updateProductRequest = new UpdateProductRequest();
        updateProductRequest.setProductId(productId);
        updateProductRequest.setName(name);
        updateProductRequest.setDescription(description);
        updateProductRequest.setPrice(price);
        updateProductRequest.setBrandId(brandId);
        updateProductRequest.setCategoryId(categoryId);
        updateProductRequest.setGender(gender);
        updateProductRequest.setMultipartFile(multipartFile);
        updateProductRequest.setOldImage(oldImage);
        ResponseData responseData = productServiceImp.updateProduct(updateProductRequest);
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }

    @DeleteMapping("/admin/delete/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable Long id) {
        ResponseData responseData = productServiceImp.deleteProduct(id);
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }

}

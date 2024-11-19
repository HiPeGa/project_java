package com.btl.snaker.dto;

import java.util.List;

public class PageProductDTO {
    private List<ProductDTO> products;
    private int totalPages;
    private long totalElements;
    private Integer currentPage;

    public PageProductDTO(List<ProductDTO> products, int totalPages, long totalElements, Integer currentPage) {
        this.products = products;
        this.totalPages = totalPages;
        this.totalElements = totalElements;
        this.currentPage = currentPage;
    }

    public List<ProductDTO> getProducts() {
        return products;
    }

    public void setProducts(List<ProductDTO> products) {
        this.products = products;
    }

    public int getTotalPages() {
        return totalPages;
    }

    public void setTotalPages(int totalPages) {
        this.totalPages = totalPages;
    }

    public long getTotalElements() {
        return totalElements;
    }

    public void setTotalElements(long totalElements) {
        this.totalElements = totalElements;
    }

    public Integer getCurrentPage() {
        return currentPage;
    }

    public void setCurrentPage(Integer currentPage) {
        this.currentPage = currentPage;
    }
}
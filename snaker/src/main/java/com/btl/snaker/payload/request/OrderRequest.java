package com.btl.snaker.payload.request;

import java.util.List;

public class OrderRequest {
    private long userId;
    private List<OrderItemRequest> orderItemRequests;
    private long totalAmount;
    private String shippingMethod;
    private String address;
    private String phoneNumberReceive;
    private String nameReceive;

    public long getUserId() {
        return userId;
    }

    public void setUserId(long userId) {
        this.userId = userId;
    }

    public List<OrderItemRequest> getOrderItemRequests() {
        return orderItemRequests;
    }

    public void setOrderItemRequests(List<OrderItemRequest> orderItemRequests) {
        this.orderItemRequests = orderItemRequests;
    }

    public long getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(long totalAmount) {
        this.totalAmount = totalAmount;
    }

    public String getShippingMethod() {
        return shippingMethod;
    }

    public void setShippingMethod(String shippingMethod) {
        this.shippingMethod = shippingMethod;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getPhoneNumberReceive() {
        return phoneNumberReceive;
    }

    public void setPhoneNumberReceive(String phoneNumberReceive) {
        this.phoneNumberReceive = phoneNumberReceive;
    }

    public String getNameReceive() {
        return nameReceive;
    }

    public void setNameReceive(String nameReceive) {
        this.nameReceive = nameReceive;
    }
}

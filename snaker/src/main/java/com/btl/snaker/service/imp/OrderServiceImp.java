package com.btl.snaker.service.imp;

import com.btl.snaker.dto.OrderDTO;
import com.btl.snaker.payload.ResponseData;
import com.btl.snaker.payload.request.OrderRequest;

import java.util.List;

public interface OrderServiceImp {
    List<OrderDTO> getAllOrders();
    ResponseData getAllOrdersOfUser(long userId);
    OrderDTO getOrderById(long orderId);
    ResponseData insertOrder(OrderRequest orderRequest);
    ResponseData checkoutInCart(OrderRequest orderRequest);
    ResponseData getAllProductSells();
}

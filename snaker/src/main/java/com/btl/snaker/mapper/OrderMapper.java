package com.btl.snaker.mapper;

import com.btl.snaker.dto.OrderDTO;
import com.btl.snaker.dto.OrderItemDTO;
import com.btl.snaker.entity.Order;
import com.btl.snaker.entity.OrderItem;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Locale;

public class OrderMapper {
    public static String formatDateTime(Date inputDate) {
        SimpleDateFormat outputFormat = new SimpleDateFormat("EEEE, 'ngày' dd 'tháng' MM 'năm' yyyy, H:mm", new Locale("vi", "VN"));
        return outputFormat.format(inputDate);
    }
    public static OrderDTO orderToOrderDTO(Order order) {
        OrderDTO orderDTO = new OrderDTO();
        orderDTO.setId(order.getId());
        orderDTO.setUserId(order.getUser().getId());
        List<OrderItemDTO> orderItemDTOS = new ArrayList<>();
        for(OrderItem orderItem : order.getOrderItems()) {
            OrderItemDTO orderItemDTO = new OrderItemDTO();
            orderItemDTO.setProductId(orderItem.getProduct().getId());
            orderItemDTO.setProductImage(orderItem.getProduct().getImage());
            orderItemDTO.setProductName(orderItem.getProduct().getName());
            orderItemDTO.setProductDescription(orderItem.getProduct().getDescription());
            orderItemDTO.setProductBrand(orderItem.getProduct().getBrand().getName());
            orderItemDTO.setProductCategory(orderItem.getProduct().getCategory().getName());
            orderItemDTO.setProductPrice(orderItem.getProduct().getPrice());
            orderItemDTO.setProductQuantity(orderItem.getQuantity());
            orderItemDTO.setProductSize(orderItem.getSize());
            orderItemDTO.setNote(orderItem.getNote());
            orderItemDTOS.add(orderItemDTO);
        }
        orderDTO.setOrderItemDTOS(orderItemDTOS);
        orderDTO.setStatus(order.getStatus() == 1 ? "Đã thanh toán" : "Chưa thanh toán");
        orderDTO.setAddress(order.getAddress());
        orderDTO.setShippingMethod(order.getShippingMethod());
        orderDTO.setPhoneNumberReceive(order.getPhoneNumberReceive());
        orderDTO.setReceiveName(order.getNameReceive());
        orderDTO.setTime(formatDateTime(order.getCreatedAt()));
        return orderDTO;
    }
}

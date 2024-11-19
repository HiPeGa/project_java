package com.btl.snaker.service;

import com.btl.snaker.dto.OrderDTO;
import com.btl.snaker.dto.ProductSellDTO;
import com.btl.snaker.entity.*;
import com.btl.snaker.entity.key.KeyOrderItem;
import com.btl.snaker.mapper.OrderMapper;
import com.btl.snaker.payload.ResponseData;
import com.btl.snaker.payload.request.OrderItemRequest;
import com.btl.snaker.payload.request.OrderRequest;
import com.btl.snaker.repository.*;
import com.btl.snaker.service.imp.OrderServiceImp;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
public class OrderService implements OrderServiceImp {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ProductSizeRepository productSizeRepository;

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private CartItemRepository cartItemRepository;

    @Override
    public List<OrderDTO> getAllOrders() {
        List<Order> orders = orderRepository.findAll();
        List<OrderDTO> orderDTOS = new ArrayList<>();
        for(Order order : orders) {
            orderDTOS.add(OrderMapper.orderToOrderDTO(order));
        }
        return orderDTOS;
    }

    @Override
    public ResponseData getAllOrdersOfUser(long userId) {
        ResponseData responseData = new ResponseData();
        User user = userRepository.findById(userId);
        if(user == null) {
            responseData.setSuccess(false);
            responseData.setDescription("User not found");
            return responseData;
        }
        List<Order> orders = orderRepository.findByUser(user);
        if(orders.isEmpty()) {
            responseData.setSuccess(true);
            responseData.setData(new ArrayList<OrderDTO>());
            return responseData;
        }
        List<OrderDTO> orderDTOS = new ArrayList<>();
        for(Order order : orders) {
            orderDTOS.add(OrderMapper.orderToOrderDTO(order));
        }
        responseData.setSuccess(true);
        responseData.setData(orderDTOS);
        return responseData;
    }

    @Override
    public OrderDTO getOrderById(long orderId) {
        Order order = orderRepository.findById(orderId);
        return OrderMapper.orderToOrderDTO(order);
    }

    @Override
    @Transactional
    public ResponseData insertOrder(OrderRequest orderRequest) {
        ResponseData responseData = new ResponseData();
        try {
            User user = userRepository.findById(orderRequest.getUserId());
            if (user == null) {
                responseData.setSuccess(false);
                responseData.setDescription("User not found");
                return responseData;
            }

            long totalAmount = 0;
            List<OrderItem> orderItems = new ArrayList<>();
            List<ProductSize> updatedProductSizes = new ArrayList<>();

            for (OrderItemRequest orderItemRequest : orderRequest.getOrderItemRequests()) {
                Product product = productRepository.findById(orderItemRequest.getProductId());
                if (product == null) {
                    responseData.setSuccess(false);
                    responseData.setDescription("Product " + orderItemRequest.getProductId() + " not found");
                    return responseData;
                }

                ProductSize productSize = productSizeRepository.findByProductAndSize(product, orderItemRequest.getSize());
                if (productSize == null || productSize.getStock() < orderItemRequest.getQuantity()) {
                    responseData.setSuccess(false);
                    responseData.setDescription(product.getName() + " size " + orderItemRequest.getSize() + " not enough");
                    return responseData;
                }

                OrderItem orderItem = new OrderItem();
                orderItem.setProduct(product);
                orderItem.setQuantity(orderItemRequest.getQuantity());
                orderItem.setNote(orderItemRequest.getNote().equals("") ? "Không có ghi chú" : orderItemRequest.getNote());
                orderItem.setPrice(product.getPrice());
                orderItem.setSize(orderItemRequest.getSize());
                totalAmount += product.getPrice() * orderItemRequest.getQuantity();
                orderItems.add(orderItem);

                productSize.setStock(productSize.getStock() - orderItemRequest.getQuantity());
                updatedProductSizes.add(productSize);
            }

            Order order = new Order();
            order.setUser(user);
            order.setStatus(1);
            order.setAddress(orderRequest.getAddress());
            order.setPhoneNumberReceive(orderRequest.getPhoneNumberReceive());
            order.setNameReceive(orderRequest.getNameReceive());
            order.setShippingMethod(orderRequest.getShippingMethod());
            order.setTotalAmount(totalAmount);
            order.setCreatedAt(new Date());

            Order savedOrder = orderRepository.save(order);

            for (OrderItem orderItem : orderItems) {
                KeyOrderItem keyOrderItem = new KeyOrderItem(savedOrder.getId(), orderItem.getProduct().getId());
                orderItem.setKeyOrderItem(keyOrderItem);
                orderItem.setCreatedAt(savedOrder.getCreatedAt());
                orderItemRepository.save(orderItem);
            }

            for (ProductSize productSize : updatedProductSizes) {
                productSizeRepository.save(productSize);
            }

            responseData.setSuccess(true);
            responseData.setDescription("Order placed successfully");
            return responseData;
        } catch (Exception e) {
            e.printStackTrace();
            responseData.setSuccess(false);
            responseData.setDescription("Order failed");
            return responseData;
        }
    }

    @Override
    @Transactional
    public ResponseData checkoutInCart(OrderRequest orderRequest) {
        ResponseData responseData = new ResponseData();
        try {
            User user = userRepository.findById(orderRequest.getUserId());
            if (user == null) {
                responseData.setSuccess(false);
                responseData.setDescription("User not found");
                return responseData;
            }

            Cart cart = cartRepository.findByUser(user);
            if(cart == null) {
                responseData.setSuccess(false);
                responseData.setDescription("Cart is empty");
                return responseData;
            }

            long totalAmount = 0;
            List<OrderItem> orderItems = new ArrayList<>();
            List<ProductSize> updatedProductSizes = new ArrayList<>();

            for (CartItem cartItem : cart.getCartItems()) {
                Product product = cartItem.getProduct();
                ProductSize productSize = productSizeRepository.findByProductAndSize(product, cartItem.getSize());

                if (productSize == null || productSize.getStock() < cartItem.getQuantity()) {
                    responseData.setSuccess(false);
                    responseData.setDescription(product.getName()+" not enough");
                    return responseData;
                }

                OrderItem orderItem = new OrderItem();
                orderItem.setProduct(product);
                orderItem.setQuantity(cartItem.getQuantity());
                orderItem.setNote("Không có ghi chú");
                orderItem.setPrice(product.getPrice());
                orderItem.setSize(cartItem.getSize());
                totalAmount += product.getPrice() * cartItem.getQuantity();
                orderItems.add(orderItem);

                productSize.setStock(productSize.getStock() - cartItem.getQuantity());
                updatedProductSizes.add(productSize);
            }

            Order order = new Order();
            order.setUser(user);
            order.setStatus(1);
            order.setAddress(orderRequest.getAddress());
            order.setPhoneNumberReceive(orderRequest.getPhoneNumberReceive());
            order.setNameReceive(orderRequest.getNameReceive());
            order.setShippingMethod(orderRequest.getShippingMethod());
            order.setTotalAmount(totalAmount);
            order.setCreatedAt(new Date());

            Order savedOrder = orderRepository.save(order);

            for (OrderItem orderItem : orderItems) {
                KeyOrderItem keyOrderItem = new KeyOrderItem(savedOrder.getId(), orderItem.getProduct().getId());
                orderItem.setKeyOrderItem(keyOrderItem);
                orderItem.setCreatedAt(savedOrder.getCreatedAt());
                orderItemRepository.save(orderItem);
            }

            for (ProductSize productSize : updatedProductSizes) {
                productSizeRepository.save(productSize);
            }

            cartItemRepository.deleteAll(cart.getCartItems());
            cart.setTotalAmount(0L);
            responseData.setSuccess(true);
            responseData.setDescription("Success");
            return responseData;
        } catch (Exception e) {
            e.printStackTrace();
            responseData.setSuccess(false);
            responseData.setDescription("Fail");
            return responseData;
        }
    }

    @Override
    public ResponseData getAllProductSells() {
        ResponseData responseData = new ResponseData();
        List<Order> orders = orderRepository.findAll();
        Map<Long, Map<Integer, ProductSellDTO>> productSells = new TreeMap<>();
        for(Order order : orders) {
            List<OrderItem> orderItems = order.getOrderItems();

            for(OrderItem orderItem : orderItems) {
                ProductSellDTO productSellDTO;
                long productId = orderItem.getProduct().getId();
                int size = orderItem.getSize();

                Map<Integer, ProductSellDTO> sizeMap = productSells.computeIfAbsent(productId, k -> new HashMap<>());
                if(sizeMap.containsKey(size)) {
                    productSellDTO = sizeMap.get(size);
                    productSellDTO.setQuantity(orderItem.getQuantity() + productSellDTO.getQuantity());
                    productSellDTO.setTotalRevenue(orderItem.getProduct().getPrice() * orderItem.getQuantity() + productSellDTO.getTotalRevenue());
                }
                else{
                    productSellDTO = new ProductSellDTO();
                    productSellDTO.setProductId(productId);
                    productSellDTO.setProductName(orderItem.getProduct().getName());
                    productSellDTO.setProductImage(orderItem.getProduct().getImage());
                    productSellDTO.setProductDescription(orderItem.getProduct().getDescription());
                    productSellDTO.setBrand(orderItem.getProduct().getBrand().getName());
                    productSellDTO.setCategory(orderItem.getProduct().getCategory().getName());
                    productSellDTO.setProductPrice(orderItem.getProduct().getPrice());
                    productSellDTO.setQuantity(orderItem.getQuantity());
                    productSellDTO.setTotalRevenue(orderItem.getProduct().getPrice() * orderItem.getQuantity());
                    productSellDTO.setSize(orderItem.getSize());
                    sizeMap.put(size, productSellDTO);
                }
            }
        }
        List<ProductSellDTO> productSellDTOList = new ArrayList<>();
        for (Map<Integer, ProductSellDTO> sizeMap : productSells.values()) {
            productSellDTOList.addAll(sizeMap.values());
        }
        productSellDTOList.sort((p1, p2) -> {
            int quantityComparison = Integer.compare(p2.getQuantity(), p1.getQuantity());
            if (quantityComparison == 0) {
                return Long.compare(p2.getTotalRevenue(), p1.getTotalRevenue());
            }
            return quantityComparison;
        });
        responseData.setSuccess(true);
        responseData.setData(productSellDTOList);
        return responseData;
    }
}

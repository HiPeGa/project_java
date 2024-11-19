package com.btl.snaker.service;

import com.btl.snaker.dto.CartDTO;
import com.btl.snaker.dto.CartItemDTO;
import com.btl.snaker.entity.*;
import com.btl.snaker.payload.ResponseData;
import com.btl.snaker.payload.request.CartRequest;
import com.btl.snaker.repository.*;
import com.btl.snaker.service.imp.CartServiceImp;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Service
public class CartService implements CartServiceImp {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private ProductSizeRepository productSizeRepository;

    @Override
    public ResponseData getCart(long userId) {
        ResponseData responseData = new ResponseData();
        User user = userRepository.findById(userId);
        Cart cart = cartRepository.findByUser(user);
        if(user == null){
            responseData.setSuccess(false);
            responseData.setDescription("User not found");
            return responseData;
        }
        if(cart == null) {
            cart = new Cart();
            cart.setUser(user);
            cart.setTotalAmount(0L);
            cart.setCartItems(new ArrayList<>());
            cartRepository.save(cart);
        }
        CartDTO cartDTO = new CartDTO();
        cartDTO.setId(cart.getId());
        cartDTO.setUserId(user.getId());
        List<CartItemDTO> cartItemDTOS = new ArrayList<>();
        for(CartItem cartItem : cart.getCartItems()){
            CartItemDTO cartItemDTO = new CartItemDTO();
            cartItemDTO.setProductId(cartItem.getProduct().getId());
            cartItemDTO.setProductImage(String.valueOf(cartItem.getProduct().getImage()));
            cartItemDTO.setProductName(cartItem.getProduct().getName());
            cartItemDTO.setProductDescription(cartItem.getProduct().getDescription());
            cartItemDTO.setProductBrand(cartItem.getProduct().getBrand().getName());
            cartItemDTO.setProductCategory(cartItem.getProduct().getCategory().getName());
            cartItemDTO.setProductPrice(cartItem.getProduct().getPrice() * cartItem.getQuantity());
            cartItemDTO.setProductSize(cartItem.getSize());
            cartItemDTO.setProductQuantity(cartItem.getQuantity());
            cartItemDTOS.add(cartItemDTO);
        }
        cartDTO.setCartItemDTOS(cartItemDTOS);
        long totalAmount = cartItemDTOS.stream()
                .mapToLong(item -> item.getProductPrice())
                .sum();
        cartDTO.setTotalAmount(totalAmount);
        responseData.setData(cartDTO);
        responseData.setSuccess(true);
        return responseData;
    }

    @Override
    public ResponseData insertToCart(CartRequest cartRequest) {
        ResponseData responseData = new ResponseData();
        User user = userRepository.findById(cartRequest.getUserId());
        if(user == null){
            responseData.setSuccess(false);
            responseData.setDescription("User not found");
            return responseData;
        }
        Cart cart = cartRepository.findByUser(user);
        if(cart == null) {
            cart = new Cart();
            cart.setUser(user);
            cart.setTotalAmount((long) 0);
            cart.setCartItems(new ArrayList<>());
            cart.setCreatedAt(new Date());
            cartRepository.save(cart);
        }
        Product product = productRepository.findById(cartRequest.getProductId());
        if(product == null) {
            responseData.setSuccess(false);
            responseData.setDescription("Product not found");
            return responseData;
        }

        ProductSize productSize = productSizeRepository.findByProductAndSize(product, cartRequest.getSize());
        if(productSize == null || productSize.getStock() < cartRequest.getQuantity()) {
            responseData.setSuccess(false);
            responseData.setDescription("Product not enough");
            return responseData;
        }

        CartItem existCartItem = cart.getCartItems().stream()
                .filter(item -> item.getProduct().getId().equals(cartRequest.getProductId()) &&
                        item.getSize().equals(cartRequest.getSize()))
                .findFirst().orElse(null);
        long totalAmount = 0;
        if(existCartItem != null) {
            existCartItem.setQuantity(existCartItem.getQuantity()+cartRequest.getQuantity());
            cartItemRepository.save(existCartItem);
        }
        else{
            CartItem newCartItem = new CartItem();
            newCartItem.setCreatedAt(new Date());
            newCartItem.setProduct(product);
            newCartItem.setSize(cartRequest.getSize());
            newCartItem.setQuantity(cartRequest.getQuantity());
            newCartItem.setPrice(product.getPrice());
            newCartItem.setCart(cart);
            totalAmount = newCartItem.getProduct().getPrice() * newCartItem.getQuantity();
            cartItemRepository.save(newCartItem);
        }
        totalAmount += cart.getTotalAmount();
        cart.setTotalAmount(totalAmount);
        cart.setCreatedAt(new Date());
        cartRepository.save(cart);
        responseData.setSuccess(true);
        responseData.setDescription("Success");
        return responseData;
    }

    @Override
    public Boolean deleteCartItem(long cartItemId) {
        Boolean isSuccess = false;
        CartItem cartItem = cartItemRepository.findById(cartItemId);
        Cart cart = cartItem.getCart();
        if (cartItem != null) {
            cartItemRepository.delete(cartItem);
            long totalAmount = cart.getCartItems().stream().mapToLong(item -> item.getProduct().getPrice() * item.getQuantity()).sum();
            cart.setTotalAmount(totalAmount);
            cartRepository.save(cart);
            isSuccess = true;
        }
        return isSuccess;
    }

    @Override
    public ResponseData updateQuantitCartItem(long cartItemId, int quantity) {
        ResponseData responseData = new ResponseData();
        CartItem cartItem = cartItemRepository.findById(cartItemId);
        Cart cart = cartItem.getCart();
        ProductSize productSize = productSizeRepository.findByProductAndSize(cartItem.getProduct(), cartItem.getSize());
        if(productSize == null || productSize.getStock() < quantity) {
            responseData.setSuccess(false);
            responseData.setDescription("Product not enough");
            return responseData;
        }
        if (quantity == 0) {
            cartItemRepository.delete(cartItem);
            cart.getCartItems().remove(cartItem);
        } else {
            cartItem.setQuantity(quantity);
            cartItemRepository.save(cartItem);
        }
        long totalAmount = cart.getCartItems().stream().mapToLong(item -> item.getProduct().getPrice() * item.getQuantity()).sum();
        cart.setTotalAmount(totalAmount);
        cartRepository.save(cart);

        responseData.setSuccess(true);
        responseData.setDescription("Success");
        return responseData;
    }

    @Override
    public ResponseData deleteAllCartItems(long userId) {
        ResponseData responseData = new ResponseData();
        User user = userRepository.findById(userId);
        if(user == null){
            responseData.setSuccess(false);
            responseData.setDescription("User not found");
            return responseData;
        }
        Cart cart = cartRepository.findByUser(user);
        if(cart == null){
            responseData.setSuccess(false);
            responseData.setDescription("Cart not found");
            return responseData;
        }
        if(!cart.getCartItems().isEmpty()){
            cartItemRepository.deleteAll(cart.getCartItems());
            cart.getCartItems().clear();
            cart.setTotalAmount(0L);
            cartRepository.save(cart);
            cartRepository.save(cart);
        }
        else{
            responseData.setSuccess(false);
            responseData.setDescription("Cart is empty");
            return responseData;
        }
        responseData.setSuccess(true);
        responseData.setDescription("Success");
        return responseData;
    }
}

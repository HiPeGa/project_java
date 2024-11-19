package com.btl.snaker.controller;

import com.btl.snaker.payload.ResponseData;
import com.btl.snaker.service.imp.UserServiceImp;
import com.btl.snaker.utils.JwtUtilHelper;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin("*")
@RestController
@RequestMapping("/users")
public class UserController {

    @Autowired
    private UserServiceImp userServiceImp;

    @Autowired
    private JwtUtilHelper jwtUtilHelper;

    @GetMapping("/user/all")
    public ResponseEntity<?> getAllUsers() {
        ResponseData responseData = new ResponseData();
        responseData.setSuccess(true);
        responseData.setData(userServiceImp.getAllUsers());
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }

    private String getTokenFromHeader(HttpServletRequest request) {
        String header = request.getHeader("Authorization");
        if (header != null && header.startsWith("Bearer ")) {
            return header.substring(7);
        }
        return null;
    }

    @GetMapping("/user/me")
    public ResponseEntity<?> getCurrentUser(HttpServletRequest httpServletRequest) {
        ResponseData responseData = new ResponseData();
        String token = getTokenFromHeader(httpServletRequest);
        if(token != null && jwtUtilHelper.verifyToken(token)) {
            String email = jwtUtilHelper.extractEmail(token);
            if(email != null) {
                responseData = userServiceImp.getUserByEmail(email);
            }
        }
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }

    @PostMapping("/user/change/password")
    public ResponseEntity<?> changePassword(@RequestParam long id,
                                            @RequestParam String oldPassword,
                                            @RequestParam String newPassword) {
        return new ResponseEntity<>(userServiceImp.changePassword(id, oldPassword, newPassword), HttpStatus.OK);
    }

    @PostMapping("/user/change/information")
    public ResponseEntity<?> changeInformation(@RequestParam long id,
                                               @RequestParam String phone,
                                               @RequestParam String address){
        return new ResponseEntity<>(userServiceImp.updateInformation(id, phone, address), HttpStatus.OK);
    }

    @PostMapping("/admin/assign/{id}")
    public ResponseEntity<?> assignUserToAdmin(@PathVariable long id) {
        ResponseData responseData = new ResponseData();
        responseData.setSuccess(userServiceImp.assignUser(id));
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }

    @DeleteMapping("/admin/delete/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable long id) {
        ResponseData responseData=new ResponseData();
        boolean isSuccess = userServiceImp.deleteUser(id);
        responseData.setData(isSuccess);
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }
}

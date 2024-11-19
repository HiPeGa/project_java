package com.btl.snaker.mapper;

import com.btl.snaker.dto.UserDTO;
import com.btl.snaker.entity.User;

import java.util.ArrayList;
import java.util.List;

public class UserMapper {
    public static UserDTO toUserDTO(User user) {
        UserDTO userDTO = new UserDTO();
        userDTO.setId(user.getId());
        userDTO.setEmail(user.getEmail());
        userDTO.setFullName(user.getFullname());
        userDTO.setPassword(user.getPassword());
        userDTO.setRole(user.getRole().getId() == 1 ? "admin" : "customer");
        userDTO.setToken(user.getToken());
        userDTO.setAddress(user.getAddress());
        userDTO.setPhone(user.getPhone());
        if(user.getActive()==1){
            userDTO.setActive("Active");
        }
        else{
            userDTO.setActive("Deactive");
        }
        return userDTO;
    }
    public static List<UserDTO> toDTOList(List<User> usersList) {
        List<UserDTO> usersDTOList = new ArrayList<>();
        for (User user : usersList) {
            usersDTOList.add(toUserDTO(user));
        }
        return usersDTOList;
    }
}

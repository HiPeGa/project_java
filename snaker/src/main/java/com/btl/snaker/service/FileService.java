package com.btl.snaker.service;

import com.btl.snaker.payload.ResponseData;
import com.btl.snaker.service.imp.FileServiceImp;
import com.cloudinary.Cloudinary;
import org.springframework.core.io.Resource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Map;

@Service
public class FileService implements FileServiceImp {

    @Autowired
    private Cloudinary cloudinary;

    @Value("${fileUpload.rootPath}")
    private String rootPath;
    private Path root;

    public void init(){
        try{
            root = Paths.get(rootPath).toAbsolutePath().normalize();
            if(Files.notExists(root)){
                Files.createDirectories(root);
            }

        }catch (Exception e){
            System.out.println("ERROR Create Directory "+e.getMessage());
        }
    }

    @Override
    public Boolean saveFile(MultipartFile file) {
        init();
        try {
            Files.copy(file.getInputStream(), this.root.resolve(file.getOriginalFilename()), StandardCopyOption.REPLACE_EXISTING);
            return true;
        } catch (Exception e) {
            System.out.println("ERROR Save File "+e.getMessage());
            return false;
        }
    }

    @Override
    public Resource loadFile(String fileName) {
        init();
        try {
            Path file=root.resolve(fileName);
            Resource resource = new UrlResource(file.toUri());

            if(resource.exists() || resource.isReadable()){
                return resource;
            }
        }catch (Exception e){
            System.out.println("ERROR Load File "+e.getMessage());
        }
        return null;
    }

    @Override
    public ResponseData uploadFileCloudinary(MultipartFile file) {
        ResponseData responseData = new ResponseData();
        try{
            Map uploadResult = this.cloudinary.uploader().upload(file.getBytes(), Map.of());
            String url = uploadResult.get("url").toString();
            responseData.setSuccess(true);
            responseData.setData(url);
            responseData.setSuccess(true);
        } catch (IOException io){
            responseData.setData(io.getMessage());
            responseData.setSuccess(false);
        }
        return responseData;
    }
}

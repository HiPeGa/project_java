package com.btl.snaker.service.imp;

import com.btl.snaker.payload.ResponseData;
import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface FileServiceImp {
    Boolean saveFile(MultipartFile file);
    Resource loadFile(String fileName);

    ResponseData uploadFileCloudinary(MultipartFile file) throws IOException;
}

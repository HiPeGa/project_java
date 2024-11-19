package com.btl.snaker.controller;

import com.btl.snaker.entity.Contact;
import com.btl.snaker.service.imp.ContactServiceImp;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin("*")
@RestController
@RequestMapping("/contact")
public class ContactController {

    @Autowired
    private ContactServiceImp contactServiceImp;

    @GetMapping("/admin/get/all")
    public ResponseEntity<?> getAllContacts() {
        return new ResponseEntity<>(contactServiceImp.getAllContacts(), HttpStatus.OK);
    }

    @GetMapping("/admin/get/{id}")
    public ResponseEntity<Contact> getContactById(@PathVariable long id) {
        Contact contact = contactServiceImp.getContactById(id);
        return contact != null ? new ResponseEntity<>(contact, HttpStatus.OK) : new ResponseEntity<>(null,HttpStatus.OK);
    }

    @PostMapping("/create")
    public ResponseEntity<Contact> createContact(@RequestBody Contact contact) {
        return new ResponseEntity<>(contactServiceImp.createContact(contact), HttpStatus.OK);
    }

    @PutMapping("/admin/markAsRead/{id}")
    public ResponseEntity<?> markAsRead(@PathVariable long id) {
        boolean success = contactServiceImp.maskAsRead(id);
        return new ResponseEntity<>(success, HttpStatus.OK);
    }

}

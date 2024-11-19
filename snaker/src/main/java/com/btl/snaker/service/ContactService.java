package com.btl.snaker.service;

import com.btl.snaker.entity.Contact;
import com.btl.snaker.repository.ContactRepository;
import com.btl.snaker.service.imp.ContactServiceImp;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ContactService implements ContactServiceImp {

    @Autowired
    private ContactRepository contactRepository;

    @Override
    public List<Contact> getAllContacts() {
        return contactRepository.findAll();
    }

    @Override
    public Contact getContactById(long id) {
        return contactRepository.findById(id).orElse(null);
    }

    @Override
    public Contact createContact(Contact contact) {
        return contactRepository.save(contact);
    }

    @Override
    public Boolean maskAsRead(long id) {
        Contact contact = contactRepository.findById(id).orElse(null);
        if(contact != null && !contact.isRead()) {
            contact.setRead(true);
            contactRepository.save(contact);
            return true;
        }
        return false;
    }
}

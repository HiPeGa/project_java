package com.btl.snaker.service.imp;

import com.btl.snaker.entity.Contact;

import java.util.List;

public interface ContactServiceImp {
    List<Contact> getAllContacts();
    Contact getContactById(long id);
    Contact createContact(Contact contact);
    Boolean maskAsRead(long id);
}

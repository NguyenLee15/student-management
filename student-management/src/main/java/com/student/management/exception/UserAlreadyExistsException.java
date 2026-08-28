// cSpell:disable
package com.student.management.exception;

public class UserAlreadyExistsException extends RuntimeException {
    public UserAlreadyExistsException(String userName) {
        super("User đã tồn tại: " + userName);
    }
}


// cSpell:disable
package com.student.management.exception;

public class UserAlreadyExistsException extends RuntimeException {
    public UserAlreadyExistsException(String userName) {
        super("User already exists: " + userName);
    }
}


package com.project.Flowgrid.validator;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

import java.util.regex.Pattern;

public class StrongPasswordValidator implements ConstraintValidator<StrongPassword, String> {

    private int minLength;
    private boolean requireUppercase;
    private boolean requireLowercase;
    private boolean requireDigit;
    private boolean requireSpecialChar;
    
    @Override
    public void initialize(StrongPassword constraintAnnotation) {
        this.minLength = constraintAnnotation.minLength();
        this.requireUppercase = constraintAnnotation.requireUppercase();
        this.requireLowercase = constraintAnnotation.requireLowercase();
        this.requireDigit = constraintAnnotation.requireDigit();
        this.requireSpecialChar = constraintAnnotation.requireSpecialChar();
    }
    
    @Override
    public boolean isValid(String password, ConstraintValidatorContext context) {
        if (password == null || password.isEmpty()) {
            return false;
        }
        
        boolean isValid = password.length() >= minLength;
        
        if (requireUppercase) {
            isValid = isValid && Pattern.compile("[A-Z]").matcher(password).find();
        }
        
        if (requireLowercase) {
            isValid = isValid && Pattern.compile("[a-z]").matcher(password).find();
        }
        
        if (requireDigit) {
            isValid = isValid && Pattern.compile("[0-9]").matcher(password).find();
        }
        
        if (requireSpecialChar) {
            isValid = isValid && Pattern.compile("[!@#$%^&*()_+\\-=\\[\\]{};':\"\\\\|,.<>/?]").matcher(password).find();
        }
        
        return isValid;
    }
} 

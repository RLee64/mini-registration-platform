package com.nzpmc.backend.validation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

import java.util.List;

public class NotEmptyFieldsValidator implements ConstraintValidator<NotEmptyFields, List<String>> {
    @Override
    public boolean isValid(List<String> fields, ConstraintValidatorContext context) {
        // Checks if any field is empty or purely whitespace
        return fields.stream().allMatch(field -> field != null && !field.trim().isEmpty());
    }
}

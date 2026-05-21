package com.solstice.backend.validation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Documented
@Constraint(validatedBy = ValidFileValidator.class)
@Target(
  {
    ElementType.METHOD,
    ElementType.FIELD,
    ElementType.ANNOTATION_TYPE,
    ElementType.CONSTRUCTOR,
    ElementType.PARAMETER,
    ElementType.TYPE_USE,
  }
)
@Retention(RetentionPolicy.RUNTIME)
public @interface ValidFile {
  String message() default "File is required and cannot be empty";

  Class<?>[] groups() default {};

  Class<? extends Payload>[] payload() default {};
}

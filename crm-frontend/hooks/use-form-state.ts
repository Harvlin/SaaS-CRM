"use client"

import type React from "react"
import { useState, useCallback } from "react"

type ValidationErrors<T> = Partial<Record<keyof T, string>>
type Validator<T> = (values: T) => ValidationErrors<T>

interface UseFormStateOptions<T> {
  initialValues: T
  validator?: Validator<T>
  onSubmit?: (values: T) => void | Promise<void>
}

export function useFormState<T extends Record<string, any>>({
  initialValues,
  validator,
  onSubmit,
}: UseFormStateOptions<T>) {
  const [values, setValues] = useState<T>(initialValues)
  const [errors, setErrors] = useState<ValidationErrors<T>>({})
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = useCallback(
    (field: keyof T, value: any) => {
      setValues((prev) => ({ ...prev, [field]: value }))

      // Clear error when field is changed
      if (errors[field]) {
        setErrors((prev) => {
          const newErrors = { ...prev }
          delete newErrors[field]
          return newErrors
        })
      }
    },
    [errors],
  )

  const handleBlur = useCallback(
    (field: keyof T) => {
      setTouched((prev) => ({
        ...prev,
        [field]: true,
      }))

      // Validate field on blur if validator exists
      if (validator) {
        const fieldErrors = validator(values)
        if (fieldErrors[field]) {
          setErrors((prev) => ({
            ...prev,
            [field]: fieldErrors[field],
          }))
        }
      }
    },
    [validator, values],
  )

  const validateForm = useCallback(() => {
    if (!validator) return true

    const formErrors = validator(values)
    const hasErrors = Object.keys(formErrors).length > 0

    if (hasErrors) {
      setErrors(formErrors)

      // Mark all fields with errors as touched
      const newTouched: Partial<Record<keyof T, boolean>> = {}
      Object.keys(formErrors).forEach((key) => {
        newTouched[key as keyof T] = true
      })
      setTouched((prev) => ({ ...prev, ...newTouched }))
    }

    return !hasErrors
  }, [validator, values])

  const handleSubmit = useCallback(
    async (e?: React.FormEvent) => {
      if (e) e.preventDefault()

      const isValid = validateForm()
      if (!isValid) return

      if (onSubmit) {
        setIsSubmitting(true)
        try {
          await onSubmit(values)
        } finally {
          setIsSubmitting(false)
        }
      }
    },
    [validateForm, onSubmit, values],
  )

  const resetForm = useCallback(() => {
    setValues(initialValues)
    setErrors({})
    setTouched({})
  }, [initialValues])

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    setValues,
  }
}

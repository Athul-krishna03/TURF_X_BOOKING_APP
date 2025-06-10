"use client"

import type React from "react"
import { Field, ErrorMessage } from "formik"
import { Input } from "../../ui/input"
import { Textarea } from "../../ui/textarea"
import { Label } from "../../ui/label"

interface FormFieldProps {
  name: string
  label: string
  type?: string
  placeholder?: string
  icon?: React.ReactNode
  required?: boolean
  as?: "input" | "textarea"
  rows?: number
  readOnly?: boolean
  className?: string
}

export default function FormField({
  name,
  label,
  type = "text",
  placeholder,
  icon,
  required = false,
  as = "input",
  rows = 3,
  readOnly = false,
  className = "",
}: FormFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={name} className="text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      <div className="relative">
        {icon && <div className="absolute left-3 top-3 h-4 w-4 text-gray-400">{icon}</div>}
        <Field
          as={as === "textarea" ? Textarea : Input}
          type={type}
          id={name}
          name={name}
          rows={as === "textarea" ? rows : undefined}
          readOnly={readOnly}
          className={`${icon ? "pl-10" : ""} h-12 border-gray-200 focus:border-green-500 focus:ring-green-500 ${
            readOnly ? "bg-gray-50" : ""
          } ${className}`}
          placeholder={placeholder}
        />
      </div>
      <ErrorMessage name={name} component="p" className="text-red-500 text-sm" />
    </div>
  )
}

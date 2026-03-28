"use client"

import * as React from "react"
import {
  Controller,
  FormProvider,
  useFormContext,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
} from "react-hook-form"

export const Form = FormProvider

type FormFieldContextValue = {
  name: string
}

const FormFieldContext = React.createContext<FormFieldContextValue>(
  {} as FormFieldContextValue
)

export function FormField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  ...props
}: ControllerProps<TFieldValues, TName>) {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  )
}

export function useFormField() {
  const fieldContext = React.useContext(FormFieldContext)
  const { getFieldState, formState } = useFormContext()

  const fieldState = getFieldState(fieldContext.name, formState)

  return {
    name: fieldContext.name,
    ...fieldState,
  }
}

export function FormItem({ children }: { children: React.ReactNode }) {
  return <div className="space-y-2">{children}</div>
}

export function FormLabel({ children }: { children: React.ReactNode }) {
  return <label className="text-sm font-medium">{children}</label>
}

export function FormControl({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>
}

export function FormMessage() {
  const { error } = useFormField()
  if (!error) return null
  return <p className="text-sm text-red-500">{error.message?.toString()}</p>
}
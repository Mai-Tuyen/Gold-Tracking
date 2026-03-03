'use client'

import * as React from 'react'
import {
  Controller,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
  FormProvider,
  useFormContext
} from 'react-hook-form'

import { Label } from '@/global/components/ui/label'
import { cn } from '@/global/lib/utils'

const Form = FormProvider

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = {
  name: TName
}

const FormFieldContext = React.createContext<FormFieldContextValue>({} as FormFieldContextValue)

function FormField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({ ...props }: ControllerProps<TFieldValues, TName>) {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  )
}

function useFormField() {
  const fieldContext = React.useContext(FormFieldContext)
  const itemContext = React.useContext(FormItemContext)
  const { getFieldState, formState } = useFormContext()

  const fieldState = getFieldState(fieldContext.name, formState)

  if (!fieldContext.name) {
    return { id: '', name: '', formItemId: '', formDescriptionId: '', formMessageId: '', ...fieldState }
  }

  return {
    id: `${itemContext.id}-${fieldContext.name}`,
    name: fieldContext.name,
    formItemId: `${itemContext.id}-${fieldContext.name}-form-item`,
    formDescriptionId: `${itemContext.id}-${fieldContext.name}-form-item-description`,
    formMessageId: `${itemContext.id}-${fieldContext.name}-form-item-message`,
    ...fieldState
  }
}

const FormItemContext = React.createContext<{ id: string }>({ id: '' })

function FormItem({ className, ...props }: React.ComponentProps<'div'>) {
  const id = React.useId()
  return (
    <FormItemContext.Provider value={{ id }}>
      <div data-slot='form-item' className={cn('space-y-2', className)} {...props} />
    </FormItemContext.Provider>
  )
}

function FormLabel({ className, ...props }: React.ComponentProps<typeof Label>) {
  const { error, formItemId } = useFormField()
  return (
    <Label
      className={cn(error && 'text-destructive', className)}
      htmlFor={formItemId}
      {...props}
    />
  )
}

function FormControl({ children }: { children?: React.ReactNode }) {
  const { error, formItemId, formDescriptionId, formMessageId } = useFormField()
  const child = React.Children.only(children) as React.ReactElement<Record<string, unknown>>
  return React.cloneElement(child, {
    id: formItemId,
    'aria-describedby': !error ? formDescriptionId : `${formDescriptionId} ${formMessageId}`,
    'aria-invalid': !!error
  } as Record<string, unknown>)
}

function FormDescription({ className, ...props }: React.ComponentProps<'p'>) {
  const { formDescriptionId } = useFormField()
  return (
    <p
      id={formDescriptionId}
      data-slot='form-description'
      className={cn('text-muted-foreground text-sm', className)}
      {...props}
    />
  )
}

function FormMessage({ className, children, ...props }: React.ComponentProps<'p'>) {
  const { error, formMessageId } = useFormField()
  const body = error ? String(error?.message) : children
  if (!body) return null
  return (
    <p
      id={formMessageId}
      data-slot='form-message'
      className={cn('text-destructive text-sm font-medium', className)}
      {...props}
    >
      {body}
    </p>
  )
}

export {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useFormField
}

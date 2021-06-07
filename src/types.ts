export type FormValues = {
  [field: string]: any
}

export type FieldError = string | string[] | undefined

export type FormErrors<Values = any> = {
  [K in keyof Values & string]?: FieldError
}

export type FormTouched<Values = any> = {
  [K in keyof Values & string]?: boolean | undefined
}

export type Form<Values = FormValues> = {
  values: Values
  validValues: Values
  submittedValues: Values | undefined
  errors: FormErrors<Values>
  touched: FormTouched<Values>
  isSubmitting: boolean
  isValidating: boolean
  readonly isDirty: boolean
  readonly isValid: boolean
  setErrors(errors: FormErrors<Values>): void
  setTouched(touched: FormTouched<Values>): void
  setValues(values: Values): void
  setFieldValue(field: keyof Values & string, value: any): void
  setFieldError(field: keyof Values & string, message: FieldError): void
  addFieldError(field: keyof Values & string, message: FieldError): void
  setFieldTouched(field: keyof Values & string, isTouched?: boolean): void
  getFieldValue(field: keyof Values & string): any
  getFieldError(field: keyof Values & string): string | undefined
  getFieldErrors(field: keyof Values & string): string[] | undefined
  isFieldTouched(field: keyof Values & string): boolean
  isFieldValid(field: keyof Values & string): boolean
  validate(): Promise<FormErrors<Error>>
  reset(values?: Values, isValid?: boolean): void
  resetField(field: keyof Values & string, value?: any): void
  submit(): Promise<void>
  handleSubmit: (e?: React.FormEvent<HTMLFormElement>) => Promise<void>
  handleReset: (e?: React.SyntheticEvent<any>) => void
}

export type FormValidate<Values = any> = (
  values: Values
) => FormErrors<Values> | Promise<FormErrors<Values>>

export type ValidateDebounce =
  | boolean
  | number
  | { wait?: number; leading?: boolean }

export type FormConfig<Values = any> = {
  initialValues?: Values | (() => Values)
  validateOnChange?: boolean
  validateOnBlur?: boolean
  validateDebounce?: ValidateDebounce
  onSubmit?: (values: Values) => void | Promise<any>
  onValidate?: FormValidate<Values>
  onFailedSubmit?: () => void
}

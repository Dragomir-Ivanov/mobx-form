import * as React from "react"
import { FormConfig } from "../src"
import { renderForm } from "./__helpers/renderForm"

const InitialValues = {
  name: "bill",
  surname: "murray",
  preferences: {
    color: "blue",
  },
  friends: [
    {
      name: "bax",
      age: 23,
    },
  ],
}

function renderTestForm(props: FormConfig = {}) {
  let renderNameCount = 0

  const result = renderForm(
    (form) => {
      const { Field } = form
      return (
        <>
          <Field name="name">
            {(field) => {
              renderNameCount++
              return (
                <div>
                  <input
                    type="text"
                    {...field.input}
                    data-testid="name-input"
                  />
                  {field.touched && field.error}
                </div>
              )
            }}
          </Field>
          <Field name="surname">
            {(field) => (
              <div>
                <input
                  type="text"
                  {...field.input}
                  data-testid="surname-input"
                />
                {field.touched && field.error}
              </div>
            )}
          </Field>
          <Field name="preferences.color">
            {(field) => (
              <div>
                <input type="text" {...field.input} data-testid="color-input" />
                {field.touched && field.error}
              </div>
            )}
          </Field>
          <Field name="friends.0.name">
            {(field) => (
              <div>
                <input
                  type="text"
                  {...field.input}
                  data-testid="friend-name-input"
                />
                {field.touched && field.error}
              </div>
            )}
          </Field>
          <Field name="friends.0.age">
            {(field) => (
              <div>
                <input
                  type="number"
                  {...field.input}
                  data-testid="friend-age-input"
                />
                {field.touched && field.error}
              </div>
            )}
          </Field>
          <button type="submit" data-testid="submit-button">
            Submit
          </button>
        </>
      )
    },
    {
      initialValues: InitialValues,
      ...props,
    }
  )

  return {
    ...result,
    renderNameCount() {
      return renderNameCount
    },
  }
}

describe("useForm", () => {
  it("has initial values", () => {
    const { form } = renderTestForm()

    expect(form().values).toEqual(InitialValues)
  })

  it("does not change initial values", () => {
    const { form } = renderTestForm()
    form().setFieldValue("name", "jean")

    expect(form().values.name).toEqual("jean")
    expect(InitialValues.name).toEqual("bill")
  })

  it("values don't change when initialValues change", () => {
    const { form, rerender } = renderTestForm()

    expect(form().values).toEqual(InitialValues)

    rerender({ initialValues: { name: "donald", surname: "duck" } })

    expect(form().values).toEqual(InitialValues)
  })

  it("setFieldValue", () => {
    const { form, getByTestId } = renderTestForm()
    form().setFieldValue("name", "jean")
    form().setFieldValue("preferences.color", "red")
    form().setFieldValue("friends.0.name", "robin")
    form().setFieldValue("friends.0.age", 42)

    expect(form().values.name).toEqual("jean")
    expect(form().values.preferences.color).toEqual("red")
    expect(form().values.friends[0].name).toEqual("robin")
    expect(form().values.friends[0].age).toEqual(42)

    function getInputValue(testId: string) {
      const input = getByTestId(testId) as HTMLInputElement
      return input.value
    }

    expect(getInputValue("name-input")).toEqual("jean")
    expect(getInputValue("color-input")).toEqual("red")
    expect(getInputValue("friend-name-input")).toEqual("robin")
    expect(getInputValue("friend-age-input")).toEqual("42")
  })

  it("rerenders only the input", () => {
    const { form, renderCount, renderNameCount } = renderTestForm()

    expect(renderCount()).toBe(1)
    expect(renderNameCount()).toEqual(1)

    form().setFieldValue("name", "jean")

    expect(renderCount()).toEqual(1)
    expect(renderNameCount()).toEqual(2)
  })

  it("uses latest onValidate", () => {
    const onValidate = jest.fn(() => Promise.resolve({}))
    const onValidate2 = jest.fn(() => Promise.resolve({}))
    const { form, rerender } = renderTestForm({ onValidate })

    form().setFieldValue("name", "jean")

    expect(onValidate).toBeCalledTimes(1)

    rerender({ onValidate: onValidate2 })

    form().setFieldValue("name", "jean2")

    expect(onValidate).toBeCalledTimes(1)
    expect(onValidate2).toBeCalledTimes(1)
  })

  it("handles field errors", () => {
    const { form } = renderTestForm()

    form().setFieldError("name", "Empty name")
    form().setFieldError("surname", ["Empty surname", "Another error"])
    form().setFieldError("preferences.color", "Not a nice color")
    form().setFieldError("friends.0.name", "Is it a name?")

    expect(form().getFieldError("name")).toEqual("Empty name")
    expect(form().getFieldError("surname")).toEqual("Empty surname")
    expect(form().getFieldErrors("surname")).toEqual([
      "Empty surname",
      "Another error",
    ])
    expect(form().getFieldError("preferences.color")).toEqual(
      "Not a nice color"
    )
    expect(form().getFieldError("friends.0.name")).toEqual("Is it a name?")
    expect(form().getFieldError("friends.0.surname")).toEqual(undefined)
  })

  it("setErrors", () => {
    const { form } = renderTestForm()

    form().setErrors({
      name: "Empty name",
      surname: ["Empty surname", "Another error"],
      "preferences.color": "Not a nice color",
      "friends.0.name": "Is it a name?",
    })

    expect(form().getFieldError("name")).toEqual("Empty name")
    expect(form().getFieldError("surname")).toEqual("Empty surname")
    expect(form().getFieldErrors("surname")).toEqual([
      "Empty surname",
      "Another error",
    ])
    expect(form().getFieldError("preferences.color")).toEqual(
      "Not a nice color"
    )
    expect(form().getFieldError("friends.0.name")).toEqual("Is it a name?")
    expect(form().getFieldError("friends.0.surname")).toEqual(undefined)
  })

  it("addFieldError", () => {
    const { form } = renderTestForm()

    expect(form().getFieldError("name")).toBe(undefined)

    // single error
    form().addFieldError("name", "Empty name")
    expect(form().getFieldError("name")).toEqual("Empty name")

    // multiple errors
    const expectedErrors = ["Empty name", "Another error"]
    form().addFieldError("name", "Another error")
    expect(form().getFieldError("name")).toEqual("Empty name")
    expect(form().getFieldErrors("name")).toEqual(expectedErrors)

    // undefined do nothing
    form().addFieldError("name", undefined)
    expect(form().getFieldErrors("name")).toEqual(expectedErrors)

    // [] do nothing
    form().addFieldError("name", [])
    expect(form().getFieldErrors("name")).toEqual(expectedErrors)
  })

  it("handles field touched", () => {
    const { form } = renderTestForm()

    form().setFieldTouched("name", true)
    form().setFieldTouched("surname", false)
    form().setFieldTouched("preferences.color") // true if not specified
    form().setFieldTouched("friends.0.name", true)

    expect(form().getFieldTouched("name")).toBe(true)
    expect(form().getFieldTouched("surname")).toBe(false)
    expect(form().getFieldTouched("preferences.color")).toBe(true)
    expect(form().getFieldTouched("friends.0.name")).toBe(true)
    expect(form().getFieldTouched("friends.0.surname")).toBe(false)
  })

  it("setTouched", () => {
    const { form } = renderTestForm()

    form().setTouched({
      name: true,
      surname: false,
      "preferences.color": true,
      "friends.0.name": true,
    })

    expect(form().getFieldTouched("name")).toBe(true)
    expect(form().getFieldTouched("surname")).toBe(false)
    expect(form().getFieldTouched("preferences.color")).toBe(true)
    expect(form().getFieldTouched("friends.0.name")).toBe(true)
    expect(form().getFieldTouched("friends.0.surname")).toBe(false)
  })
})

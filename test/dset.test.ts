import { dset } from "../src/dset"

describe("dset", () => {
  it("works", () => {
    const obj = { a: 1, b: 2 }

    dset(obj, "a", 3)
    expect(obj).toStrictEqual({ a: 3, b: 2 })
  })

  it("remove undefined", () => {
    const obj = { a: 1, b: 2 }

    dset(obj, "a", undefined)
    expect(obj).toStrictEqual({ b: 2 })
  })

  it("remove nested object", () => {
    const obj = { a: 1, b: { c: 3, d: 4 } }

    dset(obj, "b.c", undefined)
    expect(obj).toStrictEqual({ a: 1, b: { d: 4 } })
  })

  it("array works", () => {
    const obj = { a: 1, b: [2] }

    dset(obj, "b.1", 3)
    expect(obj).toStrictEqual({ a: 1, b: [2, 3] })
  })

  it("array remove undefined", () => {
    const obj = {
      a: 1,
      b: [
        { a: 1, b: 2 },
        { c: 2, d: 3 },
      ],
    }

    dset(obj, "b.1.d", undefined)
    expect(obj).toStrictEqual({ a: 1, b: [{ a: 1, b: 2 }, { c: 2 }] })
  })
})

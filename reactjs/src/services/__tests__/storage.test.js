import storage from "../storage.js"

class LocalStorageMock {
    constructor() {
        this.store = {}
    }

    clear() {
        this.store = {}
    }

    getItem(key) {
        return this.store[key] || null
    }

    setItem(key, value) {
        this.store[key] = String(value)
    }

    removeItem(key) {
        delete this.store[key]
    }
}

global.localStorage = new LocalStorageMock()

test("Stores and loads an object", () => {
    const key = "test_object"
    const value = {
        id: 1,
        name: "Test"
    }

    storage.saveObject(key, value)

    expect(storage.loadObject(key)).toStrictEqual(value)
})

test("Stores and loads a date", () => {
    const key = "test_date"
    const value = new Date()

    storage.saveDate(key, value)

    expect(storage.loadDate(key)).toStrictEqual(value)
})

test("Stores and loads a string", () => {
    const key = "test_string"
    const value = "Test"

    storage.saveString(key, value)

    expect(storage.loadString(key)).toStrictEqual(value)
})

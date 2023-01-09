function loadString(key) {
    return localStorage.getItem(key)
}

function saveString(key, value) {
    localStorage.setItem(key, value)
}

function clear() {
    localStorage.clear()
}

function loadObject(key) {
    const value = loadString(key)
    if (value == null) {
        return null
    }

    return JSON.parse(value)
}

function saveObject(key, value) {
    if (value == null) {
        saveString(key, null)
        return
    }

    saveString(key, JSON.stringify(value))
}

function saveDate(key, value) {
    if (value == null) {
        saveString(key, null)
        return
    }

    saveString(key, value.toString())
}

function loadDate(key) {
    const value = loadString(key)
    if (value == null) {
        return null
    }

    return new Date(value)
}

export default {
    loadString,
    saveString,
    clear,
    loadObject,
    saveObject,
    saveDate,
    loadDate
}

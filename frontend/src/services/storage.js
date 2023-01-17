/**
 *
 * @param {string} key
 * @returns {string|null}
 */
function loadString(key) {
    return localStorage.getItem(key)
}

/**
 *
 * @param {string} key
 * @param {string|null} value
 */
function saveString(key, value) {
    localStorage.setItem(key, value)
}

function clear() {
    localStorage.clear()
}

/**
 *
 * @param {string} key
 * @returns {Object|null}
 */
function loadObject(key) {
    const value = loadString(key)
    if (value == null) {
        return null
    }

    return JSON.parse(value)
}

/**
 *
 * @param {string} key
 * @param {Object} value
 */
function saveObject(key, value) {
    if (value == null) {
        saveString(key, null)
        return
    }

    saveString(key, JSON.stringify(value))
}

/**
 *
 * @param {string} key
 * @param {Date} value
 */
function saveDate(key, value) {
    if (value == null) {
        saveString(key, null)
        return
    }

    saveString(key, value.getTime().toString())
}

/**
 *
 * @param {string} key
 * @returns {Date|null}
 */
function loadDate(key) {
    const value = loadString(key)
    if (value == null) {
        return null
    }

    return new Date(parseInt(value))
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

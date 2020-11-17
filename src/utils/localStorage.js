const Storage = window.localStorage

const keyPrefix = 'LF_DEALER_ADMIN_'

const keyMap = {
    ACCESS_TOKEN: keyPrefix + 'ACCESS_TOKEN',
    SIGN_UP_MOBILE: keyPrefix + 'SIGN_UP_MOBILE',
    USER_INFO: keyPrefix + 'USER_INFO'
}

const setItem = (key, value) => {
    const localData = {
        data: value
    }
    return Storage.setItem(key, JSON.stringify(localData))
}

const getItem = key => {
    let value = Storage.getItem(key)
    if (value == null || value == undefined) {
        return null
    }

    return JSON.parse(value).data;
}

const removeItem = key => {
    return Storage.removeItem(key)
}

module.exports = {
    keyMap,
    setItem,
    getItem,
    removeItem
}
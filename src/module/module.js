var toFormat = function (name) {

    for (let i = 0; i < name.length; i++) {
        var type
        if (i == 0) {
            type = name[i].toUpperCase()
        } else if (name[i] == " ") {
            type += name[i]
            type += name[i + 1].toUpperCase()
            i = i + 1
        } else {
            type += name[i].toLowerCase()
        }
    }
    return type
}

module.exports = {
    toFormat
}


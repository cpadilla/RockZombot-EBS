const locales = {
    pt: {
        theSocketIsClosed: 'This socket is closed'
    },
    en: {
        theSocketIsClosed: 'This socket is closed'
    }
}

module.exports = {
    get: language => locales[language || 'en']
}

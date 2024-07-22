let expect = require('expect')
let {generateMessage, generateLocationMessage} = require('./message')

describe('Generate Message', () => {
    it('should generate correct message object', () => {
        let from = "fdv",
            text = "some text",
            message = generateMessage(from, text)

        expect(typeof message.createdAt).toBe('number')
        expect(message).toMatchObject({from, text})
    })
})

describe('Generate Location Message', () => {
    it('should generate correct location object', () => {
        let from = "fdv",
            lat = 15,
            lng = 56
            url = `https://www.google.com/maps?q=${lat},${lng}`,
            message = generateLocationMessage(from, lat, lng)

        expect(typeof message.createdAt).toBe('number')
        expect(message).toMatchObject({from, url})
    })
})
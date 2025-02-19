const jwt = require('jsonwebtoken');
const createToken = require('./tokenHelper');
const { SECRET_KEY } = require('../config')

describe('createToken', () => {
    test('works-admin', () => {
        const token = createToken({
            username: 'testAdmin',
            staffType: 'admin'
        });

        const payload = jwt.verify(token, SECRET_KEY);
        expect(payload).toEqual({
            iat: expect.any(Number),
            username: 'testAdmin',
            staffType: 'admin'
        });
    });

    test('works-mod', () => {
        const token = createToken({
            username: 'testMod',
            staffType: 'mod'
        });

        const payload = jwt.verify(token, SECRET_KEY);
        expect(payload).toEqual({
            iat: expect.any(Number),
            username: 'testMod',
            staffType: 'mod'
        });
    });
});
const {BadRequestError} = require('../ExError');
const validateData = require('./validateHelper')
const staffAuthSchema = require('../schemas/staffAuth.json');

// using staffAuth schema for test. expects username & password

describe('validateHelper', () => {
    test('works', () => {
        const data = {username: 'test', password: 'password'};
        expect (() => validateData(data, staffAuthSchema)).not.toThrowError();
    })
    
    test('throws error if not validated', () => {
        // missing password
        expect(() => validateData({username: 'test'}, staffAuthSchema)).toThrow(BadRequestError);
        // added property
        expect(() => validateData({username: 'test', password: 'password', age: 10}, staffAuthSchema)).toThrow(BadRequestError);
    })
})
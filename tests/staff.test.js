// tests for staff

const Staff = require('../models/staff');
const db = require('../db');
const bcrypt = require('bcrypt')


describe('authenticate', () => {
    test('authenticate', async () => {
        jest.spyOn(db, 'query').mockReturnValue({ rows: [{ username: 'user', password: 'password', staffType: 'admin' }] });
        jest.spyOn(bcrypt, 'compare').mockReturnValue(true);
        const res = await Staff.authenticate('user', 'password');
        expect(res).toEqual({ username: 'user', staffType: 'admin' })
    })
})

describe('getAll', () => {
    test('getAll', async () => {
        jest.spyOn(db, 'query').mockReturnValue({
            rows: [{ username: 'user', firstName: 'User', lastInitial: 'T', preferredPronouns: 'he/him', email: 'user@email.com', staffType: 'admin' },
            { username: 'user2', firstName: 'User2', lastInitial: 'T', preferredPronouns: 'she/her', email: 'user2@email.com', staffType: 'mod' }]
        });
        const res = await Staff.getAll()
        expect(res).toEqual([{ username: 'user', firstName: 'User', lastInitial: 'T', preferredPronouns: 'he/him', email: 'user@email.com', staffType: 'admin' },
        { username: 'user2', firstName: 'User2', lastInitial: 'T', preferredPronouns: 'she/her', email: 'user2@email.com', staffType: 'mod' }]);
    })
})

describe('get', () => {
    test('get', async () => {
        jest.spyOn(db, 'query').mockReturnValue({
            rows: [{ username: 'user', firstName: 'User', lastInitial: 'T', preferredPronouns: 'he/him', email: 'user@email.com', staffType: 'admin' }]
        });
        const res = await Staff.get('user')
        expect(res).toEqual(
            { username: 'user', firstName: 'User', lastInitial: 'T', preferredPronouns: 'he/him', email: 'user@email.com', staffType: 'admin' });
    })
})

describe('add', () => {
    test('add', async () => {
        jest.spyOn(db, 'query').mockReturnValueOnce({ rows: [] });
        jest.spyOn(bcrypt, 'hash').mockReturnValue('hashed')
        jest.spyOn(db, 'query').mockReturnValueOnce({
            rows: [{ username: 'newuser', firstName: 'New', lastInitial: 'U', preferredPronouns: 'she/her', email: 'new@email.com', staffType: 'mod' }]
        })
        let data = { username: 'newuser', firstName: 'New', lastInitial: 'U', preferredPronouns: 'she/her', password: 'password', email: 'new@email.com', staffType: 'mod' }
        const res = await Staff.add(data);
        expect(res).toEqual({ username: 'newuser', firstName: 'New', lastInitial: 'U', preferredPronouns: 'she/her', email: 'new@email.com', staffType: 'mod' })
    })
})

describe('update', () => {
    test('update', async () => {
        let data = { lastInitial: 'T' }
        jest.spyOn(db, 'query').mockReturnValue({
            rows: [{ username: 'user', firstName: 'User', lastInitial: 'N', preferredPronouns: 'he/him', email: 'user@email.com', staffType: 'admin' }]
        })
        const res = await Staff.update('user', data);
        expect(res).toEqual({ username: 'user', firstName: 'User', lastInitial: 'N', preferredPronouns: 'he/him', email: 'user@email.com', staffType: 'admin' });
    })
})

describe('updatePassword', () => {
    test('updatePassword', async () => {
        jest.spyOn(db, 'query').mockReturnValueOnce({ rows: [{ password: 'password' }] });
        jest.spyOn(db, 'query');
        jest.spyOn(bcrypt, 'compare').mockReturnValue(true);
        jest.spyOn(bcrypt, 'hash').mockReturnValue('newpassword');
        expect(async () => await Staff.updatePassword('user', 'password', 'newpassword')).not.toThrow();
    })
})

describe('delete', () => {
    test('delete', async () => {
        jest.spyOn(db, 'query').mockReturnValue({ rows: [{ username: 'user' }] });
        expect(async () => await Staff.delete('user')).not.toThrow();
    })
})

afterAll(async () => {
    await db.end();
})
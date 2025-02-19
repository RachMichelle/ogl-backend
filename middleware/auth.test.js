const jwt = require('jsonwebtoken');
const { authenticateToken,
    ensureAdmin,
    ensureStaff,
    ensureCorrect,
    ensureCorrectOrAdmin } = require('./auth');

const { SECRET_KEY } = require('../config');

const adminToken = jwt.sign({ username: 'testAdmin', staffType: 'admin' }, SECRET_KEY);
const invalidToken = jwt.sign({ username: 'test', staffType: 'admin' }, "wrongkey");

describe('authenticateToken', () => {
    test('works with valid token', () => {
        const req = {
            headers: { authorization: `bearer ${adminToken}` }
        };
        const res = { locals: {} };
        const next = jest.fn();
        authenticateToken(req, res, next);
        expect(res.locals).toEqual({
            user: {
                iat: expect.any(Number),
                username: 'testAdmin',
                staffType: 'admin'
            }
        })
    })

    test('works with invalid token', () => {
        const req = {
            headers: { authorization: `bearer ${invalidToken}` }
        };
        const res = { locals: {} };
        const next = jest.fn();
        authenticateToken(req, res, next);
        expect(res.locals).toEqual({})
    })

    test('works with no token', () => {
        const req = {
            headers: {}
        };
        const res = { locals: {} };
        const next = jest.fn();
        authenticateToken(req, res, next);
        expect(res.locals).toEqual({})
    })
})

describe('ensureStaff', () => {
    test('works-admin', () => {
        const req = {};
        const res = {
            locals: {
                user: {
                    username: 'testAdmin',
                    staffType: 'admin'
                }
            }
        }
        const next = jest.fn();
        ensureStaff(req, res, next);
        expect(next).not.toHaveBeenCalledWith(expect.any(Error));
    })

    test('works-mod', () => {
        const req = {};
        const res = {
            locals: {
                user: {
                    username: 'testMod',
                    staffType: 'mod'
                }
            }
        }
        const next = jest.fn();
        ensureStaff(req, res, next);
        expect(next).not.toHaveBeenCalledWith(expect.any(Error));
    })

    test('calls next error not logged in', () => {
        const req = {};
        const res = { locals: {} };
        const next = jest.fn();
        ensureStaff(req, res, next);
        expect(next).toHaveBeenCalledWith(expect.any(Error));
    })
})

describe('ensureAdmin', () => {
    test('works-admin', () => {
        const req = {};
        const res = {
            locals: {
                user: {
                    username: 'testAdmin',
                    staffType: 'admin'
                }
            }
        }
        const next = jest.fn();
        ensureAdmin(req, res, next);
        expect(next).not.toHaveBeenCalledWith(expect.any(Error));
    })

    test('calls next error for mod', () => {
        const req = {};
        const res = {
            locals: {
                user: {
                    username: 'testMod',
                    staffType: 'mod'
                }
            }
        }
        const next = jest.fn();
        ensureAdmin(req, res, next);
        expect(next).toHaveBeenCalledWith(expect.any(Error));
    })

    test('calls next error not logged in', () => {
        const req = {};
        const res = { locals: {} };
        const next = jest.fn();
        ensureAdmin(req, res, next);
        expect(next).toHaveBeenCalledWith(expect.any(Error));
    })
})

describe('ensureCorrectOrAdmin', () => {
    test('works-admin', () => {
        const req = {params: {username: 'testMod'}};
        const res = {
            locals: {
                user: {
                    username: 'testAdmin',
                    staffType: 'admin'
                }
            }
        }
        const next = jest.fn();
        ensureCorrectOrAdmin(req, res, next);
        expect(next).not.toHaveBeenCalledWith(expect.any(Error));
    })

    test('works-correct user', () => {
        const req = {params: {username: 'testMod'}};
        const res = {
            locals: {
                user: {
                    username: 'testMod',
                    staffType: 'mod'
                }
            }
        }
        const next = jest.fn();
        ensureCorrectOrAdmin(req, res, next);
        expect(next).not.toHaveBeenCalledWith(expect.any(Error));
    })

    test('calls next error for mod-incorrect', () => {
        const req = {params: {username: 'testMod'}};
        const res = {
            locals: {
                user: {
                    username: 'testMod2',
                    staffType: 'mod'
                }
            }
        }
        const next = jest.fn();
        ensureCorrectOrAdmin(req, res, next);
        expect(next).toHaveBeenCalledWith(expect.any(Error));
    })

    test('calls next error not logged in', () => {
        const req = {params: {username: 'testMod'}};
        const res = { locals: {} };
        const next = jest.fn();
        ensureCorrectOrAdmin(req, res, next);
        expect(next).toHaveBeenCalledWith(expect.any(Error));
    })
})

describe('ensureCorrect', () => {
    test('works-correct user', () => {
        const req = {params: {username: 'testMod'}};
        const res = {
            locals: {
                user: {
                    username: 'testMod',
                    staffType: 'mod'
                }
            }
        }
        const next = jest.fn();
        ensureCorrect(req, res, next);
        expect(next).not.toHaveBeenCalledWith(expect.any(Error));
    })

    test('calls next error for admin-incorrect user', () => {
        const req = {params: {username: 'testMod'}};
        const res = {
            locals: {
                user: {
                    username: 'testAdmin',
                    staffType: 'admin'
                }
            }
        }
        const next = jest.fn();
        ensureCorrect(req, res, next);
        expect(next).toHaveBeenCalledWith(expect.any(Error));
    })

    test('calls next error for mod-incorrect user', () => {
        const req = {params: {username: 'testMod'}};
        const res = {
            locals: {
                user: {
                    username: 'testMod2',
                    staffType: 'mod'
                }
            }
        }
        const next = jest.fn();
        ensureCorrect(req, res, next);
        expect(next).toHaveBeenCalledWith(expect.any(Error));
    })

    test('calls next error not logged in', () => {
        const req = {params: {username: 'testMod'}};
        const res = { locals: {} };
        const next = jest.fn();
        ensureCorrect(req, res, next);
        expect(next).toHaveBeenCalledWith(expect.any(Error));
    })
})
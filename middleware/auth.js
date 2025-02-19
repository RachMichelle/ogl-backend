"use strict"

/* middleware to handle auth for routes */

const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('../config');

const { UnauthorizedError } = require('../ExError');

/** Authenticate token:
 * check if token is included: should be in req.headers.authorization as "Bearer -token-"
 * if yes, verify it. 
 * 
 * if it is valid, store payload on res.locals to access in other auth middleware for specific accesss requirements 
 * *user object : includes username & staffType*
 *
 * general: no error for missing or invalid token
 * error handling on middleware for specific access requirements
 */

function authenticateToken(req, res, next) {
    try {
        const authHeader = req.headers && req.headers.authorization;

        if (authHeader) {
            // remove 'bearer'(capital or all lowercase) from header and trim to separate token
            const token = authHeader.replace(/^[Bb]earer /, "").trim();
            res.locals.user = jwt.verify(token, SECRET_KEY);
        }
        return next();
    } catch (e) {
        return next();
    }
};

/** Ensure staff: 
 * Use when route requires admin or mod. 
 * 
 * Since credentials are only provided to those two staff types, can just check user is logged in to confirm
 * 
 * throw unauthorized error if user is not logged in. 
 */

function ensureStaff(req, res, next) {
    try {
        if (!res.locals.user) throw new UnauthorizedError();
        return next();
    } catch (e) {
        return next(e);
    }
};

/** Ensure admin: 
 * Use when route is only accessable to admin staff
 * 
 * throw unauthorized error if no logged in user or staffType is 'mod'
*/

function ensureAdmin(req, res, next) {
    try {
        if (!res.locals.user) throw new UnauthorizedError();
        if (res.locals.user.staffType !== 'admin') throw new UnauthorizedError();
        return next();
    } catch (e) {
        return next(e);
    }
};

/** Ensure correct user or admin:
 * Use when route is only accessable to the matching user or an admin. 
 * ex: patch route for editing staff info. Only that staff member can edit their own information if they are not an admin.
 */

function ensureCorrectOrAdmin(req, res, next) {
    try {
        if (!res.locals.user) {
            throw new UnauthorizedError();
        }
        else if (
            res.locals.user.username === req.params.username ||
            res.locals.user.staffType === 'admin') {
            return next();
        }
        throw new UnauthorizedError();
    } catch (e) {
        return next(e);
    };
};

/** Ensure correct user: 
 * Use for routes that can only be accessed by the logged in user
 * primarily, password change.
 */

function ensureCorrect(req, res, next) {
    try {
        if (!res.locals.user) {
            throw new UnauthorizedError();
        }
        else if (res.locals.user.username === req.params.username) {
            return next();
        }
        throw new UnauthorizedError();
    } catch (e) {
        return next(e);
    };
};

module.exports = {
    authenticateToken,
    ensureStaff,
    ensureAdmin, 
    ensureCorrectOrAdmin,
    ensureCorrect
};
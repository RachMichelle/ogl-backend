"use strict"

/** Staff Routes */

const express = require('express');

const { ensureAdmin,
    ensureCorrectOrAdmin,
    ensureCorrect }
    = require('../middleware/auth');


const Staff = require('../models/staff');

const staffNewSchema = require('../schemas/staffNew.json');
const staffUpdateSchema = require('../schemas/staffUpdate.json');
const staffAuthSchema = require('../schemas/staffAuth.json');
const staffPwdUpdateSchema = require('../schemas/staffPwdUpdate.json');
const validateData = require('../helpers/validateHelper');

const createToken = require('../helpers/tokenHelper');

const router = new express.Router();


/** POST login --> {username, password} -> {token}
 * returns JWT token if given correct credetials
 * validates username&password included in request
 * 
 * No auth required
 */

router.post('/login', async (req, res, next) => {
    try {
        validateData(req.body, staffAuthSchema);

        const { username, password } = req.body;
        const staff = await Staff.authenticate(username, password);
        const token = createToken(staff);
        const user= {...staff, token}

        return res.json({ user });
    } catch (e) {
        return next(e);
    }
})

/** GET all staff
 * Returns all staff details -->
 * {staff: [{username, isActive, firstName, lastName, preferredPronouns, email, staffType}, ...]
 * 
 * No auth required
*/

router.get('/', async (req, res, next) => {
    try {
        let staff = await Staff.getAll();
        return res.json({ staff });
    } catch (e) {
        return next(e);
    }
})

/** GET one staff member by username
 * Returns staff member info --> 
 * {staff: {isActive, firstName, lastName, preferredPronouns, email, staffType}}
 * 
 * No auth required
*/

router.get('/:username', async (req, res, next) => {
    try {
        const username = req.params.username.toLowerCase();
        const staff = await Staff.get(username);
        return res.json({ staff });
    } catch (e) {
        return next(e);
    }
})

/** POST - add a new staff member
 * Returns newly created staff member info --> 
 * {staff: {username, isActive, firstName, lastName, preferredPronouns, email, staffType}}
 * 
 * validate data with staffUpdate jsonschema (helper function)
 * 
 * AUTH REQUIRED: Admin
 */

router.post('/', ensureAdmin, async (req, res, next) => {
    try {
        validateData(req.body, staffNewSchema);
        
        const staff = await Staff.add(req.body);
        return res.status(201).json({ staff });
    } catch (e) {
        return next(e);
    }
})

/** PATCH - update an existing staff member -> :username
 * Returns full staff member info after update complete -->
 * {staff: {username, firstName, lastInifial, preferredPronouns, email, staffType}}
 * 
 * validate data with staffUpdate jsonschema (helper function)
 * 
 * AUTH REQUIRED: Admin or correct staff member
*/

router.patch('/:username', ensureCorrectOrAdmin, async (req, res, next) => {
    try {
        validateData(req.body, staffUpdateSchema);

        const username = req.params.username.toLowerCase();
        const staff = await Staff.update(username, req.body);
        return res.json({ staff });
    } catch (e) {
        return next(e);
    }
})

/** PATCH - update password for staff member -> :username 
 * validates password and new password included in request
 * 
 * AUTH REQUIRED: correct staff member
 */

router.patch('/password/:username', ensureCorrect, async (req, res, next) => {
    try {
        validateData(req.body, staffPwdUpdateSchema);

        const username = req.params.username.toLowerCase();
        const { password, newPassword } = req.body;
  
        await Staff.updatePassword(username, password, newPassword);

        return res.json({ message: 'Password updated successfully' });
    } catch (e) {
        return next(e);
    }
})


/** DELETE an existing staff member -> :username
 * 
 * AUTH REQUIRED: Admin
 */

router.delete('/:username', ensureAdmin, async (req, res, next) => {
    try {
        const username = req.params.username.toLowerCase();
        await Staff.delete(username);
        return res.json({ deleted: username });
    } catch (e) {
        return next(e);
    }
})


module.exports = router;
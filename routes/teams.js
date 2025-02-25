"use strict"

/** Teams Routes */

/***NOTE: Team codes are all uppercase***/

const express = require('express');

const { ensureAdmin, ensureStaff } = require('../middleware/auth');

const Team = require('../models/team');

const teamNewSchema = require('../schemas/teamNew.json');
const teamUpdateSchema = require('../schemas/teamUpdate.json');
const validateData = require('../helpers/validateHelper');

const router = new express.Router();


/** GET all teams
 * Returns list of all teams with team name and active status only-->
 * {teams: [{teamName, isActive}...]

 * No auth required
*/

router.get('/', async (req, res, next) => {
    try {
        const teams = await Team.getAll();
        return res.json({ teams });
    } catch (e) {
        return next(e);
    }
})

/** GET one team by code
 * Returns teams info-->
 * {team {teamName, isActive, establishedDate, logo, captain}

 * No auth required
*/

router.get('/:code', async (req, res, next) => {
    try {
        const code = req.params.code.toUpperCase()
        const team = await Team.get(code);
        return res.json({ team })
    } catch (e) {
        return next(e);
    }
})

/** POST - add a new team
 * Returns newly created team info -->
 * {team {code, teamName, isActive, establishedDate, logo, captain}
 * 
 * validate data with teamNew jsonschema (helper function)
 * 
 * AUTH REQUIRED: Mod or Admin
*/

router.post('/', ensureStaff, async (req, res, next) => {
    try {
        validateData(req.body, teamNewSchema);
        
        const team = await Team.add(req.body);
        return res.status(201).json({ team })
    } catch (e) {
        return next(e);
    }
})

/** POST - add players to team
 * Returns object with array of objects for added players -->
 * {added : [{alias, code, isActive}, ...]}
 * 
 * AUTH REQUIRED: Mod or Admin
 */

router.post('/add-players/:code', ensureStaff, async (req, res, next) => {
    try {
        const { players } = req.body;
        const code = req.params.code.toUpperCase();
        const added = await Team.addPlayers(players, code);
        
        return res.status(201).json({ added })
    } catch (e) {
        return next(e);
    }
})

/** PATCH - update an existing team -> :code
 * Returns full team info after update complete -->
 * {team {code, teamName, isActive, establishedDate, logo, captain}
 * 
 * validate data with teamUpdate jsonschema (helper function)
 * 
 * AUTH REQUIRED: Mod or Admin
*/

router.patch('/:code', ensureStaff, async (req, res, next) => {
    try {
        validateData(req.body, teamUpdateSchema);

        const code = req.params.code.toUpperCase();
        const team = await Team.update(code, req.body);
        return res.status(200).json({ team });
    } catch (e) {
        return next(e);
    }
})

/** DELETE an existing team -> :code
 * 
 * AUTH REQUIRED: Admin
 */

router.delete('/:code', ensureAdmin, async (req, res, next) => {
    try {
        const code = req.params.code.toUpperCase();
        await Team.delete(code);
        return res.json({ deleted: code });
    } catch (e) {
        return next(e);
    }
})

module.exports = router;
"use strict"

/** Players Routes */

const express = require('express');

const { ensureAdmin, ensureStaff } = require('../middleware/auth');

const Player = require('../models/player');

const playerNewSchema = require('../schemas/playerNew.json');
const playerUpdateSchema = require('../schemas/playerUpdate.json');
const validateData = require('../helpers/validateHelper');

const router = new express.Router();

/** GET all players
 * Returns list of all players with alias and active status only-->
 * {players: [{username, isActive}...]
 * 
 * No auth required
*/

router.get('/', async (req, res, next) => {
    try {
        const players = await Player.getAll();
        return res.json({ players });
    } catch (e) {
        return next(e);
    }
})

/** GET one player by alias
 * Returns player info -->
 * {player: {isActive, firstName, lastInitial, preferredPronouns, countryOrigin, mainRole}
 * 
 * No auth required
*/

router.get('/:alias', async (req, res, next) => {
    try {
        const alias = req.params.alias.toLowerCase();
        const player = await Player.get(alias);
        return res.json({ player });
    } catch (e) {
        return next(e);
    }

})

/** POST - add a new player
 * Returns newly created player info -->
 * {player: {alias, firstName, lastInitial, preferredPronouns, countryOrigin, mainRole}
 * 
 * validate data with playerNew jsonschema (helper function)
 * 
 * AUTH REQUIRED: Mod or Admin
*/

router.post('/', ensureStaff, async (req, res, next) => {
    try {
        validateData(req.body, playerNewSchema);
        
        const player = await Player.add(req.body);
        return res.status(201).json({ player })
    } catch (e) {
        return next(e);
    }
})


/** PATCH - update an existing player -> :alias
 * Returns full player info after update complete -->
 * {player: {alias, isActive, firstName, lastInitial, preferredPronouns, countryOrigin, mainRole}
 * 
 * validate data with playerUpdate jsonschema (helper function)
 * 
 * AUTH REQUIRED: Mod or Admin
*/

router.patch('/:alias', ensureStaff, async (req, res, next) => {
    try {
        validateData(req.body, playerUpdateSchema);

        const alias = req.params.alias.toLowerCase();
        const player = await Player.update(alias, req.body);
        return res.json({ player });
    } catch (e) {
        return next(e);
    }
})

/** POST - associate a player :alias with team
 *  Player status defauls to active
 *  Returns object {added: {alias, team, isActive}}
 * 
 * AUTH REQUIRED: Mod or Admin
 */

router.post('/teams/:alias', ensureStaff, async (req, res, next) => {
    try {
        const alias = req.params.alias.toLowerCase();
        // all team codes uppercased
        const code = req.body.code.toUpperCase();
        console.log(alias, code)

        const added = await Player.addToTeam(alias, code);
        console.log(added)
        return res.status(201).json({ added });
    } catch (e) {
        return next(e);
    }
})

/** PATCH - update player's active status with previously associated team
 *  returns object {updated: {alias, team, isActive}}
 * 
 * AUTH REQUIRED: Mod or Admin
 */

router.patch('/teams/:alias', ensureStaff, async (req, res, next) => {
    try {
        const alias = req.params.alias.toLowerCase();
        // all team codes uppercased
        const code = req.body.code.toUpperCase();
        const isActive = req.body.isActive;

        const updated = await Player.manageTeam(alias, code, isActive);
        return res.json({ updated })
    } catch (e) {
        return next(e);
    }
})

/** DELETE an existing player -> :alias
 * 
 * AUTH REQUIRED: Admin
 */

router.delete('/:alias', ensureAdmin, async (req, res, next) => {
    try {
        const alias = req.params.alias.toLowerCase();
        await Player.delete(alias);
        return res.json({ deleted: alias });
    } catch (e) {
        return next(e);
    }
})

module.exports = router;
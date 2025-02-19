"use strict"

/* DB sql query logic for players:
    getAlll
    get
    add
    update
    delete
*/

const db = require('../db');

const { BadRequestError, NotFoundError } = require('../ExError');
const { sqlForUpdate, checkForDup, checkActiveStatus } = require('../helpers/sqlHelper')

class Player {

    /*find all players, alias & active status only
    [{alias}, ...]
    ordered by alias (a -> z)
    */

    static async getAll() {
        const playersRes = await db.query(`SELECT alias
                        FROM players
                        ORDER BY alias`);
        return playersRes.rows;
    }

    /* find single player by alias. return expanded info, including associated team(s)
    {firstName, lastInitial, preferredPronouns, countryOrigin, mainRole teams:[{..}, ...]} 
    */

    static async get(alias) {
        const playerRes = await db.query(`SELECT 
                        p.first_name AS "firstName", 
                        p.last_initial AS "lastInitial",
                        p.preferred_pronouns AS "preferredPronouns",
                        p.country_origin AS "countryOrigin",
                        p.main_role AS "mainRole",
                        pt.is_active AS "activeMember",
                        t.code,
                        t.team_name AS "teamName"
                        FROM players AS p
                        FULL JOIN players_teams AS pt
                        ON p.alias = pt.player
                        FULL JOIN teams AS t
                        ON pt.team = t.code
                        WHERE p.alias = $1`, [alias]);

        if (!playerRes.rows.length) throw new NotFoundError();

        const p = playerRes.rows[0];
        const teams = playerRes.rows.map(r => (
            {
                code: r.code,
                teamName: r.teamName,
                activeMember: r.activeMember

            }))

        const activeStatus = checkActiveStatus(teams)

        return {
            isActive: activeStatus,
            firstName: p.firstName,
            lastInitial: p.lastInitial,
            preferredPronouns: p.preferredPronouns,
            countryOrigin: p.countryOrigin,
            mainRole: p.mainRole,
            teams: teams
        }
    };

    /* add a new player. 
    accepts data object -> alias, firstName, lastInitial, preferredPronouns (optional), countryOrigin (optional), mainRole
    return full player info object: 
    {alias, firstName, lastInitial, preferredPronouns, countryOrigin, mainRole}
    */

    static async add({ alias, firstName, lastInitial, preferredPronouns, countryOrigin, mainRole }) {
        // check for duplicate before adding
        const duplcate = await checkForDup('players', 'alias', alias);

        if (duplcate) throw new BadRequestError(`Duplicate: ${alias} already exists`);

        const newPlayer = await db.query(`INSERT INTO players
                        (alias,  
                        first_name, 
                        last_initial, 
                        preferred_pronouns, 
                        country_origin, 
                        main_role)
                        VALUES ($1, $2, $3, $4, $5, $6)
                        RETURNING alias,
                        first_name AS "firstName", 
                        last_initial AS "lastInitial", 
                        preferred_pronouns AS "preferredPronouns", 
                        country_origin AS "countryOrigin", 
                        main_role AS "mainRole"`,
            [alias, firstName, lastInitial, preferredPronouns, countryOrigin, mainRole]);

        return newPlayer.rows[0];
    }
    w
    /* add player to team
    accepts arguments:
    player alias, team code. adds active status true by default
    returns object {alias, [team]code, isActive}
    */

    static async addToTeam(alias, code) {
        // differs from helper function, search based on 2 WHERE clauses with AND
        const duplicate = await db.query(`SELECT player, team
                        FROM players_teams 
                        WHERE player=$1
                        AND team=$2`, [alias, code]);

        if (duplicate.rows.length) throw new BadRequestError(`Duplicate: ${alias} already associated with team ${code}`);

        const res = await db.query(`INSERT INTO players_teams
                        (player, team, is_active)
                        VALUES ($1, $2, $3)
                        RETURNING player,
                        team, 
                        is_active AS "isActive"`, [alias, code, true]);

        return res.rows[0];
    }

    /* manage player's active status on already associated team
    accepts arguements:
    player alias, team code, active status
    returrns object {alias, [team]code, isActive}
    */

    static async manageTeam(alias, teamCode, isActive) {
        // update players_teams table for given alias and teamCode
        const res = await db.query(`UPDATE players_teams
            SET is_active=${isActive}
            WHERE player=$1
            AND team=$2
            RETURNING player,
            team, 
            is_active AS "isActive"`, [alias, teamCode]);

        // not found error if nothing found/updated & returned
        if (!res.rows.length) throw new NotFoundError(`No existing association between player ${alias} and team ${code}`)

        return res.rows[0];
    }

    /* edit an existing player at given alias

    return full player info object with updates:
    {alias, firstName, lastInitial, preferredPronouns, countryOrigin, mainRole}
    
    This is for a partial update--not all data needs to be included. 
    Can include firstName, lastInitial, preferredPronouns, countryOrigin, mainRole

    if the player is not found, throw error.
    */

    static async update(alias, data) {
        const { columns, values } = sqlForUpdate(data,
            {
                firstName: "first_name",
                lastInitial: "last_initial",
                preferredPronouns: "preferred_pronouns",
                countryOrigin: "country_origin",
                mainRole: "main_role"
            }
        );

        const aliasQueryIdx = "$" + (values.length + 1);

        const query = `UPDATE players 
                    SET ${columns}
                    WHERE alias = ${aliasQueryIdx}
                    RETURNING alias, 
                    first_name AS "firstName", 
                    last_initial AS "lastInitial", 
                    preferred_pronouns AS "preferredPronouns", 
                    country_origin AS "countryOrigin", 
                    main_role AS "mainRole"`;

        const result = await db.query(query, [...values, alias])
        const updatedPlayer = result.rows[0];

        // check player exists
        if (!updatedPlayer) throw new NotFoundError(`${alias} does not exist`);

        return updatedPlayer;
    }

    /* Delete player with given alias
    if not found, throw error
    returns no data
    */

    static async delete(alias) {
        const deleted = await db.query(`DELETE FROM players
                    WHERE alias = $1
                    RETURNING alias`, [alias]);
        const player = deleted.rows[0];
        // check player exists
        if (!player) throw new NotFoundError(`${alias} does not exist`);
    }

}

module.exports = Player;
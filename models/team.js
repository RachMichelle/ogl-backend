"use strict"

/* DB sql query logic for teams:
    getAlll
    get
    add
    update
    delete    
*/

const db = require('../db');

const { BadRequestError, NotFoundError } = require('../ExError');
const { sqlForUpdate, checkForDup } = require('../helpers/sqlHelper');
const Player = require('./player');

class Team {

    /*find all teams:
    returns array of team info objects:
    [{code, teamName, isActive, establishedDate, logo, captain}, ...]
    ordered by team name (a -> z)
    */

    static async getAll() {
        const teamsRes = await db.query(`SELECT code,
                        team_name AS "teamName", 
                        is_active AS "isActive"
                        FROM teams
                        ORDER BY team_name`)
        return teamsRes.rows;
    }

    /* find single team by code. 
    return expanded info plus array of associated players:
    {teamName, isActive, establishedDate, logo, captain, players: [{...}, ..]} 
   */

    static async get(code) {
        // to_char(t.established_date, 'MM/DD/YYYY') converts date to desired format on retrieval
        const teamRes = await db.query(`SELECT t.team_name AS "teamName", 
                        t.is_active AS "isActive",
                        to_char(t.established_date, 'MM/DD/YYYY') AS "establishedDate",
                        t.logo, 
                        t.captain,
                        pt.is_active AS "activeMember",
                        p.alias
                        FROM teams AS t
                        FULL JOIN players_teams AS pt
                        ON t.code = pt.team
                        FULL JOIN players AS p
                        ON pt.player = p.alias
                        WHERE t.code = $1`, [code]);

        if (!teamRes.rows.length) throw new NotFoundError();

        const t = teamRes.rows[0];
        const players = teamRes.rows.map(r => (
            {
                alias: r.alias,
                activeMember: r.activeMember
            }
        ))

        return {
            teamName: t.teamName,
            isActive: t.isActive,
            establishedDate: t.establishedDate, 
            logo: t.logo, 
            captain: t.captain,
            players: players

        };
    };

    /* add a new team. 
    accepts data object -> code, teamName, isActive, establishedDate, logo, captain
    return full team info object: 
    {code, teamName, isActive, establishedDate, logo, captain} 
    */

    static async add({ code, teamName, isActive, establishedDate, logo, captain }) {
        // check for duplicate before adding
        const duplcate = await checkForDup('teams', 'code', code.toUpperCase());
        if (duplcate) throw new BadRequestError(`Duplicate: team ${code} already exists`);

        const newTeam = await db.query(`INSERT INTO teams
                        (code,
                        team_name, 
                        is_active, 
                        established_date,
                        logo, 
                        captain)
                        VALUES ($1, $2, $3, $4, $5, $6)
                        RETURNING code, 
                        team_name AS "teamName",
                        is_active AS "isActive",
                        established_date AS "establishedDate",
                        logo, 
                        captain`,
            [code, teamName, isActive, establishedDate, logo, captain]);

        return newTeam.rows[0];
    }

    /* add players to team
   accepts arguments:
   array of player aliases, team code
   utilizes addToTeam from Player model
   returns array of object [{alias, [team]code, isActive}, ...]
   */

    static async addPlayers(players, code) {
        let res = await Promise.all(players.map(p => Player.addToTeam(p.toLowerCase(), code)));

        return res;
    }

    /* edit an existing team at given code

    return full team info object with updates:
    {code, teamName, isActive, establishedDate, logo, captain}}
    
    This is for a partial update--not all data needs to be included. 
    Can include teamName, isActive, logo, captain

    if the team is not found, throw error.
    */

    static async update(code, data) {
        const { columns, values } = sqlForUpdate(data,
            {
                isActive: "is_active",
                teamName: "team_name",
                establishedDate: "established_date",
            }
        );

        const codeQueryIdx = "$" + (values.length + 1);

        const query = `UPDATE teams 
                    SET ${columns}
                    WHERE alias = ${codeQueryIdx}
                    RETURNING code, 
                    team_name AS "teamName",
                    is_active AS "isActive", 
                    established_date AS "establishedDate", 
                    logo, 
                    captain`;

        const result = await db.query(query, [...values, code])
        const updatedTeam = result.rows[0];

        // check team exists
        if (!updatedTeam) throw new NotFoundError(`Team with code ${code} does not exist`);

        return updatedTeam;
    }

    /* Delete team with given code
    if not found, throw error
    returns no data
    */

    static async delete(code) {
        const deleted = await db.query(`DELETE FROM teams
            WHERE code = $1
            RETURNING code`, [code]);
        const team = deleted.rows[0];
        // check team exists
        if (!team) throw new NotFoundError(`Team with code ${code} does not exist`);
    }
}

module.exports = Team;
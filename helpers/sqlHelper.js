const { BadRequestError } = require('../ExError');
const db = require('../db');

/** Generate sql query for partial updates
 * 
 * accepts two arguments: 
 * --> data: object with data being updated
 * --> sqlConversion: object converting json keys to sql column names 
 * (EX: {firstName: first_name, lastInitial: last_initial})
 * 
 * returns an object with columns & values. 
 * columns for SET in query (column name and idx variable)
 * values for update
 * 
 * if no data, throws error
**/

function sqlForUpdate(data, sqlConversion) {
    const keys = Object.keys(data);
    if (!keys.length) throw new BadRequestError('No data for update');

    const colArr = keys.map((c, i) => (
        // if key needs to be converted, find in sqlConversion object & use the associated value. if not (isn't in object), use name as-is
        `"${sqlConversion[c] || c}"=$${i + 1}`
    ));

    return {
        columns: colArr.join(','),
        values: Object.values(data)
    };
}

/** Check for a duplicate before adding to database.
 * 
 * accepts 3 arguements:
 * --> table: teams, players, or staff
 * --> identifier: primarty key for given type
 * --> value being searched (ex: player alias)
 * 
 * returns true if duplicate is found or false if no duplicate is found
*/
async function checkForDup(table, identifier, value) {
    const res = await db.query(`SELECT ${identifier}
                    FROM ${table}
                    WHERE ${identifier}=$1`, [value]);
    if (res.rows.length) return true;
    return false;
}

/** Get player's active status
 * if a player is associated with a team as an active player, return true
 * if they are not associated with a team or are associated with teams without any team listing them as an active player, return false.
 * 
 * accepts argurment-array of team objects  
 */

function checkActiveStatus(teams) {
    const active = teams.filter(t => t.activeMember === true);
    if (active.length !== 0) return true;
    return false;
}

module.exports = {
    sqlForUpdate,
    checkForDup,
    checkActiveStatus
};
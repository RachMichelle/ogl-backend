"use strict"

/* DB sql query logic for staff: 
    Authenticate
    getAll
    get
    add
    update
    updatePassword
    delete
*/


const db = require('../db');

const { BadRequestError, NotFoundError, UnauthorizedError } = require('../ExError');
const { sqlForUpdate, checkForDup } = require('../helpers/sqlHelper');

const bcrypt = require('bcrypt');
const { BCRYPT_WORK_FACTOR } = require('../config');


class Staff {

    /* Authenticate staff with username/password for sign in to mod/admin view.

    returns info about currently signed in user, -password:
    {username, staffType}

    throw unauthorized error if staff member not found or password incorrect
    */
    static async authenticate(username, password) {
        // find user
        const userRes = await db.query(`SELECT username,
            password,
            staff_type AS "staffType"
            FROM staff
            WHERE username=$1`, [username]);

        const user = userRes.rows[0];

        // if staff member is found, compare passwords
        if (user){
            const isValid = await bcrypt.compare(password, user.password);
            if (isValid){
                // do not keep password in returned data
                delete user.password;
                return user;
            }
        }

        throw new UnauthorizedError("Invalid username/password");
    }

    /*find all staff members
    [{username, firstName, lastInitial, preferredPronouns, email, staffType}, ...]
    ordered by staff type(admin, mod) 
    */

    static async getAll() {
        const staffRes = await db.query(`SELECT username,
                        first_name AS "firstName", 
                        last_initial AS "lastInitial",
                        preferred_pronouns AS "preferredPronouns",
                        email, 
                        staff_type AS "staffType"
                        FROM staff
                        ORDER BY staff_type`);
        return staffRes.rows;
    }

    /*find staff member by given username
    returns all staff member info, -password
    {username, firstName, lastInitial, preferredPronouns, email, staffType}
    */

    static async get(username) {
        const staffRes = await db.query(`SELECT username,
            first_name AS "firstName", 
            last_initial AS "lastInitial",
            preferred_pronouns AS "preferredPronouns",
            email, 
            staff_type AS "staffType"
            FROM staff
            WHERE username=$1`, [username]);

        if (!staffRes.rows.length) throw new NotFoundError(`No staff member with username ${username}`);

        return staffRes.rows[0];
    }

    /*add new staff member
    accepts data object -> username, firstName, lastInitial, preferredPronouns (optional), password, email, staffType
    **password hashed with bcrypt
    return full staff info object, minus password:
    {username, firstName, lastInitial, preferredPronouns, email, staffType}

    **this does not sign user in. 
    staff would be created by existing admin with temporary password, then be able to sign in themselves and update password to one of their choice. 
    */

    static async add({ username, firstName, lastInitial, preferredPronouns, password, email, staffType }) {
        // check for duplicate before adding
        const duplcate = await checkForDup('staff', 'username', username);
        if (duplcate) throw new BadRequestError(`Duplicate: ${username} already exists`);

        // hash password
        const hashedPwd = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);

        const newStaff = await db.query(`INSERT INTO staff
                    (username,
                    first_name,
                    last_initial,
                    preferred_pronouns,
                    password,
                    email, 
                    staff_type)
                    VALUES ($1, $2, $3, $4, $5, $6, $7)
                    RETURNING username, 
                    first_name AS "firstName",
                    last_initial AS "lastInitial", 
                    preferred_pronouns AS "preferredPronouns",
                    email, 
                    staff_type AS "staffType"`,
            [username, firstName, lastInitial, preferredPronouns, hashedPwd, email, staffType]);

        return newStaff.rows[0];
    }

    /* edit an existing staff member at given username

    return full staff info object with updates:
    {username, firstName, lastInitial, preferredPronouns, email, staffType}
    
    This is for a partial update--not all data needs to be included. 
    Can include firstName, lastInitial, preferredPronouns, email

    **Does NOT include password update-->handled separately.

    if the staff member is not found, throw error.
    */

    static async update(username, data) {
        const { columns, values } = sqlForUpdate(data,
            {
                firstName: "first_name",
                lastInitial: "last_initial",
                preferredPronouns: "preferred_pronouns",
            }
        );

        const usernameQueryIdx = "$" + (values.length + 1);

        const query = `UPDATE staff
                    SET ${columns}
                    WHERE username=${usernameQueryIdx}
                    RETURNING username, 
                    first_name AS "firstName",
                    last_initial AS "lastInitial", 
                    preferred_pronouns AS "preferredPronouns",
                    email, 
                    staff_type AS "staffType"`;

        const result = await db.query(query, [...values, username])
        const updatedStaff = result.rows[0];

        if (!updatedStaff) throw new NotFoundError(`No staff member with username ${username}`);

        return updatedStaff;
    }

    /* Update password for staff member at given username
    if user not found, throw error (validation for correct user handled in route)
    confirms current password is correct before updating to new password
    throws unauthorized error if user is not found or password incorrect

    no data returned
    */ 

    static async updatePassword(username, currPwd, newPwd) {
        // find staff member to compare current password
        const res = await db.query(`SELECT password
                        FROM staff
                        WHERE username=$1`, [username])
        const storedPassword = res.rows[0].password;
        // compare passwords. if current passsword valid, update to new password
        if (storedPassword){
            let isValid = await bcrypt.compare(currPwd, storedPassword);
            if (isValid){
                const hashedNewPwd = await bcrypt.hash(newPwd, BCRYPT_WORK_FACTOR);
                await db.query(`UPDATE staff
                        SET password=$1
                        WHERE username=$2`, [hashedNewPwd, username]);
                return;
            }
        }
        throw new UnauthorizedError("Invalid credentials")
    }

    /* Delete staff member with given username
    if not found, throw error
    
    no data returned
    */

    static async delete(username) {
        const deleted = await db.query(`DELETE FROM staff
                    WHERE username=$1
                    RETURNING username`, [username]);

        const staffMember = deleted.rows[0];
        if (!staffMember) throw new NotFoundError(`No staff member with username ${username}`);
    }
}

module.exports = Staff;
const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('../config');

// Create signed JWT for admin/mod use
// accepts user object as arguement

function createToken(user) {
    let payload = {
        username: user.username,
        staffType: user.staffType
    };

    return jwt.sign(payload, SECRET_KEY);
}

module.exports = createToken;
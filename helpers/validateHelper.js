const { BadRequestError } = require('../ExError');
const jsonschema = require('jsonschema');

/* validates data
    accepts two arguements: data to validate and which schema to use. 
    if data is invalid, throws BadRequestError
*/ 

function validateData(data, schema){
    const validator = jsonschema.validate(data, schema);
    if (!validator.valid) {
        const errors = validator.errors.map(e => e.stack);
        throw new BadRequestError(errors);
    };
}

module.exports = validateData;
process.env.NODE_ENV = 'test';

const { BadRequestError } = require('../ExError');
const { sqlForUpdate, checkForDup, checkActiveStatus } = require('./sqlHelper');

const db = require('../db');

describe('sqlForUpdate', () => {
    test('throws error if no data provided', () => {
        expect(() => sqlForUpdate({})).toThrow(BadRequestError)
    })

    test('works with data & converts keys to sql column names', () => {
        const res = sqlForUpdate({ firstName: 'newFirst', age: 10 }, { firstName: 'first_name' });
        expect(res).toEqual({
            columns: "\"first_name\"=$1,\"age\"=$2",
            values: ['newFirst', 10]
        })
    })
})

describe('checkForDup', () => {
    test('returns false if no duplicate found', async () => {
        jest.spyOn(db, 'query').mockReturnValue({ rows: [] });
        const res = await checkForDup('players', 'alias', 'testPlayer');
        expect(res).toEqual(false);
    })

    test('returns true if duplicate found', async () => {
        jest.spyOn(db, 'query').mockReturnValue({ rows: [{ alias: 'testplayer' }] });
        const res = await checkForDup('players', 'alias', 'testPlayer');
        expect(res).toEqual(true);
    })
})

describe('checkActiveStatus', () => {
    let teams1 = [{ teamName: 'team1', activeMember: false }, { teamName: 'team2', activeMember: true }];

    let teams2 = [{ teamName: 'team1', activeMember: false }];

    test('works', () => {
        expect(checkActiveStatus(teams1)).toBeTruthy;
        expect(checkActiveStatus(teams2)).toBeFalsey;
    })
})

afterAll(async () => {
    await db.end();
})
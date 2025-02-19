// tests for players

const Player = require('../models/player');
const db = require('../db');

describe('getAll', () => {
    test('getAll', async () => {
        jest.spyOn(db, 'query').mockReturnValue({
            rows: [{ alias: 'test' }, { alias: 'test2' }]
        });
        const res = await Player.getAll()
        expect(res).toEqual([{ alias: 'test' }, { alias: 'test2' }]);
    })
})

describe('get', () => {
    test('get', async () => {
        jest.spyOn(db, 'query').mockReturnValue({
            rows: [
                { firstName: 'Test', lastInitial: 'T', preferredPronouns: 'he/him', countryOrigin: 'USA', mainRole: 'tank', activeMember: true, code: 'TT', teamName: 'Test Team' },
                { firstName: 'Test', lastInitial: 'T', preferredPronouns: 'he/him', countryOrigin: 'USA', mainRole: 'tank', activeMember: false, code: 'ATT', teamName: 'Another Test Team' }]
        });
        const res = await Player.get('test')
        expect(res).toEqual(
            { isActive: true, firstName: 'Test', lastInitial: 'T', preferredPronouns: 'he/him', countryOrigin: 'USA', mainRole: 'tank', teams: [{ code: 'TT', teamName: 'Test Team', activeMember: true }, { code: 'ATT', teamName: 'Another Test Team', activeMember: false }] });
    })
})

describe('add', () => {
    test('add', async () => {
        jest.spyOn(db, 'query').mockReturnValueOnce({ rows: [] });
        jest.spyOn(db, 'query').mockReturnValueOnce({
            rows: [{ alias: 'test', firstName: 'Test', lastInitial: 'T', preferredPronouns: 'he/him', countryOrigin: 'USA', mainRole: 'tank' }]
        })
        let data = { alias: 'test', firstName: 'Test', lastInitial: 'T', preferredPronouns: 'he/him', countryOrigin: 'USA', mainRole: 'tank' }
        const res = await Player.add(data);
        expect(res).toEqual({ alias: 'test', firstName: 'Test', lastInitial: 'T', preferredPronouns: 'he/him', countryOrigin: 'USA', mainRole: 'tank' })
    })
})

describe('addToTeam', () => {
    test('addToTeam', async () => {
        jest.spyOn(db, 'query').mockReturnValueOnce({ rows: [] });
        jest.spyOn(db, 'query').mockReturnValueOnce({ rows: [{ player: 'test', team: 'TT', isActive: true }] });
        const res = await Player.addToTeam('test', 'TT');
        expect(res).toEqual({ player: 'test', team: 'TT', isActive: true })
    })
})

describe('manageTeam', () => {
    test('manageTeam', async () => {
        jest.spyOn(db, 'query').mockReturnValue({ rows: [{ player: 'test', team: 'TT', isActive: false }] });
        const res = await Player.manageTeam('test', 'TT', false);
        expect(res).toEqual({ player: 'test', team: 'TT', isActive: false })
    })
})

describe('update', () => {
    test('update', async () => {
        let data={lastInitial: 'M'}
        jest.spyOn(db, 'query').mockReturnValue({
            rows: [{ alias: 'test', firstName: 'Test', lastInitial: 'M', preferredPronouns: 'he/him', countryOrigin: 'USA', mainRole: 'tank' }]
        })
        const res = await Player.update('test', data);
        expect(res).toEqual({ alias: 'test', firstName: 'Test', lastInitial: 'M', preferredPronouns: 'he/him', countryOrigin: 'USA', mainRole: 'tank' });
    })
})

describe('delete', () => {
    test('delete', async () => {
        jest.spyOn(db, 'query').mockReturnValue({rows: [{alias:'test'}]});
        expect(async () => await Player.delete('test')).not.toThrow();
    })
})

afterAll(async () => {
    await db.end();
})
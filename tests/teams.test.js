// tests for teams

const Team = require('../models/team');
const db = require('../db');

describe('getAll', () => {
    test('getAll', async () => {
        jest.spyOn(db, 'query').mockReturnValue({
            rows: [{ teamName: 'test', isActive: true }, { teamName: 'test2', isActive: false }]
        });
        const res = await Team.getAll()
        expect(res).toEqual([{ teamName: 'test', isActive: true }, { teamName: 'test2', isActive: false }]);
    })
})

describe('get', () => {
    test('get', async () => {
        jest.spyOn(db, 'query').mockReturnValue({
            rows: [
                { teamName: 'TestTeam', isActive: true, establishedDate: '01/01/2024', logo: 'logourl', captain: 'player1', activeMember: true, alias: 'test' },
                { teamName: 'TestTeam', isActive: true, establishedDate: '01/01/2024', logo: 'logourl', captain: 'player1', activeMember: true, alias: 'test2' }]
        });
        const res = await Team.get('TT')
        expect(res).toEqual(
            { teamName: 'TestTeam', isActive: true, establishedDate: '01/01/2024', logo: 'logourl', captain: 'player1', players: [{ alias: 'test', activeMember: true }, { alias: 'test2', activeMember: true }] });
    })
})

describe('add', () => {
    test('add', async () => {
        jest.spyOn(db, 'query').mockReturnValueOnce({ rows: [] });
        jest.spyOn(db, 'query').mockReturnValueOnce({
            rows: [{ alias: 'NT', teamName: 'New Team', isActive: true, establishedDate: '01/01/2024', logo: 'logourl', captain: 'player1' }]
        })
        let data = { code: 'NT', teamName: 'TestTeam', isActive: true, establishedDate: '01/01/2024', logo: 'logourl', captain: 'player1' }
        const res = await Team.add(data);
        expect(res).toEqual({ alias: 'NT', teamName: 'New Team', isActive: true, establishedDate: '01/01/2024', logo: 'logourl', captain: 'player1' })
    })
})

describe('update', () => {
    test('update', async () => {
        let data = { teamName: 'ChangedTeamName' }
        jest.spyOn(db, 'query').mockReturnValue({
            rows: [{ code: 'TT', teamName: 'ChangedTeamName', isActive: true, establishedDate: '01/01/2024', logo: 'logourl', captain: 'player1' }]
        })
        const res = await Team.update('TT', data);
        expect(res).toEqual({ code: 'TT', teamName: 'ChangedTeamName', isActive: true, establishedDate: '01/01/2024', logo: 'logourl', captain: 'player1' });
    })
})

describe('delete', () => {
    test('delete', async () => {
        jest.spyOn(db, 'query').mockReturnValue({ rows: [{ code: 'TT' }] });
        expect(async () => await Team.delete('TT')).not.toThrow();
    })
})

afterAll(async () => {
    await db.end();
})
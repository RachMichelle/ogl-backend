--test staff users both have password "password"--
INSERT INTO
    staff (
        username,
        first_name,
        last_initial,
        preferred_pronouns,
        PASSWORD,
        email,
        staff_type
    )
VALUES
    ('kavik', 'Ben', 'G', 'he/him','$2b$12$mEfmq58LghRuQckvd4a7KOtplrPiilvV5tGd/loaL5mKS89hJ9CK2', 'contact.kavik@ogl.com', 'admin'),
    ('maegical', 'Mae', 'S', 'she/her','$2b$12$mEfmq58LghRuQckvd4a7KOtplrPiilvV5tGd/loaL5mKS89hJ9CK2', 'contact.mae@ogl.com', 'mod');


INSERT INTO 
players (
    alias, 
    first_name, 
    last_initial, 
    preferred_pronouns, 
    country_origin, 
    main_role)
VALUES
    ('r3th', 'Brian', 'C', 'he/him', 'USA', 'flex'),
    ('minuet', 'Rachel', 'C', 'she/her', 'USA', 'flex'),
    ('trickster', 'Kenny', 'W', 'he/him', 'USA', 'flex'),
    ('gohan', 'Alex', 'M', 'he/him', 'USA', 'dps'),
    ('videl', 'Lauren', 'S', 'she/her', 'USA', 'support'),
    ('gator', 'Josh', 'W', 'he/him', 'USA', 'support'),
    ('kong', 'Leo', 'T', 'he/him', 'Canada', 'tank'),
    ('bott', 'Matt', 'V', 'he/him', 'USA', 'tank'),
    ('jirou', 'Amy', 'R', 'she/her', 'Canada', 'support'),
    ('prov3rbial', 'Josh', 'S', 'he/him', 'Canada', 'flex'),
    ('negative_jon', 'Jon', 'T', 'he/him', 'USA', 'support'),
    ('msstunning', 'Sara', 'N', 'she/her', 'Canada', 'dps'),
    ('dina', 'Dina', 'B', 'she/they', 'USA', 'dps'),
    ('averybyrd', 'Avery', 'K', 'she/they', 'Canada', 'tank'),
    ('kellobyte', 'Bryce', 'D', 'he/him', 'USA', 'support'),
    ('kibo', 'Danny', 'P', 'he/him', 'USA', 'support'),
    ('kouhai', 'Adam', 'S', 'he/him', 'Canada', 'tank'),
    ('vix', 'Victor', 'M', 'he/him', 'USA', 'flex'),
    ('mini', 'Maddie', 'W', 'she/her', 'USA', 'dps'),
    ('akashii', 'Jenn', 'Y', 'she/her', 'Canada', 'support'), 
    ('k1ngcat', 'Jamie', 'T', 'they/them', 'USA', 'tank'), 
    ('musa', 'Mike', 'D', 'he/him', 'Canada', 'tank'),
    ('bunn', 'Bridget', 'R', 'she/her', 'USA', 'support'),
    ('col.e', 'Cole', 'O', 'he/him', 'USA', 'support'),
    ('werbac', 'Tia', 'R', 'she/her', 'Canada', 'dps'),
    ('fish', 'Rob', 'F', 'he/him', 'USA', 'flex'),
    ('voyd', 'Xavier', 'T', 'they/them', 'Canada', 'flex'),
    ('jade', 'Jade', 'S', 'she/her', 'USA', 'tank'),
    ('covfy', 'Cam', 'E', 'he/him', 'Canada', 'support'),
    ('phantom', 'Sam', 'Y', 'she/her', 'Canada', 'dps');

INSERT INTO 
    teams (code, team_name, is_active, established_date, captain, logo)
VALUES 
    ('MEL', 'Meliora', TRUE, '2024-08-01', 'r3th', 'https://media.istockphoto.com/id/1173075789/vector/minimalist-elegant-dragonfly-design-with-line-art-style.jpg?s=612x612&w=0&k=20&c=RxoiUr8i-X4ldZqZuroJYmaJCI9mUrKQSN5WgebYmqg='),
    ('HBDS', 'Habadas', FALSE, '2023-07-15', null, 'https://img.freepik.com/premium-vector/bull-logo-design_168578-251.jpg'),
    ('VA', 'Vitality Alert', TRUE, '2023-01-21', 'prov3rbial', 'https://www.creativefabrica.com/wp-content/uploads/2020/11/12/Coffee-Logo-Graphics-6570010-1.jpg'),
    ('LS', 'Lunar Supremecy', FALSE, '2023-01-15', null, 'https://media.istockphoto.com/id/1310981865/vector/moon-and-star-yellow-icon-of-moon-for-night-pictogram-of-crescent-and-star-logo-for-sleep.jpg?s=612x612&w=0&k=20&c=6sRFa_cQlQYpYkq2LJ7Iyipk-xof4EYY3lgLJqCSQz0='),
    ('INST', 'Interstellar', TRUE, '2024-05-05', 'akashii', 'https://t4.ftcdn.net/jpg/03/14/04/97/360_F_314049726_SOwd5G8PMeK6adSYSzXC7X3tfPOWgVhy.jpg');

-- team with default logo
INSERT INTO 
    teams (code, team_name, is_active, established_date, captain)
VALUES 
   ('RLM', 'Realm', TRUE, '2024-02-26', 'werbac');

INSERT INTO 
    players_teams (player, team, is_active)
VALUES
    ('r3th', 'MEL', TRUE),
    ('minuet', 'MEL', TRUE),
    ('trickster', 'MEL', TRUE), 
    ('gohan', 'MEL', TRUE),
    ('videl', 'MEL', TRUE),
    ('gator', 'MEL', TRUE),
    ('gohan', 'HBDS', FALSE),
    ('videl', 'HBDS', FALSE), 
    ('jirou', 'HBDS', FALSE),
    ('bott', 'HBDS', FALSE),
    ('kong', 'HBDS', FALSE), 
    ('dina', 'HBDS', FALSE),
    ('jirou', 'VA', TRUE), 
    ('prov3rbial', 'VA', TRUE), 
    ('negative_jon', 'VA', TRUE), 
    ('msstunning', 'VA', TRUE), 
    ('dina', 'VA', TRUE), 
    ('averybyrd', 'VA', TRUE), 
    ('mini', 'VA', FALSE),
    ('voyd', 'VA', FALSE),
    ('covfy', 'VA', FALSE),
    ('averybyrd', 'LS', FALSE),
    ('msstunning', 'LS', FALSE),
    ('kellobyte', 'LS', FALSE),
    ('kibo', 'LS', FALSE),
    ('kouhai', 'LS', FALSE),
    ('vix', 'LS', FALSE),
    ('jade', 'LS', FALSE),
    ('phantom', 'LS', FALSE),
    ('vix', 'INST', TRUE),
    ('mini', 'INST', TRUE),
    ('akashii', 'INST', TRUE),
    ('k1ngcat', 'INST', TRUE),
    ('musa', 'INST', TRUE),
    ('bunn', 'INST', TRUE),
    ('dina', 'INST', FALSE),
    ('kibo', 'RLM', TRUE),
    ('col.e', 'RLM', TRUE),
    ('kouhai', 'RLM', TRUE),
    ('werbac', 'RLM', TRUE),
    ('fish', 'RLM', TRUE),
    ('voyd', 'RLM', TRUE),
    ('gator', 'RLM', FALSE),
    ('jirou', 'RLM', FALSE);

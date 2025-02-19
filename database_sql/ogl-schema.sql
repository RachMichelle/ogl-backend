CREATE TABLE staff (
    username VARCHAR(15) PRIMARY KEY CHECK (username = lower(username)),
    first_name TEXT NOT NULL,
    last_initial TEXT NOT NULL,
    preferred_pronouns TEXT,
    password TEXT NOT NULL,
    email TEXT NOT NULL CHECK(position('@' IN email) > 1),
    staff_type TEXT NOT NULL
);

CREATE TABLE players (
    alias VARCHAR(15) PRIMARY KEY CHECK (alias = lower(alias)),
    first_name TEXT NOT NULL, 
    last_initial TEXT NOT NULL, 
    preferred_pronouns TEXT,
    country_origin TEXT, 
    main_role TEXT NOT NULL
);

CREATE TABLE teams (
    code VARCHAR(4) PRIMARY KEY CHECK (code = upper(code)),
    team_name VARCHAR(20) NOT NULL, 
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    established_date DATE NOT NULL,
    logo TEXT DEFAULT 'https://static.thenounproject.com/png/778835-200.png', 
    captain TEXT REFERENCES players ON DELETE SET NULL
);

CREATE TABLE players_teams (
    id SERIAL PRIMARY KEY,
    player TEXT NOT NULL REFERENCES players ON DELETE CASCADE, 
    team VARCHAR(4) NOT NULL REFERENCES teams ON DELETE CASCADE,
    is_active BOOLEAN NOT NULL DEFAULT true
);

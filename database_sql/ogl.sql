\echo 'Delete and recreate ogl database?'
\prompt 'Return for yes or control-c to cancel > ' foo

DROP DATABASE ogl;
CREATE DATABASE ogl;
\connect ogl;

\i ogl-schema.sql
\i ogl-seed.sql

\echo 'Delete and recreate ogl_test database?'
\prompt 'Return for yes or control-c to cancel > ' foo

DROP DATABASE ogl_test;
CREATE DATABASE ogl_test;
\connect ogl_test;

\i ogl-schema.sql

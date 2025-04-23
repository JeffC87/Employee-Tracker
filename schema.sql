DROP DATABASE IF EXISTS officespace_db;
-- Create a new database named officespace_db
CREATE DATABASE officespace_db;

--Makes it so all of the commands are executed in the officespace_db database
\c officespace_db;

DROP TABLE IF EXISTS employees, roles, departments CASCADE;

CREATE TABLE departments (
  id SERIAL PRIMARY KEY,
  name VARCHAR(30) NOT NULL
);

CREATE TABLE roles (
  id SERIAL PRIMARY KEY,
  title VARCHAR(30) NOT NULL,
  salary NUMERIC NOT NULL,
  department_id INTEGER REFERENCES departments(id) ON DELETE SET NULL
);

CREATE TABLE employees (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id INTEGER REFERENCES roles(id) ON DELETE SET NULL,
  manager_id INTEGER REFERENCES employees(id) ON DELETE SET NULL
);

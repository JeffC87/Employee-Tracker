INSERT INTO departments (name) VALUES ('Engineering'), ('HR'), ('Marketing');

INSERT INTO roles (title, salary, department_id)
VALUES 
('Software Engineer', 95000, 1),
('Office Manager', 65000, 2),
('Data Entry', 45000, 3);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES
('Alice', 'Cooper', 1, NULL),
('Bob', 'Kulick', 2, 1),
('Carol', 'King', 3, 1);

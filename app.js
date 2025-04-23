import inquirer from 'inquirer';
import db from './db/index.js'; 

const mainMenu = async () => {
  const { action } = await inquirer.prompt({
    type: 'list',
    name: 'action',
    message: 'What would you like to do?',
    choices: [
      'View All Departments',
      'View All Roles',
      'View All Employees',
      'Add a Department',
      'Add a Role',
      'Add an Employee',
      'Update an Employee Role',
      'Exit'
    ]
  });

  switch (action) {
    case 'View All Departments':
      return viewDepartments();
    case 'View All Roles':
      return viewRoles();
    case 'View All Employees':
      return viewEmployees();
    case 'Add a Department':
      return addDepartment();
    case 'Add a Role':
      return addRole();
    case 'Add an Employee':
      return addEmployee();
    case 'Update an Employee Role':
      return updateEmployeeRole();
    case 'Exit':
      console.log('Goodbye!');
      process.exit();
  }
};

const viewDepartments = async () => {
  const res = await db.query('SELECT * FROM departments');
  console.table(res.rows);
  mainMenu();
};

const viewRoles = async () => {
  const res = await db.query(`
    SELECT roles.id, roles.title, departments.name AS department, roles.salary
    FROM roles
    LEFT JOIN departments ON roles.department_id = departments.id
  `);
  console.table(res.rows);
  mainMenu();
};

const viewEmployees = async () => {
  const res = await db.query(`
    SELECT 
      e.id, 
      e.first_name, 
      e.last_name, 
      r.title AS job_title, 
      d.name AS department, 
      r.salary, 
      CONCAT(m.first_name, ' ', m.last_name) AS manager
    FROM employees e
    LEFT JOIN roles r ON e.role_id = r.id
    LEFT JOIN departments d ON r.department_id = d.id
    LEFT JOIN employees m ON e.manager_id = m.id
  `);
  console.table(res.rows);
  mainMenu();
};

const addDepartment = async () => {
  const { name } = await inquirer.prompt({
    name: 'name',
    message: 'Enter department name:',
  });
  await db.query('INSERT INTO departments (name) VALUES ($1)', [name]);
  console.log(`Added department: ${name}`);
  mainMenu();
};

const addRole = async () => {
  const depts = await db.query('SELECT * FROM departments');
  const { title, salary, department_id } = await inquirer.prompt([
    { name: 'title', message: 'Enter role title:' },
    { name: 'salary', message: 'Enter role salary:' },
    {
      type: 'list',
      name: 'department_id',
      message: 'Select department:',
      choices: depts.rows.map((d) => ({ name: d.name, value: d.id })),
    },
  ]);
  await db.query(
    'INSERT INTO roles (title, salary, department_id) VALUES ($1, $2, $3)',
    [title, salary, department_id]
  );
  console.log(`Added role: ${title}`);
  mainMenu();
};

const addEmployee = async () => {
  const roles = await db.query('SELECT * FROM roles');
  const employees = await db.query('SELECT * FROM employees');
  const { first_name, last_name, role_id, manager_id } = await inquirer.prompt([
    { name: 'first_name', message: 'Enter first name:' },
    { name: 'last_name', message: 'Enter last name:' },
    {
      type: 'list',
      name: 'role_id',
      message: 'Select role:',
      choices: roles.rows.map((r) => ({ name: r.title, value: r.id })),
    },
    {
      type: 'list',
      name: 'manager_id',
      message: 'Select manager:',
      choices: [
        { name: 'None', value: null },
        ...employees.rows.map((e) => ({
          name: `${e.first_name} ${e.last_name}`,
          value: e.id,
        })),
      ],
    },
  ]);
  await db.query(
    'INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)',
    [first_name, last_name, role_id, manager_id]
  );
  console.log(`Added employee: ${first_name} ${last_name}`);
  mainMenu();
};

const updateEmployeeRole = async () => {
  const employees = await db.query('SELECT * FROM employees');
  const roles = await db.query('SELECT * FROM roles');
  const { employee_id, role_id } = await inquirer.prompt([
    {
      type: 'list',
      name: 'employee_id',
      message: 'Select employee to update:',
      choices: employees.rows.map((e) => ({
        name: `${e.first_name} ${e.last_name}`,
        value: e.id,
      })),
    },
    {
      type: 'list',
      name: 'role_id',
      message: 'Select new role:',
      choices: roles.rows.map((r) => ({
        name: r.title,
        value: r.id,
      })),
    },
  ]);
  await db.query('UPDATE employees SET role_id = $1 WHERE id = $2', [
    role_id,
    employee_id,
  ]);
  console.log('Employee role updated!');
  mainMenu();
};

mainMenu();

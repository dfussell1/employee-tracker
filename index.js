// bring in required packages
const inquirer = require("inquirer");
const mysql = require("mysql2");

// create connection to mysql database
const db = mysql.createConnection(
    {
        host: "localhost",
        user: "root",
        password: "rootroot",
        database: "company_db",
});

// handle error if it cannot connect
db.connect((err) => {
    if (err) {
        console.log("Cannot connect to database.");
        return;
    }
    console.log("Connected to the company_db database!");
    mainMenu();
});

// displays main menu options for user
const mainMenu = () => {
    inquirer
        .prompt([
            {
                type: "list",
                name: "menu",
                message: "What would you like to do?",
                choices: [
                    "View All Departments",
                    "View All Roles",
                    "View All Employees",
                    "Add a Department",
                    "Add an Employee",
                    "Add an Employee Role",
                    "Update an Employee Role",
                    "Quit",
                ],
            }
        ])
        // calls functions for whichever option user selects
        .then((answers) => {
            console.log(answers.menu);
            switch(answers.menu) {
                case "View All Departments": 
                    viewAllDepartments();
                    break;
                case "View All Roles":
                    viewAllRoles();
                    break;
                case "View All Employees":
                    viewAllEmployees();
                    break;
                case "Add a Department":
                    addDepartment();
                    break;
                case "Add an Employee":
                    addEmployee();
                    break;
                case "Add an Employee Role":
                    addEmployeeRole();
                    break;
                case "Update an Employee Role": 
                    updateEmployeeRole();
                    break;
                case "Quit":
                    console.log("Exiting database...");
                    db.end();
                    break;
            };
        });
};

// view all departments
const viewAllDepartments = () => {
    db.query("SELECT * FROM department", (err, departments) => {
        if (err) {
            console.log("Cannot get departments.");
            mainMenu();
        }
        console.table(departments);
        mainMenu();
    });
};

// view all roles and display title, role id, department name, and salary
const viewAllRoles = () => {
    db.query("SELECT role.title, role.id, department.name AS department, role.salary FROM role JOIN department ON role.department_id = department.id", (err, roles) => {
        if (err) {
            console.log("Cannot get roles.");
            mainMenu();
        }
        console.table(roles);
        mainMenu();
    });
};

// view all employees and display employee id, first and last name, department name, their salary, and who they report to
const viewAllEmployees = () => {
    db.query("SELECT employee.id, employee.first_name, employee.last_name, role.title AS title, department.name AS department, role.salary AS salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id LEFT JOIN employee AS manager ON employee.manager_id = manager.id", (err, employees) => {
        if (err) {
            console.log("Cannot get employees.");
            mainMenu();
        } 
        console.table(employees);
        mainMenu();
    });
};

// add a department to the database
const addDepartment = () => {
    inquirer
        .prompt([
            {
                type: "input",
                name: "departmentName",
                message: "What is the name of the department you would like to add?"
            }
        ])
        .then((answer) => {
            db.query("INSERT INTO department (name) VALUES (?)", [answer.departmentName], (err, res) => {
                if (err) {
                    console.log("Cannot add new department.");
                } else {
                    console.log("New department added successfully!");
                }
                mainMenu();
            });
        });
};

// add an employee to the database
const addEmployee = () => {

    // gets roles for role choices
    const queryRoles = "SELECT id, title FROM role";
    db.query(queryRoles, (err, roles) => {
        if (err) {
            console.log("Cannot get roles.");
            mainMenu();
        }

        // gets employees for manager choices
    const queryEmployees = "SELECT id, CONCAT(first_name, ' ', last_name) AS manager FROM employee";
    db.query(queryEmployees, (err, employees) => {
        if (err) {
            console.log("Cannot get employees.");
            mainMenu();
        }

        inquirer
            .prompt([
                {
                    type: "input",
                    name: "firstName",
                    message: "What is the employee's first name?",
                },
                {
                    type: "input",
                    name: "lastName",
                    message: "What is the employee's last name?",
                },
                {
                    type: "list",
                    name: "roleId",
                    message: "What is the employee's role?",
                    // displays each role as a choice for the employee's role
                    choices: roles.map(role => ({ name: role.title, value: role.id })),
                },
                {
                    type: "list",
                    name: "managerId",
                    message: "Select the employee's manager:",
                    // displays each employee as a choice for manager
                    choices: [{ name: "None", value: null }, ...employees.map(employee => ({ name: employee.manager, value: employee.id }))],
                }
            ])
            .then((answers) => {
                // new object with user's input
                const newEmployee = {
                    first_name: answers.firstName,
                    last_name: answers.lastName,
                    role_id: answers.roleId,
                    manager_id: answers.managerId
                };
                // add employee to database
                const employeeAdd = "INSERT INTO employee SET ?";
                db.query(employeeAdd, newEmployee, (err, res) => {
                    if (err) {
                        console.log("Cannot add new employee.");
                        mainMenu();
                    } else {
                        console.log("New employee added successfully!");
                    }
                    mainMenu();
                });
            });
        });
    });
};

// add new employee role to database
const addEmployeeRole = () => {
    // gets departments for department choices
    const queryDepartments = "SELECT id, name FROM department";
    db.query(queryDepartments, (err, departments) => {
        if (err) {
            console.log("Cannot get departments");
            mainMenu();
        }

        inquirer
            .prompt([
                {
                    type: "input",
                    name: "roleTitle",
                    message: "What role would you like to add?",
                },
                {
                    type: "input",
                    name: "roleSalary",
                    message: "What is the salary of this new role?",
                },
                {
                    type: "list",
                    name: "departmentId",
                    message: "What department does this role belong to?",
                    // displays each department as a choice
                    choices: departments.map(department => ({ name: department.name, value: department.id })),
                },
            ])
            .then((answers) => {
                // create new object with user's input
                const newRole = {
                    title: answers.roleTitle,
                    salary: answers.roleSalary,
                    department_id: answers.departmentId,
                };
                // add role to database
                const roleAdd = "INSERT INTO role SET ?";
                db.query(roleAdd, newRole, (err, res) => {
                    if (err) {
                        console.log("Cannot add new role.");
                        mainMenu();
                    } else {
                        console.log("New role added successfully!")
                    }
                    mainMenu();
                });
            });
        });
};

// update an employee's role
const updateEmployeeRole = () => {
    // gets roles from database for role choices
    const queryRoles = "SELECT id, title FROM role";
    db.query(queryRoles, (err, roles) => {
        if (err) {
            console.log("Cannot get roles.");
            mainMenu();
        }
    
        // gets employees names' as choices to update employee
    const queryEmployees = "SELECT id, CONCAT(first_name, ' ', last_name) AS name FROM employee";
    db.query(queryEmployees, (err, employees) => {
        if (err) {
            console.log("Cannot get employees.");
            mainMenu();
        }

        inquirer
            .prompt([
                {
                    type: "list",
                    name: "employeeId",
                    message: "Which employee's role would you like to update?",
                    // displays each employee as a choice to update
                    choices: employees.map(employee => ({ name: employee.name, value: employee.id })),
                },
                {
                    type: "list",
                    name: "roleId",
                    message: "Select the employee's new role.",
                    // displays each role as a choice to update role
                    choices: roles.map(role => ({ name: role.title, value: role.id })),
                },
            ])
            .then((answers) => {
                // updates the employee's role based on user input
                const updateRole = "UPDATE employee SET role_id = ? WHERE id = ?";
                db.query(updateRole, [answers.roleId, answers.employeeId], (err, res) => {
                    if (err) {
                        console.log("Cannot update employee's role.");
                        mainMenu();
                    } else {
                        console.log("Successfully updated employee's role!");
                    } 
                    mainMenu();
                });
            });
        });
    });
};
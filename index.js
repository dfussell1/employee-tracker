const inquirer = require("inquirer");
const mysql = require("mysql2");
const fs = require("fs"); 

const db = mysql.createConnection(
    {
        host: "localhost",
        user: "root",
        password: "rootroot",
        database: "company_db",
});

db.connect((err) => {
    if (err) {
        console.log("Cannot connect to database.");
        return;
    }
    console.log("Connected to the company_db database!");
    mainMenu();
});

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
                    console.log("Quitting...");
                    db.end();
                    break;
            };
        });
};

const viewAllDepartments = () => {
    db.query("SELECT * FROM department", (err, departments) => {
        if (err) {
            console.log("Cannot get departments.");
        }
        console.table(departments);
        mainMenu();
    });
};

// job title, role id, department, salary
const viewAllRoles = () => {
    db.query("SELECT role.title, role.id, department.name AS department, role.salary FROM role JOIN department ON role.department_id = department.id", (err, roles) => {
        if (err) {
            console.log("Cannot get roles.");
        }
        console.table(roles);
        mainMenu();
    });
};

// id, first and last name, job title, department, salaries, and managers reported to
const viewAllEmployees = () => {
    db.query("SELECT employee.id, employee.first_name, employee.last_name, role.title AS title, department.name AS department, role.salary AS salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id LEFT JOIN employee AS manager ON employee.manager_id = manager.id", (err, employees) => {
        if (err) {
            console.log("Cannot get employees.");
        } 
        console.table(employees);
        mainMenu();
    });
};

const addDepartment = () => {

};

const addEmployee = () => {

};

const addEmployeeRole = () => {

};

const updateEmployeeRole = () => {

};
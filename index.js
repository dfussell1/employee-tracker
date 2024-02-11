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
            }
        });
}
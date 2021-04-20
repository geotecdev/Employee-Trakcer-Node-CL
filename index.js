//dependencies
//const mysql = require("mysql");
const inquirer = require("inquirer");
const table = require("console.table");


const appSession = () => {
    inquirer.prompt({
        name: sessionAction,
        type: "rawlist",
        message: "pick an action to perform",
        choices: [
            "View Departments",
            "Add Department",
            "View Roles",
            "Add Role",
            "View Employees",
            "Add Employee",                                    
            "Update Employee Role",
            "Quit Session"
        ]
    })
    .then((selectedAction) => {
        switch (selectedAction.action) {
            case "View Departments":
                //viewDepartments();
                break;
            case "Add Department":
                //addDepartment();
                break;
            case "View Roles":
                //viewRoles();
                break;                                           
            case "Add Role":
                //addRole();
                break;
            case "View Employees":
                //viewEmployees();
                break;
            case "Add Employee":
                //addEmployee();
                break;
            case "Update Employee Role":
                //updateEmployeeRole();
                break;                                           
            default:
                //endSession();
                break;
        }
    })
};

//viewDepartments()
//addDepartment()
//viewRoles()
//addRole()
//viewEmployees()
//addEmployee()
//updateEmployeeRole()
//endSession()
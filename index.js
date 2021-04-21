//dependencies
//const mysql = require("mysql");
const inquirer = require("inquirer");
const table = require("console.table");

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "employees"
});

connection.connect((err) => {
    if (err) throw err
    //entry pt
    mainMenu();
});

const mainMenu = () => {
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
                viewDepartments();
                break;
            case "Add Department":
                //addDepartment();
                break;
            case "View Roles":
                viewRoles();
                break;                                           
            case "Add Role":
                //addRole();
                break;
            case "View Employees":
                viewEmployees();
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
const viewDepartments = () => {
    const sqlQuery = "SELECT * FROM department";
    console.log("Departments List:");
    connection.query(sqlQuery, (err, departments) => {
        console.table(departments);
        mainMenu();
    });
};

//addDepartment()
//viewRoles()
const viewRoles = () => {
    const sqlQuery = `SELECT rl.title, rl.salary, dep.department_name FROM role as rl
                    LEFT JOIN department AS dep ON rl.department_id=dep.id`;
    console.log("Roles List:");
    connection.query(sqlQuery, (err, roles) => {
        console.table(roles);
        mainMenu();
    });
};

//addRole()
//viewEmployees()
const viewEmployees = () => {
    const sqlQuery = `SELECT emp.first_name, emp.last_name, rl.title, mgr.first_name as manager_fn, mgr.last_name as manager_ln 
                        FROM employee as emp
                        LEFT JOIN role as rl ON emp.role_id=rl.id
                        LEFT JOIN employee as mgr ON emp.manager_id=mgr.id`;
    connection.query(sqlQuery, (err, employees) => {
        console.table(employees);
    });
}

//addEmployee()
//updateEmployeeRole()
//endSession()
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
                addEmployee();
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
    });
    mainMenu();
};

//addDepartment()
const addDepartment = () => {
   inquirer.prompt([
       {
        name: "department_name",
        type: "input",
        message: "enter a name for the new department",   
       }
   ])
   .then((answer) => {
        connection.query(`INSERT INTO deparment SET ?`, {
            department_name: answer.department_name
        }),
        (err) => {
            if (err) throw err;
            console.log(`new ${answer.department_name} department added`);
        }
   })

   mainMenu();
};

//viewRoles()
const viewRoles = () => {
    const sqlQuery = `SELECT rl.title, rl.salary, dep.department_name FROM role as rl
                        LEFT JOIN department AS dep ON rl.department_id=dep.id`;
    console.log("Roles List:");
    connection.query(sqlQuery, (err, roles) => {
        console.table(roles);        
    });

    mainMenu();
};

//addRole()
const addRole = () => {
    //get departments for department_id
    const sqlQuery = `SELECT * from department`;
    connection.query(sqlQuery, (err, departments) => {
        if (err) throw err;
        inquirer.prompt([
            {
                name: "title",
                type: "input",
                message: "enter a title for this role",
            },
            {
                name: "salary",
                type: "input",
                message: "enter a base salary for this role",
                validate: function validateInput(salary) {
                    return salary > 0;
                }
            },
            {
                name: "selected_department",
                type: "rawlist",
                message: "which department is this role organized under?",
                choices() {
                    const choices = [];
                    departments.foreach(dep => {
                        choices.push(dep.department_name);
                    })
                    return choices;
                }
            }
        ])
        .then((answers) => {
            const roleDepartment = firstOrDefault(departments, "department_name", answers.selected_department);
            if (roleDepartment !== undefined) {
                connection.query(`INSERT INTO role SET ?`, {
                    title: answers.title,
                    salary: answers.salary,
                    department_id: roleDepartment.id
                }),
                (err) => {
                    if (err) throw err;
                    console.log(`new ${answers.title} role added`);
                }
            }
        });
    });

    mainMenu();
};

//viewEmployees()
const viewEmployees = () => {
    const sqlQuery = `SELECT emp.first_name, emp.last_name, rl.title, mgr.first_name as manager_fn, mgr.last_name as manager_ln 
                        FROM employee as emp
                        LEFT JOIN role as rl ON emp.role_id=rl.id
                        LEFT JOIN employee as mgr ON emp.manager_id=mgr.id`;
    console.log("Employees List:");
    connection.query(sqlQuery, (err, employees) => {
        console.table(employees);        
    });

    mainMenu();
}

//addEmployee()
const addEmployee = () => {
    //get roles for role_id
    let sqlQuery = `SELECT * FROM role`;
    connection.query(sqlQuery, (err, roles) => {
        if (err) throw err;
        //get employees for manager_id
        sqlQuery = `SELECT * FROM employee`;
        connection.query(sqlQuery, (err, mgrs) => {
            inquirer.prompt([
                {
                    name: "first_name",
                    type: "input",
                    message: "enter new employee's first name",                
                },
                {
                    name: "last_name",
                    type: "input",
                    message: "enter new employee's last name",  
                },
                {
                    name: "selected_role",
                    type: "rawlist",
                    message: "choose a role for the employee",
                    choices() {
                        const choices = [];
                        roles.forEach(role => {
                            choices.push(role.title);
                        })
                        return choices;
                    }
                },
                {
                    name: "selected_manager",
                    type: "rawlist",
                    message: "select the employee's manager",
                    choices() {
                        const choices = [];
                        mgrs.forEach(mgr => {
                            choices.push(mgr.id + ';' + mgr.last_name + ";" + mgr.first_name);
                        })
                        return choices;
                    }
                }
            ])
            .then((answers) => {
                const employeeRole = firstOrDefault(roles, "title", answers.selected_role);
                const employeeMgr = firstOrDefault(mgrs, "id", answers.selected_manager.split(';')[0]);
                if (employeeRole !== undefined && employeeMgr !== undefined) {
                    connection.query("INSERT INTO employee SET ?", {
                        first_name: answers.first_name,
                        last_name: answers.last_name,
                        role_id = employeeRole.id,
                        manager_id = employeeMgr.id,
                    }), 
                    (err) => {
                        if (err) throw err;
                        console.log(`new employee record for ${answers.last_name}, ${answers.first_name}`);
                    }
                }                
            })
        });
    });

    mainMenu();
}

//updateEmployeeRole()
//endSession()

const firstOrDefault = (arr, propName, matchValue) => {
    let result;
    arr.forEach(item => {
        let compValue = item[propName];
        if (compValue === matchValue) {
            result = item;
            break;
        }
    });

    return result;
};
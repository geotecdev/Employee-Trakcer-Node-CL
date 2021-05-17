//dependencies
const mysql = require("mysql");
const inquirer = require("inquirer");
require("console.table");

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "employees",
    multipleStatements: true
});

connection.connect((err) => {
    if (err) throw err
    //entry pt
    mainMenu();
});

//const mainMenu = () => 
const mainMenu = () => {
    inquirer.prompt({
        name: "sessionAction",
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
        switch (selectedAction.sessionAction) {
            case "View Departments":
                viewDepartments();
                break;
            case "Add Department":
                addDepartment();
                break;
            case "View Roles":
                viewRoles();
                break;                                           
            case "Add Role":
                addRole();
                break;
            case "View Employees":
                viewEmployees();
                break;
            case "Add Employee":
                addEmployee();
                break;
            case "Update Employee Role":
                updateEmployeeRole();
                break;                                           
            case "Quit Session":
                endSession();
                break;
        }
    })
};

//
const viewDepartments = () => {
    const sqlQuery = "SELECT * FROM department";
    tableHeader("Departments List:");
    connection.query(sqlQuery, (err, departments) => {
        if (err) {
            console.log(err.message);
        } else {
            console.table(departments);
            sleep(2);
            mainMenu();
        }        
    });
    
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
        connection.query(`INSERT INTO department SET ?`, {
            department_name: answer.department_name
        }),
        (err) => {
            if (err) {
                console.log(err.message);
                throw err;
            }
            console.log(`new ${answer.department_name} department added`);
        }
        
        sleep(2);
        mainMenu();
   })
};

//viewRoles()
const viewRoles = () => {
    const sqlQuery = `SELECT rl.title, rl.salary, dep.department_name FROM role as rl
                        LEFT JOIN department AS dep ON rl.department_id=dep.id`;
    tableHeader("Roles List:");
    connection.query(sqlQuery, (err, roles) => {
        console.table(roles);
        sleep(2);
        mainMenu();   
    });    
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
                    let choices = [];
                    departments.forEach(dep => {
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
            sleep(2);
            mainMenu();
        });
    });

    
};

//viewEmployees()
const viewEmployees = () => {
    const sqlQuery = `SELECT emp.first_name, emp.last_name, rl.title, mgr.first_name as manager_fn, mgr.last_name as manager_ln 
                        FROM employee as emp
                        LEFT JOIN role as rl ON emp.role_id=rl.id
                        LEFT JOIN employee as mgr ON emp.manager_id=mgr.id`;
    tableHeader("Employees List:");
    connection.query(sqlQuery, (err, employees) => {
        console.table(employees);
        sleep(2);
        mainMenu();
    });    
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
                        let choices = [];
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
                        let choices = [];
                        mgrs.forEach(mgr => {
                            choices.push(mgr.id + '-' + mgr.last_name + ", " + mgr.first_name);
                        })
                        return choices;
                    }
                }
            ])
            .then((answers) => {
                const employeeRole = firstOrDefault(roles, "title", answers.selected_role);
                const employeeMgr = firstOrDefault(mgrs, "id", parseInt(answers.selected_manager.split('-')[0]));
                if (employeeRole !== undefined && employeeMgr !== undefined) {
                    connection.query("INSERT INTO employee SET ?", {
                        first_name: answers.first_name,
                        last_name: answers.last_name,
                        role_id: employeeRole.id,
                        manager_id: employeeMgr.id,
                    }), 
                    (err) => {
                        if (err) throw err;
                        console.log(`new employee record for ${answers.last_name}, ${answers.first_name}`);
                    }
                }
                sleep(2);
                mainMenu();
            })
        });
    });    
}

//updateEmployeeRole()
const updateEmployeeRole = () => {
    let sqlQuery = `SELECT emp.id, emp.first_name, emp.last_name, rl.title, mgr.first_name as manager_fn, mgr.last_name as manager_ln 
                        FROM employee as emp
                        LEFT JOIN role as rl ON emp.role_id=rl.id
                        LEFT JOIN employee as mgr ON emp.manager_id=mgr.id`;
    connection.query(sqlQuery, (err, employees) => {
        sqlQuery = `SELECT rl.id, rl.title, rl.salary, dep.department_name FROM role as rl
                    LEFT JOIN department AS dep ON rl.department_id=dep.id`;
        connection.query(sqlQuery, (err, roles) => {
            inquirer.prompt([
                {
                    name: "selected_employee",
                    type: "rawlist",
                    message: "choose an employee to update thier role",
                    choices() {
                        let choices = [];
                        employees.forEach(emp => {
                            choices.push(emp.id + "-" + emp.last_name + ", " + emp.first_name + ": " + emp.title);
                        });
                        return choices;
                    }
                },
                {
                    name: "selected_role",
                    type: "rawlist",
                    message: "choose a new role for this employee",
                    choices() {
                        let choices = [];
                        roles.forEach(role => {
                            choices.push(role.id + "-" + role.title + "(" + role.department_name + ")");
                        })
                        return choices;
                    }
                }
            ])
            .then((answers) => {
                const employeeId = parseInt(answers.selected_employee.split("-")[0]);
                const newRoleId = parseInt(answers.selected_role.split("-")[0]);
                if (employeeId !== 0 && newRoleId !== 0) {
                    connection.query(`UPDATE employee SET ? WHERE ?`, [
                        { role_id: newRoleId },
                        { id: employeeId }
                    ]),
                    (err, res) => {
                        if (err) throw err;
                        console.log(`role value updated for ${answers.selected_employee}`);
                    }
                }

                sleep(2);
                mainMenu();
            })
        });
    });

    
};

//endSession()
function endSession() {
    console.log("Closing the application...");
    process.exit();
}


//helper functions
const tableHeader = (headerText) => {
    const nLine = "\\n";
    const borderText = "============================================";
    console.log(borderText);
    console.log();
    console.log(headerText);
    console.log();
    console.log(borderText);
};

const sleep = (seconds) => {
  var e = new Date().getTime() + (seconds * 1000);
  while (new Date().getTime() <= e) {}
};

const firstOrDefault = (arr, propName, matchValue) => {
    let result;
    arr.forEach(item => {
        let compValue = item[propName];
        if (compValue === matchValue) {
            result = item;
        }
    });

    return result;
};
DROP DATABASE IF EXISTS employees;

CREATE DATABASE employees;
USE employees;

CREATE TABLE department (
    id INTEGER NOT NULL AUTO_INCREMENT,
    department_name VARCHAR(30) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE role (
    id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL(10, 2) NOT NULL,
    department_id INTEGER NOT NULL,
    FOREIGN KEY (department_id) REFERENCES department(id) ON DELETE CASCADE
);

CREATE TABLE employee (
    id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INTEGER NOT NULL,
    manager_id INTEGER,
    
    FOREIGN KEY (role_id) REFERENCES role(id) ON DELETE CASCADE
);


INSERT INTO department (department_name)
VALUES 
    ("Sales"),
    ("Engineering"),
    ("Operations"),
    ("Executive"),
    ("Accounting");

INSERT INTO role (title, salary, department_id)
VALUES
    ("President", 260000, 4),
    ("Regional Sales Manager", 165000, 1),
    ("Sales Engineer", 70000, 1),
    ("Field Engineer", 67000, 2),
    ("Design Engineer", 75000, 2),
    ("Engineering Director", 141000, 2),
    ("Project Manager", 125000, 3),
    ("Controller", 154300, 5),
    ("Staff Accountant", 62000, 5);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
    ("Brandon", "Berman", 1, 1),
    ("Maria", "Pascal", 2, 1),
    ("Andrew", "Kovack", 3, 2),
    ("Quinton", "Bauer", 4, 6),
    ("Sarah", "Masse", 5, 6),
    ("Sonia", "Everett", 6, 1),
    ("Jordan", "Richardson", 7, 6),
    ("Mark", "Sandoval", 8, 1),
    ("Katlin", "Armatige", 9, 8),
    ("Steven", "Sullivan", 4, 6),
    ("Elizabeth", "Benedetto", 3, 2),
    ("Gary", "Mergner", 9, 8),
    ("William", "Uhl", 4, 6),
    ("Alex", "Larson", 5, 6);
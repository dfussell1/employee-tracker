INSERT INTO department (name)
VALUES 
    ("Management"),
    ("Sales"),
    ("Information Technology (IT)"),
    ("Finance");

INSERT INTO role (title, salary, department_id)
VALUES 
    ("CEO", 150000, 1),
    ("Building Supervisor", 120000, 1),
    ("Sales Manager", 90000, 2),
    ("Sales Associate", 75000, 2),
    ("IT Manager", 100000, 3),
    ("IT Associate", 80000, 3),
    ("Account Manager", 105000, 4),
    ("Accountant", 85000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
    ("Cee", "Ayeo", 1, NULL),
    ("James", "Better", 2, 1),
    ("Eric", "Cartman", 3, NULL),
    ("Ben", "Tin", 4, 3),
    ("Michael", "Long", 5, NULL),
    ("Mallory", "Keeps", 6, 5),
    ("Meredith", "Ray", 7, NULL),
    ("Sarah", "Thomas", 8, 7);

INSERT INTO departments (name)
VALUES ("Produce"),
       ("Meat"), 
       ("Specialty"), 
       ("Grocery"), 
       ("Bakery"), 
       ("Deli"), 
       ("Coffee Bar");
INSERT INTO roles (title, salary, department_id)
VALUES ("Barista", 35000, 7),
       ("Baker", 43000, 5), 
       ("Cheese Monger", 36000, 3), 
       ("Butcher", 35000, 2), 
       ("Deli Attendent", 23000, 6); 
       
INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES ("Tevis", "Reilly", 2, 1),
       ("John", "Doe", 4, 2);
       
         
const inquirer = require('inquirer')
const cTable = require('console.table')
const mysql = require('mysql2')



const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'employees_db'
}, () => console.log('Connected to db'))



const add = async (tableName, { addDept, addRole, roleSalary, roleDeptId, addEmployee, addEmployeeRole, addManager }) => {
    // const { addDept } = tableProps
    // console.log(tableName, tableProps)
    switch (tableName) {
        case 'employee':
            let first = addEmployee.split(' ')[0]
            let last = addEmployee.split(' ')[1]
            let role = addEmployeeRole.split(' ')[0]
            let manager = addManager.split(' ')[0]
            db.query(
                'INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)',
                [first, last, role, manager]
            )
            break
        case 'role':
            let dept = roleDeptId.split(' ')[0]
            db.query(
                'INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)',
                [addRole, roleSalary, dept]
            )
            break
        case 'department':
            db.query(
                'INSERT INTO departments (name) VALUES (?)',
                addDept
            )
    }
    // console.log(tableName)




}


const getAll = async (tableName) => {
    return await db.promise().query(
        "SELECT * FROM ??",
        tableName)
}

const update = async (tableName, { employeeIdUpdate, newRoleId }) => {
    console.log(tableName, employeeIdUpdate[0])

    db.query('UPDATE ?? SET role_id=? WHERE id=?',
                [tableName, newRoleId[0], employeeIdUpdate[0]])
}

const createQuestion = async (array, table) => {
    let final = []
    // console.log(array)
    let name = ''
    switch (table) {
        case 'employees':
            return array.map(emp => {
                return name = `${emp.id} ${emp.first_name} ${emp.last_name}`
            });

        case 'roles':
            return array.map(role => {
                return name = `${role.id} ${role.title}`
            })
        // array.forEach()
        case 'departments':
            return array.map(dept => {
                return name = `${dept.id} ${dept.name}`
            })
    }
}


const collectInputs = async () => {
    const homeChoices = ['View all departments', 'View all roles', 'View all employees',
        'Add a department', 'Add a role', 'Add an employee',
        'Update employee role', 'Quit']
    const [allEmployees, y] = await getAll('employees')
    let allEmployeesQuestions = await createQuestion(allEmployees, 'employees')
    const [allRoles, x] = await getAll('roles')
    let allRolesQuestions = await createQuestion(allRoles, 'roles')
    const [allDepts, q] = await getAll('departments')
    let allDeptsQuestions = await createQuestion(allDepts, 'departments')
    // console.log(allRolesQuestions)
    const questions = [
        {
            type: 'list',
            name: 'homeScreen',
            message: 'What would you like to do?',
            choices: homeChoices
        },
        {
            type: 'input',
            name: 'addDept',
            message: 'What is the name of the department you want to add?',
            when: ({ homeScreen }) => homeScreen === homeChoices[3]
        },
        {
            type: 'input',
            name: 'addRole',
            message: 'What is the name of the role you want to add?',
            when: ({ homeScreen }) => homeScreen === homeChoices[4]
        },
        {
            type: 'number',
            name: 'roleSalary',
            message: 'What is the salary of the position?',
            when: ({ homeScreen }) => homeScreen === homeChoices[4]
        },
        {
            type: 'list',
            name: 'roleDeptId',
            message: 'What is the department ID of the role?',
            when: ({ homeScreen }) => homeScreen === homeChoices[4],
            choices: allDeptsQuestions
        },
        {
            type: 'input',
            name: 'addEmployee',
            message: 'What is the name of the employee you want to add?',
            when: ({ homeScreen }) => homeScreen === homeChoices[5]
        },
        {
            type: 'list',
            name: 'addEmployeeRole',
            message: 'Which role is this employee in?',
            when: ({ homeScreen }) => homeScreen === homeChoices[5],
            choices: allRolesQuestions
        },
        {
            type: 'list',
            name: 'addManager',
            message: 'What is the manager id for this employee?',
            when: ({ homeScreen }) => homeScreen === homeChoices[5],
            choices: allEmployeesQuestions
        },
        {
            type: 'list',
            name: 'employeeIdUpdate',
            message: 'Which employee do you want to update?',
            when: ({ homeScreen }) => homeScreen === homeChoices[6],
            choices: allEmployeesQuestions
        },
        {
            type: 'list',
            name: 'newRoleId',
            message: 'Which role are they in now?',
            when: ({ homeScreen }) => homeScreen === homeChoices[6],
            choices: allRolesQuestions
        }
    ]

    return await inquirer.prompt(questions)
}

const init = async () => {
    while (true) {
        // console.log(running)
        // await collectInputs()
        let { homeScreen, ...answers } = await collectInputs()

        let arr = homeScreen.split(' ')
        let task = arr[0]
        let currentTable = arr[2]
        let results
        // console.log(answers)
        if (task === 'View') {

            results = await getAll(currentTable)
            console.log('\n\n')
            console.table(results[0])

        } else if (task === 'Update') {

            results = await update('employees', answers)
            console.table(results)

        } else if (task === 'Add') {

            results = await add(currentTable, answers)
            console.table(results)

        } else if (task === 'Quit') {
            process.exit(1)

        }
    }

}


init()
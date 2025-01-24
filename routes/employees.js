const express = require('express');
const router = express.Router();

const EmployeeService = require('../services/employeeService');
const employeeService = new EmployeeService();

router.get('/', (req, res) => {
  const employees = employeeService.loadEmployees();
  res.render('view-employees', { employees: employees });
});

router.get('/add', (req, res) => {
  const predefinedRoles = ['Manager', 'Developer', 'Designer', 'QA', 'HR'];
  res.render('addEmployee', { 
    roles: predefinedRoles, 
    errors: null, 
    formData: {} 
  });
});

router.post('/add', (req, res) => {
  const { name, address, salary, role, employeeNumber } = req.body;

  const parsedSalary = parseFloat(salary);
  const parsedEmployeeNumber = parseInt(employeeNumber, 10);

  const employeeData = {
    name: name.trim(),
    address: address.trim(),
    salary: parsedSalary,
    role,
    employeeNumber: parsedEmployeeNumber
  };

  try {
    const createdEmployee = employeeService.createEmployee(employeeData);
    res.render('addEmployee', { 
      roles: ['Manager', 'Developer', 'Designer', 'QA', 'HR'], 
      errors: null, 
      formData: {}, 
      success: `Employee ${createdEmployee.name} added successfully!` 
    });
  } catch (error) {
    const predefinedRoles = ['Manager', 'Developer', 'Designer', 'QA', 'HR'];
    res.render('addEmployee', { 
      roles: predefinedRoles, 
      errors: error.message, 
      formData: employeeData 
    });
  }
});

router.post('/delete/:id', (req, res) => {
  const employeeNumber = parseInt(req.params.id, 10);
  const success = employeeService.deleteEmployee(employeeNumber);

  if (!success) {
    return res.status(404).send('Employee not found');
  }
  res.redirect('/employees');
});

router.get('/:id', (req, res) => {
  const employee = employeeService.getEmployeeById(parseInt(req.params.id));
  if (!employee) return res.status(404).send('Employee not found');
  res.render('employeeDetail', { employee: employee });
});

module.exports = router;

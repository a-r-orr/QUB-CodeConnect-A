// routes/employees.js

const express = require('express');
const router = express.Router();

const EmployeeService = require('../services/employeeService');
const employeeService = new EmployeeService();

router.get('/', (req,res) => {
  const employees = employeeService.loadEmployees();
  res.render('view-employees', { employees: employees });
});

// Display the Add Employee Form
router.get('/add', (req, res) => {
  const predefinedRoles = ['Manager', 'Developer', 'Designer', 'QA', 'HR'];
  res.render('addEmployee', { 
    roles: predefinedRoles, 
    errors: null, 
    formData: {} 
  });
});

// Handle Add Employee Form Submission
router.post('/add', (req, res) => {
  const { name, address, salary, role, employeeNumber } = req.body;

  // Parse numeric fields
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
    // Redirect to the Add Employee form with a success message
    res.render('addEmployee', { 
      roles: ['Manager', 'Developer', 'Designer', 'QA', 'HR'], 
      errors: null, 
      formData: {}, 
      success: `Employee ${createdEmployee.name} added successfully!` 
    });
  } catch (error) {
    // If there's a validation error, re-render the form with error message and existing data
    const predefinedRoles = ['Manager', 'Developer', 'Designer', 'QA', 'HR'];
    res.render('addEmployee', { 
      roles: predefinedRoles, 
      errors: error.message, 
      formData: employeeData 
    });
  }
});

module.exports = router;

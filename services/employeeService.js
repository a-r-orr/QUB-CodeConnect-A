// services/employeeService.js

const fs = require('fs');
const path = require('path');

class EmployeeService {
  constructor() {
    this.filePath = path.join(__dirname, '..', 'employees.json');
    this.employees = this.loadEmployees();
  }

  // Load employees from the JSON file
  loadEmployees() {
    try {
      const data = fs.readFileSync(this.filePath, 'utf8');
      return JSON.parse(data);
    } catch (err) {
      console.error('Error reading employees.json:', err);
      return [];
    }
  }

  // Get an employee by ID
  getEmployeeById(id) {
    const employees = this.loadEmployees();
    console.log(employees);
    return employees.find(employee => employee.employeeNumber === id);
  }

  // Save employees to the JSON file
  saveEmployees() {
    try {
      fs.writeFileSync(this.filePath, JSON.stringify(this.employees, null, 2));
    } catch (err) {
      console.error('Error writing to employees.json:', err);
    }
  }

  // Create a new employee with validation
  createEmployee(employeeData) {
    const { name, address, salary, role, employeeNumber } = employeeData;

    // Validation: All fields are required
    if (!name || !address || salary === undefined || !role || employeeNumber === undefined) {
      throw new Error('All fields are required.');
    }

    // Validation: Salary must be a non-negative number
    if (typeof salary !== 'number' || salary < 0) {
      throw new Error('Salary must be a non-negative number.');
    }

    // Validation: Employee Number must be a number
    if (typeof employeeNumber !== 'number') {
      throw new Error('Employee number must be a number.');
    }

    // Validation: Employee Number must be unique
    const existingEmployee = this.employees.find(emp => emp.employeeNumber === employeeNumber);
    if (existingEmployee) {
      throw new Error('Employee number must be unique.');
    }

    // Validation: Role must be predefined
    const predefinedRoles = ['Manager', 'Developer', 'Designer', 'QA', 'HR'];
    if (!predefinedRoles.includes(role)) {
      throw new Error(`Role must be one of the following: ${predefinedRoles.join(', ')}`);
    }

    // Validation: Address must be a single line
    if (address.includes('\n') || address.includes('\r')) {
      throw new Error('Address must be a single line.');
    }

    // Create the new employee object
    const newEmployee = {
      name: name.trim(),
      address: address.trim(),
      salary,
      role,
      employeeNumber
    };

    // Add to the employees array and save
    this.employees.push(newEmployee);
    this.saveEmployees();

    return newEmployee;
  }
}

module.exports = EmployeeService;

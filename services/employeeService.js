// services/employeeService.js

const fs = require('fs');
const path = require('path');

class EmployeeService {
  constructor() {
    this.filePath = path.join(__dirname, '..', 'employees.json');
    this.employees = this.loadEmployees();
  }

  loadEmployees() {
    try {
      const data = fs.readFileSync(this.filePath, 'utf8');
      return JSON.parse(data);
    } catch (err) {
      console.error('Error reading employees.json:', err);
      return [];
    }
  }

  getEmployeeById(id) {
    const employees = this.loadEmployees();
    console.log(employees);
    return employees.find(employee => employee.employeeNumber === id);
  }

  saveEmployees() {
    try {
      fs.writeFileSync(this.filePath, JSON.stringify(this.employees, null, 2));
    } catch (err) {
      console.error('Error writing to employees.json:', err);
    }
  }

  createEmployee(employeeData) {
    const { name, address, salary, role, employeeNumber } = employeeData;

    if (!name || !address || salary === undefined || !role || employeeNumber === undefined) {
      throw new Error('All fields are required.');
    }

    if (typeof salary !== 'number' || salary < 0) {
      throw new Error('Salary must be a non-negative number.');
    }

    if (typeof employeeNumber !== 'number') {
      throw new Error('Employee number must be a number.');
    }

    const existingEmployee = this.employees.find(emp => emp.employeeNumber === employeeNumber);
    if (existingEmployee) {
      throw new Error('Employee number must be unique.');
    }

    const predefinedRoles = ['Manager', 'Developer', 'Designer', 'QA', 'HR'];
    if (!predefinedRoles.includes(role)) {
      throw new Error(`Role must be one of the following: ${predefinedRoles.join(', ')}`);
    }

    if (address.includes('\n') || address.includes('\r')) {
      throw new Error('Address must be a single line.');
    }

    const newEmployee = {
      name: name.trim(),
      address: address.trim(),
      salary,
      role,
      employeeNumber
    };

    this.employees.push(newEmployee);
    this.saveEmployees();

    return newEmployee;
  }


    deleteEmployee(employeeNumber) {
      this.employees = this.loadEmployees();
      
      const index = this.employees.findIndex(emp => emp.employeeNumber === employeeNumber);
      if (index !== -1) {
        this.employees.splice(index, 1);
        this.saveEmployees();
        return true; 
      }
      return false; 
    }
  }

module.exports = EmployeeService;

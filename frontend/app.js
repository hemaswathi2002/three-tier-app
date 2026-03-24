const API_URL = 'http://backend:8080/api/v1/employees';

document.addEventListener('DOMContentLoaded', () => {
    fetchEmployees();

    document.getElementById('employeeForm').addEventListener('submit', function(e) {
        e.preventDefault();
        createEmployee();
    });
});

async function fetchEmployees() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const employees = await response.json();
        const tbody = document.querySelector('#employeeTable tbody');
        tbody.innerHTML = '';

        employees.forEach(employee => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${employee.id}</td>
                <td>${employee.firstName}</td>
                <td>${employee.lastName}</td>
                <td>${employee.emailId}</td>
            `;
            tbody.appendChild(tr);
        });
        document.getElementById('errorMessage').innerText = '';
    } catch (error) {
        console.error('Error fetching employees:', error);
        document.getElementById('errorMessage').innerText = 'Could not fetch employees. Is the backend running?';
    }
}

async function createEmployee() {
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const emailId = document.getElementById('emailId').value;

    const employee = { firstName, lastName, emailId };

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(employee),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Clear form
        document.getElementById('employeeForm').reset();
        
        // Refresh list
        fetchEmployees();
        document.getElementById('errorMessage').innerText = '';
    } catch (error) {
        console.error('Error creating employee:', error);
        document.getElementById('errorMessage').innerText = 'Could not create employee.';
    }
}

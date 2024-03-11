const Employee = () => {
    this.empId = '';
    this.name = '';
    this.email = '';
    this.firstName = '';
    this.lastName = '';
    this.image = '';
};

Employee.prototype.name = () => {
    return this.firstName + " " + this.lastName;
};

export default Employee;

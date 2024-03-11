import { Avatar, ListItem, ListItemAvatar, Tooltip, Typography } from "@material-ui/core";
import { connect } from "react-redux";
import { ListItemText } from '@material-ui/core/es';
import moment from 'moment';
import Paper from "@material-ui/core/Paper";
import React, { Component } from 'react';
import Tab from "@material-ui/core/Tab";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Tabs from "@material-ui/core/Tabs";
import withStyles from "@material-ui/core/es/styles/withStyles";
import PropTypes from 'prop-types';
import { getAllEmployees, updateDrawerMenu } from "../../Store/actions";
import { MENU_EMPLOYEES } from '../common/AppBar/DCAppBar';
import { VIEW_TYPE_DEFAULT } from "../../common/Strings";
import SearchView from '../SearchView/SearchView';
import SkeletonLoading from '../Loaders/SkeletonLoading';

import '../../Components/common/common.css';
import CircularLoader from "../common/CircularLoader";
const styles = theme => ({
    progress: {
        margin: theme.spacing(2),
    },
});

function desc(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  }

function getSorting(order, orderBy) {
    return order === 'desc' ? (a, b) => desc(a, b, orderBy) : (a, b) => -desc(a, b, orderBy);
}

const rows = [
    { id: 'first_name', numeric: true, disablePadding: false, label: 'Name' },
    { id: 'user_role', numeric:true, disablePadding: false, label: 'Designation' },
    { id: 'phone', numeric: false, disablePadding: false, label: 'Phone Number' },
    { id: 'hire_date', numeric: true, disablePadding: false, label: 'Joined DevDigital' },
  ];

  class EnhancedTableHead extends React.Component {
    createSortHandler = property => event => {
      this.props.onRequestSort(event, property);
    };
  
    render() {
      const { order, orderBy } = this.props;
  
      return (
        <TableHead>
          <TableRow>
            {rows.map(row => {
              return (
                <TableCell
                  key={row.id}
                  numeric={row.numeric}
                  padding={row.disablePadding ? 'none' : 'default'}
                  sortDirection={orderBy === row.id ? order : false}
                >
                  <Tooltip
                    title="Sort"
                    placement={row.numeric ? 'bottom-end' : 'bottom-start'}
                    enterDelay={300}
                  >
                    <TableSortLabel
                      active={orderBy === row.id}
                      direction={order}
                      onClick={this.createSortHandler(row.id)}
                    >
                      {row.label}
                    </TableSortLabel>
                  </Tooltip>
                </TableCell>
              );
            }, this)}
          </TableRow>
        </TableHead>
      );
    }
  }

  EnhancedTableHead.propTypes = {
    order: PropTypes.string.isRequired,
    orderBy: PropTypes.string.isRequired,
  };

class Employees extends Component {

    state = {
        order:'asc',
        orderBy:'first_name',
        selectedValue: 0,
        selectedDept: 'All',
        viewType: VIEW_TYPE_DEFAULT,
        keyword: ''
    };

    componentDidMount() {
        this.props.getEmployees();
        this.props.changeDrawerMenu(MENU_EMPLOYEES);
    }

    handleClick = (event) => {
        this.setState({
            viewType: event.target.value
        })
    };

    handleSearch = (keyword) => {
        this.setState({
            keyword: keyword
        })
    };

    handleTabChange = (event, value) => {
        // console.log('pos', value);
        // console.log('value', this.departments[value]);
        let mValue = this.departments[value];
        console.log(mValue)
        this.setState({
            selectedValue: value,
            selectedDept: mValue
        });
    };

    handleRequestSort = (event, property) => {
        const orderBy = property;
        let order = 'desc';
    
        if (this.state.orderBy === property && this.state.order === 'desc') {
          order = 'asc';
        }
    
        this.setState({ order, orderBy });
      };

    
    render() {
        const { order, orderBy} = this.state;
        this.departments = ['All'];
        this.dept = [];
        let employees = this.props.employees;
        this.props.employees.map((emp) => {
            if (!this.dept.includes(emp.department)) {
                if(emp.department.toLowerCase() !== 'client'){
                    this.dept.push(emp.department);
                }
            }
            return true;
        });
        
        this.dept.sort();
        console.log(this.dept)
        this.dept.map((mDepartment) => {
            return this.departments.push(mDepartment);
        });
        
        
        return (
                <div>
                    {/*Search View and View Toggle*/}

                    <Typography variant={'h5'}>
                        Employees
                    </Typography>

                    <SearchView handleSearch={this.handleSearch} />

                    {/*Tab bar*/}

                    {/* <div style={{ marginBottom: '16px' }} className='blockView'></div> */}
                    <Paper>
                        <Tabs
                            value={this.state.selectedValue}
                            onChange={this.handleTabChange}
                            indicatorColor="primary"
                            textColor="primary"
                            variant="scrollable"
                            scrollButtons="auto"
                        >
                            {
                                this.departments
                                    .map((dept, index) => {
                                        return (<Tab key={index} label={dept} />);
                                    })
                            }
                        </Tabs>
                    </Paper>


                    {/*Container*/}

                    <Paper style={{ marginTop: '12px' }} >

                        <Table size='small'>

                            <EnhancedTableHead
                                order={order}
                                orderBy={orderBy}
                                onRequestSort={this.handleRequestSort}
                            />

                            <TableBody>
                                {employees
                                    .sort(getSorting(order, orderBy))
                                    .filter((val, index, arr) => {
                                        if (this.state.selectedValue !== 0) {
                                            return val.department === this.state.selectedDept;
                                        } else {
                                            return true;
                                        }
                                    })
                                    .filter((val, index, arr) => {
                                        let fullName = val.first_name + val.last_name;
                                        return fullName.toLowerCase().includes((this.state.keyword).toLowerCase());
                                    })
                                    .map((employee, index) => {
                                        return (

                                            <TableRow key={employee.id}>
                                                <TableCell component='th' scope='row'>
                                                    <ListItem button onClick={() => {
                                                        // console.log(employee.id);
                                                        this.props.history.push("/employees/" + employee.id);
                                                    }}>
                                                        <ListItemAvatar>
                                                            <Avatar alt={employee.first_name} src={employee.Image} />
                                                        </ListItemAvatar>

                                                        <ListItemText primary={
                                                            <Typography variant='body1'>
                                                                {employee.first_name + " "}{employee.last_name}
                                                            </Typography>}
                                                            secondary={
                                                                <Typography variant='body2'>
                                                                    {(employee.email).toLowerCase()}
                                                                </Typography>

                                                            }
                                                        />
                                                    </ListItem>
                                                </TableCell>
                                                <TableCell scope='row'>
                                                    <ListItemText primary={
                                                        <Typography variant='body1'>{employee.user_role}  </Typography>}
                                                        secondary={
                                                            <Typography variant='body2'>
                                                                {employee.department}
                                                            </Typography>
                                                        }
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant='body1'>{employee.phone}</Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant='body1'>{moment(employee.hire_date, 'YYYY-MM-DD').fromNow()}</Typography>
                                                </TableCell>

                                            </TableRow>

                                        )
                                    })
                                }
                            </TableBody>
                        </Table>
                    </Paper>
                </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        isFetching: state.usr.isFetching,
        employees: state.usr.employees
    }
};

const mapDispatchToProps = dispatch => {
    return {
        getEmployees: () => dispatch(getAllEmployees()),
        changeDrawerMenu: (index) => dispatch(updateDrawerMenu(index))
    };
};

export default withStyles(styles)(connect(
    mapStateToProps,
    mapDispatchToProps
)(Employees));
import React, {useState, useEffect} from 'react'
import axios from 'axios'
import {
Typography,
Avatar,
IconButton,
Chip,
Button,
Tooltip,
Tab,
Tabs,
Box
} from '@mui/material'
import { Add } from '@mui/icons-material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import ConfirmationDialog from './confirmationDialog';
import toast from 'react-hot-toast';
import PropTypes from 'prop-types';
import ApprovedPayments from './approvedPayments';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';



export default function Payments() {

    const [workers, setWorkers] = useState([{name: "Willy Wario"}])
    const [open, setOpen] = useState(false)
    const [addWorkerOpen, setAddWorkerOpen] = useState(false)
    const [deleteId, setDeleteId] = useState(null)
    const [value, setValue] = useState(0);

    const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};
    

    const getWaitingApproval = async() => {
        const data = await axios.get('http://localhost:5000/waitingApproval')
        setWorkers(data.data)
      }
    
      useEffect(() => {
        getWaitingApproval()
      }, [])


      
   const stringToColor = (string) => {
    let hash = 0;
    let i;
  
    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }
  
    let color = '#';
  
    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }
    /* eslint-enable no-bitwise */
  
    return color;
  }

   const stringAvatar = (name) => {
    return {
      sx: {
        bgcolor: stringToColor(name),
        width: 35,
        height: 35,
        fontSize: 15
      },
      children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
    };
  }

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));
  
  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
      border: 0,
    },
  }));

  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }


  const handleChange = (event, newValue) => {
    setValue(newValue);
    };

  const onClose = () => {
    setOpen(false)
  }


  const handleDelete = (id) => {
    axios.delete('http://localhost:5000/workers/'+id).then(() => {
        toast.success('worker terminated')
        setOpen(false)
        getWaitingApproval()
    }).catch((err) => {
        toast.error(err.message)
    })
  }


  const approvePayment = (payment) => {
    axios.post('http://localhost:5000/approvedPayments', {...payment}).then(() => {
        toast.success('payment approved')
        axios.delete('http://localhost:5000/waitingApproval/'+ payment.id).then(() => {
          getWaitingApproval()
        })
    }).catch((err) => {
        toast.error(err.message)
    })
  }



  return (
    <>
    <Box>
    <Box sx={{ borderBottom: 1, borderColor: 'divider', padding: '25px', display: 'flex', justifyContent: 'center' }}>
      <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
        <Tab label="Pending Approval" {...a11yProps(0)} />
        <Tab label="Approved Payments" {...a11yProps(1)} />
      </Tabs>
    </Box>

<TabPanel value={value} index={0}>
<TableContainer component={Paper} sx={{margin:'auto', maxWidth: '1800px'}}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <StyledTableRow>
            <StyledTableCell>Name</StyledTableCell>
            <StyledTableCell align="center">Role</StyledTableCell>
            <StyledTableCell align="center">Clock In Time</StyledTableCell>
            <StyledTableCell align="center">Clock Out Time</StyledTableCell>
            <StyledTableCell align="center">Time Worked(hours)</StyledTableCell>
            <StyledTableCell align="center">Amount Payable</StyledTableCell>
            <StyledTableCell align="right">Actions</StyledTableCell>
          </StyledTableRow>
        </TableHead>
        <TableBody>
          {workers.map((worker) => (
            <StyledTableRow
              key={worker.id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <StyledTableCell component="th" scope="row">
                <Box sx={{display: 'flex', gap: '5px', alignItems: 'center'}}>
                <Avatar {...stringAvatar(worker.name)} />
                <Typography>
                {worker.name}
                </Typography>
                </Box>
              </StyledTableCell>
              <StyledTableCell align="center">
              <Chip label={worker.role} variant='contained' color="primary">
                </Chip>
              </StyledTableCell>
              <StyledTableCell align="center">
              <Typography>
                {worker.clockInTime}
                </Typography>
              </StyledTableCell>
              <StyledTableCell align="center">
              <Typography>
                {worker.clockOutTime}
                </Typography>
              </StyledTableCell>
              <StyledTableCell align="center">
              <Typography>
                {parseFloat(worker.timeWorked).toFixed(2)}
                </Typography>
              </StyledTableCell>
              <StyledTableCell align="center">
              <Typography color='green' sx={{fontWeight: 'bold'}}>
                {"+Kes." + parseFloat(worker.amountPayable).toFixed(2)}
                </Typography>
              </StyledTableCell>
              <StyledTableCell align="right">
              <Box sx={{display: 'flex', gap: '7px', justifyContent: 'flex-end'}}>
                <Tooltip title="approve payment">
                <IconButton onClick={() => approvePayment(worker)}><CheckCircleIcon color='info'></CheckCircleIcon></IconButton>
                </Tooltip>
                </Box>
              </StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    </TabPanel>
    <TabPanel value={value} index={1}>
      <ApprovedPayments></ApprovedPayments>
    </TabPanel>
    <ConfirmationDialog {...{open, onClose, onOk: () => handleDelete(deleteId)}}></ConfirmationDialog>
    </Box>
    </>
  )
}
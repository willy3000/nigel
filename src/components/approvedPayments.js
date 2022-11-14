import React, {useState, useEffect} from 'react'
import axios from 'axios'
import {
Typography,
Avatar,
IconButton,
Chip,
Tooltip,
Box
} from '@mui/material'
import TableBody from '@mui/material/TableBody';
import TableHead from '@mui/material/TableHead';
import Paper from '@mui/material/Paper';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import Table from '@mui/material/Table';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import { styled } from '@mui/material/styles';
import SendIcon from '@mui/icons-material/Send';
import SuccessDialog from './success';
import { toast } from 'react-hot-toast';


export default function ApprovedPayments() {

    const [payments, setPayments] = useState([])
    const [open, setOpen] = useState(false)

    const getApprovedPayments = async() => {
        const data = await axios.get('http://localhost:5000/approvedPayments')
        setPayments(data.data)
      }
    
      useEffect(() => {
        getApprovedPayments()
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


      const sendEmail = async (payment) => {
        const config = {
            Username: 'willywario0@gmail.com',
            Password: '04B0F52F32FC4607574D24CD84C43E7A7748',
            Host: 'smtp.elasticemail.com',
            Port: 2525,
            To: payment.email,
            From: 'willywario0@gmail.com',
            Subject:'PAYMENT DISPATCHED',
            Body: `Your payment of Kes. ${parseFloat(payment.amountPayable).toFixed(2)} has been dispatched successfully`
        };
        const res = await window.Email.send(config)
        console.log(res)
        if(res==='OK'){
            setOpen(true)
        }
      }

      const handleSendEmail = (payment) => {
        toast.promise(
            sendEmail(payment),
             {
               loading: 'Processing',
               success: "Operation Successful",
               error: err => err.message,
             }
           );
      }

  return (
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
          {payments.map((payment) => (
            <StyledTableRow
              key={payment.id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <StyledTableCell component="th" scope="row">
                <Box sx={{display: 'flex', gap: '5px', alignItems: 'center'}}>
                <Avatar {...stringAvatar(payment.name)} />
                <Typography>
                {payment.name}
                </Typography>
                </Box>
              </StyledTableCell>
              <StyledTableCell align="center">
              <Chip label={payment.role} variant='contained' color="primary">
                </Chip>
              </StyledTableCell>
              <StyledTableCell align="center">
              <Typography>
                {payment.clockInTime}
                </Typography>
              </StyledTableCell>
              <StyledTableCell align="center">
              <Typography>
                {payment.clockOutTime}
                </Typography>
              </StyledTableCell>
              <StyledTableCell align="center">
              <Typography>
                {parseFloat(payment.timeWorked).toFixed(2)}
                </Typography>
              </StyledTableCell>
              <StyledTableCell align="center">
              <Typography color='green' sx={{fontWeight: 'bold'}}>
                {"+Kes." + parseFloat(payment.amountPayable).toFixed(2)}
                </Typography>
              </StyledTableCell>
              <StyledTableCell align="right">
              <Box sx={{display: 'flex', gap: '7px', justifyContent: 'flex-end'}}>
                <Tooltip title="dispatch payment">
                <IconButton onClick={() => handleSendEmail(payment)}><SendIcon color='info'></SendIcon></IconButton>
                </Tooltip>
                </Box>
              </StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
      <SuccessDialog {...{open, setOpen}}/>
    </TableContainer>
  )
}

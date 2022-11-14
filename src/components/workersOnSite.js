import React, {useState, useEffect} from 'react'
import axios from 'axios'
import { Card,
CardContent,
CardActions,
Typography,
Avatar,
IconButton,
Chip,
Tooltip,

Box
} from '@mui/material'
import WatchLaterIcon from '@mui/icons-material/WatchLater';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import SnoozeIcon from '@mui/icons-material/Snooze';
import { toast } from 'react-hot-toast';
import {v4 as uuid} from 'uuid'


export default function WorkersOnSite() {

    const [workers, setWorkers] = useState([])
    
    const getWorkersOnSite = async() => {
        console.log('startedwewe')
        const data = await axios.get('http://localhost:5000/workersOnSite')
        setWorkers(data.data)
      }
    
      useEffect(() => {
        getWorkersOnSite()
      }, [])


      const StyledTableCell = styled(TableCell)(({ theme }) => ({
        [`&.${tableCellClasses.head}`]: {
          backgroundColor: theme.palette.common.black,
          color: theme.palette.common.white,
        },
        [`&.${tableCellClasses.body}`]: {
          fontSize: 14,
        },
      }));

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
      
      const StyledTableRow = styled(TableRow)(({ theme }) => ({
        '&:nth-of-type(odd)': {
          backgroundColor: theme.palette.action.hover,
        },
        // hide last border
        '&:last-child td, &:last-child th': {
          border: 0,
        },
      }));

      const clockOutWorker = (worker) => {
        axios.post('http://localhost:5000/waitingApproval', {...worker, paymentId: uuid(),clockOutTime: new Date(), timeWorked: (new Date() - new Date(worker.clockInTime))/3600000, amountPayable: (new Date() - new Date(worker.clockInTime))/3600000*160}).then(() => {
          toast.success('worker clocked out')
          axios.delete('http://localhost:5000/workersOnSite/'+ worker.id).then(() => {
            getWorkersOnSite()
          })
      }).catch((err) => {
          toast.error(err.message)
      })
      }


  return (
    <TableContainer component={Paper} sx={{margin:'auto', maxWidth: '1800px'}}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <StyledTableRow>
            <StyledTableCell>Name</StyledTableCell>
            <StyledTableCell align="center">Role</StyledTableCell>
            <StyledTableCell align="center">ClockIn Time</StyledTableCell>
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
                {worker.clockInTime}
              </StyledTableCell>
              <StyledTableCell align="right">
              <Box sx={{display: 'flex', gap: '7px', justifyContent: 'flex-end'}}>
                <Tooltip title="clock out of work">
                <IconButton onClick={() => clockOutWorker(worker)}><SnoozeIcon color='warning'></SnoozeIcon></IconButton>
                </Tooltip>
                </Box>
              </StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

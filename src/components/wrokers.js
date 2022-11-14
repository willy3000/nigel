import React, {useState, useEffect} from 'react'
import axios from 'axios'
import { Card,
CardContent,
CardActions,
Typography,
Avatar,
IconButton,
Chip,
Button,
Tooltip,
Tab,
Tabs,
TabPanel,
Box
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit';
import WatchLaterIcon from '@mui/icons-material/WatchLater';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
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
import AddWorker from './addWorker';
import toast from 'react-hot-toast';
import PropTypes from 'prop-types';
import WorkersOnSite from './workersOnSite';



export default function Workers() {

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
    

    const getData = async() => {
        const data = await axios.get('http://localhost:5000/workers')
        setWorkers(data.data)
      }
    
      useEffect(() => {
        getData()
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

  const getCurrentTime = () => {
    var d = new Date()
    const hour = d.getHours()
    const minute = d.getMinutes()
  }

  const handleChange = (event, newValue) => {
    setValue(newValue);
    };

  const onClose = () => {
    setOpen(false)
  }

  const handleOpenConfirm = (id) => {
    setDeleteId(id)
    setOpen(true)
  }

  const handleAddWorkerClose = () => {
    setAddWorkerOpen(false)
  }

  const handleDelete = (id) => {
    axios.delete('http://localhost:5000/workers/'+id).then(() => {
        toast.success('worker terminated')
        setOpen(false)
        getData()
    }).catch((err) => {
        toast.error(err.message)
    })
  }

  const clockInWorker = (worker) => {
    axios.post('http://localhost:5000/workersOnSite', {...worker, clockInTime: new Date()}).then(() => {
      toast.success('worker clocked in')
  }).catch((err) => {
    if(err.response.status === 500){
      toast.error('Worker already on site')
    }else{

    }
  })
  }


  return (
    <>
    {

    }
    <Box sx={{display: 'flex',justifyContent: 'flex-end', margin: '25px'}}>
    <Button startIcon={<Add/>} variant='outlined' onClick={() => setAddWorkerOpen(true)}> Add Worker</Button>
    </Box>
    <Box>

    <Box sx={{ borderBottom: 1, borderColor: 'divider', padding: '25px', display: 'flex', justifyContent: 'center' }}>
      <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
        <Tab label="All Workers" {...a11yProps(0)} />
        <Tab label="Workers On Site" {...a11yProps(1)} />
      </Tabs>
    </Box>

<TabPanel value={value} index={0}>
<TableContainer component={Paper} sx={{margin:'auto', maxWidth: '1800px'}}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <StyledTableRow>
            <StyledTableCell>Name</StyledTableCell>
            <StyledTableCell align="center">Role</StyledTableCell>
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
              <StyledTableCell align="right">
              <Box sx={{display: 'flex', gap: '7px', justifyContent: 'flex-end'}}>
                <Tooltip title="edit worker information">
                <IconButton><EditIcon color='warning'></EditIcon></IconButton>
                </Tooltip>
                <Tooltip title="clock in to work">
                <IconButton onClick={() => clockInWorker(worker)}><WatchLaterIcon color='success'></WatchLaterIcon></IconButton>
                </Tooltip>
                <Tooltip title="terminate worker contract">
                <IconButton onClick = {() => handleOpenConfirm(worker.id)}><HighlightOffIcon color='error'></HighlightOffIcon></IconButton>
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
      <WorkersOnSite></WorkersOnSite>
    </TabPanel>
    <AddWorker {...{addWorkerOpen, handleAddWorkerClose, getData, setAddWorkerOpen}}></AddWorker>
    <ConfirmationDialog {...{open, onClose, onOk: () => handleDelete(deleteId)}}></ConfirmationDialog>
    </Box>
    </>
  )
}
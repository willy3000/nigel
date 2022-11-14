import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import {Dialog} from '@mui/material';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useFormik } from 'formik';
import * as Yup from "yup";
import { blue } from '@mui/material/colors';
import { Autocomplete } from '@mui/material';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { v4 as uuid } from 'uuid';


const theme = createTheme();
const color = blue[700];


const roles = [ 'Software Developer', 'Product Manager', 'Marketing', 'HR', 'Accounting', 'Delivery Man' ]

export default function AddWorker(props) {
    const {addWorkerOpen, handleAddWorkerClose, getData, setAddWorkerOpen} = props

    const formik = useFormik({
        initialValues: {
          email: "",
          name: "",
          phone: "",
          role: "",
        },
        validationSchema: Yup.object({
            name: Yup.string().required('Name is required'),
            email: Yup.string().required('Email is required'),
            phone: Yup.string().required('Phone number is required').min(10, 'Phone number should be at least 10 digits'),
            role: Yup.string().required('Employee role is required')
        }),
        onSubmit: values => {   
            axios.post('http://localhost:5000/workers', {...values, id: uuid()}).then(() => {
                toast.success('worker added successfuly')
                getData()
                setAddWorkerOpen(false)
            }).catch((err) => {
                toast.error(err.message)
            })
        }
      })

    

  return (
    <Dialog
    open={addWorkerOpen}
    onClose={handleAddWorkerClose}
    >


    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: {color} }}>
            <PersonAddIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Add Worker
          </Typography>
          <Box component="form" onSubmit={ formik.handleSubmit}  sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="name"
              label="Name"
              name="name"
              autoComplete="name"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.name}
              error = {Boolean(formik.touched.name && formik.errors.name)}
              helperText = {formik.touched.name && formik.errors.name} 
              
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
              error = {Boolean(formik.touched.email && formik.errors.email)}
              helperText = {formik.touched.email && formik.errors.email} 
              
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="phone"
              label="Phone Number"
              id="phone"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.phone}
              error = {Boolean(formik.touched.phone && formik.errors.phone)}
              helperText = {formik.touched.phone && formik.errors.phone} 
            />
           <Autocomplete
                disablePortal
                fullWidth
                options={roles}
                onChange={(e,value) => formik.setFieldValue('role', value ? value : "")}
                renderInput={(params) => 
                <TextField {...params} 
                    id="role"
                    name = 'role'
                    margin="normal" 
                    label="Choose Role" 
                    onBlur={formik.handleBlur}
                    value={formik.values.role}
                    error = {Boolean(formik.touched.role && formik.errors.role)}
                    helperText = {formik.touched.role && formik.errors.role}
                  />}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, bgcolor: {color}, color: 'white'}}
            >
             Add
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>

    </Dialog>
  )
}

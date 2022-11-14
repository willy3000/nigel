import React from 'react';
import {Box, Button, Dialog, DialogContent, Typography} from "@mui/material";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

const SuccessDialog = props => {
    const {open, setOpen} = props;

    const handleOnOk = () => {
        setOpen(false)
    }

    return(
        <Dialog
            open={open}
            maxWidth={'sm'}
            fullWidth
        >
            <DialogContent>
                <Box sx={{
                    display: 'flex',
                    justifyContent:'center',
                    flexDirection:'column',
                    alignItems:'center',
                }}>
                    <CheckCircleOutlineIcon sx={{ fontSize:'50px'}} fontSize={'large'} color={'success'}/>
                    <Typography variant={'h6'} gutterBottom color="success">Success</Typography>
                    <Typography variant={'subtitle1'}>Transactions has been dispatched, a confirmation email has been sent to the worker</Typography>
                    <Box sx={{ display:'flex', mt:2 }}>
                        <Button sx={{mr:2}} color={'success'} variant={'contained'} onClick={handleOnOk}>Proceed</Button>
                    </Box>
                </Box>
            </DialogContent>
        </Dialog>
    )
}

export default SuccessDialog;
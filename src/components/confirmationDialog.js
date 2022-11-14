import React from 'react';
import {Box, Button, Dialog, DialogContent, Typography} from "@mui/material";
import {DangerousOutlined} from "@mui/icons-material";

const ConfirmationDialog = props => {
    const { open , onClose, onOk} = props;

    const handleOnOk = () => {
        onOk();
    }

    return(
        <Dialog
            open={open}
            maxWidth={'sm'}
            fullWidth
            onClose={onClose}
        >
            <DialogContent>
                <Box sx={{
                    display: 'flex',
                    justifyContent:'center',
                    flexDirection:'column',
                    alignItems:'center',
                }}>
                    <DangerousOutlined sx={{ fontSize:'50px'}} fontSize={'large'} color={'warning'}/>
                    <Typography variant={'h6'} gutterBottom>WARNING!</Typography>
                    <Typography variant={'subtitle1'}>Do you want to terminate worker? This action is irreversable</Typography>
                    <Box sx={{ display:'flex', mt:2 }}>
                        <Button sx={{mr:2}} color={'success'} variant={'contained'} onClick={handleOnOk}>Yes, Proceed</Button>
                        <Button sx={{mr:2}} color={'error'} variant={'contained'} onClick={onClose}>No, Cancel</Button>
                    </Box>
                </Box>
            </DialogContent>
        </Dialog>
    )
}

export default ConfirmationDialog;
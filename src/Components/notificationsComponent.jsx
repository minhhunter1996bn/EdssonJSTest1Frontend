import React, { useState } from 'react'
import PropTypes from 'prop-types'
import {Snackbar,Alert} from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { setNotification } from './../store/index'

function NotificationsComponent(props) {
    const {isOpen,message,type} = useSelector((state) => state.notifications)
    const dispatch = useDispatch()
    const handleClose = ()=>{
        dispatch(setNotification({isOpen:false}))
    }
    return (
        <Snackbar open={isOpen} autoHideDuration={3000} onClose={()=>handleClose()}>
            <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
                {message}
            </Alert>
        </Snackbar>
    )
}


export default NotificationsComponent


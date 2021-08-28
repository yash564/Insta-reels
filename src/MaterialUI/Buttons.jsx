import React from 'react';
import { Button, IconButton } from '@material-ui/core';
import {Send, Delete} from '@material-ui/icons'

const Buttons = () => {

    const styles={
        marginLeft:"10px",
        backgroundColor:"red"
    }
    return ( <div>
        <Button variant="contained">Hello</Button>
        <Button variant="outlined">Hello</Button>
        <Button variant="text">Hello</Button>

        <Button variant="contained" style={styles}>Hello</Button>
        <Button onClick={()=>{alert("Ok")}} variant="contained">Hello</Button>
        <Button href="https://www.google.com/" variant="contained">Hello</Button>

        <Button variant="contained" startIcon={<Send></Send>}>Send</Button>
        <Button variant="contained" endIcon={<Delete></Delete>}>Send</Button>

        <IconButton>
            <Delete></Delete>
        </IconButton>
        
    </div> );
}
 
export default Buttons;
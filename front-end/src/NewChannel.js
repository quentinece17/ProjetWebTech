/** @jsxImportSource @emotion/react */
// Layout
import React, { useRef, useState } from 'react';
// MUI
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/styles';
import Button from '@mui/material/Button';

import {useContext, useEffect} from 'react';
import Context from './Context'

import {useNavigate} from "react-router-dom";

const axios = require('axios')
const config = {port: 3001};

const useStyles = (theme) => ({
  root: {
    height: '100%',
    flex: '1 1 auto',
    display: 'flex',
    // background: 'rgba(0,0,0,.2)',
  },
  card: {
    textAlign: 'center',
  },
  icon: {
    width: '30%',
    fill: '#fff',
  }
})

export default function CreateChannel (){
  const styles = useStyles(useTheme())
  const navigate = useNavigate();
  const [name, setName] = useState()
  const valueRef = useRef()
  const {
    oauth,
    channels, setChannels
  } = useContext(Context)

  const newChannelName = () => {
    setName((prevState) => prevState = valueRef.current.value);
  }

  const validChannel = () => {
    addNewChannel();
  }

  const addNewChannel = async () => {
    try{
      const {data: newChannel} = await axios.post(`http://localhost:${config.port}/channels`, {
        name: name,
        members:[oauth.email],
        owner: oauth.email
    })
    navigate('/channels')
    setChannels([...channels, newChannel])
    }catch(err){
      alert("OUPS");
    }
  }

  return (
    <Stack spacing={2} direction="column">
    <Box
      component="form"
      sx={{
        '& .MuiTextField-root': { m: 1, width: '25ch' },
      }}
      noValidate
      autoComplete="off"
    >
      <div css={styles.root}>
        <TextField
          id="channel-name"
          helperText="Your new channel's name"
          label="Channel name"
          type="Required"
          inputRef={valueRef}
          onChange={() => newChannelName()}
        />
      </div>
    </Box>
    <Button variant="outlined"
      onClick={ () => validChannel() }
    >
      Enter</Button>
    </Stack>
    );
}

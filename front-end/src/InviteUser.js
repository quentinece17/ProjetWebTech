/** @jsxImportSource @emotion/react */
// Layout
import React, { useRef, useState } from 'react';
// MUI
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/styles';
import Button from '@mui/material/Button';

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
  const [name, setName] = useState()
  const valueRef = useRef()

  const newChannelName = () => {
    setName((prevState) => prevState = valueRef.current.value);
  }

  const validChannel = () => {
    console.log("Tu veux un channel : " + name);
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
        <TextField
          id="user-name"
          helperText="Please enter a user name"
          label="Name of user"
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

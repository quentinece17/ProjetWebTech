
/** @jsxImportSource @emotion/react */
import {forwardRef, useImperativeHandle, useLayoutEffect, useRef, useContext, useState} from 'react'
import * as React from 'react';

// Layout
import { useTheme } from '@mui/styles';
import { Button, TextField, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';   
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Stack from '@mui/material/Stack';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { FixedSizeList } from 'react-window';

import Gravatar from 'react-gravatar'

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';

import { useNavigate, useParams } from 'react-router-dom'

import Context from '../Context'

import axios from 'axios';


// Markdown
import { unified } from 'unified'
import markdown from 'remark-parse'
import remark2rehype from 'remark-rehype'
import html from 'rehype-stringify'
// Time
import dayjs from 'dayjs'
import calendar from 'dayjs/plugin/calendar'
import updateLocale from 'dayjs/plugin/updateLocale'
dayjs.extend(calendar)
dayjs.extend(updateLocale)
dayjs.updateLocale('en', {
  calendar: {
    sameElse: 'DD/MM/YYYY hh:mm A'
  }
})

const useStyles = (theme) => ({
  root: {
    position: 'relative',
    flex: '1 1 auto',
    overflow: 'auto',
    '& ul': {
      'margin': 0,
      'padding': 0,
      'textIndent': 0,
      'listStyleType': 0,
    },
  },
  message: {
    padding: '.2rem .5rem',
    ':hover': {
      backgroundColor: 'rgba(255,255,255,.05)',
    },
  },
  fabWrapper: {
    position: 'absolute',
    right: 0,
    top: 0,
    width: '50px',
  },
  fab: {
    position: 'fixed !important',
    top: 0,
    width: '50px',
  },
})

const onSubmitMessage = async (props) => {
  console.log("message: " + props)
  try{
      await axios.delete(`http://localhost:3001/channels/${props.channelId}/messages`,
      { data: {
            creation: props.creation,
      }
    })

    window.location.reload(); 

  } catch(err) {
    alert ("OUPS");
  }
  
 }

function AuthorMessage (props) {

  const log = props.oauth.email;

  if (log === props.email) {
    return (

      <Button 
        size="small"
        style={{backgroundColor: '#FFFFFF', color: '#2f435e'}}
        variant="outlined" 
        startIcon={<DeleteIcon />}
        onClick={() => {
          onSubmitMessage(props)
        }}
      >Delete
      </Button>
    )
  }
  return (
    <Button 
        size="small"
        variant="outlined" 
        startIcon={<DeleteIcon />}
        disabled
      >Delete
      </Button>
  )

}

export default forwardRef(({
  channel,
  messages,
  onScrollDown,
}, ref) => {
  const styles = useStyles(useTheme())
  // Expose the `scroll` action
  useImperativeHandle(ref, () => ({
    scroll: scroll
  }));
  const rootEl = useRef(null)
  const scrollEl = useRef(null)
  const scroll = () => {
    scrollEl.current.scrollIntoView()
  }

  const navigate = useNavigate();
  const {
    oauth, setOauth,
    drawerVisible, setDrawerVisible,
    channels, setChannels
  } = useContext(Context)

  const [openDelete, setOpenDelete] = React.useState(false);
  const [openUpdate, setOpenUpdate] = React.useState(false);
  const [openFriends, setOpenFriends] = React.useState(false);
  const [name, setName] = useState()
  const [email, setEmail] = useState()
  const valueRef = useRef()

  // See https://dev.to/n8tb1t/tracking-scroll-position-with-react-hooks-3bbj
  const throttleTimeout = useRef(null) // react-hooks/exhaustive-deps
  useLayoutEffect( () => {
    const rootNode = rootEl.current // react-hooks/exhaustive-deps
    const handleScroll = () => {
      if (throttleTimeout.current === null) {
        throttleTimeout.current = setTimeout(() => {
          throttleTimeout.current = null
          const {scrollTop, offsetHeight, scrollHeight} = rootNode // react-hooks/exhaustive-deps
          onScrollDown(scrollTop + offsetHeight < scrollHeight)
        }, 200)
      }
    }
    handleScroll()
    rootNode.addEventListener('scroll', handleScroll)
    return () => rootNode.removeEventListener('scroll', handleScroll)
  })

  const onSubmitChannel = async (props) => {
    try{
        await axios.delete( `http://localhost:3001/channels/${props.id}/`)

        const {data: newChannels} = await axios.get('http://localhost:3001/channels', 
        {
          headers: {
            'Authorization': `Bearer ${oauth.access_token}`
          }
        },)
        navigate('/channels')

        var currentChannels = []

        for (let i=0; i<newChannels.length; i++) {

          if (newChannels[i].members) {

            for (let j=0; j<newChannels[i].members.length; j++) {

              if (newChannels[i].members[j] === oauth.email) {
                currentChannels[currentChannels.length] = newChannels[i]
              }
            }
          }
        }
        
        setChannels(currentChannels)

    } catch (err) {
      alert("OUPS");
    }
   }
  
  //  *********************ALERTE***************************
      //Faire appara^itre l'alarme uniquement si l'utilisateur appuie sur "delete"
            // <Stack sx={{ width: '100%' }} spacing={2}>
            //   <Alert severity="warning" action={
            //       <Button color="inherit" size="small" onClick={() => {
            //         onSubmitChannel(props)
            //       }}>
            //         Yes
            //       </Button>
            //     }>
            //     <AlertTitle>Warning</AlertTitle>
            //     Are you sure you want to <strong>DELETE</strong> this channel ? 
            //   </Alert>
            // </Stack>
 //  *********************ALERTE***************************

 const deleteOpen = () => {
    setOpenDelete(true);
 }

 const deleteClose = () => {
    setOpenDelete(false);
};

const updateOpen = () => {
  setOpenUpdate(true);
 }

 const updateClose = () => {
    setOpenUpdate(false);
};

const friendsOpen = () => {
  setOpenFriends(true);
 }

 const friendsClose = () => {
    setOpenFriends(false);
};


 
const newChannelName = () => {
  setName((prevState) => prevState = valueRef.current.value);
}

const newFriendEmail = () => {
  setEmail((prevState) => prevState = valueRef.current.value);
}

const DeleteChannel = (props) => {
  
    const log = props.oauth.email;
    
    if (log === props.owner) {
      return (
        <div>
          <Button 
            variant="outlined" 
            style={{backgroundColor: '#2f435e', color: '#FFFFFF'}}
            startIcon={<DeleteIcon />}
            onClick={deleteOpen}
          >Delete 
          </Button>

          <Dialog
            open={openDelete}
            onClose={deleteClose}
            aria-labelledby="alert-dialog-title"
          >
          <DialogTitle>{"Are you sure you want to delete this channel?"}</DialogTitle>
          <DialogActions>
            <Button 
              style={{backgroundColor: '#2f435e', color: '#FFFFFF'}}
              onClick={() => {
                onSubmitChannel(props);
                deleteClose();
              }}>Yes
            </Button>
            <Button 
              style={{backgroundColor: '#2f435e', color: '#FFFFFF'}}
              onClick={() => {
                deleteClose();
                props.pop.close();
              }}>Cancel
            </Button>
          </DialogActions>
          </Dialog>
        </div>
      )
    }
    return (
      <Button 
          variant="outlined" 
          startIcon={<DeleteIcon />}
          disabled
        >Delete
        </Button>
    )
    }

const updateChannel = async (id, source) => {

  try{

    const channel = await axios.get( `http://localhost:3001/channels/${id}`)

    console.log("before update : ", channel)

    //Update name of the channel
    if (source === 0) {
      channel.data.name = name;
    } else if (source === 1) {
      //Add a member to a channel
      if(!channel.data.members.includes(email)){
        channel.data.members[channel.data.members.length]=email;
      } else {
        alert('User already member');
      }
    }

    await axios.put(`http://localhost:3001/channels/${id}`, 
    {
      data: {
        channel: channel
      }
    })

    var newcurrentChannel = await axios.get(
      `http://localhost:3001/channels/${id}`
    )
    console.log("after update : ", newcurrentChannel)

    const {data: newChannels} = await axios.get('http://localhost:3001/channels', 
        {
          headers: {
            'Authorization': `Bearer ${oauth.access_token}`
          }
        },)
        navigate(`/channels/${id}`)

        var currentChannels = []

        for (let i=0; i<newChannels.length; i++) {

          if (newChannels[i].members) {

            for (let j=0; j<newChannels[i].members.length; j++) {

              if (newChannels[i].members[j] === oauth.email) {
                currentChannels[currentChannels.length] = newChannels[i]
              }
            }
          }
        }
        
    setChannels(currentChannels)

  }catch(err) {
    alert("OUPS");
  }
}


  return (
    <div css={styles.root} ref={rootEl}>

       <Box sx={{ flexGrow: 1}}>
        <Grid container spacing={30}>
          <Grid item xs={8}>
            <h1>Messages for {channel.name}</h1>
          </Grid>
          <Grid item xs={4}>
          <PopupState variant="popover" popupId="demo-popup-menu">
            {(popupState) => (
              <React.Fragment>
                <Button 
                  style={{backgroundColor: '#FFFFFF', color: '#2f435e'}}
                  variant="contained" 
                  {...bindTrigger(popupState)}
                >
                  Settings
                </Button>
                <Menu {...bindMenu(popupState)}>
                  <MenuItem><DeleteChannel owner={channel.owner} id={channel.id} oauth={oauth} pop={popupState}/></MenuItem>
                  <MenuItem>
                    <div>
                      <Button 
                        variant="outlined" 
                        style={{backgroundColor: '#2f435e', color: '#FFFFFF'}}
                        onClick={updateOpen}
                        >Update Name
                      </Button>
                      <Dialog open={openUpdate} onClose={updateClose}>
                        <DialogTitle>Update Channel Name</DialogTitle>
                        <DialogContent>
                          <DialogContentText>
                            You can modify the name of the channel below.
                          </DialogContentText>
                          <TextField
                            margin="dense"
                            id="new-name"
                            label="New Channel Name"
                            type="Required"
                            fullWidth
                            variant="standard"
                            inputRef={valueRef}
                            onChange={() => newChannelName()}
                          />
                        </DialogContent>
                        <DialogActions>
                          <Button 
                            style={{backgroundColor: '#2f435e', color: '#FFFFFF'}} 
                            onClick={() => {
                              updateClose();
                              updateChannel(channel.id, 0);
                              popupState.close();
                              }}>Enter</Button>
                        </DialogActions>
                      </Dialog>
                    </div>
                  </MenuItem>
                  <MenuItem>
                    <div>
                      <Button 
                        variant="outlined" 
                        style={{backgroundColor: '#2f435e', color: '#FFFFFF'}}
                        onClick={friendsOpen}
                        >Invite Friends
                      </Button>
                      <Dialog open={openFriends} onClose={friendsClose}>
                        <DialogTitle>Invite Friends to the Channel</DialogTitle>
                        <DialogContent>
                          <DialogContentText>
                            You can invite your friends to the Channel if you want to speak to them here.
                          </DialogContentText>
                          <TextField
                            margin="dense"
                            id="new-friends"
                            label="New Friend Email"
                            helperText="Please enter the email of your friend"
                            type="email"
                            fullWidth
                            variant="standard"
                            inputRef={valueRef}
                            onChange={() => newFriendEmail()}
                          />
                        </DialogContent>
                        <DialogActions>
                          <Button 
                            style={{backgroundColor: '#2f435e', color: '#FFFFFF'}} 
                            onClick={() => {
                              friendsClose();
                              updateChannel(channel.id, 1);
                              popupState.close();
                              }}>Enter</Button>
                        </DialogActions>
                      </Dialog>
                    </div>
                  </MenuItem>
                </Menu>
              </React.Fragment>
            )}
          </PopupState>
          </Grid>
        </Grid>
      </Box>

      <ul>
        { messages.map( (message, i) => {
            const {value} = unified()
            .use(markdown)
            .use(remark2rehype)
            .use(html)
            .processSync(message.content);
            return (
              <li key={i} css={styles.message}>
                <p>
                  <Gravatar
                      email={message.author}
                      style={{borderRadius: "100%", width: "30px", height: "30px"}}
                  />__
                  <span>{message.author}</span>
                  {' - '}
                  <span>{dayjs((message.creation)/1000).calendar()}</span>__
                  {/* <div> */}
                  <AuthorMessage email={message.author} creation={message.creation} channelId={message.channelId} oauth={oauth}/>
                  {/* </div> */}
                </p>
                <div dangerouslySetInnerHTML={{__html: value}}>
                </div>
              </li>
            )
        })}
      </ul>
      <div ref={scrollEl} />
    </div>
  )
})

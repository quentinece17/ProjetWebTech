
/** @jsxImportSource @emotion/react */
import {forwardRef, useImperativeHandle, useLayoutEffect, useRef, useContext, useState} from 'react'
import * as React from 'react';

// Layout
import { useTheme } from '@mui/styles';
import { Button, TextField} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';

import Gravatar from 'react-gravatar';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';

import StarWarsImage from '../icons/1.star-wars.jpeg';
import GhettoImage from '../icons/2.ghetto.jpg';
import SquelettonImage from '../icons/3.squeletton.jpeg';
import PikachuImage from '../icons/4.pikachu.jpeg';
import LionImage from '../icons/5.lion.jpeg';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import { useNavigate} from 'react-router-dom'

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
  try{
      await axios.delete(`http://localhost:3001/channels/${props.channelId}/messages`,
      { data: {
            creation: props.creation,
      }
    })

    window.location.reload(); 

  } catch(err) {
    alert ("Error in the Delete of the message");
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
    oauth,
    setChannels
  } = useContext(Context)

  const [openDelete, setOpenDelete] = React.useState(false);
  const [openUpdate, setOpenUpdate] = React.useState(false);
  const [openUpdateMessage, setOpenUpdateMessage] = useState(false);
  const [openFriends, setOpenFriends] = React.useState(false);
  const [openList, setOpenList] = React.useState(false);
  const [newMessage, setNewMessage] = useState()
  const [membersChannel, setMembersChannel] = useState("")
  const [name, setName] = useState()
  const [email, setEmail] = useState()
  const [userImage, setUserImage] = useState(0)
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
      alert("Error in the delete of the channel");
    }
   }

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

const listOpen = () => {
  setOpenList(true);
 }

 const listClose = () => {
    setOpenList(false);
};
 
const newChannelName = () => {
  setName((prevState) => prevState = valueRef.current.value);
}

const newFriendEmail = () => {
  setEmail((prevState) => prevState = valueRef.current.value);
}

const updateMessageOpen = (props) => {
  setOpenUpdateMessage(true)
  setNewMessage(props.message.content)
}

const updateMessageClose = () => {
  setOpenUpdateMessage(false)
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

    //Update name of the channel
    if (source === 0) {
      channel.data.name = name;
    } else if (source === 1) {
      //Add a member to a channel
      if(!channel.data.members.includes(email)){
        channel.data.members[channel.data.members.length]=email;
      } else {
        alert('User is already a member');
      }
    }

    await axios.put(`http://localhost:3001/channels/${id}`, 
    {
      data: {
        channel: channel
      }
    })

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
    alert("Error in the update of the channel");
  }
}

const getMembers = async (props) => {

  try {

  const {data: channel} = await axios.get( `http://localhost:3001/channels/${props}`)
  
  setMembersChannel(channel.members)

  } catch (err) {
    alert("Invalid members")
  }
}

const NewMessageContent = (e) => {
  setNewMessage(e.target.value);
}

const UpdateButton = (props) => {

  const log = props.oauth.email;

  if (log === props.message.author) {

    return (
      <span>
        <Button 
          size="small"
          style={{backgroundColor: '#FFFFFF', color: '#2f435e'}}
          variant="outlined" 
          onClick={() => {
            updateMessageOpen(props);
          }}
        >Update
        </Button>
    </span>
    )
  }
  return (
    <Button 
        size="small"
        variant="outlined" 
        disabled
      >Update
      </Button>
  )

}

const updateMessage = async (props) => {

  try {
    props.content = newMessage
    await axios.put (`http://localhost:3001/channels/${props.channelId}/messages`,
    { data: {
          message: props,
      }
    })

  } catch (err) {
    alert ("Invalid message updated");
  }
}

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
                  <MenuItem>
                    <div>
                      <Button 
                        variant="outlined" 
                        style={{backgroundColor: '#2f435e', color: '#FFFFFF'}}
                        onClick={() => {
                          listOpen();
                          getMembers(channel.id);
                          }}
                        >Channel's Members
                      </Button>
                      <Dialog open={openList} onClose={listClose}>
                        <DialogTitle>List of all the channel's members</DialogTitle>
                        <DialogContent>
                        <TextField
                          disabled
                          id="filled-hidden-label-small"
                          margin="dense"
                          fullWidth
                          multiline
                          value={membersChannel}
                          variant="filled"
                          size="small"
                        />
                        </DialogContent>
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
                  <Stack direction="row" spacing={2}>
                    <CurrentImage author={message.author}/>
                    <span>{message.author}</span>
                    <span>{dayjs((message.creation)/1000).calendar()}</span>
                    <AuthorMessage email={message.author} creation={message.creation} channelId={message.channelId} oauth={oauth}/>
                    <UpdateButton message={message} oauth={oauth}/>
                    <Dialog open={openUpdateMessage} onClose={updateMessageClose}>
                      <DialogTitle>Update Message</DialogTitle>
                      <DialogContent>
                        <DialogContentText>
                          You can modify your message below
                        </DialogContentText>
                        <TextField
                          margin="dense"
                          id="new-message"
                          label="New Message"
                          multiline
                          fullWidth
                          variant="standard"
                          value={newMessage}
                          onChange={NewMessageContent}
                        />
                      </DialogContent>
                      <DialogActions>
                        <Button 
                          style={{backgroundColor: '#2f435e', color: '#FFFFFF'}} 
                          onClick={() => {
                            updateMessageClose();
                            updateMessage(message);
                            }}>Enter</Button>
                      </DialogActions>
                  </Dialog>
                </Stack>
                </p>
                <div dangerouslySetInnerHTML={{__html: value}}></div>
              </li>
            )
        })}
      </ul>
      <div ref={scrollEl} />
    </div>
  )
})

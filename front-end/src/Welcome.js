
/** @jsxImportSource @emotion/react */
// Layout
import { ReactComponent as ChannelIcon } from './icons/channel.svg';
import { ReactComponent as SettingsIcon } from './icons/settings.svg';
import StarWarsImage from './icons/1.star-wars.jpeg';
import GhettoImage from './icons/2.ghetto.jpg';
import SquelettonImage from './icons/3.squeletton.jpeg';
import PikachuImage from './icons/4.pikachu.jpeg';
import LionImage from './icons/5.lion.jpeg';

import {useState, useContext, useRef} from 'react'

import axios from 'axios';

import Context from './Context';

import { useTheme } from '@mui/styles';
import { Button, Grid, Typography, TextField } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormGroup from '@mui/material/FormGroup';
import Switch from '@mui/material/Switch';
import Link from '@mui/material/Link';

import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';

import { alpha, styled } from '@mui/material/styles';

import {useNavigate} from "react-router-dom";

import Gravatar from 'react-gravatar'

const config = {port: 3001};

const useStyles = (theme) => ({
  root: {
    height: '100%',
    flex: '1 1 auto',
    display: 'flex',
    background: 'rgba(0,0,0,.2)',
  },
  card: {
    textAlign: 'center',
  },
  icon: {
    cursor: 'pointer',
    width: '30%',
    fill: '#fff',
    ':hover': {
      backgroundColor: 'rgba(255,255,255,.05)',
    }
  },
  image: {
    cursor: 'pointer'
  }
})

const BlueSwitch = styled(Switch)(({ theme }) => ({
  '& .MuiSwitch-switchBase.Mui-checked': {
    color: "#44566c",
    '&:hover': {
      backgroundColor: alpha("#44566c", theme.palette.action.hoverOpacity),
    },
  },
  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
    backgroundColor: "#44566c",
  },
}));

const MaterialUISwitch = styled(Switch)(({ theme }) => ({
  width: 62,
  height: 34,
  padding: 7,
  "& .MuiSwitch-switchBase": {
    margin: 1,
    padding: 0,
    transform: "translateX(6px)",
    "&.Mui-checked": {
      color: "#fff",
      transform: "translateX(22px)",
      "& .MuiSwitch-thumb:before": {
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
          "#fff"
        )}" d="M4.2 2.5l-.7 1.8-1.8.7 1.8.7.7 1.8.6-1.8L6.7 5l-1.9-.7-.6-1.8zm15 8.3a6.7 6.7 0 11-6.6-6.6 5.8 5.8 0 006.6 6.6z"/></svg>')`
      },
      "& + .MuiSwitch-track": {
        opacity: 1,
        backgroundColor: theme.palette.mode === "dark" ? "#8796A5" : "#aab4be"
      }
    }
  },
  "& .MuiSwitch-thumb": {
    backgroundColor: theme.palette.mode === "dark" ? "#003892" : "#001e3c",
    width: 32,
    height: 32,
    "&:before": {
      content: "''",
      position: "absolute",
      width: "100%",
      height: "100%",
      left: 0,
      top: 0,
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center",
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
        "#fff"
      )}" d="M9.305 1.667V3.75h1.389V1.667h-1.39zm-4.707 1.95l-.982.982L5.09 6.072l.982-.982-1.473-1.473zm10.802 0L13.927 5.09l.982.982 1.473-1.473-.982-.982zM10 5.139a4.872 4.872 0 00-4.862 4.86A4.872 4.872 0 0010 14.862 4.872 4.872 0 0014.86 10 4.872 4.872 0 0010 5.139zm0 1.389A3.462 3.462 0 0113.471 10a3.462 3.462 0 01-3.473 3.472A3.462 3.462 0 016.527 10 3.462 3.462 0 0110 6.528zM1.665 9.305v1.39h2.083v-1.39H1.666zm14.583 0v1.39h2.084v-1.39h-2.084zM5.09 13.928L3.616 15.4l.982.982 1.473-1.473-.982-.982zm9.82 0l-.982.982 1.473 1.473.982-.982-1.473-1.473zM9.305 16.25v2.083h1.389V16.25h-1.39z"/></svg>')`
    }
  },
  "& .MuiSwitch-track": {
    opacity: 1,
    backgroundColor: theme.palette.mode === "dark" ? "#8796A5" : "#aab4be",
    borderRadius: 20 / 2
  }
}));

export default function Welcome() {
  const navigate = useNavigate();
  const styles = useStyles(useTheme())

  const {
    oauth,
    channels, setChannels
  } = useContext(Context)

  const valueRef = useRef()

  const [nameNewChannel, setNameNewChannel] = useState()
  const [openSettings, setOpenSettings] = useState(false)
  const [openNewChannel, setNewChannel] = useState(false)
  const [openUpdate, setOpenUpdate] = useState(false)
  const [userId, setUserId] = useState("")
  const [userUsername, setUserUsername] = useState("")
  const [userType, setUserType] = useState("")
  const [userLanguage, setUserLanguage] = useState("")
  const [userSourdine, setUserSourdine] = useState()
  const [userTheme, setUserTheme] = useState()
  const [userImage, setUserImage] = useState(0)
  const [email, setEmail] = useState()
  const [members, setMembers] = useState([])

  const settingsOpen = () => {
    setOpenSettings(true);
   }
  
   const settingsClose = () => {
      setOpenSettings(false);
  }

  const newChannelOpen = () => {
    setNewChannel(true);
  }

  const newChannelClose = () => {
    setNewChannel(false);
  }

  const NewFriendEmail = (e) => {
    setEmail(e.target.value);
  }

  const updateOpen = () => {
    setOpenUpdate(true);
   }
  
   const updateClose = () => {
      setOpenUpdate(false);
  }

  const newUserType = (event) => {
    setUserType(event.target.value);
  }

  const newUserLanguage = (event) => {
    setUserLanguage(event.target.value);
  }

  const newUserSourdine = (event) => {
    setUserSourdine(event.target.checked);
  }

  const newUserTheme = (event) => {
    setUserTheme(event.target.checked);
  }

  const changeImage = (ref) => {
    setUserImage(ref);
  }

  const newChannelName = () => {
    setNameNewChannel((prevState) => prevState = valueRef.current.value);
  }

  const validChannel = () => {
    addNewChannel();
  }

  const CurrentImage = () => {

    if (userImage === 0) {
      return (
        <Gravatar
        email={oauth.email}
        style={{borderRadius: "100%"}}
        />
      )
    } else if (userImage === 1) {
      return (
        <Avatar alt="Star Wars" src={StarWarsImage}/>
      )
    } else if (userImage === 2) {
      return (
        <Avatar alt="Ghetto" src={GhettoImage}/>
      )
    } else if (userImage === 3) {
      return (
        <Avatar alt="Squeletton" src={SquelettonImage}/>
      )
    } else if (userImage === 4) {
      return (
        <Avatar alt="Pikachu" src={PikachuImage}/>
      )
    } else if (userImage === 5) {
      return (
        <Avatar alt="Lion" src={LionImage}/>
      )
    }
    else {
      return (
        alert('No Prolife Image Found')
      )
    }
  }

  const addNewChannel = async () => {

    if (email !== null) {
      setMembers(members[members.length]=oauth.email)
      setMembers(members[members.length]=email)
    } else {
      setMembers(members[members.length]=oauth.email)
    }

    try{
      const {data: newChannel} = await axios.post(`http://localhost:${config.port}/channels`, {
        name: nameNewChannel,
        members:members,
        owner: oauth.email
    })
    navigate('/channels')
    setChannels([...channels, newChannel])
    }catch(err){
      alert("OUPS");
    }
  }

  const getUser = async () => {

  try {

    const email = oauth.email
    const {data: users} = await axios.get(`http://localhost:3001/users/`)

    for (let i=0; i<users.length; i++) {
      if (users[i].username === email) {
        setUserId(users[i].id)
        setUserUsername(users[i].username);
        setUserType(users[i].type);
        setUserLanguage(users[i].language);
        setUserSourdine(users[i].sourdine);
        setUserTheme(users[i].theme);
        setUserImage(users[i].image);
      }
    }

  } catch (err) {
    alert ("Invalid User information")
  }

}

const updateUser = async () => {

  try{

    const user = await axios.get( `http://localhost:3001/users/${userId}`)

    user.data.type = userType;
    user.data.language = userLanguage;
    user.data.theme = userTheme;
    user.data.sourdine = userSourdine;
    user.data.image = userImage;

    await axios.put(`http://localhost:3001/users/${userId}`, 
    {
      data: {
        user: user
      }
    })

    window.location.reload(); 

  } catch (err) {
    alert ("Invalide update information")
  }
}

  return (
    <div css={styles.root}>
      <Grid
        container
        direction="row"
        justify="center"
        alignItems="center"
        spacing={5}
      >
        <Grid item xs>
          <div css={styles.card}>
            <ChannelIcon 
              css={styles.icon} 
              onClick={(e) => {
                newChannelOpen();
              }}
            />
            <Typography color="#FFFFFF">
              Create channels
            </Typography>
            <Dialog 
              open={openNewChannel} 
              onClose={newChannelClose}
            >
              <DialogTitle>Create New Channel</DialogTitle>
              <br/>
              <DialogContent>
                <TextField
                  id="channel-name"
                  helperText="Your new channel's name"
                  label="Channel name"
                  type="Required"
                  inputRef={valueRef}
                  onChange={() => newChannelName()}
                />
                <TextField
                  id="members"
                  helperText="Your first channel's members"
                  label="Channel members"
                  onChange={NewFriendEmail}
                />
              </DialogContent>
              <DialogActions>
              <Button 
                style={{backgroundColor: '#2f435e', color: '#FFFFFF'}} 
                onClick={ () => {
                  validChannel();
                  newChannelClose();
                }}>Enter</Button>
              </DialogActions>
            </Dialog>
          </div>
        </Grid>
        <Grid item xs>
          <div css={styles.card}>
            <SettingsIcon
              css={styles.icon} 
              onClick={() => {
                getUser();
                settingsOpen();
                }}
            />
            <Typography color="#FFFFFF">
              Settings
            </Typography>
            <Dialog 
              open={openSettings} 
              onClose={settingsClose}
            >
              <DialogTitle>User Information</DialogTitle>
              <DialogContent>
                <TextField
                  disabled
                  margin="dense"
                  id="username"
                  label="Username"
                  fullWidth
                  variant="standard"
                  value={userUsername}
                />
                <TextField
                  disabled
                  margin="dense"
                  id="type"
                  label="Gender"
                  fullWidth
                  variant="standard"
                  value={userType}
                />
                <TextField
                  disabled
                  margin="dense"
                  id="language"
                  label="Language"
                  fullWidth
                  variant="standard"
                  value={userLanguage}
                />
                <FormGroup>
                  <FormControlLabel
                    control={
                      <MaterialUISwitch 
                        sx={{ m: 1 }} 
                        margin="dense"
                        id="mute"
                        label="Mute"
                        variant="standard"
                        disabled
                        checked={userTheme}
                      />}
                    label="MUI switch"
                  />
                </FormGroup>
                <FormGroup>
                  <FormControlLabel  
                    control={
                      <BlueSwitch 
                        margin="dense"
                        id="mute"
                        label="Mute"
                        variant="standard"
                        disabled
                        checked={userSourdine}
                      />
                    } 
                    label="Mute" 
                  />
                </FormGroup>
                 <TextField 
                  disabled
                  margin="dense"
                  id="image"
                  label="Profile Image"
                  fullWidth
                  variant="standard"
                > Current Profile Image: 
                </TextField>
                <CurrentImage/>
              </DialogContent>
              
              <DialogActions>
                <Button 
                    style={{backgroundColor: '#2f435e', color: '#FFFFFF'}} 
                    onClick={() => {
                      settingsClose();
                      }}>Cancel</Button>
                <Button 
                  style={{backgroundColor: '#2f435e', color: '#FFFFFF'}} 
                  onClick={() => {
                    updateOpen();
                    settingsClose();
                    }}>Update</Button>
              </DialogActions>
            </Dialog>
                
            <Dialog 
              open={openUpdate} 
              onClose={updateClose}
            >
              <DialogTitle>Update User Information</DialogTitle>
              <DialogContent>
                <TextField
                  disabled
                  margin="dense"
                  id="username"
                  label="Username"
                  type="email"
                  fullWidth
                  variant="standard"
                  defaultValue={userUsername}
                />
                <FormControl component="fieldset">
                  <FormLabel component="legend">Gender</FormLabel>
                  <RadioGroup
                    row
                    aria-label="gender"
                    name="controlled-radio-buttons-group"
                    defaultValue={userType}
                    onChange={newUserType}
                  >
                    <FormControlLabel value="Female" control={<Radio />} label="Female" />
                    <FormControlLabel value="Male" control={<Radio />} label="Male" />
                    <FormControlLabel value="Other" control={<Radio />} label="Other" />
                  </RadioGroup>
                </FormControl>
                <FormControl fullWidth variant="standard">
                  <InputLabel id="label">Language</InputLabel>
                  <Select
                    labelId="label"
                    id="selectLanguage"
                    defaultValue={userLanguage}
                    onChange={newUserLanguage}
                    label="Language"
                  >
                    <MenuItem value="English">English</MenuItem>
                    <MenuItem value="French">French</MenuItem>
                    <MenuItem value="Spanish">Spanish</MenuItem>
                    <MenuItem value="Deutch">Deutch</MenuItem>
                    <MenuItem value="Italian">Italian</MenuItem>
                    <MenuItem value="Chinese">Chinese</MenuItem>
                  </Select>
                </FormControl>
                <FormGroup>
                  <FormControlLabel
                    control={
                      <MaterialUISwitch 
                        checked={userTheme}
                        onChange={newUserTheme}
                      />}
                    label="MUI switch"
                  />
                </FormGroup>
                <FormGroup>
                  <FormControlLabel  
                    control={
                      <BlueSwitch 
                        checked={userSourdine}
                        onChange={newUserSourdine}
                        inputProps={{ 'aria-label': 'controlled' }}
                      />
                    } 
                    label="Mute" 
                  />
                </FormGroup>
                <TextField
                  disabled
                  margin="dense"
                  id="image"
                  label="Profile Image"
                  fullWidth
                  variant="standard"
                  helperText="You can change your profile Image here or follow the link to update your Gravatar Image "
                />
                <Stack direction="row" spacing={2}>
                  <Gravatar email={oauth.email} css={styles.image} style={{borderRadius: "50%"}} onClick={() => {changeImage(0);}}/>
                  <Avatar alt="Star Wars" src={StarWarsImage} css={styles.image} onClick={() => {changeImage(1);}}/>
                  <Avatar alt="Ghetto" src={GhettoImage} css={styles.image} onClick={() => {changeImage(2);}}/>
                  <Avatar alt="Squeletton" src={SquelettonImage} css={styles.image} onClick={() => {changeImage(3);}}/>
                  <Avatar alt="Pikachu" src={PikachuImage} css={styles.image} onClick={() => {changeImage(4);}}/>
                  <Avatar alt="Lion" src={LionImage} css={styles.image} onClick={() => {changeImage(5);}}/>
                </Stack>
                <Link 
                  margin="dense"
                  id="image"
                  label="Profile Image"
                  variant="standard"
                  color="inherit"
                  target="_blank"
                  rel="noreferrer"
                  href="https://fr.gravatar.com/gravatars/new"
                  >Change my Gravatar Image</Link>
              </DialogContent>
              
              <DialogActions>
                <Button 
                  style={{backgroundColor: '#2f435e', color: '#FFFFFF'}} 
                  onClick={() => {
                    updateClose();
                }}>Cancel</Button>
                <Button 
                  style={{backgroundColor: '#2f435e', color: '#FFFFFF'}} 
                  onClick={() => {
                    updateUser();
                    updateClose();
                    }}>Update</Button>
              </DialogActions>
            </Dialog>
          </div>
        </Grid>
      </Grid>
    </div>
  );
}

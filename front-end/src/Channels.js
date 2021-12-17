
/** @jsxImportSource @emotion/react */
import {useContext, useEffect} from 'react';
import axios from 'axios';
// Layout
import {Link} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
// Local
import Context from './Context'
import {useNavigate} from 'react-router-dom'

const styles = {
  root: {
    backgroundColor: '#44566c',
    '& a': {
      padding: '.2rem .5rem',
      whiteSpace: 'nowrap', 
    }
  },
  channel: {
    padding: '3.2rem 0.5rem',
    whiteSpace: 'nowrap',
    textAlign: 'center',
    verticalAlign: 'center',
    ':hover': {
      backgroundColor: 'rgba(255,255,255,.2)',
    },
  }
}

export default function Channels() {
  const {
    oauth,
    channels, setChannels
  } = useContext(Context)
  const naviate = useNavigate();
  useEffect( () => {
    const fetch = async () => {
      try{
        const {data: channels} = await axios.get('http://localhost:3001/channels', 
        {
          headers: {
            'Authorization': `Bearer ${oauth.access_token}`
          }
        },)

        console.log(channels)
        var currentChannels = []

        for (let i=0; i<channels.length; i++) {

          if (channels[i].members) {

            for (let j=0; j<channels[i].members.length; j++) {

              if (channels[i].members[j] === oauth.email) {
                currentChannels[currentChannels.length] = channels[i]
              }
            }
          }
        }

        setChannels(currentChannels)
      }catch(err){
        console.error(err)
      }
    }
    fetch()
  }, [oauth, setChannels])
  return (
    <ul css={styles.root}>
      <li css={styles.channel}>
        <Link to="/channels" component={RouterLink}>Welcome</Link>
      </li>
      { channels.map( (channel, i) => (
        <li key={i} css={styles.channel}>
          <Link
            href={`/channels/${channel.id}`}
            onClick={ (e) => {
              e.preventDefault()
              naviate(`/channels/${channel.id}`)
            }}
          >
            {channel.name}
          </Link>
        </li>
      ))}
    </ul>
  );
}

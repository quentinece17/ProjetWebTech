
/** @jsxImportSource @emotion/react */
import {forwardRef, useImperativeHandle, useLayoutEffect, useRef, useContext} from 'react'
// Layout
import { useTheme } from '@mui/styles';
import { Button, TextField } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

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

        try{
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

        }catch (err){
          alert("oups");
        }

    } catch (err) {
      alert("OUPS");
    }
   }
  
  function DeleteChannel (props) {
  
    const log = props.oauth.email;
    
    if (log === props.owner) {
      return (
  
        <Button 
          variant="outlined" 
          startIcon={<DeleteIcon />}
          onClick={() => {
            onSubmitChannel(props)
          }}
        >Delete
        </Button>
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

  return (
    <div css={styles.root} ref={rootEl}>
      <h1>Messages for {channel.name}</h1>
      <DeleteChannel owner={channel.owner} id={channel.id} oauth={oauth}/>
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
                  <span>{message.author}</span>
                  {' - '}
                  <span>{dayjs((message.creation)/1000).calendar()}</span>
                </p>
                <div dangerouslySetInnerHTML={{__html: value}}>
                </div>
                <div>
                  <AuthorMessage email={message.author} creation={message.creation} channelId={message.channelId} oauth={oauth}/>
                </div>
              </li>
            )
        })}
      </ul>
      <div ref={scrollEl} />
    </div>
  )
})

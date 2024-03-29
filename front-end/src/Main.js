/** @jsxImportSource @emotion/react */
import {useContext} from 'react'
// Layout
import { useTheme } from '@mui/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Drawer } from '@mui/material';
// Local
import Context from './Context'
import Channels from './Channels'
import Channel from './Channel'
import Welcome from './Welcome'
import {
  Route,
  Routes,
} from 'react-router-dom'

const useStyles = (theme) => ({
  root: {
    backgroundColor: '#44566c',
    overflow: 'hidden',
    flex: '1 1 auto',
    display: 'flex',
    flexDirection: 'row',
    position: 'relative',
    borderRadius: 30,
  },
  drawer: {
    width: '200px',
    display: 'none',
  },
  drawerVisible: {
    display: 'block',
  },
})

export default function Main() {
  const {
    drawerVisible,
  } = useContext(Context)
  
  const theme = useTheme()
  const styles = useStyles(theme)
  const alwaysOpen = useMediaQuery(theme.breakpoints.up('sm'))
  const isDrawerVisible = alwaysOpen || drawerVisible
  return (
    <main css={styles.root}>
      <Drawer
        PaperProps={{ style: { position: 'relative', backgroundColor: '#44566c' } }}
        BackdropProps={{ style: { position: 'relative', backgroundColor: '#44566c'} }}
        ModalProps={{
          style: { position: 'relative' }
        }}
        variant="persistent"
        open={isDrawerVisible}
        css={[styles.drawer, isDrawerVisible && styles.drawerVisible]}
      >
        <Channels />
      </Drawer>
      <Routes>
        <Route path=":id" element={<Channel />}/>
        <Route path="*" element={<Welcome />}/>
      </Routes>
    </main>
  );
}

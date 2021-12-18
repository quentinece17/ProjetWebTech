/** @jsxImportSource @emotion/react */
import {useContext} from 'react'
import React from "react";

import Gravatar from 'react-gravatar'
import Context from './Context'
//import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
// import DropDown from './dropDown'
import IconButton from '@mui/material/IconButton';
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import GroupAddIcon from '@mui/icons-material/GroupAdd';

import { useNavigate } from 'react-router';

const styles = {
    root:{
        display:"flex",
        justifyContent:"space-between",
        alignItems: "flex-end",
        paddingRight: "10px",
    },
    name: {
        fontSize: 12.0,
    },
}

export default function Design ({name}){

return (
    <div>
        <Gravatar
        email="mathews.kyle@gmail.com"
        style={{borderRadius: "100%"}}
        />
    </div>
)
}

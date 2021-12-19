/** @jsxImportSource @emotion/react */
import {useContext} from 'react'
import React from "react";

import Gravatar from 'react-gravatar'
import Context from './Context'

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

export default function Design ({}){

const {oauth} = useContext(Context)

return (
    <div>
        <Gravatar
            email={oauth.email}
            style={{borderRadius: "100%"}}
        />
    </div>
)}

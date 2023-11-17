/**
 * @NotFound.js
 * @brief
 *
 * Not Found Page
 *
 * @props
 *
 *username   -    To be displayed in NAV BAR
 *
 *@return
 *
 *
 * NotFound(Fn) - NotFound Component
 *
 * @note
 *
 * Revision History:
 * 151022 - Creation Date - Divine A Mathew
 *
 *
 */

//-----------------------------------------------------------------------------
// All Imports
//-----------------------------------------------------------------------------

import { Section404 } from '@404pagez/react'
import React from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import NavBar from '../../components/navBar/NavBar'
import notfound from "./Assets/notfound.png"
import "./NotFound.css"

//-----------------------------------------------------------------------------
// NotFound Function
//-----------------------------------------------------------------------------
function NotFound({username}) {
  const navigate = useNavigate();
  return (
    <div className="notfound">
             <NavBar username={username}></NavBar>
        <Section404 size={20} isButton={true} onButtonClick={()=>navigate(-1)} buttonColor="#312f92" color="#312f92"></Section404>
    </div>
  )
}

export default NotFound
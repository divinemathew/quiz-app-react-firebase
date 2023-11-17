/**
 * @DataPost.js
 * @brief
 *
 * Async Hook for API Post Request
 *
 * @props
 *
 * api       - api to be used in the get call
 * PostData  - data to be posted
 *
 *
 *@return
 *
 *
 * DataPost(Fn) - DataPost Component
 *
 * @note
 *
 * Revision History:
 * 101022 - Creation Date - Divine A Mathew
 *
 *
 */
//-----------------------------------------------------------------------------
// All Imports
//-----------------------------------------------------------------------------
import axios from "axios";
import React, { useEffect } from "react";
import { useState } from "react";
import ApiConfig from "../AppConfig.json"
import { ReactSession }  from 'react-client-session';


function DataPost(api,postData) {
  const [response, SetResponse] = useState(null);
  const [error, Seterror] = useState(null);
  const [loading, SetLoading] = useState(true);

  const ip = ApiConfig.root;

  var userToken = ReactSession.get("dats_token")? ReactSession.get("dats_token") : ""; 
  var userName = ReactSession.get("dats_user")? ReactSession.get("dats_user") : ""; 
  var AuthStr = 'Bearer '.concat(userToken); 


  useEffect(() => {
    (async () => {
      Seterror(null);
      SetLoading(true);
      try {
        const result = await axios.post(ip + api,postData, { headers: { Authorization: AuthStr, datsuser: userName } });
        SetResponse(result.data);
      } catch (error) {
        Seterror(error.response);
      }
      SetLoading(false);
    })();
  }, []);
  return { response, error, loading };
}

export default DataPost;

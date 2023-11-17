/**
 * @DataFetch.js
 * @brief
 *
 * Async Hook for API Get Request
 *
 * @props
 *
 * api       - api to be used in the get call
 * username  - username returned from Microsoft API
 *
 *
 *@return
 *
 *
 * DataFetch(Fn) - DataFetch Component
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
import { useEffect } from "react";
import { useState } from "react";
import ApiConfig from "../AppConfig.json";
import { ReactSession }  from 'react-client-session';


//-----------------------------------------------------------------------------
// Data Fetch Return Function
//-----------------------------------------------------------------------------
function DataFetch(api, username) {

//-----------------------------------------------------------------------------
// Use State Hooks
//-----------------------------------------------------------------------------
  const [data, Setdata] = useState(null);
  const [error, Seterror] = useState(null);
  const [loading, SetLoading] = useState(true);

  const ip = ApiConfig.root; // ip root
  var userToken = ReactSession.get("dats_token")? ReactSession.get("dats_token") : ""; 
  var userName = ReactSession.get("dats_user")? ReactSession.get("dats_user") : ""; 
  var AuthStr = 'Bearer '.concat(userToken); 

  useEffect(() => {
    (async () => {
      Seterror(null);
      SetLoading(true);
      try {
        const result = await axios.get(ip + api + username, { headers: { Authorization: AuthStr, datsuser: userName } });
        Setdata(result.data);
      } catch (error) {
        Seterror(error);
      }
      SetLoading(false);
    })();
  }, []);
  return { data, error, loading };
}

export default DataFetch;

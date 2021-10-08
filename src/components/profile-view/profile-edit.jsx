import React, { useState, useEffect } from 'react';
import {Button} from 'react-bootstrap';
import axios from 'axios';

export function ProfileEdit(props) {
    //const {password, setPassword};
    const [username,setUsername] = useState("");
    const [password,setPassword] = useState("");
    //const {birthday, setBirthday};
    const [birthday, setBirthday] = useState("");
    //const {email, setEmail};
    const [email, setEmail] = useState("");

    useEffect(() => {
        setUsername(props.username); 
        setPassword(props.password);
        setBirthday(props.birthday);
        setEmail(props.email);
      }, [props]); 

    function handleUpdate(e) {
        e.preventDefault()
        let token = localStorage.getItem("token");
        axios.put( `https://lukesmovies.herokuapp.com/users/${username}`,
          { 
              Username: username,
              Password: password,
              Email: email,
              Birthday: birthday
          },
          { headers: { Authorization: `Bearer ${token}` } } 
        )
          .then((response) => {
              const data = response.data;
              console.log(data);
              alert(username + " has been updated.");
              window.location.reload()
          })
          .catch(function (error) {
              alert(error.response.data);
          });
    }

    // add const for each prop, add button and onclick, try to start defining onclick, make post request for onClick
    return (
        <div>
            <h1>Profile Edit</h1>
            <label for="username">Username</label><br/>
            <input type="text" value={username} onChange={(e)=>setUsername(e.target.value)}/><br/>
            <label for="password">Password</label><br/>
            <input onChange={(e)=>setPassword(e.target.value)}/><br/>
            <label for="birthday">Birthday</label><br/>
            <input type="text" value={birthday} onChange={(e)=>setBirthday(e.target.value)}/><br/>
            <label for="email">Email</label><br/>
            <input type="text" value={email} onChange={(e)=>setEmail(e.target.value)}/><br/>
            <Button size="md" variant="primary" type="submit" ml="4" onClick={(e) => handleUpdate(e)} >Submit</Button>
        </div>

    )
    
} 

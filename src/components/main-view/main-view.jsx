import React from "react";
import axios from 'axios';

import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";

import { LoginView } from '../login-view/login-view';
import { MovieCard } from '../movie-card/movie-card';
import { MovieView } from '../movie-view/movie-view';
import { DirectorView } from '../director-view/director-view';
import { RegistrationView } from '../registration-view/registration-view';
import { GenreView } from '../genre-view/genre-view';
import { ProfileView } from '../profile-view/profile-view';
import { ProfileEdit } from '../profile-view/profile-edit';
import { NavBar } from '../navbar-view/navbar-view';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import './main-view.scss';

class MainView extends React.Component {
  constructor() {
    super();
    this.state = {
      movies:[],
      selectedMovie: null,
      register: false,
      username: null,
      password: null,
      email: null,
      birthday: null,
      favourites: []
      
    };
  }


  componentDidMount() {
    let accessToken = localStorage.getItem('token');
    if (accessToken !== null) {
      this.setState({
        user: localStorage.getItem('user')
      });
      this.getMovies(accessToken);
      this.getUser(accessToken);
    }
  }

  /* When a user successfully logs in, this function updates the
   `user` property in state to that *particular user*/
  onLoggedIn(authData) {
    console.log(authData);
    this.setState({
      user: authData.user.Username
    });

    localStorage.setItem('token', authData.token);
    localStorage.setItem('user', authData.user.Username);
    this.getMovies(authData.token);
  }

  getMovies(token) {
    axios.get('https://lukesmovies.herokuapp.com/movies', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => {
        // Assign the result to the state
        console.log(response);
        this.setState({
          movies: response.data
        });
      })
      .catch(function (error) {
        console.log(error);
      })
  }

  getUser(token) {
    let url = 'https://lukesmovies.herokuapp.com/users/' +
        localStorage.getItem('user');
    axios
        .get(url, {
            headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
            this.setState({
                username: response.data.Username,
                password: response.data.Password,
                email: response.data.Email,
                birthday: response.data.Birthday,
                favourites: response.data.Favourites,
            });
        });
  }
  
  

  onRegister(register) {
    this.setState({
      register: register,
    });
  }

  render() {
    const { movies, user, username, password, birthday, email, favourites } = this.state;

    if (!user) return <Row>
      <Col>
        <RegistrationView />
        <LoginView onLoggedIn={user => this.onLoggedIn(user)} />
      </Col>
    </Row>
    if (movies.length === 0) return <div className="main-view" />;

    return (
      <Router>
        <NavBar user={user}/>
        <Row className="main-view justify-content-md-center">
            <Route exact path="/" render={() => {
              if (!user) return <Col>
                <LoginView onLoggedIn={user => this.onLoggedIn(user)} />
              </Col>
              if (movies.length === 0) return <div className="main-view" />;
              return movies.map(m => (
                <Col md={3} key={m._id}>
                  <MovieCard movie={m} />
                </Col>
              ))
            }} />
  
            <Route path="/register" render={() => {
              if (user) return <Redirect to="/" />
              return <Col>
                <RegistrationView />
              </Col>
            }} />
  
            <Route path="/profile" render={() => {
                return (
                  <Col> 
                    <ProfileView username={username} password={password} email={email} birthday={birthday} favourites={favourites} movies={movies} onBackClick={() => history.goBack()} removeMovie={(_id) => this.removeFromFavourites(_id)} />
                  </Col>
                )
            }} />

            <Route path="/profileEdit" render={() => {
                return (
                  <Col> 
                    <ProfileEdit username={username} password={password} birthday={birthday} email={email} favourites={favourites}/>
                  </Col>
                )
            }} />


          
          <Route path="/movies/:movieId" render={({ match, history }) => {
            if (!user) return <Col>
              <LoginView onLoggedIn={user => this.onLoggedIn(user)} />
            </Col>
            if (movies.length === 0) return <div className="main-view" />;
            return <Col md={8}>
              <MovieView movie={movies.find(m => m._id === match.params.movieId)} onBackClick={() => history.goBack()} />
            </Col>
          }} />

          <Route path="/directors/:name" render={({ match, history }) => {
            if (!user) return <Col>
              <LoginView onLoggedIn={user => this.onLoggedIn(user)} />
            </Col>
            if (movies.length === 0) return <div className="main-view" />;
            return <Col md={8}>
              <DirectorView director={movies.find(m => m.Director.Name === match.params.name).Director} onBackClick={() => history.goBack()} />
            </Col>
          }
          } />

          <Route path="/genres/:name" render={({ match, history }) => {
            if (!user) return <Col>
              <LoginView onLoggedIn={user => this.onLoggedIn(user)} />
            </Col>
            if (movies.length === 0) return <div className="main-view" />;
            return <Col md={8}>
              <GenreView genreData={movies.find(m => m.Genre.Name === match.params.name).Genre} onBackClick={() => history.goBack()} />
            </Col>
          }} />

          <Route exact path='/users/:username' render={({ history }) => {
            if (!user) return <LoginView onLoggedIn={(data) => this.onLoggedIn(data)} />;
            if (movies.length === 0) return;
            return <ProfileView history={history} movies={movies} />
          }} />

        </Row>
      </Router>
    );
  }
}

export default MainView;
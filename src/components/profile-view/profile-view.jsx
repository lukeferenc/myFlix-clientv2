import React from 'react';
import {Row, Col, Button, Container, Card } from 'react-bootstrap';
import PropTypes, { string } from 'prop-types';
import axios from 'axios';
import './profile-view.scss';

export class ProfileView extends React.Component {
    constructor() {
      super();
      this.state = {
        username: null,
        password: null,
        email: null,
        birthday: null,
        Favourites: [],
      }
    }

    componentDidMount() {
        let accessToken = localStorage.getItem("token");
        this.getUser(accessToken);
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
                    Username: response.data.Username,
                    Password: response.data.Password,
                    Email: response.data.Email,
                    Birthday: response.data.Birthday,
                    Favourites: response.data.Favourites,
                });
            });
    }

handleRemove(movie) {
const token = localStorage.getItem("token");
const user = localStorage.getItem("user");
axios.post(`https://lukesmovies.herokuapp.com/users/removefromfavs/${user}/` +
    movie._id, {},
    { headers: { Authorization: `Bearer ${token}` } }
)
    .then((response) => {
    console.log(response);
    alert(movie.Title + " has been removed from your favourites!");
    window.location.reload(false);
    })
}


handleUpdate(e, newName, newUsername, newPassword, newEmail, newBirthday) {
    this.setState({
      validated: null,
    });

    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.preventDefault();
      e.stopPropagation();
      this.setState({
        validated: true,
      });
      return;
    }
    e.preventDefault();

    const token = localStorage.getItem('token');
    const username = localStorage.getItem('user');

    axios.put(`https://lukesmovies.herokuapp.com/users${username}`, {
      headers: { Authorization: `Bearer ${token}` },
      data: {
        Name: newName ? newName : this.state.Name,
        Username: newUsername ? newUsername : this.state.Username,
        Password: newPassword ? newPassword : this.state.Password,
        Email: newEmail ? newEmail : this.state.Email,
        Birthday: newBirthday ? newBirthday : this.state.Birthday,
      },
    })
      .then((response) => {
        alert('Saved Changes');
        this.setState({
          Name: response.data.Name,
          Username: response.data.Username,
          Password: response.data.Password,
          Email: response.data.Email,
          Birthday: response.data.Birthday,
        });
        localStorage.setItem('user', this.state.Username);
        window.open(`/users/${username}`, '_self');
      })
      .catch(function (error) {
        console.log(error);
      });
    }  

setName(input) {
    this.Name = input;
  }

  setUsername(input) {
    this.Username = input;
  }

  setPassword(input) {
    this.Password = input;
  }

  setEmail(input) {
    this.Email = input;
  }

  setBirthday(input) {
    this.Birthday = input;
  }


handleDelete() {

const answer = window.confirm("This cannot be undone, are you sure?");
if (answer) {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    axios.delete( `https://lukesmovies.herokuapp.com/users/${user}`,
        { headers: { Authorization: `Bearer ${token}` } }
        )
        .then(() => {
            alert(user + " has been deleted.");
            localStorage.removeItem("user");
            localStorage.removeItem("token");
            window.location.pathname = "/";
        })
        .catch(function (error) {
            console.log(error);
        });
        } else {
            // Do Nothing
            console.log("That was a close one");
    }
    }


render() {
    console.log("profile-view")
    const { movies } = this.props;
    let favouritesState = this.state.Favourites || [];
    const favouritesList = movies.filter(m => {
        return favouritesState.includes(m._id);
    });

    return (
        <Container className="profile-wrapper m-4">
        <Row>
            <Col>
            <h2>Username: {this.props.user}</h2>
            <p>Email: {this.state.Email}</p>
            <p>Birthday: {this.state.Birthday}</p>
            <h5 className="mt-5">Your Favourites</h5>
            </Col>
            </Row>
            <Row>
            {favouritesList.map((movie) => {
                return (
                <Col md={4} key={movie._id}>
                    <div key={movie._id}>
                    <Card className='mb-4 h-100 text-white bg-transparent'>
                        <Card.Img variant="top" src={movie.ImageUrl} />
                        <Card.Body>
                        <Link to={`/movies/${movie.Title}`}>
                            <Card.Img variant="top" src={movie.imageUrl} />
                            <Card.Title as='h3'>{movie.Title}</Card.Title>
                        </Link>
                            <Button className='mb-4' variant="outline-secondary" size="sm" onClick={() => this.handleRemove(movie)}>Remove from Favourites</Button> 
                        </Card.Body>

                        <h1 className="section">Update Profile</h1>
                        <Card.Body>
                        <Form noValidate validated={validated} className="update-form" onSubmit={(e) => this.handleUpdate(e, this.Name, this.Username, this.Password, this.Email, this.Birthday)}>

                            <Form.Group controlId="formName">
                            <Form.Label className="form-label">Name</Form.Label>
                            <Form.Control type="text" placeholder="Change Name" onChange={(e) => this.setName(e.target.value)} />
                            </Form.Group>

                            <Form.Group controlId="formBasicUsername">
                            <Form.Label className="form-label">Username</Form.Label>
                            <Form.Control type="text" placeholder="Change Username" onChange={(e) => this.setUsername(e.target.value)} />
                            </Form.Group>

                            <Form.Group controlId="formBasicPassword">
                            <Form.Label className="form-label">
                                Password<span className="required">*</span>
                            </Form.Label>
                            <Form.Control type="password" placeholder="New Password" onChange={(e) => this.setPassword(e.target.value)} />
                            </Form.Group>

                            <Form.Group controlId="formBasicEmail">
                            <Form.Label className="form-label">Email</Form.Label>
                            <Form.Control type="email" placeholder="Change Email" onChange={(e) => this.setEmail(e.target.value)} />
                            </Form.Group>

                            <Form.Group controlId="formBasicBirthday">
                            <Form.Label className="form-label">Birthday</Form.Label>
                            <Form.Control type="date" placeholder="Change Birthday" onChange={(e) => this.setBirthday(e.target.value)} />
                            </Form.Group>

                            <Button variant='danger' type="submit">
                            Update
                            </Button>

                            <h3>Delete your Account</h3>
                            <Card.Body>
                            <Button variant='danger' onClick={(e) => this.handleDelete(e)}>
                                Delete Account
                            </Button>
                            </Card.Body>
                        </Form>

                        </Card.Body>
                    </Card>
                    </div>
                </Col>
                );
            })}
            </Row>
            <Row>
            <Col className="acc-btns mt-1">
                <Button size="md" variant="outline-danger" type="submit" ml="4" onClick={() => this.handleDelete()} >Delete Account</Button>
            </Col>
            </Row>
        </Container>
    );
    }
    }

ProfileView.propTypes = {
users: PropTypes.shape({
    Username: PropTypes.string.isRequired,
    Email: PropTypes.string.isRequired,
    Birthday: PropTypes.string,
    Favourites: PropTypes.array,
}),
movies: PropTypes.array.isRequired,
};
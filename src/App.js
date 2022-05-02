import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Form } from 'react-bootstrap';
import { useState } from 'react';
import { createUserWithEmailAndPassword, FacebookAuthProvider, getAuth, GithubAuthProvider, GoogleAuthProvider, sendEmailVerification, sendPasswordResetEmail, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import app from './firebase.init';


const auth = getAuth(app);

function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [checked, setChecked] = useState(false);
  const [validated, setValidated] = useState(false);
  const [error, setError] = useState('');
  const googleProvider = new GoogleAuthProvider();
  const githubProvider = new GithubAuthProvider();
  const facebookProvider = new FacebookAuthProvider();

  const handleOnSubmit = (e) => {
    e.preventDefault();

    // Form Validation
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
    }

    if (checked) {
      signInWithEmailAndPassword(auth, email, password)
        .then(result => {
          const user = result.user;
          console.log(user);
        })
        .catch(error => {
          setError(error.message);
        })
    }
    else {
      if (!email && !password) {
        setError('Please Enter Email or Password');
        return
      }
      else if (!/(?=.*[!@#$%^&*])/.test(password)) {
        setError('Password should have a special charecter');
        return;
      }
      setError('');
      setValidated(true);

      createUserWithEmailAndPassword(auth, email, password)
        .then(result => {
          const user = result.user;
          console.log(user)
          handleEmailVerify();
        })
        .catch(error => {
          console.log(error)
        })


    }


  }
  const handleEmailOnBlur = e => {
    setEmail(e.target.value);
  }
  const handlePasswordOnBlur = e => {
    setPassword(e.target.value);
  }
  const handleChecked = e => {
    setChecked(e.target.checked)
  }
  const handleEmailVerify = () => {
    sendEmailVerification(auth.currentUser)
      .then(() => {
        console.log('Verification Email Sent')
      })
      .catch(error => {
        console.log(error)
      })
    setError('');
  }
  const handlePasswordReset = () => {
    sendPasswordResetEmail(auth, email)
      .then(result => {
        console.log('Password Reset Email Sent')
      })
      .catch(error => {
        setError(error.message)
      })
    setError('');

  }
  const handleGoogleLogin = () => {
    signInWithPopup(auth, googleProvider)
      .then(result => {
        const user = result.user;
        console.log(user)
      })
      .catch(error => {
        setError(error.message)
      })
  }
  const handleGithubLogin = () => {
    signInWithPopup(auth, githubProvider)
      .then(result => {
        const user = result.user;
        console.log(user)
      })
      .catch(error => {
        setError(error.message)
      })
  }
  const handleFacebookLogin = () => {
    signInWithPopup(auth, facebookProvider)
      .then(result => {
        const user = result.user;
        console.log(user)
      })
      .catch(error => {
        setError(error.message)
      })
  }
  return (
    <div>
      <div className="form-container w-50 mx-auto mt-5">
        <h4 className='text-primary'>Please {checked ? 'Login' : 'Register'}</h4>
        <Form noValidate validated={validated} onSubmit={handleOnSubmit}>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control onBlur={handleEmailOnBlur} type="email" placeholder="Enter email" required />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control onBlur={handlePasswordOnBlur} type="password" placeholder="Password" required />
            <p className='text-danger'>{error}</p>
          </Form.Group>
          <Form.Group className="mb-3 d-flex align-items-center" controlId="formBasicCheckbox">
            <Form.Check onClick={handleChecked} type="checkbox" label="Already Registerd?" />
            <Button onClick={handlePasswordReset} className='text-danger' variant="link">Forgot Password?</Button>

          </Form.Group>
          <Button variant="primary" type="submit">
            {checked ? 'Login' : 'Register'}
          </Button>
          <h5 className='mt-4 text-primary'>Login With</h5>
          <Button onClick={handleGoogleLogin} variant="link"><i className="fa-brands fa-google text-primary"></i></Button>
          <Button onClick={handleGithubLogin} variant="link"><i className="fa-brands fa-github text-dark"></i></Button>
          <Button onClick={handleFacebookLogin} variant="link"><i className="fa-brands fa-facebook text-primary"></i></Button>
        </Form>
      </div>
    </div >
  );
}

export default App;

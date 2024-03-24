import { useEffect, useState } from 'react';
import Button from '../../components/Button/Button';
import styles from './Login.module.scss';
import axios from 'axios';
import { useNavigate, useOutletContext } from 'react-router-dom';
// import { check } from 'express-validator';

export default function Login() {
  const [body, setBody] = useState(),
    [user, setUser] = useOutletContext(),
    [errors, setErrors] = useState([]),
    navigate = useNavigate();
  async function handleSubmit(e) {
    e.preventDefault();
    const response = await axios.post('http://localhost:3000/api/login', body, {
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    });
    response.data.user && setUser(response.data.user);
    response.data.errors && setErrors(response.data.errors);
    console.log(errors);
    errors.find((el) => el === 'EMPTY_EMAIL');
  }
  useEffect(() => {
    if (user) navigate('/');
  }, [user]);
  return (
    <div className={styles.login}>
      <div>
        <div>
          <div></div>
          <p className='headline-medium'>Solstice</p>
        </div>
        <h1 className='title-large'>Log in to your account</h1>
        <h2 className='body-large'>Select your identifiers</h2>
      </div>
      <form onSubmit={handleSubmit}>
        <div
          className={styles.container}
          style={
            (errors.find((el) => el === 'EMPTY_EMAIL') ||
              errors.find((el) => el === 'EMAIL_NOT_FOUND')) && {
              gap: '1.5rem',
            }
          }
        >
          <div>
            <input
              type='email'
              className='body-large'
              name='email'
              placeholder='Email'
              autoComplete='email'
              onInput={(e) =>
                setBody({ ...body, [e.target.name]: e.target.value })
              }
            />
            {errors.find((el) => el === 'EMPTY_EMAIL') ? (
              <p className='body-small'>Please select your email</p>
            ) : (
              errors.find((el) => el === 'EMAIL_NOT_FOUND') && (
                <p className='body-small'>Please select a valid email</p>
              )
            )}
          </div>
          <div>
            <input
              type='password'
              className='body-large'
              name='password'
              placeholder='Password'
              autoComplete='current-password'
              onInput={(e) =>
                setBody({ ...body, [e.target.name]: e.target.value })
              }
            />
            {errors.find((el) => el === 'EMPTY_PASSWORD') ? (
              <p className='body-small'>Please select your password</p>
            ) : (
              errors.find((el) => el === 'UNMATCHING_PASSWORD') && (
                <p className='body-small'>Wrong password</p>
              )
            )}
          </div>
        </div>
        <div className={styles.container_btn}>
          <Button style='text' label='Sign up' onClick={() => navigate('/sign_up')} />
          <button type='submit'>
            <Button label='Log in' />
          </button>
        </div>
      </form>
    </div>
  );
}

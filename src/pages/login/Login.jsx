import { useEffect, useState } from 'react';
import Button from '../../components/Button/Button';
import styles from './Login.module.scss';
import axios from 'axios';
import { useNavigate, useOutletContext } from 'react-router-dom';

export default function Login() {
  const [body, setBody] = useState(),
    [user, setUser] = useOutletContext(),
    [errors, setErrors] = useState([]),
    navigate = useNavigate();
  async function handleSubmit() {
    const response = await axios.post('http://localhost:3000/login', body, {
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
      <main>
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
              onInput={(e) =>
                setBody({ ...body, [e.target.name]: e.target.value })
              }
            />
            {errors.find((el) => el === 'EMPTY_EMAIL') ? (
              <p className='body-small'>Please register your email</p>
            ) : (
              errors.find((el) => el === 'EMAIL_NOT_FOUND') && (
                <p className='body-small'>Please register a valid email</p>
              )
            )}
          </div>
          <div>
            <input
              type='password'
              className='body-large'
              name='password'
              placeholder='Password'
              onInput={(e) =>
                setBody({ ...body, [e.target.name]: e.target.value })
              }
            />
            {errors.find((el) => el === 'EMPTY_PASSWORD') ? (
              <p className='body-small'>Please register your password</p>
            ) : (
              errors.find((el) => el === 'UNMATCHING_PASSWORD') && (
                <p className='body-small'>Wrong password</p>
              )
            )}
          </div>
        </div>
        <div className={styles.container_btn}>
          <Button style='text' label='Sign up' />
          <Button label='Log in' onClick={handleSubmit} />
        </div>
      </main>
    </div>
  );
}

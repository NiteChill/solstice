import { useEffect, useState } from 'react';
import styles from './SignUp.module.scss';
import { useNavigate, useOutletContext } from 'react-router-dom';
import Button from '../../components/Button/Button';
import axios from 'axios';

export default function SignUp() {
  const [body, setBody] = useState(),
    [user, setUser] = useOutletContext(),
    [errors, setErrors] = useState([]),
    [step, setStep] = useState(0),
    navigate = useNavigate();
  async function handleSubmit(e) {
    e.preventDefault();
    const response = await axios.post(
      'http://localhost:3000/api/sign_up',
      body,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      }
    );
    response.data.user && setUser(response.data.user);
    response.data.errors && setErrors(response.data.errors);
    console.log(errors);
    errors.find((el) => el === 'EMPTY_EMAIL');
  }
  useEffect(() => {
    if (user) navigate('/');
  }, [user]);
  useEffect(() => {
    console.log(body);
  }, [body]);
  return (
    <div className={styles.sign_up}>
      <div>
        <div>
          <div></div>
          <p className='headline-medium'>Solstice</p>
        </div>
        <h1 className='title-large'>
          {step === 0
            ? 'Create an account'
            : step === 1
            ? 'General information'
            : step === 2
            ? 'Identifiers'
            : 'Almost done'}
        </h1>
        <h2 className='body-large'>
          {step === 0
            ? 'Select your name'
            : step === 1
            ? 'Select your username and age'
            : step === 2
            ? 'Select your email and pasword'
            : 'Confirm your password'}
        </h2>
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
          {step !== 3 && (
            <div>
              {(step === 0 || step === 1 || step === 2) && (
                <input
                  type={
                    step === 0 || step === 1 ? 'text' : step === 2 && 'email'
                  }
                  className='body-large'
                  name={
                    step === 0
                      ? 'first_name'
                      : step === 1
                      ? 'username'
                      : step === 2 && 'email'
                  }
                  placeholder={
                    step === 0
                      ? 'First Name'
                      : step === 1
                      ? 'Username'
                      : step === 2 && 'Email'
                  }
                  autoComplete={
                    step === 0
                      ? 'given-name'
                      : step === 1
                      ? 'username'
                      : step === 2 && 'email'
                  }
                  onInput={(e) =>
                    setBody({ ...body, [e.target.name]: e.target.value })
                  }
                />
              )}
              {errors.find((el) => el === 'EMPTY_EMAIL') ? (
                <p className='body-small'>Please register your email</p>
              ) : (
                errors.find((el) => el === 'EMAIL_NOT_FOUND') && (
                  <p className='body-small'>Please register a valid email</p>
                )
              )}
            </div>
          )}
          <div>
            {step === 0 && (
              <input
                type='text'
                className='body-large'
                name='last_name'
                placeholder='Last name'
                autoComplete='family-name'
                onInput={(e) =>
                  setBody({ ...body, [e.target.name]: e.target.value })
                }
              />
            )}
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
          <Button
            style='text'
            label={step === 0 ? 'Log in' : 'Previous'}
            onClick={() => {
              if (step === 0) navigate('/login');
              else setStep(step - 1);
            }}
          />
          <button
            type='submit'
            style={{ display: step === 3 ? 'flex' : 'none' }}
          >
            <Button label='Create account' />
          </button>
          <button
            type='reset'
            style={{ display: step === 3 ? 'none' : 'flex' }}
          >
            <Button label='Next' onClick={() => setStep(step + 1)} />
          </button>
        </div>
      </form>
    </div>
  );
}

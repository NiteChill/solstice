import { useEffect, useState } from 'react';
import styles from './SignUp.module.scss';
import { useNavigate, useOutletContext } from 'react-router-dom';
import Button from '../../components/Button/Button';
import IconButton from '../../components/IconButton/IconButton';
import { useHandleEventSignUp } from '../../hooks/useHandleEventSignUp';

export default function SignUp() {
  const [user, setUser] = useOutletContext(),
    [visibility, setVisibility] = useState(false),
    navigate = useNavigate(),
    [handleClick, handleSubmit, errors, setErrors, step, setStep, body, setBody] = useHandleEventSignUp();
  useEffect(() => {
    if (user) navigate('/');
  }, [user]);
  useEffect(() => {
    console.log(body);
  }, [body]);
  useEffect(() => {
    setVisibility(false);
  }, [step]);
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
      <form onSubmit={(e) => handleSubmit(e, errors)}>
        <div
          className={styles.container}
          style={{
            gap:
              (errors.find((el) => el === 'EMPTY_FIRST_NAME') && step === 0) ||
              (errors.find((el) => el === 'EMPTY_USERNAME') && step === 1) ||
              (errors.find((el) => el === 'EMPTY_EMAIL') && step === 2)
                ? '1.5rem'
                : '1rem',
          }}
        >
          {step !== 3 && (
            <div>
              {(step === 0 || step === 1 || step === 2) && (
                <input
                  value={
                    step === 0
                      ? body.first_name
                      : step === 1
                      ? body.username
                      : step === 2 && body.email
                  }
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
              {errors.find((el) => el === 'EMPTY_FIRST_NAME') && step === 0 ? (
                <p className='body-small'>Please select your first name</p>
              ) : errors.find((el) => el === 'EMPTY_USERNAME') && step === 1 ? (
                <p className='body-small'>Please select a username</p>
              ) : (
                errors.find((el) => el === 'EMPTY_EMAIL') &&
                step === 2 && (
                  <p className='body-small'>Please select your email</p>
                )
              )}
            </div>
          )}
          <div>
            {step === 0 || step === 1 ? (
              <input
                value={step === 0 ? body.last_name : step === 1 && body.age}
                type={step === 0 ? 'text' : step === 1 && 'number'}
                className='body-large'
                name={step === 0 ? 'last_name' : step === 1 && 'age'}
                placeholder={step === 0 ? 'Last name' : step === 1 && 'Age'}
                autoComplete={step === 0 ? 'family-name' : step === 1 && 'on'}
                onInput={(e) =>
                  setBody({ ...body, [e.target.name]: e.target.value })
                }
              />
            ) : (
              (step === 2 || step === 3) && (
                <div>
                  <input
                    value={
                      step === 2
                        ? body.password
                        : step === 3 && body.password_confirm
                    }
                    type={visibility ? 'text' : 'password'}
                    className='body-large'
                    name={
                      step === 2 ? 'password' : step === 3 && 'password_confirm'
                    }
                    placeholder={
                      step === 2 ? 'Password' : step === 3 && 'Confirm password'
                    }
                    autoComplete='off'
                    onInput={(e) =>
                      setBody({ ...body, [e.target.name]: e.target.value })
                    }
                  />
                  <IconButton
                    icon={visibility ? 'visibility_off' : 'visibility'}
                    onClick={() => setVisibility(!visibility)}
                  />
                </div>
              )
            )}
            {errors.find((el) => el === 'EMPTY_LAST_NAME') && step === 0 ? (
              <p className='body-small'>Please select your last name</p>
            ) : errors.find((el) => el === 'EMPTY_AGE') && step === 1 ? (
              <p className='body-small'>Please select your age</p>
            ) : errors.find((el) => el === 'EMPTY_PASSWORD') && step === 2 ? (
              <p className='body-small'>Please choose a password</p>
            ) : errors.find((el) => el === 'EMPTY_PASSWORD_CONFIRM') ? (
              step === 3 && (
                <p className='body-small'>Please confirm your password</p>
              )
            ) : (
              (errors.find((el) => el === 'UNMATCHING_PASSWORD') && step === 3) && (
                <p className='body-small'>The passwords don't match</p>
              )
            )}
          </div>
        </div>
        <div className={styles.container_btn}>
          <button type='reset'>
            <Button
              style='text'
              label={step === 0 ? 'Log in' : 'Previous'}
              onClick={() => {
                if (step === 0) navigate('/login');
                else setStep(step - 1);
              }}
            />
          </button>
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
            <Button
              label='Next'
              onClick={() => {
                handleClick(errors) && setStep(step + 1);
              }}
            />
          </button>
        </div>
      </form>
    </div>
  );
}

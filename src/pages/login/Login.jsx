import { useEffect, useState } from 'react';
import Button from '../../components/Button/Button';
import styles from './Login.module.scss';

export default function Login() {
  const [body, setBody] = useState();
  useEffect(() => {
    console.log(body);
  }, [body]);
  return (
    <div className={styles.login}>
      <div>
        <h1 className='display-medium'>Log in to your account</h1>
      </div>
      <main>
        <h2 className='title-large'>Select your identifiers</h2>
        <div className={styles.container}>
          <input
            type='email'
            className='body-large'
            name='email'
            placeholder='Email'
            onInput={(e) =>
              setBody({ ...body, [e.target.name]: e.target.value })
            }
          />
          <input
            type='password'
            className='body-large'
            name='password'
            placeholder='Password'
            onInput={(e) =>
              setBody({ ...body, [e.target.name]: e.target.value })
            }
          />
        </div>
        <div className={styles.container_btn}>
          <Button style='text' label='Sign up' />
          <Button label='Log in' />
        </div>
      </main>
    </div>
  );
}

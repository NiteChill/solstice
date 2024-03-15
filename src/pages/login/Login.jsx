import { useEffect, useState } from 'react';
import Button from '../../components/Button/Button';
import styles from './Login.module.scss';
import axios from 'axios';

export default function Login() {
  const [body, setBody] = useState();
  async function handleSubmit() {
    const response = await axios.post('http://localhost:3000/login', body, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    console.log(response.data.error);
    console.log(response.data.user);
  }
  useEffect(() => {
  }, []);
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
          <Button style='text' label='Sign up' onClick={()=> axios.get('http://localhost:3000/oui')} />
          <Button label='Log in' onClick={handleSubmit} />
        </div>
      </main>
    </div>
  );
}

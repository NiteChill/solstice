import { useState } from 'react';
import axios from 'axios';
import { useOutletContext } from 'react-router-dom';
import validator from 'validator';


export function useHandleEventSignUp() {
  const [errors, setErrors] = useState([]),
    [step, setStep] = useState(0),
    [user, setUser] = useOutletContext(),
    [body, setBody] = useState({
      first_name: '',
      last_name: '',
      username: '',
      age: '',
      email: '',
      password: '',
      password_confirm: '',
    });
  function handleClick(current_errors) {
    let errors = current_errors;
    if (step === 0) {
      if (errors.find((el) => el === 'EMPTY_FIRST_NAME')) {
        let tempArr = errors;
        tempArr.splice(tempArr.indexOf('EMPTY_FIRST_NAME'), 1);
        setErrors(tempArr);
        errors = tempArr;
      }
      if (errors.find((el) => el === 'EMPTY_LAST_NAME')) {
        let tempArr = errors;
        tempArr.splice(tempArr.indexOf('EMPTY_LAST_NAME'), 1);
        setErrors(tempArr);
        errors = tempArr;
      }
      if (validator.isEmpty(body.first_name, { ignore_whitespace: true}))
        errors = [...errors, 'EMPTY_FIRST_NAME'];
      if (validator.isEmpty(body.last_name, { ignore_whitespace: true }))
        errors = [...errors, 'EMPTY_LAST_NAME'];
      if (
        errors.find((el) => el === 'EMPTY_FIRST_NAME') ||
        errors.find((el) => el === 'EMPTY_LAST_NAME')
      ) {
        setErrors(errors);
        return false;
      }
    }
    if (step === 1) {
      if (errors.find((el) => el === 'EMPTY_USERNAME')) {
        let tempArr = errors;
        tempArr.splice(tempArr.indexOf('EMPTY_USERNAME'), 1);
        setErrors(tempArr);
        errors = tempArr;
      }
      if (errors.find((el) => el === 'EMPTY_AGE')) {
        let tempArr = errors;
        tempArr.splice(tempArr.indexOf('EMPTY_AGE'), 1);
        setErrors(tempArr);
        errors = tempArr;
      }
      if (validator.isEmpty(body.username, { ignore_whitespace: true}))
        errors = [...errors, 'EMPTY_USERNAME'];
      if (validator.isEmpty(body.age, { ignore_whitespace: true }))
        errors = [...errors, 'EMPTY_AGE'];
      if (
        errors.find((el) => el === 'EMPTY_USERNAME') ||
        errors.find((el) => el === 'EMPTY_AGE')
      ) {
        setErrors(errors);
        return false;
      }
    }
    if (step === 2) {
      if (errors.find((el) => el === 'EMPTY_EMAIL')) {
        let tempArr = errors;
        tempArr.splice(tempArr.indexOf('EMPTY_EMAIL'), 1);
        setErrors(tempArr);
        errors = tempArr;
      }
      if (errors.find((el) => el === 'EMPTY_PASSWORD')) {
        let tempArr = errors;
        tempArr.splice(tempArr.indexOf('EMPTY_PASSWORD'), 1);
        setErrors(tempArr);
        errors = tempArr;
      }
      if (errors.find((el) => el === 'INVALID_EMAIL')) {
        let tempArr = errors;
        tempArr.splice(tempArr.indexOf('INVALID_EMAIL'), 1);
        setErrors(tempArr);
        errors = tempArr;
      }
      if (validator.isEmpty(body.email, { ignore_whitespace: true }))
        errors = [...errors, 'EMPTY_EMAIL'];
      else {
        if (!validator.isEmail(body.email)) errors = [...errors, 'INVALID_EMAIL'];
      }
      if (validator.isEmpty(body.password, { ignore_whitespace: true }))
        errors = [...errors, 'EMPTY_PASSWORD'];
      if (
        errors.find((el) => el === 'EMPTY_EMAIL') ||
        errors.find((el) => el === 'EMPTY_PASSWORD') ||
        errors.find((el) => el === 'INVALID_EMAIL')
      ) {
        setErrors(errors);
        return false;
      }
    }
    return true;
  }

  async function handleSubmit(e, current_errors) {
    e.preventDefault();
    let errors = current_errors;
    if (errors.find((el) => el === 'EMPTY_PASSWORD_CONFIRM')) {
      let tempArr = errors;
      tempArr.splice(tempArr.indexOf('EMPTY_PASSWORD_CONFIRM'), 1);
      setErrors(tempArr);
      errors = tempArr;
    }
    if (validator.isEmpty(body.password_confirm, { ignore_whitespace: true }))
      errors = [...errors, 'EMPTY_PASSWORD_CONFIRM'];
    if (errors.find((el) => el === 'EMPTY_PASSWORD_CONFIRM')) {
      setErrors(errors);
      return false;
    }
    if (body.password === body.password_confirm) {
      console.log('hi');
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
      if (response.data.errors.find((el) => el === 'EMAIL_ALREADY_USED'))
        setStep(2);
    } else setErrors(['UNMATCHING_PASSWORD']);
  }
  return [
    handleClick,
    handleSubmit,
    errors,
    setErrors,
    step,
    setStep,
    body,
    setBody,
    user,
    setUser
  ];
}

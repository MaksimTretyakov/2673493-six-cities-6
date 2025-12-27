import { Link, Navigate } from 'react-router-dom';
import { FormEvent, useRef, useState, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginAction } from '../../store/api-actions';
import { RootState, AppDispatch } from '../../store';
import { AuthorizationStatus, CITIES } from '../../consts';
import Header from '../../components/header/header';
import { NameSpace } from '../../store/const';
import { changeCity } from '../../store/action';

const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{2,}$/;

function LoginPage(): JSX.Element {
  const emailRef = useRef<HTMLInputElement | null>(null);
  const passwordRef = useRef<HTMLInputElement | null>(null);
  const [isFormValid, setIsFormValid] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const authorizationStatus = useSelector(
    (state: RootState) => state[NameSpace.User].authorizationStatus
  );

  const randomCity = useMemo(
    () => CITIES[Math.floor(Math.random() * CITIES.length)],
    []
  );

  const handleInputChange = useCallback(() => {
    const isPasswordCorrect = passwordRef.current
      ? PASSWORD_REGEX.test(passwordRef.current.value)
      : false;
    const isEmailFilled = emailRef.current
      ? emailRef.current.value.length > 0
      : false;
    setIsFormValid(isPasswordCorrect && isEmailFilled);
  }, []);

  const handleCityClick = useCallback(() => {
    dispatch(changeCity(randomCity.name));
  }, [dispatch, randomCity.name]);

  const handleSubmit = (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault();

    if (emailRef.current && passwordRef.current) {
      dispatch(
        loginAction({
          email: emailRef.current.value,
          password: passwordRef.current.value,
        })
      );
    }
  };

  if (authorizationStatus === AuthorizationStatus.Auth) {
    return <Navigate to="/" />;
  }

  return (
    <div className="page page--gray page--login">
      <Header withNavigation={false} />

      <main className="page__main page__main--login">
        <div className="page__login-container container">
          <section className="login">
            <h1 className="login__title">Sign in</h1>
            <form
              className="login__form form"
              action="#"
              method="post"
              onSubmit={handleSubmit}
            >
              <div className="login__input-wrapper form__input-wrapper">
                <label className="visually-hidden">E-mail</label>
                <input
                  ref={emailRef}
                  className="login__input form__input"
                  type="email"
                  name="email"
                  placeholder="Email"
                  required
                  onChange={handleInputChange}
                />
              </div>
              <div className="login__input-wrapper form__input-wrapper">
                <label className="visually-hidden">Password</label>
                <input
                  ref={passwordRef}
                  className="login__input form__input"
                  type="password"
                  name="password"
                  placeholder="Password"
                  required
                  onChange={handleInputChange}
                />
              </div>
              <button
                className="login__submit form__submit button"
                type="submit"
                disabled={!isFormValid}
              >
                Sign in
              </button>
            </form>
          </section>
          <section className="locations locations--login locations--current">
            <div className="locations__item">
              <Link
                className="locations__item-link"
                to="/"
                onClick={handleCityClick}
              >
                <span>{randomCity.name}</span>
              </Link>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default LoginPage;

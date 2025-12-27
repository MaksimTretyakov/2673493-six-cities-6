import { Link, useLocation } from 'react-router-dom';
import React, { MouseEvent, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { AuthorizationStatus } from '../../consts';
import { logoutAction } from '../../store/api-actions';
import { selectFavoriteCount } from '../../store/selectors';
import { NameSpace } from '../../store/const';

type HeaderProps = {
  withNavigation?: boolean;
};

function Header({ withNavigation = true }: HeaderProps): JSX.Element {
  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();

  const authorizationStatus = useSelector(
    (state: RootState) => state[NameSpace.User].authorizationStatus
  );
  const user = useSelector((state: RootState) => state[NameSpace.User].user);
  const favoriteCount = useSelector(selectFavoriteCount);

  const handleLogout = useCallback(
    (evt: MouseEvent<HTMLAnchorElement>) => {
      evt.preventDefault();
      dispatch(logoutAction());
    },
    [dispatch]
  );

  return (
    <header className="header">
      <div className="container">
        <div className="header__wrapper">
          <div className="header__left">
            <Link
              className={`header__logo-link ${
                location.pathname === '/' ? 'header__logo-link--active' : ''
              }`}
              to="/"
            >
              <img
                className="header__logo"
                src="img/logo.svg"
                alt="6 cities logo"
                width="81"
                height="41"
              />
            </Link>
          </div>
          {withNavigation && (
            <nav className="header__nav">
              <ul className="header__nav-list">
                {authorizationStatus === AuthorizationStatus.Auth ? (
                  <>
                    <li className="header__nav-item user">
                      <Link
                        className="header__nav-link header__nav-link--profile"
                        to="/favorites"
                      >
                        <div className="header__avatar-wrapper user__avatar-wrapper">
                          <img
                            src={user?.avatarUrl}
                            alt="User avatar"
                            style={{ borderRadius: '50%' }}
                          />
                        </div>
                        <span className="header__user-name user__name">
                          {user?.email}
                        </span>
                        <span className="header__favorite-count">
                          {favoriteCount}
                        </span>
                      </Link>
                    </li>
                    <li className="header__nav-item">
                      <a
                        className="header__nav-link"
                        href="#"
                        onClick={handleLogout}
                      >
                        <span className="header__signout">Sign out</span>
                      </a>
                    </li>
                  </>
                ) : (
                  <li className="header__nav-item user">
                    <Link
                      className="header__nav-link header__nav-link--profile"
                      to="/login"
                    >
                      <div className="header__avatar-wrapper user__avatar-wrapper"></div>
                      <span className="header__login">Sign in</span>
                    </Link>
                  </li>
                )}
              </ul>
            </nav>
          )}
        </div>
      </div>
    </header>
  );
}

const MemoizedHeader = React.memo(Header);
export default MemoizedHeader;

import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { AuthorizationStatus } from '../../consts';
import { NameSpace } from '../../store/const';

type PrivateRouteProps = {
  children: JSX.Element;
};

function PrivateRoute({ children }: PrivateRouteProps): JSX.Element {
  const authorizationStatus = useSelector(
    (state: RootState) => state[NameSpace.User].authorizationStatus
  );

  return authorizationStatus === AuthorizationStatus.Auth ? (
    children
  ) : (
    <Navigate to="/login" />
  );
}

export default PrivateRoute;

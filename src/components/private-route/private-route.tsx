import { Navigate } from 'react-router-dom';

type PrivateRouteProps = {
  authorizationStatus: boolean;
  children: JSX.Element;
};

function PrivateRoute(props: PrivateRouteProps): JSX.Element {
  const { authorizationStatus, children } = props;

  return authorizationStatus ? children : <Navigate to="/login" />;
}

export default PrivateRoute;

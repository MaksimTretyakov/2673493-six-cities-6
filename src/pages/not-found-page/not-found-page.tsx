import { Link } from 'react-router-dom';

function NotFoundPage(): JSX.Element {
  return (
    <div>
      <h1>404 Not Found</h1>
      <Link to="/">Go to the main page</Link>
    </div>
  );
}

export default NotFoundPage;

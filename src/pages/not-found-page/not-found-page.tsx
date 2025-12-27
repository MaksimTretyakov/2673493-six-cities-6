import { Link } from 'react-router-dom';
import Header from '../../components/header/header';

function NotFoundPage(): JSX.Element {
  const containerStyle: React.CSSProperties = {
    textAlign: 'center',
    padding: '50px',
  };

  const linkStyle: React.CSSProperties = {
    display: 'inline-block',
    marginTop: '20px',
    padding: '10px 20px',
    backgroundColor: '#4481c3',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '5px',
  };

  return (
    <div className="page page--gray">
      <Header />
      <main className="page__main">
        <div style={containerStyle}>
          <h1>404 Not Found</h1>
          <p>The page you are looking for does not exist.</p>
          <Link to="/" style={linkStyle}>
            Go to the main page
          </Link>
        </div>
      </main>
    </div>
  );
}

export default NotFoundPage;

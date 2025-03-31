import { Link } from 'react-router-dom';

const Header = () => {
    return (
      <nav>
        <ul style={style.ul}>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/Manage/Users">Manage Users</Link>
          </li>
          <li>
            <Link to="/map">Map</Link>
          </li>
        </ul>
      </nav>
    )
}

const style = {
    ul: { 
      listStyle: 'none', 
      display: 'flex', 
      gap: '20px',
      padding: 0
    }
  }

  export default Header
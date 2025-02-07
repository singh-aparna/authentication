import './App.css';
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import Login from './pages/Login';
import UserContext from './UserContext';
import { useEffect, useState } from 'react';
import Regiser from './pages/register';

function App() {
  const [username, setUsername] = useState('');
  useEffect(() => {
    fetch('http://localhost:4000/user', {
      credentials: "include"
    }).then(res => res.json())
      .then((data => {
        setUsername(data.username);
        console.log(data);
        console.log(data.username);
      }
      ));
  }, []);

  function logoutUser(e) {
    e.preventDefault();
    fetch('http://localhost:4000/logout', {
      credentials: "include",
      method: "POST"
    })
      .then(() => setUsername(''));
  }

  return (
    <div>
      <UserContext.Provider value={{ username, setUsername }}>
        <BrowserRouter>
          <nav>
            <Link to="/">Home</Link>
            {
              !username && (
                <>
                  <Link to="/register">Register</Link>
                  <Link to="/login">Login</Link>
                </>
              )
            }
            {
              !!username && (
                <>
                  <Link to={"/logout"} onClick={(e) => logoutUser(e)}>Logout</Link>
                </>
              )
            }
          </nav>
          <main>
            <Routes>
              <Route path={'/'} element={<h1>Welcome {username}</h1>} />
              <Route path={"/register"} element={<Regiser />} />
              <Route path={"/login"} element={<Login />} />
            </Routes>
          </main>
        </BrowserRouter>
      </UserContext.Provider>
    </div>
  );
}

export default App;

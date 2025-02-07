import { useContext, useState } from "react"
import UserContext from "../UserContext";
import { Navigate } from "react-router-dom";

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const user = useContext(UserContext);
    const [redirect, setRedirect] = useState(false);
    const [error, setError] = useState('');

    async function loginUser(e) {
        e.preventDefault();
        setError('');
        try {
            const response = await fetch('http://localhost:4000/login', {
                body: JSON.stringify({ username, password }),
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include"
            });
            const data = await response.json();
            if (response.ok) {
                user.setUsername(data.username);
                setUsername('');
                setPassword('');
                alert("Login successful!");
                setRedirect(true);
            }
            else {
                if (response.status === 401) {
                    setError('Username not found!');
                    setUsername('');
                    setPassword('');
                }
                else {
                    if (response.status === 403) {
                        setError('Incorrect password!');
                        setUsername('');
                        setPassword('');
                    }
                }
            }
        }
        catch (err) {
            console.log(err);
        }
    }
    if (redirect) {
        return <Navigate to={"/"} />
    }
    return (<form className="login" onSubmit={(e) => loginUser(e)}>
        {error}
        <h1>Login</h1>
        <input placeholder="username" required value={username} onChange={(e) => setUsername(e.target.value)} />
        <input placeholder="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
        <button>Login</button>
    </form>)
}
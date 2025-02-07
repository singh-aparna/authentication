import { useContext, useState } from "react"
import UserContext from "../UserContext";
import { Navigate } from "react-router-dom";

export default function Regiser() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [redirect, setRedirect] = useState(false);
    const user = useContext(UserContext);

    async function registerUser(e) {
        e.preventDefault();
        setError('');
        try {
            const response = await fetch('http://localhost:4000/register', {
                method: "POST",
                body: JSON.stringify({ username, password }),
                headers: { "Content-Type": "application/json" },
                credentials: "include"
            });
            const data = await response.json();
            if (response.ok) {
                user.setUsername(data.username);
                alert("User successfully registered!");
                setUsername('');
                setPassword('');
                setRedirect(true);
                console.log("User registered:", data)
            }
            else {
                if (response.status === 401) {
                    setError('Username already exist!');
                    setUsername('');
                    setPassword('');
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
    return (<form className="register" onSubmit={(e) => registerUser(e)}>
        <h1>Register</h1>
        <p>{error}</p>
        <input placeholder="username" required value={username} onChange={(e) => setUsername(e.target.value)} />
        <input placeholder="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
        <button>Register</button>
    </form>)
}
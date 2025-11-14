import { Link } from "react-router-dom";

export function Home() {


    return (
        <>
            <div> welcome to dashboard</div>
            <Link to="/signup">signup</Link>
            <Link to="/login">login</Link>
        </>
    );
}
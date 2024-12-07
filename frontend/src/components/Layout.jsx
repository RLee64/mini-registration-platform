import { Outlet } from "react-router-dom"

const Layout = () => {
    return (
        <>
        <header>
            <h1>NZPMC</h1>
        </header>
        <main>
            <Outlet />
        </main>
        <footer>
            mmm potato
        </footer>
        </>
    
    )
}

export default Layout
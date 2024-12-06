import { Outlet } from "react-router-dom"

const Layout = () => {
    return (
        //HEADER
        <main>
            <Outlet />
        </main>
        //FOOTER
    )
}

export default Layout
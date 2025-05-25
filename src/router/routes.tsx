import { createBrowserRouter } from "react-router-dom";
import MainPage from "../pages/MainPage";
import Login from "../components/auth/Login";
// import KardexMain from "../components/api/kardex/KardexMain";
// import PrivateRoutes from "../components/auth/PrivateRoutes";

// path: "/app",
// element: <MainPage />,
// errorElement: <div>404</div>,
// children: [
//     {
//         path: "students-main",
//         element: 
//         <PrivateRoutes>
//             <StudentsPage />
//         </PrivateRoutes>
//     },

const routes = createBrowserRouter([
    {
        path: "/login",
        element: <Login />,
    },
    {
        path: "/",
        element: <MainPage />,
        errorElement: <div>Error</div>,
    },
    // {
    //     path: "/",
    //     element: <PrivateRoutes><MainPage /></PrivateRoutes>,
    //     errorElement: <div>Error</div>,
    // }
]);

export default routes
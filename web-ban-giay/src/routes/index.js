import LayoutDefault from "../layout/LayoutDefault";
import Carts from "../pages/Carts";
import Contact from "../pages/Contact";
import History from "../pages/History";
import Home from "../pages/Home";
import Introduce from "../pages/Introduce";
import Login from "../pages/Login";
import Register from "../pages/Register";

const routes = [
  {
    path: '/',
    element: <LayoutDefault />,
    children: [
      {
        path: '/',
        element: <Home />
      },
      {
        path: '/carts',
        element: <Carts />
      },
      {
        path: '/login',
        element: <Login />
      },
      {
        path: '/register',
        element: <Register />
      },
      {
        path: '/introduce',
        element: <Introduce />
      },
      {
        path: '/history',
        element: <History />
      },
      {
        path: '/contact',
        element: <Contact />
      }
    ]
  }
]
export default routes
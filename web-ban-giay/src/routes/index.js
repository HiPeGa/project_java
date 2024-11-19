import LayoutAdmin from "../layout/LayoutAdmin";
import LayoutDefault from "../layout/LayoutDefault";
import Carts from "../pages/Carts";
import Contact from "../pages/Contact";
import History from "../pages/History";
import Home from "../pages/Home";
import Introduce from "../pages/Introduce";
import Login from "../pages/Login";
import ManageContacts from "../pages/ManageContacts";
import ManageProducts from "../pages/ManageProducts";
import ManageShop from "../pages/ManageShop";
import ManageUsers from "../pages/ManageUsers";
import Register from "../pages/Register";
import ManageOrders from "../pages/ManageOrders";

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
    ],
  },
  {
    path: '/admin',
    element: <LayoutAdmin />,
    children: [
      {
        path: 'manage-shop',
        element: <ManageShop />
      },
      {
        path: 'manage-products',
        element: <ManageProducts />
      },
      {
        path: 'manage-users',
        element: <ManageUsers />
      },
      {
        path: 'manage-contacts',
        element: <ManageContacts />
      },
      {
        path: 'manage-orders',
        element: <ManageOrders />
      }
    ]
  }
]
export default routes
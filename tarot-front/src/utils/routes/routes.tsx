// routes.tsx
import TarotMateMainPage from "../../pages/TarotMate/MainPage/TarotMateMainPage";
import AboutPage from "../../pages/TarotMate/AboutPage/AboutPage";

export const HOME = "/";


interface RouteProps {
    path: string
    component: any
    exact?: boolean
}


const mainRoutes: Array<RouteProps> = [
    { path: "/", component: <TarotMateMainPage /> },
    { path: "/about", component: <AboutPage /> }
]



export const allRoutes = [
    ...mainRoutes
];

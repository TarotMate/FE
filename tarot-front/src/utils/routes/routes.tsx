// routes.tsx
import TarotMateMainPage from "../../pages/TarotMate/MainPage/TarotMateMainPage";
import AboutPage from "../../pages/TarotMate/AboutPage/AboutPage";
import TarotDetail from "../../pages/TarotMate/MainPage/TarotComponent/TarotDetail";
import TarotLayout from "../../layouts/TarotMate/MainLayout/TarotLayout";

export const HOME = "/";


interface RouteProps {
    path: string;
    component: React.ReactNode;
    layout?: React.ComponentType;
    exact?: boolean;
}


const mainRoutes: Array<RouteProps> = [
    { path: "/", component: <TarotMateMainPage />, layout: TarotLayout },
    { path: "/about", component: <AboutPage />, layout: TarotLayout },
    { path: "/detail", component: <TarotDetail />, layout: TarotLayout }
];



export const allRoutes = [
    ...mainRoutes
];

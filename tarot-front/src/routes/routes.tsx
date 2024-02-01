// routes.tsx
import TarotPage from "../pages/tarotPage/TarotPage";
import TarotDetailPage from "../pages/detailPage/TarotDetailPage";
import TarotLayout from "../layouts/TarotLayout/TarotLayout";
import TarotResultPage from "../pages/resultPage/TarotResultPage";
import TarotFooterLessLayout from "../layouts/TarotFooterLessLayout/TarotFooterLessLayout";
import MainLayout from "../layouts/MainLayout/MainLayout";

export const HOME = "/";


interface RouteProps {
    path: string;
    component: React.ReactNode;
    layout?: React.ComponentType;
    exact?: boolean;
}


const mainRoutes: Array<RouteProps> = [
    { path: "/", component: <TarotPage />, layout: MainLayout },
    { path: "/detail", component: <TarotDetailPage />, layout: MainLayout },
    { path: "/result", component: <TarotResultPage />, layout: MainLayout }
];



export const allRoutes = [
    ...mainRoutes
];

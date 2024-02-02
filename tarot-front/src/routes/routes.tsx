// routes.tsx
import TarotPage from "../pages/tarotPage/TarotPage";
import TarotDetailPage from "../pages/detailPage/TarotDetailPage";
import TarotResultPage from "../pages/resultPage/TarotResultPage";
import MainLayout from "../layouts/MainLayout/MainLayout";



interface RouteProps {
    path: string;
    component: any;
    layout?: any;
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



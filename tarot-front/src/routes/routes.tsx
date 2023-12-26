// routes.tsx
import TarotPage from "../pages/tarotPage/TarotPage";
import TarotDetailPage from "../pages/tarotPage/detail/TarotDetailPage";
import TarotLayout from "../layouts/TarotLayout/TarotLayout";
import TarotResultPage from "../pages/tarotPage/result/TarotResultPage";
import TarotFooterLessLayout from "../layouts/TarotFooterLessLayout/TarotFooterLessLayout";

export const HOME = "/";


interface RouteProps {
    path: string;
    component: React.ReactNode;
    layout?: React.ComponentType;
    exact?: boolean;
}


const mainRoutes: Array<RouteProps> = [
    { path: "/", component: <TarotPage />, layout: TarotLayout },
    { path: "/detail", component: <TarotDetailPage />, layout: TarotFooterLessLayout },
    { path: "/result", component: <TarotResultPage />, layout: TarotFooterLessLayout }
];



export const allRoutes = [
    ...mainRoutes
];

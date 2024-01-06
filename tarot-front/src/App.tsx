import './App.css'
import {allRoutes} from "./routes/routes";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {CircularProgress} from "@mui/material";
import React, { Suspense } from 'react';
import TarotLayout from "./layouts/TarotLayout/TarotLayout";

function App() {
    return (
        <>
            <React.Fragment>
                <BrowserRouter>
                    <Suspense fallback={<CircularProgress />}>
                        <Routes>
                            {allRoutes.map((route, idx) => {
                                const RouteLayout = route.layout || TarotLayout;
                                return (
                                    <Route
                                        path={route.path}
                                        element={<RouteLayout>{route.component}</RouteLayout>}
                                        key={idx}
                                    />
                                );
                            })}
                        </Routes>
                    </Suspense>
                </BrowserRouter>
            </React.Fragment>
        </>
    )
}

export default App

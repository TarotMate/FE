import './App.css'
import TarotMateMainPage from "./pages/TarotMate/MainPage/TarotMateMainPage";
import {allRoutes} from "./utils/routes/routes";
import {BrowserRouter, Route, Router, Routes} from "react-router-dom";
import {CircularProgress} from "@mui/material";
import React, { Suspense } from 'react';
import MainLayout from "./layouts/MainLayout/MainLayout";

function App() {
  return (
      <>
          <React.Fragment>
              <BrowserRouter>
                  <Suspense fallback={<CircularProgress />}>
                  <Routes>
                      {allRoutes.map((route, idx) => (
                          <Route path={route.path} element={<MainLayout>{route.component}</MainLayout>} key={idx} />
                      ))}
                  </Routes>
                  </Suspense>
              </BrowserRouter>
          </React.Fragment>
      </>
  )
}

export default App

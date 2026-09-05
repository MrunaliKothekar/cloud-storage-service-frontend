import { Routes, Route } from "react-router-dom";
import { ToastProvider } from "./components/Toast";
import ProtectedRoute from "./components/ProtectedRoute";
import AppLayout from "./components/AppLayout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Files from "./pages/Files";
import Search from "./pages/Search";
import Starred from "./pages/Starred";
import Trash from "./pages/Trash";
import Activity from "./pages/Activity";
import Shared from "./pages/Shared";
import Settings from "./pages/Settings";
import PublicLink from "./pages/PublicLink";

export default function App() {
  return <ToastProvider>
    <Routes>
      <Route path="/login" element={<Login/>}/>
      <Route path="/register" element={<Register/>}/>
      <Route path="/public/:token" element={<PublicLink/>}/>
      <Route element={<ProtectedRoute/>}>
        <Route element={<AppLayout/>}>
          <Route path="/" element={<Dashboard/>}/>
          <Route path="/files" element={<Files/>}/>
          <Route path="/files/:id" element={<Files/>}/>
          <Route path="/search" element={<Search/>}/>
          <Route path="/starred" element={<Starred/>}/>
          <Route path="/shared" element={<Shared/>}/>
          <Route path="/trash" element={<Trash/>}/>
          <Route path="/activity" element={<Activity/>}/>
          <Route path="/settings" element={<Settings/>}/>
        </Route>
      </Route>
    </Routes>
  </ToastProvider>;
}

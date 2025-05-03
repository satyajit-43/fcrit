import "./App.css";
import { Route, Routes } from "react-router-dom";
import About from "./components/LandingSite/About/index";
import Contact from "./components/LandingSite/Contact/index";
import LandingSite from "./components/LandingSite/Index";
import LandingPage from "./components/LandingSite/LandingPage/index"
import Auth from "./components/LandingSite/AuthPage/Index";
import SignIn from "./components/LandingSite/AuthPage/SignIn";
import RequestAcc from "./components/LandingSite/AuthPage/Request";
import AdminSignIn from "./components/LandingSite/AuthPage/AdminSignIn";
import Index from "./components/Dashboards/StudentDashboard/Index";
import Home from "./components/Dashboards/StudentDashboard/Home";
import Mess from "./components/Dashboards/StudentDashboard/Mess";
import Attendance from "./components/Dashboards/StudentDashboard/Attendance";
import Invoices from "./components/Dashboards/StudentDashboard/Invoices";
import Suggestions from "./components/Dashboards/StudentDashboard/Suggestions";
import LeaveForm from "./components/Dashboards/StudentDashboard/LeaveForm";
import Complaints from "./components/Dashboards/StudentDashboard/Complaints";
import Settings from "./components/Dashboards/StudentDashboard/Settings";
import Notices from "./components/Dashboards/StudentDashboard/Notices";
import RoomAllocation from "./components/Dashboards/StudentDashboard/RoomAllocation";

import AdminIndex from "./components/Dashboards/AdminDashboard/Index";
import AdminHome from "./components/Dashboards/AdminDashboard/Home/Home"
import RegisterStudent from "./components/Dashboards/AdminDashboard/RegisterStudent";
import AdminAttendance from "./components/Dashboards/AdminDashboard/Attendance";
import AdminComplaints from "./components/Dashboards/AdminDashboard/Complaints";
import AdminInvoices from './components/Dashboards/AdminDashboard/Invoices'
import AdminSuggestions from './components/Dashboards/AdminDashboard/Suggestions'
import AdminLeave from './components/Dashboards/AdminDashboard/Leave'
import AdminSettings from './components/Dashboards/AdminDashboard/Settings'
import AllStudents from "./components/Dashboards/AdminDashboard/AllStudents";
import AdminMess from "./components/Dashboards/AdminDashboard/MessOff";
import Facility from "./components/LandingSite/Facility/Facility";
import AdminNotice from "./components/Dashboards/AdminDashboard/Notice";
import RoomManagement from "./components/Dashboards/AdminDashboard/RoomManagement";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LandingSite />}>
          <Route index element={<LandingPage />} />
          <Route path="about" element={<About />} />
          <Route path="facility" element={<Facility />} />
          <Route path="contact" element={<Contact />} />
          <Route path="auth" element={<Auth />}>
            <Route index element={<SignIn />} />
            <Route path="login" element={<SignIn />} />
            <Route path="request" element={<RequestAcc />} />
            <Route path="admin-login" element={<AdminSignIn />} />
          </Route>
        </Route>
        <Route path="/student-dashboard" element={<Index />}>
          <Route index element={<Home />} />
          <Route path="mess" element={<Mess />  } />
          <Route path="attendance" element={<Attendance/>} />
          <Route path="complaints" element={<Complaints/>} />
          <Route path="suggestions" element={<Suggestions/>} />
          <Route path="leave-form" element={<LeaveForm/>} />
          <Route path="notice-board" element={<Notices/>} />
          <Route path="room-allocation" element={<RoomAllocation/>} />
          <Route path="invoices" element={<Invoices/>} />
          <Route path="settings" element={<Settings/>} />
        </Route>
        <Route path="/admin-dashboard" element={<AdminIndex />}>
          <Route index element={<AdminHome />} />
          <Route path='register-student' element={<RegisterStudent />} />
          <Route path="attendance" element={<AdminAttendance />} />
          <Route path="complaints" element={<AdminComplaints />} />
          <Route path="invoices" element={<AdminInvoices/>} />
          <Route path="suggestions" element={<AdminSuggestions/>} />
          <Route path="leave" element={<AdminLeave/>} />
          <Route path="notice" element={<AdminNotice/>} />
          <Route path="room" element={<RoomManagement/>} />
          <Route path="settings" element={<AdminSettings/>} />
          <Route path="all-students" element={<AllStudents/>}/>
          <Route path="mess" element={<AdminMess />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;

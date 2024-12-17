import { Routes, Route } from "react-router-dom";
import "./App.css";

// admin
import AdminLogin from "./page/auth/admin/login";
import AdminLayout from "./AdminLayout";

// Consult
import ConsultLogin from "./page/auth/consult/login";
import RegistrationForm from "./page/auth/consult/register";

import ConsultLayout from "./consultlayout"; // Import ConsultLayout
import ConsultDashboard from "./page/auth/consult/dashboard/pages/dashboard";







function App() {
  return (
    <div className="App h-full">

      <Routes>
        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
       

        <Route path="/Consult/Login" element={<ConsultLogin />} /> 
        <Route path="/consult/registrationForm" element={<RegistrationForm />} />  

       {/* Consult Routes */}
       <Route path="/consult/login" element={<ConsultLogin />} />
        <Route path="/consult/registrationForm" element={<RegistrationForm />} />
        <Route path="/consult-dashboard" element={<ConsultLayout />} >
          <Route index element={<ConsultDashboard />} /> {/* Default route inside ConsultLayout */}
          {/* ... other consult dashboard routes ... */}
        </Route>
      </Routes>


    </div>
  );
}

export default App;

import React from 'react';
import ConsultDashboard from './page/auth/consult/dashboard/pages/dashboard';
import ConsultSidebar from './page/auth/consult/dashboard/component/sidebar';

const ConsultLayout = () => {
  return (
    <div className="flex">
      <ConsultSidebar />
      <main className="flex-grow">
        <ConsultDashboard />
      </main>
    </div>
  );
};

export default ConsultLayout

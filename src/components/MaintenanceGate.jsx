import { useEffect, useState } from 'react';
import { getPublicAppSettings } from '../services/api';
import MaintenancePage from '../ui/MaintenancePage';
import { useUserRole, USER_ROLES } from '../utils/roleUtils';

function MaintenanceGate({ children }) {
  const { role, isLoaded } = useUserRole();
  const [loading, setLoading] = useState(true);
  const [maintenanceInfo, setMaintenanceInfo] = useState(null);

  useEffect(() => {
    let mounted = true;

    const loadStatus = async () => {
      try {
        const response = await getPublicAppSettings();
        if (mounted) {
          setMaintenanceInfo(response?.data || null);
        }
      } catch {
        if (mounted) {
          setMaintenanceInfo(null);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadStatus();

    return () => {
      mounted = false;
    };
  }, []);

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050816] text-slate-200">
        <div className="rounded-xl border border-white/10 bg-white/5 px-6 py-4 text-sm">
          Checking platform status...
        </div>
      </div>
    );
  }

  const isMaintenance = maintenanceInfo?.maintenanceMode;
  const isAdmin = role === USER_ROLES.ADMIN;

  if (isMaintenance && !isAdmin) {
    return <MaintenancePage siteName={maintenanceInfo?.siteName || 'Kuppi.lk'} />;
  }

  return children;
}

export default MaintenanceGate;
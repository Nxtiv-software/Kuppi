import { RefreshCcw, ShieldAlert } from 'lucide-react';
import { Button } from '../components/Button';

function MaintenancePage({ siteName = 'Kuppi.lk' }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.22),_transparent_35%),linear-gradient(180deg,_#050816_0%,_#0b1020_100%)] px-4">
      <div className="w-full max-w-2xl rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-md text-center">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-500/15 text-orange-300 ring-1 ring-orange-400/30">
          <ShieldAlert className="h-8 w-8" />
        </div>
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-orange-300/90">Maintenance mode</p>
        <h1 className="mt-3 text-3xl font-bold text-white sm:text-4xl">{siteName} is temporarily unavailable</h1>
        <p className="mt-4 text-sm leading-6 text-slate-300 sm:text-base">
          We&apos;re performing scheduled updates and improvements. Please check back soon.
        </p>
        <div className="mt-8 flex justify-center">
          <Button
            onClick={() => window.location.reload()}
            className="gap-2 bg-orange-500 text-white hover:bg-orange-400"
          >
            <RefreshCcw className="h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>
    </div>
  );
}

export default MaintenancePage;
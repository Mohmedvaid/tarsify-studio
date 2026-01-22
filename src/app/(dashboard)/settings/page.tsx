import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Settings',
};

export default function SettingsPage() {
  return (
    <div className="flex items-center justify-center py-20">
      <p className="text-muted-foreground">Settings page - Coming in Phase 7</p>
    </div>
  );
}

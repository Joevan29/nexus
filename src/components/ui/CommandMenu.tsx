'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Command } from 'cmdk';
import { 
  Calculator, 
  Calendar, 
  CreditCard, 
  Settings, 
  User, 
  Map as MapIcon, 
  Box, 
  Truck,
  LayoutDashboard,
  Search
} from 'lucide-react';
import { toast } from 'sonner';

export function CommandMenu() {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const runCommand = (command: () => void) => {
    setOpen(false);
    command();
  };

  return (
    <Command.Dialog
      open={open}
      onOpenChange={setOpen}
      label="Global Command Menu"
      className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[640px] bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden z-[9999] animate-in fade-in zoom-in-95 duration-100 p-2"
    >
      <div className="flex items-center border-b border-slate-100 px-3 pb-2 mb-2">
        <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
        <Command.Input 
          placeholder="Ketik perintah atau cari halaman..." 
          className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-slate-500 disabled:cursor-not-allowed disabled:opacity-50"
        />
      </div>
      
      <Command.List className="max-h-[300px] overflow-y-auto overflow-x-hidden p-1">
        <Command.Empty className="py-6 text-center text-sm text-slate-500">
          Tidak ada hasil ditemukan.
        </Command.Empty>

        <Command.Group heading="Navigasi Utama" className="text-xs font-medium text-slate-500 mb-2 px-2">
          <Item onSelect={() => runCommand(() => router.push('/'))}>
            <LayoutDashboard className="mr-2 h-4 w-4" />
            Dashboard
          </Item>
          <Item onSelect={() => runCommand(() => router.push('/fleet'))}>
            <MapIcon className="mr-2 h-4 w-4" />
            Fleet Map
          </Item>
          <Item onSelect={() => runCommand(() => router.push('/inventory'))}>
            <Box className="mr-2 h-4 w-4" />
            Inventory
          </Item>
          <Item onSelect={() => runCommand(() => router.push('/drivers'))}>
            <Truck className="mr-2 h-4 w-4" />
            Drivers List
          </Item>
        </Command.Group>

        <Command.Group heading="Tindakan Cepat" className="text-xs font-medium text-slate-500 mb-2 px-2 mt-4">
          <Item onSelect={() => runCommand(() => toast.info("Memulai sinkronisasi data..."))}>
            <Calendar className="mr-2 h-4 w-4" />
            Sync Data Manual
          </Item>
          <Item onSelect={() => runCommand(() => toast.warning("Mode Darurat Diaktifkan!"))}>
            <Calculator className="mr-2 h-4 w-4" />
            Emergency Stop
          </Item>
        </Command.Group>

        <Command.Group heading="Pengaturan" className="text-xs font-medium text-slate-500 mb-2 px-2 mt-4">
          <Item onSelect={() => runCommand(() => router.push('/settings'))}>
            <User className="mr-2 h-4 w-4" />
            Profile
          </Item>
          <Item onSelect={() => runCommand(() => router.push('/settings'))}>
            <CreditCard className="mr-2 h-4 w-4" />
            Billing
          </Item>
          <Item onSelect={() => runCommand(() => router.push('/settings'))}>
            <Settings className="mr-2 h-4 w-4" />
            System Settings
          </Item>
        </Command.Group>
      </Command.List>
      
      <div className="border-t border-slate-100 py-2 px-4 text-[10px] text-slate-400 flex justify-between">
        <span>NEXUS Command</span>
        <span>Esc untuk tutup</span>
      </div>
    </Command.Dialog>
  );
}

function Item({ children, onSelect }: { children: React.ReactNode, onSelect: () => void }) {
  return (
    <Command.Item
      onSelect={onSelect}
      className="relative flex cursor-default select-none items-center rounded-lg px-3 py-2.5 text-sm text-slate-700 outline-none data-[selected=true]:bg-slate-100 data-[selected=true]:text-slate-900 transition-colors cursor-pointer"
    >
      {children}
    </Command.Item>
  );
}
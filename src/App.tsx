import React, { useState, useEffect, useRef } from 'react';

// =====================================================================
// 🛠️ ZONA MODIFIKASI: KONFIGURASI NAMA SISTEM
// =====================================================================
const APP_CONFIG = {
  namaSistem: "SIDE TERMINAL",     
  versi: "v5.0.1-stable-core",
  koordinat: "LAT -0.9492° S, LON 100.3543° E (Padang, ID)", 
  userTerminal: "takerevenge@1120",      
};

// =====================================================================
// 🎨 PALET TEMA CYBERPUNK & HACKER
// =====================================================================
const THEMES = {
  hacker: { id: 'hacker', name: 'MATRIX GREEN', text: 'text-emerald-400', border: 'border-emerald-700', bgHover: 'hover:bg-emerald-900/40', glow: 'shadow-[0_0_15px_rgba(52,211,153,0.2)]', hex: '#34d399', ring: 'focus:ring-emerald-500' },
  cyberpunk: { id: 'cyberpunk', name: 'NEON PINK', text: 'text-fuchsia-400', border: 'border-fuchsia-700', bgHover: 'hover:bg-fuchsia-900/40', glow: 'shadow-[0_0_15px_rgba(232,121,249,0.2)]', hex: '#e879f9', ring: 'focus:ring-fuchsia-500' },
  netrunner: { id: 'netrunner', name: 'CYBER CYAN', text: 'text-cyan-400', border: 'border-cyan-700', bgHover: 'hover:bg-cyan-900/40', glow: 'shadow-[0_0_15px_rgba(34,211,238,0.2)]', hex: '#22d3ee', ring: 'focus:ring-cyan-500' },
  corpo: { id: 'corpo', name: 'AMBER GOLD', text: 'text-amber-400', border: 'border-amber-700', bgHover: 'hover:bg-amber-900/40', glow: 'shadow-[0_0_15px_rgba(251,191,36,0.2)]', hex: '#fbbf24', ring: 'focus:ring-amber-500' },
};

interface DataTerminal {
  idLog: string;
  namaAlias: string;
  role: string;
  tingkatAkses: string;
  waktuInput: string;
}

export default function App() {
  const [dataLokal, setDataLokal] = useState<DataTerminal[]>(() => {
    const simpanan = localStorage.getItem('dataWebTerminal');
    return simpanan ? JSON.parse(simpanan) : [];
  });

  const [formInput, setFormInput] = useState({ namaAlias: '', role: '', tingkatAkses: 'Standard' });
  const [kataKunci, setKataKunci] = useState('');
  const [logSistem, setLogSistem] = useState<string[]>(['> SYSTEM BOOT SEQUENCE INITIATED...', '> SECURE UPLINK ESTABLISHED.']);
  
  const [lagiLoading, setLagiLoading] = useState(false);
  const [lagiInjecting, setLagiInjecting] = useState(false); 
  const [idEdit, setIdEdit] = useState<string | null>(null);
  const [isEncrypted, setIsEncrypted] = useState(false); 
  const [isScanning, setIsScanning] = useState(false); 
  const [integrityScore, setIntegrityScore] = useState(100);

  const [networkTraffic, setNetworkTraffic] = useState<string[]>([]);
  const [activeTheme, setActiveTheme] = useState(THEMES.hacker);

  const logBawahRef = useRef<HTMLDivElement>(null);

  useEffect(() => { logBawahRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [logSistem]);
  useEffect(() => { localStorage.setItem('dataWebTerminal', JSON.stringify(dataLokal)); }, [dataLokal]);

  useEffect(() => {
    const interval = setInterval(() => {
      const hex = Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, '0').toUpperCase();
      const ip = `192.168.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}`;
      const status = Math.random() > 0.85 ? 'BLOCKED' : 'ALLOW';
      setNetworkTraffic(prev => [...prev.slice(-4), `[0x${hex}] ${ip} - ${status}`]);
    }, 400);
    return () => clearInterval(interval);
  }, []);

  const handleKetik = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormInput({ ...formInput, [e.target.name]: e.target.value });
  };

  const downloadData = (format: 'csv' | 'json') => {
    if (dataLokal.length === 0) return alert("Database kosong!");
    
    let blob, filename;
    const tglExport = new Date().toISOString().split('T')[0];

    if (format === 'csv') {
      const header = ["ID_Log", "Nama_Alias", "Role", "Tingkat_Akses", "Waktu_Input"];
      const barisCsv = dataLokal.map(item => `"${item.idLog}","${item.namaAlias}","${item.role}","${item.tingkatAkses}","${item.waktuInput}"`);
      blob = new Blob([[header.join(','), ...barisCsv].join('\n')], { type: 'text/csv;charset=utf-8;' });
      filename = `DB_DUMP_${tglExport}.csv`;
    } else {
      blob = new Blob([JSON.stringify(dataLokal, null, 2)], { type: 'application/json' });
      filename = `DB_DUMP_${tglExport}.json`;
    }

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url; link.download = filename; 
    document.body.appendChild(link); link.click(); document.body.removeChild(link);
    setLogSistem(prev => [...prev, `> SUKSES: Data di-export ke format .${format.toUpperCase()}`]);
  };

  const runSystemScan = () => {
    setIsScanning(true);
    setLogSistem(prev => [...prev, `> INITIATING DEEP SYSTEM SCAN...`, `> CHECKING DATA BLOCKS...`]);
    setTimeout(() => {
      const score = dataLokal.length === 0 ? 100 : (100 - (Math.random() * 5)).toFixed(2);
      setIntegrityScore(Number(score));
      setIsScanning(false);
      setLogSistem(prev => [...prev, `> SCAN COMPLETE. INTEGRITY: ${score}%`]);
    }, 2000);
  };

  const mulaiEdit = (item: DataTerminal) => {
    setIdEdit(item.idLog);
    setFormInput({ namaAlias: item.namaAlias, role: item.role, tingkatAkses: item.tingkatAkses });
    setLogSistem(prev => [...prev, `> OVERRIDE PROTOCOL ACTIVATED FOR: ${item.idLog}`]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSimpanData = (e: React.FormEvent) => {
    e.preventDefault(); setLagiLoading(true);
    setLogSistem(prev => [...prev, `> ${idEdit ? 'Patching' : 'Injecting'} entitas: ${formInput.namaAlias}...`]);
    
    setTimeout(() => {
      if (idEdit) {
        setDataLokal(dataLokal.map(item => item.idLog === idEdit ? { ...item, ...formInput, waktuInput: new Date().toLocaleTimeString('id-ID', { hour12: false }) + ' (MODIFIED)' } : item));
        setLogSistem(prev => [...prev, `> DATA ${idEdit} SECURELY UPDATED.`]);
        setIdEdit(null);
      } else {
        setDataLokal([{ ...formInput, idLog: `SYS-${Math.floor(Math.random() * 90000) + 10000}`, waktuInput: new Date().toLocaleTimeString('id-ID', { hour12: false }) }, ...dataLokal]);
        setLogSistem(prev => [...prev, `> NEW DATA RECORDED.`]);
      }
      setFormInput({ namaAlias: '', role: '', tingkatAkses: 'Standard' });
      setLagiLoading(false);
    }, 800);
  };

  const injectDummyData = () => {
    setLagiInjecting(true);
    setLogSistem(prev => [...prev, `> EXECUTING MASS PAYLOAD...`]);
    const namaRandom = ["V", "Johnny_Silverhand", "Alt_Cunningham", "Panam", "Judy_A", "Motoko", "Batou", "Zero_Cool", "Acid_Burn", "Crash_Override"];
    const roleRandom = ["Netrunner", "Solo", "Techie", "Fixer", "Ripperdoc", "Corporate Spy"];
    const aksesRandom = ["Standard", "Moderator", "Admin", "Root"];
    
    setTimeout(() => {
      const dummyPayloads: DataTerminal[] = Array.from({ length: 5 }).map(() => ({
        idLog: `SYS-${Math.floor(Math.random() * 90000) + 10000}`,
        namaAlias: namaRandom[Math.floor(Math.random() * namaRandom.length)] + `_${Math.floor(Math.random() * 100)}`,
        role: roleRandom[Math.floor(Math.random() * roleRandom.length)],
        tingkatAkses: aksesRandom[Math.floor(Math.random() * aksesRandom.length)],
        waktuInput: new Date().toLocaleTimeString('id-ID', { hour12: false }),
      }));
      setDataLokal(prev => [...dummyPayloads, ...prev]);
      setLogSistem(prev => [...prev, `> 5 DUMMY RECORDS INJECTED.`]);
      setLagiInjecting(false);
    }, 1200);
  };

  const handleHapus = (id: string) => {
    setDataLokal(dataLokal.filter(item => item.idLog !== id));
    setLogSistem(prev => [...prev, `> PURGED: ${id}`]);
  };

  const handlePurgeDatabase = () => {
    if (window.confirm("☢️ INITIATE ZERO DAWN PROTOCOL? ALL DATA WILL BE DESTROYED.")) {
      setDataLokal([]); setLogSistem(prev => [...prev, `> CRITICAL: DATABASE WIPED.`]);
      setIntegrityScore(100);
    }
  };

  const dataTampil = dataLokal.filter(item => 
    item.namaAlias.toLowerCase().includes(kataKunci.toLowerCase()) || 
    item.role.toLowerCase().includes(kataKunci.toLowerCase()) ||
    item.idLog.toLowerCase().includes(kataKunci.toLowerCase())
  );

  const maskText = (text: string) => isEncrypted ? text.replace(/[a-zA-Z0-9]/g, '*') : text;

  // VARIABEL YANG ERROR SEBELUMNYA KITA PAKE DI SINI:
  const totalRoot = dataLokal.filter(d => d.tingkatAkses === 'Root').length;
  const totalAdmin = dataLokal.filter(d => d.tingkatAkses === 'Admin').length;

  return (
    <div className={`h-screen bg-slate-950 font-mono ${activeTheme.text} flex flex-col selection:bg-slate-800 overflow-hidden relative transition-colors duration-500`}>
      
      <style>
        {`
          @keyframes marquee { 0% { transform: translateX(100%); } 100% { transform: translateX(-100%); } }
          .animate-marquee { display: inline-block; white-space: nowrap; animation: marquee 20s linear infinite; }
          .custom-scrollbar::-webkit-scrollbar { width: 4px; }
          .custom-scrollbar::-webkit-scrollbar-track { background: rgba(0, 0, 0, 0.3); }
          .custom-scrollbar::-webkit-scrollbar-thumb { background: ${activeTheme.hex}; }
          
          .glitch-text { position: relative; display: inline-block; }
          .glitch-text::before, .glitch-text::after {
            content: attr(data-text); position: absolute; top: 0; left: 0; width: 100%; height: 100%; opacity: 0.8;
          }
          .glitch-text::before { left: 2px; text-shadow: -2px 0 red; clip: rect(24px, 550px, 90px, 0); animation: glitch-anim 3s infinite linear alternate-reverse; }
          .glitch-text::after { left: -2px; text-shadow: -2px 0 blue; clip: rect(85px, 550px, 140px, 0); animation: glitch-anim 2.5s infinite linear alternate-reverse; }
          @keyframes glitch-anim {
            0% { clip: rect(10px, 9999px, 44px, 0); }
            20% { clip: rect(80px, 9999px, 12px, 0); }
            40% { clip: rect(20px, 9999px, 90px, 0); }
            60% { clip: rect(90px, 9999px, 30px, 0); }
            80% { clip: rect(40px, 9999px, 70px, 0); }
            100% { clip: rect(60px, 9999px, 10px, 0); }
          }
        `}
      </style>

      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] z-0"></div>
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.4)_50%)] bg-[length:100%_4px] z-50"></div>
      
      <div className={`w-full overflow-hidden border-b ${activeTheme.border} bg-black/60 backdrop-blur-sm text-[10px] py-1 shrink-0 relative z-10 font-bold tracking-widest`}>
        <div className="animate-marquee">
          ⚠️ UNAUTHORIZED ACCESS DETECTED // FIREWALL BREACHED // CYBER-WARFARE PROTOCOLS ENGAGED // ENCRYPTING LOCAL FRAGMENTS // DO NOT TURN OFF TERMINAL ⚠️
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6 custom-scrollbar relative z-10 flex flex-col">
        <header className={`max-w-7xl w-full mx-auto mb-8 border-b ${activeTheme.border} pb-4 flex flex-col md:flex-row justify-between items-start md:items-end shrink-0 gap-4`}>
          <div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase mb-1">
              <span className="glitch-text" data-text={APP_CONFIG.namaSistem}>{APP_CONFIG.namaSistem}</span> 
              <span className="animate-pulse ml-2 opacity-50">_</span>
            </h1>
            <p className="text-xs tracking-[0.2em] opacity-80 uppercase">CORE V.5 ULTIMATE NETWORK // {APP_CONFIG.versi}</p>
          </div>
          
          <div className="flex flex-col items-end gap-2">
            <div className="text-[10px] uppercase tracking-widest opacity-60">UI_COLOR_SCHEME</div>
            <div className="flex gap-2">
              {Object.values(THEMES).map(theme => (
                <button 
                  key={theme.id} onClick={() => setActiveTheme(theme)}
                  className={`w-6 h-6 border ${activeTheme.id === theme.id ? 'border-white scale-110 shadow-[0_0_10px_rgba(255,255,255,0.5)]' : 'border-transparent opacity-50'} transition-all hover:scale-110`}
                  style={{ backgroundColor: theme.hex }} title={theme.name}
                />
              ))}
            </div>
            <div className="text-[10px] uppercase mt-1">SYS: <span className="font-bold animate-pulse text-red-500">BREACHED</span> | LOC: {APP_CONFIG.koordinat}</div>
          </div>
        </header>

        <main className="max-w-7xl w-full mx-auto flex-1 flex flex-col lg:flex-row gap-6 min-h-0">
          
          {/* PANEL KIRI (FORM & DIAGNOSTICS) */}
          <section className="w-full lg:w-[400px] shrink-0 flex flex-col gap-4 overflow-y-auto custom-scrollbar pr-2">
            
            <div className={`bg-slate-950/80 backdrop-blur-md border p-5 relative transition-all duration-500
              ${idEdit ? 'border-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.4)] bg-amber-950/20' : `${activeTheme.border} ${activeTheme.glow}`}`}>
              
              <div className={`text-xs mb-6 border-b ${idEdit ? 'border-amber-500/50' : activeTheme.border} pb-2 flex justify-between uppercase tracking-widest`}>
                <span className={idEdit ? 'text-amber-500 font-bold animate-pulse' : 'opacity-80'}>
                  {APP_CONFIG.userTerminal} {idEdit ? `UPDATE_MODE --target=${idEdit}` : 'INSERT_MODE'}
                </span>
                {idEdit && <button onClick={() => { setIdEdit(null); setFormInput({ namaAlias: '', role: '', tingkatAkses: 'Standard' }); }} className="text-amber-500 hover:text-white font-bold">[ABORT_EDIT]</button>}
              </div>

              <form onSubmit={handleSimpanData} className="space-y-6">
                <div className="group">
                  <span className="text-[10px] uppercase tracking-widest block mb-1 opacity-70 group-focus-within:opacity-100">Alias_Tag</span>
                  <input 
                    type="text" name="namaAlias" required autoComplete="off" value={formInput.namaAlias} onChange={handleKetik} 
                    className={`w-full bg-black/50 border-b ${idEdit ? 'border-amber-500/50' : activeTheme.border} outline-none text-sm px-2 py-2 transition-colors ${idEdit ? 'focus:border-amber-500 text-amber-100' : `${activeTheme.ring} focus:border-transparent focus:ring-1`} focus:bg-white/5`}
                    placeholder="Insert codename..."
                  />
                </div>

                <div className="group">
                  <span className="text-[10px] uppercase tracking-widest block mb-1 opacity-70 group-focus-within:opacity-100">Class_Role</span>
                  <input 
                    type="text" name="role" required autoComplete="off" value={formInput.role} onChange={handleKetik} 
                    className={`w-full bg-black/50 border-b ${idEdit ? 'border-amber-500/50' : activeTheme.border} outline-none text-sm px-2 py-2 transition-colors ${idEdit ? 'focus:border-amber-500 text-amber-100' : `${activeTheme.ring} focus:border-transparent focus:ring-1`} focus:bg-white/5`}
                    placeholder="e.g. Netrunner..."
                  />
                </div>

                <div className="group">
                  <span className="text-[10px] uppercase tracking-widest block mb-1 opacity-70 group-focus-within:opacity-100">Sec_Clearance</span>
                  <select 
                    name="tingkatAkses" value={formInput.tingkatAkses} onChange={handleKetik} 
                    className={`w-full bg-black/50 border-b ${idEdit ? 'border-amber-500/50' : activeTheme.border} outline-none text-sm px-2 py-2 appearance-none cursor-pointer ${idEdit ? 'focus:border-amber-500 text-amber-100' : `${activeTheme.ring} focus:border-transparent focus:ring-1`}`}
                  >
                    <option className="bg-slate-900" value="Standard">Level 1 - Standard</option>
                    <option className="bg-slate-900" value="Moderator">Level 2 - Moderator</option>
                    <option className="bg-slate-900" value="Admin">Level 3 - Admin</option>
                    <option className="bg-slate-900" value="Root">Level 4 - ROOT</option>
                  </select>
                </div>

                <div className="pt-2 grid grid-cols-1 gap-3">
                  <button 
                    type="submit" disabled={lagiLoading || lagiInjecting}
                    className={`w-full bg-black/40 border py-3 text-sm tracking-widest uppercase transition-all font-black shadow-lg
                    ${idEdit ? `border-amber-500 text-amber-400 hover:bg-amber-900/60` : `${activeTheme.border} ${activeTheme.text} ${activeTheme.bgHover} hover:scale-[1.02]`}`}
                  >
                    {lagiLoading ? '[ PROCESSING... ]' : (idEdit ? '[ CONFIRM OVERRIDE ]' : '[ EXECUTE RECORD ]')}
                  </button>

                  {!idEdit && (
                    <button 
                      type="button" onClick={injectDummyData} disabled={lagiLoading || lagiInjecting}
                      className={`w-full bg-slate-900 border border-slate-700 hover:border-white text-slate-300 py-2 text-[10px] tracking-widest transition-all uppercase`}
                    >
                      {lagiInjecting ? 'UPLOADING...' : 'AUTO-INJECT DUMMY PAYLOAD'}
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* MENGGUNAKAN VARIABEL NETWORK TRAFFIC AGAR TIDAK ERROR TS6133 */}
            <div className={`bg-black/40 border ${activeTheme.border} p-3 text-[9px] tracking-widest opacity-60 h-24 overflow-hidden flex flex-col justify-end shrink-0`}>
              {networkTraffic.map((traffic, i) => (
                <div key={i} className="mb-0.5">{traffic}</div>
              ))}
            </div>

            {/* MENGGUNAKAN VARIABEL TOTAL ROOT & ADMIN AGAR TIDAK ERROR TS6133 */}
            <div className={`bg-slate-950/80 border ${activeTheme.border} p-4 flex flex-col gap-3 backdrop-blur-md shrink-0`}>
              <div className="flex justify-between items-center border-b border-slate-800 pb-1 mb-1">
                <span className="text-[10px] uppercase tracking-widest">SYSTEM_DIAGNOSTICS</span>
                <button onClick={runSystemScan} disabled={isScanning} className="text-[9px] bg-slate-800 hover:bg-slate-700 px-2 py-0.5 rounded text-white transition-colors">
                  {isScanning ? 'SCANNING...' : 'RUN SCAN'}
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="flex justify-between text-[9px] mb-1"><span>STORAGE</span> <span>{dataLokal.length}/999</span></div>
                  <div className="h-1 bg-slate-900 w-full"><div className="h-full bg-white transition-all" style={{ width: `${Math.min((dataLokal.length/999)*100, 100)}%` }}></div></div>
                </div>
                <div>
                  <div className="flex justify-between text-[9px] mb-1 text-cyan-400"><span>INTEGRITY</span> <span>{integrityScore}%</span></div>
                  <div className="h-1 bg-slate-900 w-full"><div className={`h-full ${integrityScore < 100 ? 'bg-orange-500' : 'bg-cyan-500'} transition-all`} style={{ width: `${integrityScore}%` }}></div></div>
                </div>
                <div>
                  <div className="flex justify-between text-[9px] mb-1 text-red-400"><span>ROOT_ACC</span> <span>{totalRoot}</span></div>
                  <div className="h-1 bg-slate-900 w-full"><div className="h-full bg-red-500 transition-all" style={{ width: `${dataLokal.length === 0 ? 0 : (totalRoot/dataLokal.length)*100}%` }}></div></div>
                </div>
                <div>
                  <div className="flex justify-between text-[9px] mb-1 text-orange-400"><span>ADMIN_ACC</span> <span>{totalAdmin}</span></div>
                  <div className="h-1 bg-slate-900 w-full"><div className="h-full bg-orange-500 transition-all" style={{ width: `${dataLokal.length === 0 ? 0 : (totalAdmin/dataLokal.length)*100}%` }}></div></div>
                </div>
              </div>
            </div>
          </section>

          {/* PANEL KANAN (DATABANK) */}
          <section className="flex-1 flex flex-col gap-4 min-w-0">
            
            <div className={`flex flex-col xl:flex-row justify-between items-start xl:items-end border-b ${activeTheme.border} pb-4 gap-4 shrink-0`}>
              <div className="flex-1 w-full relative">
                <span className="text-[10px] uppercase opacity-70 mb-1 block tracking-widest">QUERY_DATABANK</span>
                <input 
                  type="text" placeholder="Search parameters..." value={kataKunci} onChange={(e) => setKataKunci(e.target.value)}
                  className={`w-full bg-black/50 border border-slate-800 outline-none text-sm py-2 px-3 transition-colors ${activeTheme.ring} focus:border-transparent focus:ring-1`}
                />
              </div>
              
              <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap w-full xl:w-auto">
                <button onClick={() => setIsEncrypted(!isEncrypted)} className={`flex-1 sm:flex-none text-xs border border-slate-600 ${isEncrypted ? 'bg-white text-black' : 'hover:bg-slate-800'} px-3 py-2 font-bold uppercase tracking-widest transition-colors`}>
                  {isEncrypted ? '🔓 DECRYPT' : '🔒 ENCRYPT'}
                </button>
                <button onClick={() => downloadData('csv')} className={`flex-1 sm:flex-none text-xs border ${activeTheme.border} ${activeTheme.bgHover} px-3 py-2 font-bold uppercase tracking-widest`}>
                  DUMP .CSV
                </button>
                <button onClick={() => downloadData('json')} className={`flex-1 sm:flex-none text-xs border ${activeTheme.border} ${activeTheme.bgHover} px-3 py-2 font-bold uppercase tracking-widest`}>
                  DUMP .JSON
                </button>
                <button onClick={handlePurgeDatabase} className={`flex-1 sm:flex-none text-xs border border-red-900 bg-red-950/30 text-red-500 hover:bg-red-900 hover:text-white px-3 py-2 font-bold uppercase tracking-widest transition-colors`}>
                  ☢️ NUKE
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar pb-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {dataTampil.length === 0 ? (
                  <div className="col-span-full flex flex-col items-center justify-center h-48 border border-dashed border-slate-800 text-slate-600 text-[10px] tracking-[0.3em] uppercase animate-pulse">
                    <span>[ DATABANK_EMPTY ]</span>
                    <span className="mt-2 text-red-900 text-[8px]">AWAITING DATA PACKETS</span>
                  </div>
                ) : (
                  dataTampil.map((item) => (
                    <div key={item.idLog} className={`bg-slate-950/60 backdrop-blur-sm border p-5 hover:border-slate-400 transition-all duration-300 relative group overflow-hidden 
                      ${idEdit === item.idLog ? 'border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.3)] bg-amber-950/30' : 'border-slate-800'}`}>
                      
                      {idEdit === item.idLog && (
                        <div className="absolute inset-0 border-2 border-amber-500 animate-pulse pointer-events-none z-0"></div>
                      )}

                      <div className="absolute -right-4 -top-4 text-[60px] font-black opacity-[0.03] select-none pointer-events-none group-hover:opacity-[0.06] transition-opacity">
                        {item.idLog.split('-')[1]}
                      </div>

                      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 flex gap-2 transition-opacity bg-black/90 px-2 py-1 rounded backdrop-blur-md z-20 border border-slate-700">
                        <button onClick={() => mulaiEdit(item)} className="text-amber-400 hover:text-white font-bold text-[10px] tracking-widest bg-amber-900/30 px-2 py-0.5 rounded">[EDIT]</button>
                        <button onClick={() => handleHapus(item.idLog)} className="text-red-500 hover:text-white font-bold text-[10px] tracking-widest bg-red-900/30 px-2 py-0.5 rounded">[DEL]</button>
                      </div>

                      <div className="flex justify-between items-start mb-4 relative z-10">
                        <span className={`text-[10px] bg-black px-2 py-0.5 border ${activeTheme.border}`}>{item.idLog}</span>
                        <span className="text-[9px] opacity-60 tracking-widest">{item.waktuInput}</span>
                      </div>
                      
                      <h3 className={`text-xl font-black uppercase truncate relative z-10 transition-all ${isEncrypted ? 'text-slate-500 tracking-[0.5em]' : 'text-white group-hover:pl-2'}`}>
                        {maskText(item.namaAlias)}
                      </h3>
                      
                      <div className={`text-[10px] mt-1 uppercase tracking-widest relative z-10 ${isEncrypted ? 'text-slate-600' : 'opacity-60'}`}>
                        CLASS: {maskText(item.role)}
                      </div>
                      
                      <div className={`mt-5 pt-3 border-t border-slate-800 flex justify-between items-center relative z-10`}>
                        <span className="text-[9px] opacity-50 tracking-widest">CLEARANCE:</span>
                        <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 bg-black border
                          ${item.tingkatAkses === 'Root' ? 'border-red-500 text-red-500 animate-pulse' : 
                            item.tingkatAkses === 'Admin' ? 'border-orange-500 text-orange-400' : 
                            `border-slate-700 text-slate-400`}
                        `}>
                          {isEncrypted ? '****' : item.tingkatAkses}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </section>
        </main>
      </div>

      <div className={`fixed bottom-4 left-4 w-72 bg-black/90 border ${activeTheme.border} p-3 text-[9px] tracking-widest opacity-80 backdrop-blur-md hidden lg:flex flex-col z-50`}>
        <div className="border-b border-slate-800 pb-1 mb-2 flex justify-between">
          <span>TERMINAL_OUTPUT</span>
          <span className="text-red-500 animate-pulse">REC</span>
        </div>
        <div className="h-20 overflow-y-auto custom-scrollbar pr-1 flex flex-col justify-end">
          {logSistem.slice(-10).map((log, i) => <div key={i} className="mb-0.5">{log}</div>)}
          <div ref={logBawahRef} />
        </div>
      </div>
    </div>
  );
}
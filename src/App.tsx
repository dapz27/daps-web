import React, { useState, useEffect, useRef } from 'react';

// =====================================================================
// 🛠️ ZONA MODIFIKASI: KAMU BISA RUBAH TULISAN DI BAWAH INI SESUAI SELERA
// =====================================================================
const APP_CONFIG = {
  namaSistem: "SIDE TERMINAL",     
  versi: "v2.0.0-hacker-edition",
  koordinat: "LAT -0.9492° S, LON 100.3543° E (Padang, ID)", 
  userTerminal: "takerevenge@1120",      
  temaWarna: "text-emerald-400",      
  borderWarna: "border-emerald-700",  
  bgHover: "hover:bg-emerald-900/40", 
};
// =====================================================================

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

  const [formInput, setFormInput] = useState({
    namaAlias: '',
    role: '',
    tingkatAkses: 'Standard',
  });

  const [kataKunci, setKataKunci] = useState('');
  const [logSistem, setLogSistem] = useState<string[]>(['> jalankan sistemnya :)...', '> Koneksi berhasil dibangun @.']);
  const [lagiLoading, setLagiLoading] = useState(false);
  
  // STATE BARU: Untuk tulisan bergerak / Network Traffic yang jalan otomatis
  const [networkTraffic, setNetworkTraffic] = useState<string[]>([]);

  const logBawahRef = useRef<HTMLDivElement>(null);

  // Auto scroll log terminal
  useEffect(() => {
    logBawahRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logSistem]);

  // Simpan ke local storage
  useEffect(() => {
    localStorage.setItem('dataWebTerminal', JSON.stringify(dataLokal));
  }, [dataLokal]);

  // FUNGSI BARU: Bikin teks Hex & IP bergerak otomatis ala Hacker
  useEffect(() => {
    const interval = setInterval(() => {
      const hex = Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, '0').toUpperCase();
      const ip = `192.168.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}`;
      const port = Math.floor(Math.random() * 9000) + 1000;
      const status = Math.random() > 0.8 ? 'DENIED' : 'OK';
      
      setNetworkTraffic(prev => {
        const newLog = [...prev, `[0x${hex}] PING ${ip}:${port} - ${status}`];
        return newLog.slice(-5); // Cuma nampilin 5 baris terakhir biar gak kepanjangan
      });
    }, 600); // Kecepatan gerak (600ms)

    return () => clearInterval(interval);
  }, []);

  const handleKetik = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormInput({ ...formInput, [e.target.name]: e.target.value });
  };

  const downloadCSVLokal = (seluruhData: DataTerminal[]) => {
    if (seluruhData.length === 0) {
      alert("Database kosong, tidak ada yang bisa di-export!");
      return;
    }
    const header = ["ID_Log", "Nama_Alias", "Role", "Tingkat_Akses", "Waktu_Input"];
    const barisCsv = seluruhData.map(item => `"${item.idLog}","${item.namaAlias}","${item.role}","${item.tingkatAkses}","${item.waktuInput}"`);
    const isiFileCsv = [header.join(','), ...barisCsv].join('\n');

    const blob = new Blob([isiFileCsv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const linkBantuan = document.createElement('a');
    linkBantuan.href = url;
    const tglExport = new Date().toISOString().split('T')[0];
    linkBantuan.download = `DATASET_EXPORT_${tglExport}.csv`; 
    
    document.body.appendChild(linkBantuan);
    linkBantuan.click();
    document.body.removeChild(linkBantuan);
    URL.revokeObjectURL(url);
  };

  const handleSimpanData = (e: React.FormEvent) => {
    e.preventDefault();
    setLagiLoading(true);
    setLogSistem(prev => [...prev, `> Memproses entitas: ${formInput.namaAlias}...`, '> Kompilasi data ke format CSV...']);

    setTimeout(() => {
      const entriBaru: DataTerminal = {
        ...formInput,
        idLog: `LOG-${Math.floor(Math.random() * 90000) + 10000}`,
        waktuInput: new Date().toLocaleTimeString('id-ID', { hour12: false }),
      };

      const dataTerupdate = [entriBaru, ...dataLokal];
      setDataLokal(dataTerupdate);
      downloadCSVLokal(dataTerupdate);

      setLogSistem(prev => [...prev, `> SUKSES: Data tersimpan di memori lokal.`, `> SUKSES: Dataset CSV diekspor.`]);
      setFormInput({ namaAlias: '', role: '', tingkatAkses: 'Standard' });
      setLagiLoading(false);
    }, 1200);
  };

  const handleHapus = (idYgMauDihapus: string) => {
    setDataLokal(dataLokal.filter(item => item.idLog !== idYgMauDihapus));
    setLogSistem(prev => [...prev, `> WARNING: Data ${idYgMauDihapus} telah dihapus dari sistem.`]);
  };

  const handlePurgeDatabase = () => {
    const konfirmasi = window.confirm("⚠️ PERINGATAN KRITIS: MENGHAPUS SELURUH DATABASE? Tindakan ini tidak bisa dibatalkan.");
    if (konfirmasi) {
      setDataLokal([]);
      setLogSistem(prev => [...prev, `> CRITICAL: SELURUH DATABASE TELAH DIKOSONGKAN (PURGED).`]);
    }
  };

  const dataTampil = dataLokal.filter(item => 
    item.namaAlias.toLowerCase().includes(kataKunci.toLowerCase()) || 
    item.role.toLowerCase().includes(kataKunci.toLowerCase()) ||
    item.idLog.toLowerCase().includes(kataKunci.toLowerCase())
  );

  return (
    <div className={`min-h-screen bg-black font-mono ${APP_CONFIG.temaWarna} p-4 md:p-8 selection:bg-emerald-900 overflow-hidden relative`}>
      
      {/* Custom CSS Animasi Marquee & Scanline */}
      <style>
        {`
          @keyframes marquee {
            0% { transform: translateX(100%); }
            100% { transform: translateX(-100%); }
          }
          .animate-marquee {
            display: inline-block;
            white-space: nowrap;
            animation: marquee 15s linear infinite;
          }
        `}
      </style>

      {/* Efek Garis TV Tabung */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] z-50"></div>
      
      {/* Teks Berjalan di Atas (Marquee Ticker) */}
      <div className={`w-full overflow-hidden border-b ${APP_CONFIG.borderWarna} bg-emerald-950/30 text-xs py-1 mb-4 relative z-10 font-bold tracking-widest text-emerald-300`}>
        <div className="animate-marquee">
          ⚠️ UR DEVICE IS NOT SAFE // SECURE CONNECTION ACTIVE // MONITORING INCOMING TRAFFIC // ENCRYPTION KEYS VALID // AWAITING COMMAND PROTOCOL // BE AWARE ON SOSMED // CRIMINAL IS EVERYWHERE ⚠️
        </div>
      </div>

      <header className={`max-w-7xl mx-auto mb-6 border-b ${APP_CONFIG.borderWarna} pb-4 flex justify-between items-end relative z-10`}>
        <div>
          <h1 className="text-4xl font-black tracking-tighter drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]">
            {APP_CONFIG.namaSistem} <span className="animate-pulse">_</span>
          </h1>
          <p className="text-xs mt-2 tracking-[0.2em] opacity-80">SECURE DATA COLLECTION // {APP_CONFIG.versi}</p>
        </div>
        <div className="text-right hidden md:block text-xs opacity-80">
          <div>LOC: {APP_CONFIG.koordinat}</div>
          <div>STATUS: <span className="font-bold animate-pulse text-red-500">MONITORING</span></div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10">
        
        {/* Panel Kiri (Form Input & Live Traffic) */}
        <section className="lg:col-span-5 flex flex-col gap-4">
          <div className={`bg-black border ${APP_CONFIG.borderWarna} p-5 shadow-[0_0_15px_rgba(6,78,59,0.2)] flex-1 relative`}>
            
            <div className={`text-xs mb-4 border-b ${APP_CONFIG.borderWarna} pb-2 opacity-80 flex justify-between`}>
              <span>{APP_CONFIG.userTerminal} ./jalankan_script.sh</span>
            </div>

            <form onSubmit={handleSimpanData} className="space-y-5 mt-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <span className="text-sm whitespace-nowrap w-24">Nama_Alias:</span>
                <input 
                  type="text" name="namaAlias" required autoComplete="off"
                  value={formInput.namaAlias} onChange={handleKetik} 
                  className={`flex-1 bg-transparent border-b ${APP_CONFIG.borderWarna} outline-none placeholder-emerald-800/50 text-sm focus:border-emerald-400 px-2 py-1 transition-colors`}
                  placeholder="Masukkan nama..."
                />
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <span className="text-sm whitespace-nowrap w-24">Role_Kerja:</span>
                <input 
                  type="text" name="role" required autoComplete="off"
                  value={formInput.role} onChange={handleKetik} 
                  className={`flex-1 bg-transparent border-b ${APP_CONFIG.borderWarna} outline-none placeholder-emerald-800/50 text-sm focus:border-emerald-400 px-2 py-1 transition-colors`}
                  placeholder="Misal: Data Engineer..."
                />
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <span className="text-sm whitespace-nowrap w-24">Akses_Lvl:</span>
                <select 
                  name="tingkatAkses" value={formInput.tingkatAkses} onChange={handleKetik} 
                  className={`flex-1 bg-transparent border border-emerald-800/50 outline-none text-sm p-1 appearance-none cursor-pointer focus:border-emerald-500`}
                >
                  <option className="bg-black text-emerald-500" value="Standard">Standard User</option>
                  <option className="bg-black text-emerald-500" value="Moderator">Moderator</option>
                  <option className="bg-black text-emerald-500" value="Admin">Administrator</option>
                  <option className="bg-black text-emerald-500" value="Root">Root (Superuser)</option>
                </select>
              </div>

              <div className={`pt-4 mt-6`}>
                <button 
                  type="submit" disabled={lagiLoading}
                  className={`w-full bg-transparent border border-emerald-700 ${APP_CONFIG.bgHover} py-2 text-sm tracking-widest transition-all focus:ring-2 focus:ring-emerald-500 font-bold`}
                >
                  {lagiLoading ? '[ MEMPROSES... ]' : '[ EKSEKUSI & EXPORT CSV ]'}
                </button>
              </div>
            </form>
          </div>

          {/* Animasi Network Traffic (Angka Gerak-gerak) */}
          <div className={`bg-black border border-emerald-900 p-2 text-[9px] tracking-widest text-emerald-600/70 h-24 overflow-hidden flex flex-col justify-end`}>
            {networkTraffic.map((traffic, i) => (
              <div key={i} className="mb-0.5">{traffic}</div>
            ))}
          </div>

          {/* Panel Log Sistem Biasa */}
          <div className={`bg-black border ${APP_CONFIG.borderWarna} p-4 h-32 overflow-y-auto text-[11px] tracking-wider opacity-90 custom-scrollbar`}>
            {logSistem.map((log, i) => (
              <div key={i} className="mb-1">{log}</div>
            ))}
            <div ref={logBawahRef} />
          </div>
        </section>

        {/* Panel Kanan (Tabel Data/Grid) */}
        <section className="lg:col-span-7 flex flex-col gap-4">
          
          {/* Header Panel Kanan (Search Bar & Tombol Nuke) */}
          <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-end border-b ${APP_CONFIG.borderWarna} pb-3 gap-3`}>
            <div className="flex-1 w-full">
              <span className="text-xs opacity-70 mb-1 block">QUERY DATABANK:</span>
              <input 
                type="text" 
                placeholder="Cari ID, Nama, atau Role..." 
                value={kataKunci}
                onChange={(e) => setKataKunci(e.target.value)}
                className={`w-full bg-transparent border-b border-dashed ${APP_CONFIG.borderWarna} outline-none text-sm focus:border-emerald-400 py-1 transition-colors`}
              />
            </div>
            
            <div className="flex items-center gap-2">
              <button onClick={() => downloadCSVLokal(dataLokal)} className={`text-xs border ${APP_CONFIG.borderWarna} ${APP_CONFIG.bgHover} px-3 py-1`}>
                📥 DUMP CSV
              </button>
              <button onClick={handlePurgeDatabase} className={`text-xs border border-red-900 text-red-500 hover:bg-red-900/30 px-3 py-1 font-bold`}>
                ☢️ NUKE
              </button>
            </div>
          </div>
          
          {/* Tampilan Grid Data */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[65vh] overflow-y-auto pr-2 custom-scrollbar">
            {dataTampil.length === 0 ? (
              <div className="col-span-full border border-dashed border-emerald-800 p-8 text-center text-emerald-700 text-xs tracking-widest animate-pulse">
                [ NO DATA FOUND IN CURRENT QUERY ]
              </div>
            ) : (
              dataTampil.map((item) => (
                <div key={item.idLog} className={`bg-black border ${APP_CONFIG.borderWarna} p-4 hover:border-emerald-400 transition-colors relative group`}>
                  <button onClick={() => handleHapus(item.idLog)} className="absolute top-2 right-2 text-emerald-900 hover:text-red-500 opacity-0 group-hover:opacity-100">[DEL]</button>
                  <div className="flex justify-between items-start mb-3">
                    <span className={`text-xs border-b ${APP_CONFIG.borderWarna}`}>{item.idLog}</span>
                    <span className="text-[10px] opacity-70">{item.waktuInput}</span>
                  </div>
                  <h3 className="text-lg font-bold uppercase truncate">{item.namaAlias}</h3>
                  <div className="text-xs mt-1 uppercase opacity-80">ROLE: {item.role}</div>
                  <div className={`mt-3 pt-2 border-t ${APP_CONFIG.borderWarna} flex justify-between items-center`}>
                    <span className="text-[10px] opacity-70">AKSES:</span>
                    <span className={`text-xs font-bold uppercase ${item.tingkatAkses === 'Root' ? 'text-red-500 animate-pulse' : item.tingkatAkses === 'Admin' ? 'text-orange-400' : 'text-emerald-400'}`}>
                      [{item.tingkatAkses}]
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

      </main>
    </div>
  );
}
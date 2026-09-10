import { useRef, useState } from 'react';
import { Download, Upload, CheckCircle, AlertCircle } from 'lucide-react';
import { usePlaces } from '../../contexts/PlacesContext';
import { useLanguage } from '../../contexts/LanguageContext';

export default function DataExport() {
  const { exportData, importData, adminPlaces } = usePlaces();
  const { t } = useLanguage();
  const fileInputRef = useRef(null);
  const [message, setMessage] = useState(null);

  const handleExport = () => {
    const data = exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `turiarica_data_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setMessage({ type: 'success', text: 'Datos exportados correctamente.' });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleImport = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const success = importData(event.target.result);
      if (success) {
        setMessage({ type: 'success', text: 'Datos importados correctamente.' });
      } else {
        setMessage({ type: 'error', text: 'Error: El archivo no tiene el formato correcto.' });
      }
      setTimeout(() => setMessage(null), 4000);
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Stats */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <h2 className="text-lg font-extrabold text-gray-900 mb-4">Resumen de Datos</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-brand-50 rounded-xl p-4 text-center border border-brand-100">
            <p className="text-3xl font-black text-brand-600">{adminPlaces.length}</p>
            <p className="text-xs font-bold text-brand-500">Lugares agregados (admin)</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4 text-center border border-gray-200">
            <p className="text-3xl font-black text-gray-600">14</p>
            <p className="text-xs font-bold text-gray-400">Lugares predeterminados</p>
          </div>
        </div>
      </div>

      {/* Export */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <h3 className="font-bold text-gray-900 mb-2">{t('admin.export')}</h3>
        <p className="text-sm text-gray-500 mb-4">
          Descarga todos los lugares agregados por el administrador como un archivo JSON. Útil para backup.
        </p>
        <button
          onClick={handleExport}
          disabled={adminPlaces.length === 0}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-500 hover:bg-brand-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold transition-all shadow-md"
        >
          <Download size={18} />
          {t('admin.export')}
        </button>
      </div>

      {/* Import */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <h3 className="font-bold text-gray-900 mb-2">{t('admin.import')}</h3>
        <p className="text-sm text-gray-500 mb-4">
          Sube un archivo JSON previamente exportado para restaurar los datos. Esto reemplazará los datos actuales del admin.
        </p>
        <input
          type="file"
          ref={fileInputRef}
          accept=".json"
          onChange={handleImport}
          className="hidden"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold transition-colors border border-gray-200"
        >
          <Upload size={18} />
          {t('admin.import')}
        </button>
      </div>

      {/* Message */}
      {message && (
        <div className={`flex items-center gap-3 px-5 py-4 rounded-2xl ${
          message.type === 'success'
            ? 'bg-green-50 text-green-700 border border-green-200'
            : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          {message.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
          <span className="text-sm font-medium">{message.text}</span>
        </div>
      )}
    </div>
  );
}

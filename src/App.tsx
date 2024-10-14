import React, { useState, useEffect } from 'react';
import { Table } from './components/Table';
import { Header } from './components/Header';
import { RegionModal } from './components/RegionModal';
import { ExecutorModal } from './components/ExecutorModal';

function App() {
  const [showRegionModal, setShowRegionModal] = useState(false);
  const [showExecutorModal, setShowExecutorModal] = useState(false);
  const [regions, setRegions] = useState<string[]>([]);
  const [executors, setExecutors] = useState<string[]>([]);

  useEffect(() => {
    // TODO: Fetch regions and executors from the database
    setRegions(['Воронеж', 'Владимир']);
    setExecutors(['Черняев', 'Булычева']);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <Table regions={regions} executors={executors} />
        </div>
      </main>
      <div className="container mx-auto px-4 py-4 flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4">
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          onClick={() => setShowRegionModal(true)}
        >
          Управление регионами
        </button>
        <button
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
          onClick={() => setShowExecutorModal(true)}
        >
          Управление исполнителями
        </button>
      </div>
      {showRegionModal && (
        <RegionModal
          regions={regions}
          setRegions={setRegions}
          onClose={() => setShowRegionModal(false)}
        />
      )}
      {showExecutorModal && (
        <ExecutorModal
          executors={executors}
          setExecutors={setExecutors}
          onClose={() => setShowExecutorModal(false)}
        />
      )}
    </div>
  );
}

export default App;
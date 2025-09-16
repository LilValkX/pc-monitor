import { useState, useEffect } from 'react';
import MachineCard from '../components/MachineCard';
import Navbar from '../components/Navbar';

export default function Dashboard() {
  const [machines, setMachines] = useState([]);
  const [machineData, setMachineData] = useState({});

  useEffect(() => {
    // ดึงรายการเครื่อง
    fetch('/api/machines')
      .then(res => res.json())
      .then(data => {
        setMachines(data);
        
        // ดึงข้อมูลล่าสุดของแต่ละเครื่อง
        data.forEach(machine => {
          fetch(`/api/machines/${machine.machine_id}`)
            .then(res => res.json())
            .then(machineInfo => {
              setMachineData(prev => ({
                ...prev,
                [machine.machine_id]: machineInfo
              }));
            });
        });
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {machines.map(machine => (
            <MachineCard 
              key={machine.machine_id} 
              machine={{
                machine_id: machine.machine_id,
                latest: machineData[machine.machine_id]?.latest
              }} 
            />
          ))}
        </div>
      </div>
    </div>
  );
}
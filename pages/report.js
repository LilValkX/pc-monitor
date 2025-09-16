import { useState, useEffect } from 'react';
import { format, subDays } from 'date-fns';
import { th } from 'date-fns/locale';
import Navbar from '../components/Navbar';

export default function Report() {
  const [machines, setMachines] = useState([]);
  const [selectedMachine, setSelectedMachine] = useState('');
  const [dateRange, setDateRange] = useState('7'); // 7 days
  const [reportData, setReportData] = useState([]);

  useEffect(() => {
    fetch('/api/machines')
      .then(res => res.json())
      .then(data => {
        setMachines(data);
        if (data.length > 0) {
          setSelectedMachine(data[0].machine_id);
        }
      });
  }, []);

  useEffect(() => {
    if (selectedMachine) {
      fetchReportData();
    }
  }, [selectedMachine, dateRange]);

  async function fetchReportData() {
    const response = await fetch(`/api/report?machine_id=${selectedMachine}&days=${dateRange}`);
    const data = await response.json();
    setReportData(data);
  }

  // คำนวณค่าไฟ
  const calculateCost = (watt, hours) => {
    const kwh = (watt * hours) / 1000;
    const cost = kwh * 4; // สมมุติค่าไฟ 4 บาท/kWh
    return cost;
  };

  const totalHours = reportData.reduce((sum, item) => sum + (item.roblox_count > 0 ? 1 : 0), 0);
  const totalCost = calculateCost(300, totalHours); // สมมุติ 300W

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">รายงานการใช้งาน</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">เลือกเครื่อง</label>
              <select 
                value={selectedMachine}
                onChange={(e) => setSelectedMachine(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                {machines.map(machine => (
                  <option key={machine.machine_id} value={machine.machine_id}>
                    {machine.machine_id}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">ช่วงเวลา</label>
              <select 
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="1">1 วัน</option>
                <option value="7">7 วัน</option>
                <option value="30">30 วัน</option>
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-800">เวลาใช้งาน Roblox</h3>
              <p className="text-2xl font-bold text-blue-600">{totalHours} ชั่วโมง</p>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-green-800">ค่าไฟโดยประมาณ</h3>
              <p className="text-2xl font-bold text-green-600">{totalCost.toFixed(2)} บาท</p>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-purple-800">จำนวนครั้ง</h3>
              <p className="text-2xl font-bold text-purple-600">
                {reportData.filter(item => item.roblox_count > 0).length} ครั้ง
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
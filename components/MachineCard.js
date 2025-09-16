import React from 'react';
import Link from 'next/link';

export default function MachineCard({ machine }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <h3 className="text-xl font-bold text-gray-800 mb-2">
        {machine.machine_id}
      </h3>
      {machine.latest ? (
        <div className="space-y-2">
          <p className="text-sm text-gray-600">
            CPU: {machine.latest.cpu_usage?.toFixed(1)}%
          </p>
          <p className="text-sm text-gray-600">
            RAM: {machine.latest.ram_usage?.toFixed(1)}%
          </p>
          <p className="text-sm text-gray-600">
            Roblox: {machine.latest.roblox_count} หน้าต่าง
          </p>
          <p className="text-sm text-gray-600">
            ใช้ไฟ: {machine.latest.watt}W
          </p>
          <Link 
            href={`/machine/${machine.machine_id}`}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            ดูรายละเอียด →
          </Link>
        </div>
      ) : (
        <p className="text-gray-500 text-sm">ยังไม่มีข้อมูล</p>
      )}
    </div>
  );
}
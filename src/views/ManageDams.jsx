import React, { useState } from "react";
import {
  Sliders,
  Plus,
  Edit2,
  X,
  Save,
  Activity,
} from "lucide-react";
import { DAMS_DATA } from "../data/damData";
import { getRiskColorClass } from "../utils/helpers";

export function ManageDams() {
  const [damsList, setDamsList] = useState(DAMS_DATA);
  const [editingDam, setEditingDam] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const [newDam, setNewDam] = useState({
    name: "",
    river: "",
    state: "Odisha",
    cwcCode: "CWC-NEW-01",
    currentWaterLevel: 180,
    fullReservoirLevel: 195,
    dangerLevel: 192,
    warningLevel: 188,
    inflow: 2500,
    outflow: 2000,
    gatesOpen: 12,
    totalGates: 36,
    riskLevel: "MODERATE",
    lat: 21.5,
    lng: 83.9,
    structuralHealth: "Piezometers Online",
  });

  const handleEditSave = (e) => {
    e.preventDefault();

    if (!editingDam) return;

    const updated = {
      ...editingDam,
      storagePercentage: Math.round(
        (editingDam.currentWaterLevel /
          editingDam.fullReservoirLevel) *
          100
      ),
    };

    setDamsList((prev) =>
      prev.map((dam) =>
        dam.id === editingDam.id ? updated : dam
      )
    );

    setEditingDam(null);
  };

  const handleAddNew = (e) => {
    e.preventDefault();

    if (!newDam.name.trim()) return;

    const storagePercentage = Math.round(
      (newDam.currentWaterLevel /
        newDam.fullReservoirLevel) *
        100
    );

    const created = {
      ...newDam,
      id: `dam-${Date.now()}`,
      storagePercentage,
    };

    setDamsList((prev) => [created, ...prev]);
    setShowAddModal(false);

    setNewDam({
      name: "",
      river: "",
      state: "Odisha",
      cwcCode: "CWC-NEW-01",
      currentWaterLevel: 180,
      fullReservoirLevel: 195,
      dangerLevel: 192,
      warningLevel: 188,
      inflow: 2500,
      outflow: 2000,
      gatesOpen: 12,
      totalGates: 36,
      riskLevel: "MODERATE",
      lat: 21.5,
      lng: 83.9,
      structuralHealth: "Piezometers Online",
    });
  };

  const criticalCount = damsList.filter(
    (dam) => dam.riskLevel === "CRITICAL"
  ).length;

  const highCount = damsList.filter(
    (dam) => dam.riskLevel === "HIGH"
  ).length;

  const normalCount = damsList.filter(
    (dam) => dam.riskLevel === "NORMAL"
  ).length;

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">

          <div>
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Sliders className="w-5 h-5 text-blue-600" />
              </div>

              <div>
                <h1 className="text-xl font-bold text-slate-900">
                  Dam Fleet Management
                </h1>

                <p className="text-sm text-slate-500 mt-0.5">
                  Configure dam stations, telemetry values and reservoir
                  monitoring parameters.
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-colors"
          >
            <Plus className="w-4 h-4" />
            Register New Dam
          </button>
        </div>
      </div>

      {/* Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <p className="text-xs text-slate-500">Registered Dams</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">
            {damsList.length}
          </p>
        </div>

        <div className="bg-white border border-red-200 rounded-xl p-4 shadow-sm">
          <p className="text-xs text-slate-500">Critical Risk</p>
          <p className="text-2xl font-bold text-red-600 mt-1">
            {criticalCount}
          </p>
        </div>

        <div className="bg-white border border-orange-200 rounded-xl p-4 shadow-sm">
          <p className="text-xs text-slate-500">High Risk</p>
          <p className="text-2xl font-bold text-orange-600 mt-1">
            {highCount}
          </p>
        </div>

        <div className="bg-white border border-green-200 rounded-xl p-4 shadow-sm">
          <p className="text-xs text-slate-500">Normal</p>
          <p className="text-2xl font-bold text-green-600 mt-1">
            {normalCount}
          </p>
        </div>
      </div>

      {/* Fleet table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">

        <div className="px-5 py-4 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-600" />

            <div>
              <h2 className="font-semibold text-slate-900">
                Dam Telemetry Stations
              </h2>

              <p className="text-xs text-slate-500 mt-1">
                Current monitoring and operational parameters.
              </p>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">
                  Dam
                </th>

                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">
                  River / State
                </th>

                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">
                  Water Level
                </th>

                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">
                  Storage
                </th>

                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">
                  Inflow / Outflow
                </th>

                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">
                  Gates
                </th>

                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">
                  Risk
                </th>

                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase text-right">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {damsList.map((dam) => (
                <tr
                  key={dam.id}
                  className="hover:bg-slate-50 transition-colors"
                >
                  <td className="px-4 py-4">
                    <p className="font-semibold text-slate-900">
                      {dam.name}
                    </p>

                    {dam.cwcCode && (
                      <p className="text-xs text-slate-400 mt-1">
                        {dam.cwcCode}
                      </p>
                    )}
                  </td>

                  <td className="px-4 py-4">
                    <p className="text-slate-700">{dam.river}</p>
                    <p className="text-xs text-slate-500 mt-1">
                      {dam.state}
                    </p>
                  </td>

                  <td className="px-4 py-4">
                    <span className="font-semibold text-slate-900">
                      {dam.currentWaterLevel} m
                    </span>
                  </td>

                  <td className="px-4 py-4">
                    <div className="w-24">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-500">
                          Storage
                        </span>
                        <span className="font-semibold text-slate-700">
                          {dam.storagePercentage}%
                        </span>
                      </div>

                      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-600 rounded-full"
                          style={{
                            width: `${Math.min(
                              dam.storagePercentage,
                              100
                            )}%`,
                          }}
                        />
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-4">
                    <div className="text-xs">
                      <span className="text-blue-600 font-semibold">
                        {dam.inflow}
                      </span>
                      <span className="text-slate-400">
                        {" "} / {" "}
                      </span>
                      <span className="text-orange-600 font-semibold">
                        {dam.outflow}
                      </span>
                    </div>

                    <p className="text-[10px] text-slate-400 mt-1">
                      cumecs
                    </p>
                  </td>

                  <td className="px-4 py-4 text-slate-700">
                    {dam.gatesOpen} / {dam.totalGates}
                  </td>

                  <td className="px-4 py-4">
                    <span
                      className={`px-2 py-1 rounded-md text-[10px] font-bold ${getRiskColorClass(
                        dam.riskLevel
                      )}`}
                    >
                      {dam.riskLevel}
                    </span>
                  </td>

                  <td className="px-4 py-4 text-right">
                    <button
                      onClick={() => setEditingDam({ ...dam })}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit modal */}
      {editingDam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-white border border-slate-200 rounded-xl shadow-xl">

            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
              <div>
                <h3 className="font-bold text-slate-900">
                  Edit Dam Telemetry
                </h3>

                <p className="text-xs text-slate-500 mt-1">
                  {editingDam.name}
                </p>
              </div>

              <button
                onClick={() => setEditingDam(null)}
                className="p-2 rounded-lg hover:bg-slate-100 text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={handleEditSave}
              className="p-5 space-y-4"
            >
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  Water Level (m)
                </label>

                <input
                  type="number"
                  step="0.1"
                  value={editingDam.currentWaterLevel}
                  onChange={(e) =>
                    setEditingDam({
                      ...editingDam,
                      currentWaterLevel: Number(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                    Inflow (cumecs)
                  </label>

                  <input
                    type="number"
                    value={editingDam.inflow}
                    onChange={(e) =>
                      setEditingDam({
                        ...editingDam,
                        inflow: Number(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                    Outflow (cumecs)
                  </label>

                  <input
                    type="number"
                    value={editingDam.outflow}
                    onChange={(e) =>
                      setEditingDam({
                        ...editingDam,
                        outflow: Number(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                    Gates Open
                  </label>

                  <input
                    type="number"
                    value={editingDam.gatesOpen}
                    onChange={(e) =>
                      setEditingDam({
                        ...editingDam,
                        gatesOpen: Number(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                    Risk Level
                  </label>

                  <select
                    value={editingDam.riskLevel}
                    onChange={(e) =>
                      setEditingDam({
                        ...editingDam,
                        riskLevel: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-900 bg-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  >
                    <option value="NORMAL">Normal</option>
                    <option value="MODERATE">Moderate</option>
                    <option value="HIGH">High</option>
                    <option value="CRITICAL">Critical</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingDam(null)}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold"
                >
                  <Save className="w-4 h-4" />
                  Update Telemetry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white border border-slate-200 rounded-xl shadow-xl">

            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 sticky top-0 bg-white">
              <div>
                <h3 className="font-bold text-slate-900">
                  Register New Dam Station
                </h3>

                <p className="text-xs text-slate-500 mt-1">
                  Add a new telemetry monitoring station.
                </p>
              </div>

              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 rounded-lg hover:bg-slate-100 text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={handleAddNew}
              className="p-5 space-y-4"
            >
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  Dam Name
                </label>

                <input
                  type="text"
                  required
                  value={newDam.name}
                  onChange={(e) =>
                    setNewDam({
                      ...newDam,
                      name: e.target.value,
                    })
                  }
                  placeholder="e.g. Koyna Dam"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                    River
                  </label>

                  <input
                    type="text"
                    required
                    value={newDam.river}
                    onChange={(e) =>
                      setNewDam({
                        ...newDam,
                        river: e.target.value,
                      })
                    }
                    placeholder="River name"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                    State
                  </label>

                  <input
                    type="text"
                    required
                    value={newDam.state}
                    onChange={(e) =>
                      setNewDam({
                        ...newDam,
                        state: e.target.value,
                      })
                    }
                    placeholder="State"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                    Water Level
                  </label>

                  <input
                    type="number"
                    value={newDam.currentWaterLevel}
                    onChange={(e) =>
                      setNewDam({
                        ...newDam,
                        currentWaterLevel: Number(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                    Danger Level
                  </label>

                  <input
                    type="number"
                    value={newDam.dangerLevel}
                    onChange={(e) =>
                      setNewDam({
                        ...newDam,
                        dangerLevel: Number(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                    FRL
                  </label>

                  <input
                    type="number"
                    value={newDam.fullReservoirLevel}
                    onChange={(e) =>
                      setNewDam({
                        ...newDam,
                        fullReservoirLevel: Number(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                    Inflow
                  </label>

                  <input
                    type="number"
                    value={newDam.inflow}
                    onChange={(e) =>
                      setNewDam({
                        ...newDam,
                        inflow: Number(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                    Outflow
                  </label>

                  <input
                    type="number"
                    value={newDam.outflow}
                    onChange={(e) =>
                      setNewDam({
                        ...newDam,
                        outflow: Number(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold"
                >
                  <Plus className="w-4 h-4" />
                  Register Station
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageDams;
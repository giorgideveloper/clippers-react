import React, { useState } from "react";
import { Service } from "../../types";
import { Edit2, BadgeDollarSign, Clock, Check, Scissors, AlertCircle, Sparkles } from "lucide-react";

interface AdminServicesProps {
  services: Service[];
  onUpdateService: (updatedService: Service) => void;
}

export function AdminServices({ services, onUpdateService }: AdminServicesProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempPrice, setTempPrice] = useState<number>(0);
  const [tempDuration, setTempDuration] = useState<number>(0);
  const [tempName, setTempName] = useState<string>("");

  const handleStartEdit = (service: Service) => {
    setEditingId(service.id);
    setTempPrice(service.price);
    setTempDuration(service.duration);
    setTempName(service.name);
  };

  const handleSave = (service: Service) => {
    onUpdateService({
      ...service,
      name: tempName,
      price: tempPrice,
      duration: tempDuration
    });
    setEditingId(null);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="space-y-1 text-left">
        <h2 className="text-2xl font-light uppercase tracking-wide text-stone-100">
          Services <span className="text-amber-400 font-semibold font-serif">Catalog Configurator</span>
        </h2>
        <p className="text-xs text-stone-400 font-mono">
          EDIT PRICING SCALES, ESTIMATED TREATMENT TIMINGS
        </p>
      </div>

      {/* Grid of services */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {services.map((service) => {
          const isEditing = editingId === service.id;

          return (
            <div
              key={service.id}
              className="p-5 rounded-2xl bg-[#141416]/95 border border-stone-850 hover:border-amber-500/20 transition-all duration-300 flex flex-col justify-between space-y-4"
            >
              {/* Header category details */}
              <div className="flex items-start justify-between">
                <span className="px-2.5 py-0.5 bg-stone-900 border border-stone-850 text-[9px] font-mono tracking-widest font-bold text-amber-500 uppercase rounded-full">
                  {service.category} Treatment
                </span>
                <span className="text-xs text-stone-500 font-mono">ID: {service.id}</span>
              </div>

              {/* Service Details info */}
              <div className="space-y-2">
                {isEditing ? (
                  <div className="space-y-2 pt-1 font-mono">
                    <div className="space-y-1">
                      <label className="text-[10px] text-stone-500 uppercase font-black">Service Name</label>
                      <input
                        type="text"
                        value={tempName}
                        onChange={(e) => setTempName(e.target.value)}
                        className="w-full bg-stone-950 border border-stone-800 text-stone-200 text-xs rounded p-2 focus:border-amber-500 outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-1">
                      <div className="space-y-1">
                        <label className="text-[10px] text-stone-500 uppercase font-black">Price ($)</label>
                        <input
                          type="number"
                          value={tempPrice}
                          onChange={(e) => setTempPrice(Math.max(0, parseInt(e.target.value) || 0))}
                          className="w-full bg-stone-950 border border-stone-800 text-stone-200 text-xs rounded p-2 focus:border-amber-500 outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] text-stone-500 uppercase font-black">Duration (Min)</label>
                        <input
                          type="number"
                          value={tempDuration}
                          onChange={(e) => setTempDuration(Math.max(1, parseInt(e.target.value) || 1))}
                          className="w-full bg-stone-950 border border-stone-800 text-stone-200 text-xs rounded p-2 focus:border-amber-500 outline-none"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <h3 className="font-semibold text-stone-200 tracking-wide text-base">
                      {service.name}
                    </h3>
                    <p className="text-xs text-stone-400 font-light leading-relaxed line-clamp-2">
                      {service.description}
                    </p>
                  </div>
                )}
              </div>

              {/* Pricing & Duration Labels */}
              {!isEditing && (
                <div className="flex items-center gap-4 py-2 border-y border-stone-850/60 font-mono text-xs">
                  <div className="flex items-center text-amber-400">
                    <BadgeDollarSign className="w-4 h-4 mr-1 text-amber-500" />
                    <span className="font-bold font-mono text-stone-200">${service.price}</span>
                  </div>
                  <div className="flex items-center text-stone-400">
                    <Clock className="w-4 h-4 mr-1 text-stone-550" />
                    <span>{service.duration} Mins</span>
                  </div>
                </div>
              )}

              {/* Edit Operations controls */}
              <div className="flex items-center justify-end gap-2 pt-1">
                {isEditing ? (
                  <>
                    <button
                      onClick={() => setEditingId(null)}
                      className="px-3.5 py-1.5 bg-stone-900 border border-stone-800 text-stone-400 font-mono text-[10px] uppercase font-bold rounded-lg hover:bg-stone-850 transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleSave(service)}
                      className="px-3.5 py-1.5 bg-amber-500 border border-amber-400 text-stone-950 font-mono text-[10px] uppercase font-bold rounded-lg hover:bg-amber-450 transition-colors flex items-center cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5 mr-1" /> Save
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => handleStartEdit(service)}
                    className="px-3 py-1.5 bg-stone-900 hover:bg-stone-850 border border-stone-850 text-stone-400 hover:text-amber-400 font-mono text-[10px] uppercase font-bold rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Edit2 className="w-3 h-3" /> Customize Service
                  </button>
                )}
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
}

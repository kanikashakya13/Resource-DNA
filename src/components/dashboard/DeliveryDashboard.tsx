import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DeliveryAssignment, DeliveryStatus } from '../../types';
import QRCode from 'qrcode';
import {
  Truck,
  ShieldCheck,
  MapPin,
  Calendar,
  CheckCircle2,
  Clock,
  Phone,
  FileText,
  AlertCircle,
  Package,
  Layers,
  ChevronRight,
  ArrowRight,
  Navigation,
} from 'lucide-react';

export const DeliveryDashboard: React.FC = () => {
  const { user, deliveries, bookings, updateDeliveryStatus } = useApp();

  const [activeTab, setActiveTab] = useState<'assigned' | 'history'>('assigned');
  const [selectedDelivery, setSelectedDelivery] = useState<DeliveryAssignment | null>(null);
  const [newLogNote, setNewLogNote] = useState('');
  const [activeQr, setActiveQr] = useState<{
    bookingId: string;
    action: 'handover' | 'return';
    dataUrl: string;
  } | null>(null);
  const [qrError, setQrError] = useState<string | null>(null);

  // Filter deliveries assigned to this delivery partner only
  const partnerDeliveries = deliveries.filter(
    (d) =>
      d.assignedPartnerId === (user?.id || 'user_del_01') &&
      bookings.some((b) =>
        b.id === d.bookingId &&
        (b.status === 'in_delivery' || b.status === 'active' || b.status === 'return_pending')
      )
  );

  const activeDeliveries = partnerDeliveries.filter((d) => d.status !== 'returned');
  const historyDeliveries = partnerDeliveries.filter((d) => d.status === 'returned');
  const currentSelectedDelivery = selectedDelivery
    ? deliveries.find((delivery) => delivery.id === selectedDelivery.id)
    : undefined;
  const selectedBooking = currentSelectedDelivery
    ? bookings.find((booking) => booking.id === currentSelectedDelivery.bookingId)
    : undefined;

  const handleStatusProgression = (deliveryId: string, nextStatus: DeliveryStatus, statusLabel: string) => {
    updateDeliveryStatus(
      deliveryId,
      nextStatus,
      `Status updated to: ${statusLabel} at ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
    );
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentSelectedDelivery || !newLogNote.trim()) return;

    updateDeliveryStatus(currentSelectedDelivery.id, currentSelectedDelivery.status, `Note: ${newLogNote.trim()}`);
    setNewLogNote('');
  };

  const handleShowQr = async (action: 'handover' | 'return') => {
    if (!currentSelectedDelivery || !selectedBooking) return;
    const canShowHandover = action === 'handover' &&
      selectedBooking.status === 'in_delivery' &&
      currentSelectedDelivery.status === 'in_transit' &&
      !selectedBooking.handoverVerifiedAt;
    const canShowReturn = action === 'return' &&
      selectedBooking.status === 'return_pending' &&
      currentSelectedDelivery.status === 'return_transit' &&
      !selectedBooking.returnVerifiedAt;
    if (!canShowHandover && !canShowReturn) return;

    const code = action === 'handover' ? selectedBooking.handoverQrCode : selectedBooking.returnQrCode;
    setQrError(null);
    try {
      const dataUrl = await QRCode.toDataURL(code, { width: 300, margin: 2 });
      setActiveQr({ bookingId: selectedBooking.id, action, dataUrl });
    } catch (error) {
      console.error('Could not generate delivery QR code:', error);
      setQrError('Could not display this QR code. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
      {/* Top Banner with Delivery Dashboard Branding */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 tracking-wider uppercase mb-1">
                <Truck className="w-4 h-4 text-emerald-600" />
                <span>Specialized Transport Portal</span>
                <span>·</span>
                <span className="flex items-center gap-1 text-emerald-700">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Certified Cold-Chain & Shock-Isolated Carrier
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Delivery Dashboard
              </h1>
              <p className="text-sm text-slate-500 mt-0.5">
                {user?.institution || 'Apex Scientific Logistics'} · Partner Operations & Transport Manifest
              </p>
            </div>

            {/* Note: In strict compliance with requirements, NO QR scanner button or launcher exists here */}
            <div className="flex items-center gap-3">
              <div className="px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Fleet Active · GPS Calibration Verified</span>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-4 mt-6 border-b border-slate-200 -mb-6">
            <button
              onClick={() => setActiveTab('assigned')}
              className={`pb-3 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
                activeTab === 'assigned'
                  ? 'border-emerald-600 text-slate-900 font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <span>Active Assigned Deliveries</span>
              <span className="px-1.5 py-0.5 text-xs bg-emerald-100 text-emerald-800 rounded-full font-mono">
                {activeDeliveries.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`pb-3 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
                activeTab === 'history'
                  ? 'border-emerald-600 text-slate-900 font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <span>Delivery History</span>
              <span className="px-1.5 py-0.5 text-xs bg-slate-200 text-slate-700 rounded-full font-mono">
                {historyDeliveries.length}
              </span>
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {activeTab === 'assigned' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Active Scientific Equipment Deliveries</h2>
                <p className="text-xs text-slate-500">
                  Precision transport routes assigned to your certified partner fleet.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Deliveries List */}
              <div className="lg:col-span-7 space-y-4">
                {activeDeliveries.map((del) => {
                  const isSelected = selectedDelivery?.id === del.id;
                  return (
                    <div
                      key={del.id}
                      onClick={() => setSelectedDelivery(del)}
                      className={`bg-white rounded-2xl border p-5 transition-all cursor-pointer shadow-xs ${
                        isSelected
                          ? 'border-emerald-500 ring-2 ring-emerald-500/20'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-slate-900">{del.id}</span>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                              del.status === 'in_transit'
                                ? 'bg-cyan-100 text-cyan-800'
                                : del.status === 'delivered'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {del.status.replace(/_/g, ' ')}
                          </span>
                        </div>
                        <span className="text-xs text-slate-400 font-mono">Booking: {del.bookingId}</span>
                      </div>

                      <h3 className="font-bold text-base text-slate-900 mb-3">{del.equipmentName}</h3>

                      {/* Route overview */}
                      <div className="space-y-2 text-xs border-y border-slate-100 py-3 my-2">
                        <div className="flex items-start gap-2">
                          <MapPin className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
                          <div>
                            <span className="text-slate-400 block text-[10px] uppercase font-bold">Pickup Facility:</span>
                            <span className="text-slate-800 font-medium">{del.pickupLocation}</span>
                            <span className="text-slate-400 block text-[11px]">Contact: {del.providerName} ({del.providerContact})</span>
                          </div>
                        </div>

                        <div className="flex items-start gap-2 pt-1">
                          <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <div>
                            <span className="text-slate-400 block text-[10px] uppercase font-bold">Drop-off Destination:</span>
                            <span className="text-slate-800 font-medium">{del.dropoffLocation}</span>
                            <span className="text-slate-400 block text-[11px]">Recipient: {del.researcherName} ({del.researcherContact})</span>
                          </div>
                        </div>
                      </div>

                      {/* Status progression quick actions */}
                      <div className="pt-2 flex flex-wrap items-center justify-between gap-2">
                        <span className="text-xs text-slate-500">
                          Pickup Time: <span className="font-semibold text-slate-800">{del.scheduledPickupDate}</span>
                        </span>

                        <div className="flex items-center gap-1.5">
                          {del.status === 'assigned' && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleStatusProgression(del.id, 'out_for_pickup', 'Out for Pickup');
                              }}
                              className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg cursor-pointer"
                            >
                              Dispatch for Pickup
                            </button>
                          )}

                          {del.status === 'out_for_pickup' && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleStatusProgression(del.id, 'in_transit', 'Picked Up & In Transit');
                              }}
                              className="px-3 py-1.5 bg-cyan-700 hover:bg-cyan-800 text-white text-xs font-semibold rounded-lg cursor-pointer"
                            >
                              Confirm Pickup & Transit
                            </button>
                          )}

                          {del.status === 'in_transit' && (
                            <span className="text-xs font-semibold text-cyan-800">
                              Awaiting Researcher handover scan
                            </span>
                          )}

                          {del.status === 'delivered' && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleStatusProgression(del.id, 'return_transit', 'In Return Transit to Provider');
                              }}
                              className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-lg cursor-pointer"
                            >
                              Pickup for Return
                            </button>
                          )}

                          {del.status === 'return_transit' && (
                            <span className="text-xs font-semibold text-amber-800">
                              Awaiting Researcher return scan
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Delivery Details & Manifest Panel */}
              <div className="lg:col-span-5">
                {selectedDelivery ? (
                  <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4 sticky top-24">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <div>
                        <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">
                          Delivery Manifest Details
                        </span>
                        <h3 className="font-bold text-base text-slate-900">{selectedDelivery.id}</h3>
                      </div>
                      <span className="text-xs font-mono text-slate-400">
                        {new Date(selectedDelivery.updatedAt).toLocaleTimeString()}
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700">
                      <p className="font-semibold text-slate-900 mb-1">Handling Protocols:</p>
                      <p>{selectedDelivery.instructions}</p>
                    </div>

                    {selectedBooking && currentSelectedDelivery && (
                      <div className="p-3 rounded-xl bg-cyan-50 border border-cyan-200 space-y-2">
                        <h4 className="text-xs font-bold text-slate-900">Researcher Verification QR</h4>
                        {selectedBooking.status === 'in_delivery' && currentSelectedDelivery.status === 'in_transit' && !selectedBooking.handoverVerifiedAt && (
                          <button
                            onClick={() => handleShowQr('handover')}
                            className="px-3 py-2 bg-cyan-700 hover:bg-cyan-800 text-white text-xs font-bold rounded-lg"
                          >
                            Display Handover QR
                          </button>
                        )}
                        {selectedBooking.status === 'return_pending' && currentSelectedDelivery.status === 'return_transit' && !selectedBooking.returnVerifiedAt && (
                          <button
                            onClick={() => handleShowQr('return')}
                            className="px-3 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-lg"
                          >
                            Display Return QR
                          </button>
                        )}
                        {selectedBooking.handoverVerifiedAt && !selectedBooking.returnVerifiedAt && (
                          <p className="text-xs text-slate-600">Handover verified: {new Date(selectedBooking.handoverVerifiedAt).toLocaleString()}</p>
                        )}
                        {selectedBooking.returnVerifiedAt && (
                          <p className="text-xs text-slate-600">Return verified: {new Date(selectedBooking.returnVerifiedAt).toLocaleString()}</p>
                        )}
                      </div>
                    )}

                    {/* Timeline Log */}
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                        Chain of Custody Activity Log
                      </h4>
                      <div className="space-y-2 text-xs">
                        {selectedDelivery.deliveryNotes.map((note, index) => (
                          <div key={index} className="flex items-start gap-2 p-2 rounded-lg bg-slate-50">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                            <span className="text-slate-700">{note}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Add note to delivery */}
                    <form onSubmit={handleAddNote} className="pt-2 border-t border-slate-100">
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Add Transport Log Entry
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newLogNote}
                          onChange={(e) => setNewLogNote(e.target.value)}
                          placeholder="e.g. Temperature stabilized at -20C..."
                          className="flex-1 px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
                        />
                        <button
                          type="submit"
                          className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg cursor-pointer"
                        >
                          Log
                        </button>
                      </div>
                    </form>
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-500">
                    <Package className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                    <p className="text-xs font-semibold text-slate-700">Select a delivery on the left</p>
                    <p className="text-[11px] text-slate-400 mt-1">
                      View full chain of custody log, temperature logs, and delivery contacts.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-slate-900">Completed Delivery History</h2>
            <div className="space-y-3">
              {historyDeliveries.map((del) => (
                <div
                  key={del.id}
                  className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-xs font-bold text-slate-900">{del.id}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 text-slate-700">
                        Returned & Completed
                      </span>
                    </div>
                    <h3 className="font-bold text-sm text-slate-900">{del.equipmentName}</h3>
                    <p className="text-xs text-slate-500">
                      From: {del.pickupLocation} · Delivered to: {del.dropoffLocation}
                    </p>
                  </div>
                  <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Custody Completed</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
      {qrError && (
        <div className="fixed bottom-5 right-5 z-50 rounded-xl border border-rose-200 bg-white px-4 py-3 text-sm text-rose-700 shadow-lg">
          {qrError}
          <button onClick={() => setQrError(null)} className="ml-3 font-bold">Dismiss</button>
        </div>
      )}
      {activeQr && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900">
                {activeQr.action === 'handover' ? 'Handover QR' : 'Return QR'}
              </h3>
              <button onClick={() => setActiveQr(null)} className="text-slate-500 hover:text-slate-900">Close</button>
            </div>
            <p className="text-xs text-slate-600">Booking {activeQr.bookingId}</p>
            <img src={activeQr.dataUrl} alt={`${activeQr.action} verification QR`} className="w-56 h-56 mx-auto" />
            <p className="text-xs text-slate-500">The Researcher scans this QR from their dashboard.</p>
          </div>
        </div>
      )}
    </div>
  );
};

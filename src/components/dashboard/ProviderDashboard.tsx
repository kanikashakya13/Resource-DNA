import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Resource, Booking, ResourceType } from '../../types';
import QRCode from 'qrcode';
import {
  Building2,
  Microscope,
  CalendarCheck,
  Check,
  X,
  Plus,
  QrCode,
  ShieldCheck,
  AlertCircle,
  Clock,
  DollarSign,
  MapPin,
  CheckCircle2,
  Layers,
  Sparkles,
  Truck,
  ArrowRight,
  Bell,
} from 'lucide-react';

export const ProviderDashboard: React.FC = () => {
  const {
    user,
    resources,
    bookings,
    notifications,
    markNotificationRead,
    addResource,
    updateResource,
    updateBookingStatus,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'requests' | 'resources' | 'active' | 'notifications'>('requests');

  // Add Resource modal state
  const [isAddResourceModalOpen, setIsAddResourceModalOpen] = useState(false);
  const [newResName, setNewResName] = useState('');
  const [newResType, setNewResType] = useState<ResourceType>('equipment');
  const [newResCategory, setNewResCategory] = useState('');
  const [newResDesc, setNewResDesc] = useState('');
  const [newResLocation, setNewResLocation] = useState('Stanford Core Instrumentation Complex, Wing B');
  const [newResDayRate, setNewResDayRate] = useState(450);
  const [newResDeposit, setNewResDeposit] = useState(1000);
  const [newResImage, setNewResImage] = useState(
    'https://images.unsplash.com/photo-1582719471384-894fbb16e074?auto=format&fit=crop&w=1000&q=80'
  );

  // Rejection modal
  const [rejectingBookingId, setRejectingBookingId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [activeQr, setActiveQr] = useState<{
    booking: Booking;
    dataUrl: string;
    action: 'handover' | 'return';
  } | null>(null);
  const [qrError, setQrError] = useState<string | null>(null);

  // Provider's resources
  const providerResources = resources.filter(
    (r) => r.providerId === (user?.id || 'user_prov_01')
  );

  // Incoming booking requests for this provider
  const incomingRequests = bookings.filter(
    (b) => b.providerId === (user?.id || 'user_prov_01') && b.status === 'pending'
  );

  // Active / approved reservations
  const activeBookings = bookings.filter(
    (b) =>
      b.providerId === (user?.id || 'user_prov_01') &&
      (b.status === 'approved' || b.status === 'in_delivery' || b.status === 'active' || b.status === 'return_pending' || b.status === 'completed')
  );
  const providerNotifications = notifications.filter((notification) =>
    notification.userId === (user?.id || 'user_prov_01')
  );
  const unreadProviderNotifications = providerNotifications.filter((notification) => !notification.read).length;

  const handleShowQr = async (booking: Booking, action: 'handover' | 'return') => {
    const code = action === 'handover' ? booking.handoverQrCode : booking.returnQrCode;
    setQrError(null);
    try {
      const dataUrl = await QRCode.toDataURL(code, { width: 300, margin: 2 });
      setActiveQr({ booking, dataUrl, action });
    } catch (error) {
      console.error('Could not generate booking QR code:', error);
      setQrError('Could not display this QR code. Please try again.');
    }
  };

  const handleApprove = (bookingId: string) => {
    updateBookingStatus(bookingId, 'approved', 'Approved by Core Facility Director.');
  };

  const handleRejectConfirm = () => {
    if (!rejectingBookingId) return;
    updateBookingStatus(rejectingBookingId, 'rejected', rejectionReason || 'Facility schedule conflict.');
    setRejectingBookingId(null);
    setRejectionReason('');
  };

  const handleCreateResource = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newResName.trim() || !newResCategory.trim() || !newResDesc.trim()) {
      alert('Please fill out all required fields.');
      return;
    }

    addResource({
      name: newResName,
      type: newResType,
      category: newResCategory,
      description: newResDesc,
      specifications: {
        'Facility Type': newResType === 'equipment' ? 'Precision Instrument' : 'Containment Suite',
        'Access Level': 'Credentialed Investigators',
        'Calibration Status': 'Certified ISO-9001',
      },
      institution: user?.institution || 'Stanford Core Instrumentation Facility',
      location: newResLocation,
      dayRate: Number(newResDayRate),
      securityDeposit: Number(newResDeposit),
      availabilityStatus: 'available',
      imageUrl: newResImage,
      guidelines: [
        'Mandatory equipment safety orientation prior to first experiment.',
        'Users must supply their own consumables and reagents.',
      ],
      capacity: newResType === 'laboratory' ? 'Up to 6 researchers' : undefined,
    });

    setIsAddResourceModalOpen(false);
    // Reset form
    setNewResName('');
    setNewResCategory('');
    setNewResDesc('');
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
      {/* Top Banner & Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-indigo-700 tracking-wider uppercase mb-1">
                <span>Facility Provider Portal</span>
                <span>·</span>
                <span className="flex items-center gap-1 text-emerald-700">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Verified Core Facility Manager
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                {user?.institution || 'Stanford Core Instrumentation Facility'}
              </h1>
              <p className="text-sm text-slate-500 mt-0.5">
                Facility Lead: {user?.name || 'Prof. Marcus Vance'} · Unified Equipment & Laboratory Management
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => setIsAddResourceModalOpen(true)}
                className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-2 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4 text-cyan-400" />
                <span>List New Resource</span>
              </button>

            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-4 mt-6 border-b border-slate-200 -mb-6">
            <button
              onClick={() => setActiveTab('requests')}
              className={`pb-3 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
                activeTab === 'requests'
                  ? 'border-cyan-700 text-cyan-950 font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <span>Incoming Booking Requests</span>
              {incomingRequests.length > 0 && (
                <span className="px-2 py-0.5 text-xs bg-cyan-600 text-white rounded-full font-mono">
                  {incomingRequests.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('resources')}
              className={`pb-3 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
                activeTab === 'resources'
                  ? 'border-cyan-700 text-cyan-950 font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <span>Managed Resources</span>
              <span className="px-1.5 py-0.5 text-xs bg-slate-200 text-slate-700 rounded-full font-mono">
                {providerResources.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('active')}
              className={`pb-3 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
                activeTab === 'active'
                  ? 'border-cyan-700 text-cyan-950 font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <span>Active Bookings & Returns</span>
              <span className="px-1.5 py-0.5 text-xs bg-slate-200 text-slate-700 rounded-full font-mono">
                {activeBookings.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('notifications')}
              className={`pb-3 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
                activeTab === 'notifications'
                  ? 'border-cyan-700 text-cyan-950 font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Bell className="w-4 h-4" />
              <span>Notifications</span>
              {unreadProviderNotifications > 0 && (
                <span className="px-1.5 py-0.5 text-xs bg-cyan-600 text-white rounded-full font-mono">
                  {unreadProviderNotifications}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* =========================================================================
            TAB 1: INCOMING REQUESTS
           ========================================================================= */}
        {activeTab === 'requests' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Pending Review Requests</h2>
                <p className="text-xs text-slate-500">
                  Review investigator credentials, dates, and research protocols before approving.
                </p>
              </div>
            </div>

            {incomingRequests.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-500">
                <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
                <h3 className="font-bold text-slate-900 text-base">All Caught Up</h3>
                <p className="text-xs text-slate-500 mt-1">There are no pending booking requests right now.</p>
              </div>
            ) : (
              incomingRequests.map((b) => (
                <div
                  key={b.id}
                  className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-900">{b.id}</span>
                      <span className="px-2 py-0.5 rounded text-[11px] font-bold uppercase bg-amber-100 text-amber-800">
                        Pending Decision
                      </span>
                      <span className="text-xs text-slate-500">· Submitted {new Date(b.createdAt).toLocaleDateString()}</span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900">{b.resourceName}</h3>

                    <p className="text-xs text-slate-600">
                      Researcher: <span className="font-semibold text-slate-900">{b.researcherName}</span> ({b.researcherInstitution})
                    </p>

                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 max-w-xl">
                      <p className="font-semibold text-slate-900 mb-0.5">Stated Purpose:</p>
                      <p className="italic">{b.purpose}</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                      <span>Schedule: {b.startDate} to {b.endDate} ({b.totalDays} days)</span>
                      <span>Estimated Billing: ${b.totalCost}</span>
                      {b.requiresDelivery && (
                        <span className="flex items-center gap-1 text-cyan-700 font-semibold">
                          <Truck className="w-3.5 h-3.5" />
                          <span>Requires Delivery Partner</span>
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex md:flex-col gap-2 shrink-0">
                    <button
                      onClick={() => handleApprove(b.id)}
                      className="flex-1 md:flex-none px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Check className="w-4 h-4" />
                      <span>Approve Booking</span>
                    </button>
                    <button
                      onClick={() => setRejectingBookingId(b.id)}
                      className="flex-1 md:flex-none px-5 py-2 text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 font-semibold text-xs rounded-xl cursor-pointer"
                    >
                      Decline
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* =========================================================================
            TAB 2: MANAGED RESOURCES (Unified Equipment & Labs)
           ========================================================================= */}
        {activeTab === 'resources' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Your Facility Resources</h2>
                <p className="text-xs text-slate-500">
                  Manage instruments and containment research laboratories. Toggle availability and adjust rates.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {providerResources.map((res) => (
                <div
                  key={res.id}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs flex flex-col justify-between"
                >
                  <div className="relative h-44 bg-slate-100">
                    <img
                      src={res.imageUrl}
                      alt={res.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-2 py-1 rounded bg-slate-900/80 text-white text-[10px] font-bold uppercase">
                        {res.type === 'equipment' ? 'Equipment' : 'Laboratory Suite'}
                      </span>
                    </div>

                    <div className="absolute bottom-3 left-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          res.availabilityStatus === 'available'
                            ? 'bg-emerald-500 text-white'
                            : 'bg-amber-500 text-white'
                        }`}
                      >
                        {res.availabilityStatus}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-[11px] font-semibold text-cyan-800">{res.category}</span>
                      <h3 className="font-bold text-base text-slate-900 mt-1 line-clamp-1">{res.name}</h3>
                      <p className="text-xs text-slate-600 line-clamp-2 mt-1.5 leading-relaxed">
                        {res.description}
                      </p>
                      <div className="mt-3 text-xs font-semibold text-slate-800">
                        ${res.dayRate} / day · Deposit: ${res.securityDeposit}
                      </div>
                    </div>

                    <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                      <button
                        onClick={() =>
                          updateResource(res.id, {
                            availabilityStatus:
                              res.availabilityStatus === 'available' ? 'maintenance' : 'available',
                          })
                        }
                        className="text-xs font-semibold text-cyan-800 hover:underline cursor-pointer"
                      >
                        Toggle Status
                      </button>
                      <span className="text-[11px] text-slate-400">{res.location.split(',')[0]}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 3: ACTIVE BOOKINGS & RETURNS
           ========================================================================= */}
        {activeTab === 'active' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Active Bookings & Return Logs</h2>
                <p className="text-xs text-slate-500">
                  Display approved booking handover and return QR codes for researcher verification.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {activeBookings.map((b) => (
                <div
                  key={b.id}
                  className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-900">{b.id}</span>
                      <span
                        className={`px-2 py-0.5 rounded text-[11px] font-bold uppercase ${
                          b.status === 'active'
                            ? 'bg-emerald-100 text-emerald-800'
                            : b.status === 'completed'
                            ? 'bg-slate-100 text-slate-700'
                            : 'bg-cyan-100 text-cyan-800'
                        }`}
                      >
                        {b.status.replace(/_/g, ' ')}
                      </span>
                      {b.handoverVerifiedAt && (
                        <span className="text-[11px] text-emerald-700 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Handover Verified</span>
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-base text-slate-900">{b.resourceName}</h3>
                    <p className="text-xs text-slate-600">
                      Researcher: {b.researcherName} ({b.researcherInstitution})
                    </p>
                    <p className="text-xs text-slate-500">
                      Window: {b.startDate} to {b.endDate} · Total: ${b.totalCost}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {!b.requiresDelivery && b.status === 'approved' && !b.handoverVerifiedAt && (
                      <button
                        onClick={() => handleShowQr(b, 'handover')}
                        className="px-3 py-1.5 bg-cyan-700 hover:bg-cyan-800 text-white font-bold text-xs rounded-lg flex items-center gap-1.5 cursor-pointer"
                      >
                        <QrCode className="w-3.5 h-3.5" />
                        <span>Show Handover QR</span>
                      </button>
                    )}
                    {!b.requiresDelivery && b.status === 'active' && !b.returnVerifiedAt && (
                      <button
                        onClick={() => handleShowQr(b, 'return')}
                        className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-lg flex items-center gap-1.5 cursor-pointer"
                      >
                        <QrCode className="w-3.5 h-3.5" />
                        <span>Show Return QR</span>
                      </button>
                    )}
                    {b.requiresDelivery && b.status !== 'completed' && (
                      <span className="text-xs text-slate-500">QR displayed by assigned Delivery Partner</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {activeTab === 'notifications' && (
          <div className="space-y-4 max-w-3xl">
            <h2 className="text-lg font-bold text-slate-900">Provider Notifications</h2>
            <div className="space-y-3">
              {providerNotifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => markNotificationRead(notification.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    notification.read
                      ? 'bg-white border-slate-200 text-slate-600'
                      : 'bg-cyan-50/60 border-cyan-200 text-slate-900'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-bold text-sm text-slate-900">{notification.title}</h3>
                    <span className="text-[11px] text-slate-400">{notification.timestamp}</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{notification.message}</p>
                </div>
              ))}
              {providerNotifications.length === 0 && (
                <p className="text-sm text-slate-500">No provider notifications yet.</p>
              )}
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
            <p className="text-xs text-slate-600">
              {activeQr.booking.resourceName} · Booking {activeQr.booking.id}
            </p>
            <img src={activeQr.dataUrl} alt={`${activeQr.action} verification QR`} className="w-56 h-56 mx-auto" />
            <p className="text-xs text-slate-500">
              Ask the Researcher to scan this QR from their dashboard.
            </p>
          </div>
        </div>
      )}

      {/* Rejection Reason Modal */}
      {rejectingBookingId && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="font-bold text-base text-slate-900 mb-2">Decline Booking Request</h3>
            <p className="text-xs text-slate-600 mb-4">
              Please state the reason for declining (e.g. routine maintenance, calibration overhaul, or scheduling conflict):
            </p>
            <textarea
              rows={3}
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Reason for declining reservation..."
              className="w-full p-2.5 text-xs border border-slate-300 rounded-lg mb-4"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setRejectingBookingId(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
              >
                Cancel
              </button>
              <button
                onClick={handleRejectConfirm}
                className="px-4 py-2 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-lg cursor-pointer"
              >
                Confirm Decline
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Resource Modal */}
      {isAddResourceModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200">
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
              <div>
                <span className="text-xs text-cyan-400 font-semibold uppercase">Provider Inventory</span>
                <h3 className="text-lg font-bold">List Scientific Resource</h3>
              </div>
              <button
                onClick={() => setIsAddResourceModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateResource} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Resource Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewResType('equipment')}
                    className={`py-2 text-xs font-bold rounded-lg border ${
                      newResType === 'equipment'
                        ? 'border-cyan-600 bg-cyan-50 text-cyan-900'
                        : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    Scientific Instrument
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewResType('laboratory')}
                    className={`py-2 text-xs font-bold rounded-lg border ${
                      newResType === 'laboratory'
                        ? 'border-cyan-600 bg-cyan-50 text-cyan-900'
                        : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    Complete Laboratory Suite
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Resource Name
                </label>
                <input
                  type="text"
                  required
                  value={newResName}
                  onChange={(e) => setNewResName(e.target.value)}
                  placeholder="e.g. JEOL 2100 Plus Transmission Electron Microscope"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Category
                  </label>
                  <input
                    type="text"
                    required
                    value={newResCategory}
                    onChange={(e) => setNewResCategory(e.target.value)}
                    placeholder="Microscopy, Genomics, etc."
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Facility Location
                  </label>
                  <input
                    type="text"
                    required
                    value={newResLocation}
                    onChange={(e) => setNewResLocation(e.target.value)}
                    placeholder="Clark Center Room 102"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Day Rate ($)
                  </label>
                  <input
                    type="number"
                    required
                    value={newResDayRate}
                    onChange={(e) => setNewResDayRate(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Security Deposit ($)
                  </label>
                  <input
                    type="number"
                    required
                    value={newResDeposit}
                    onChange={(e) => setNewResDeposit(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Description & Capabilities
                </label>
                <textarea
                  required
                  rows={3}
                  value={newResDesc}
                  onChange={(e) => setNewResDesc(e.target.value)}
                  placeholder="Overview of specifications, detector options, and experimental applications..."
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddResourceModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer"
                >
                  Publish Resource
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

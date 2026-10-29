import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Resource, Booking } from '../../types';
import {
  Search,
  Filter,
  Microscope,
  Building2,
  Calendar,
  Clock,
  MapPin,
  ShieldCheck,
  QrCode,
  FileText,
  Truck,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  Star,
  Info,
  X,
  Bell,
  ArrowRight,
} from 'lucide-react';

export const ResearcherDashboard: React.FC = () => {
  const {
    user,
    resources,
    bookings,
    createBooking,
    openScanner,
    notifications,
    markNotificationRead,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'discover' | 'bookings' | 'notifications'>('discover');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<'all' | 'equipment' | 'laboratory'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Modal states
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [bookingStartDate, setBookingStartDate] = useState('2026-11-10');
  const [bookingEndDate, setBookingEndDate] = useState('2026-11-12');
  const [bookingPurpose, setBookingPurpose] = useState('');
  const [requiresDelivery, setRequiresDelivery] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [bookingSuccessMsg, setBookingSuccessMsg] = useState<string | null>(null);

  // Filter resources
  const categories = Array.from(new Set(resources.map((r) => r.category)));

  const filteredResources = resources.filter((r) => {
    const matchesSearch =
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.institution.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'all' || r.type === selectedType;
    const matchesCategory = selectedCategory === 'all' || r.category === selectedCategory;
    return matchesSearch && matchesType && matchesCategory;
  });

  // Filter researcher bookings
  const myBookings = bookings.filter((b) => b.researcherId === (user?.id || 'user_res_01'));
  const myNotifications = notifications.filter((notification) =>
    notification.userId === (user?.id || 'user_res_01') ||
    notification.userId === 'all'
  );

  const handleOpenBookModal = (res: Resource) => {
    setSelectedResource(res);
    setBookingPurpose('');
    setRequiresDelivery(false);
    setDeliveryAddress(user?.institution ? `${user.institution}, Department Lab 204` : '');
    setBookingSuccessMsg(null);
    setIsBookingModalOpen(true);
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedResource) return;

    if (!bookingStartDate || !bookingEndDate || !bookingPurpose.trim()) {
      alert('Please fill out all required fields.');
      return;
    }

    const res = createBooking({
      resourceId: selectedResource.id,
      startDate: bookingStartDate,
      endDate: bookingEndDate,
      purpose: bookingPurpose,
      requiresDelivery,
      deliveryAddress: requiresDelivery ? deliveryAddress : undefined,
    });

    if (res.success) {
      setBookingSuccessMsg(`Reservation request #${res.bookingId} submitted to ${selectedResource.providerName}.`);
      setTimeout(() => {
        setIsBookingModalOpen(false);
        setActiveTab('bookings');
      }, 1500);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
      {/* Top Profile & Action Bar */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-cyan-700 tracking-wider uppercase mb-1">
                <span>Researcher Portal</span>
                <span>·</span>
                <span className="flex items-center gap-1 text-emerald-700">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Verified Academic Credentials
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Welcome, {user?.name || 'Dr. Elena Rostova'}
              </h1>
              <p className="text-sm text-slate-500 mt-0.5">
                {user?.department || 'Structural Biology'} · {user?.institution || 'Institute for Molecular Oncology'}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => openScanner('handover')}
                className="px-4 py-2.5 bg-cyan-700 hover:bg-cyan-800 text-white text-sm font-bold rounded-xl shadow-xs flex items-center gap-2 transition-all cursor-pointer ring-1 ring-cyan-600/30"
              >
                <QrCode className="w-4 h-4 text-cyan-200" />
                <span>Scan Handover QR</span>
              </button>
              <button
                onClick={() => openScanner('return')}
                className="px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-sm font-bold rounded-xl shadow-xs flex items-center gap-2 transition-all cursor-pointer"
              >
                <QrCode className="w-4 h-4" />
                <span>Scan Return QR</span>
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-4 mt-6 border-b border-slate-200 -mb-6">
            <button
              onClick={() => setActiveTab('discover')}
              className={`pb-3 text-sm font-semibold border-b-2 transition-all ${
                activeTab === 'discover'
                  ? 'border-cyan-700 text-cyan-950 font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Explore Equipment & Labs
            </button>
            <button
              onClick={() => setActiveTab('bookings')}
              className={`pb-3 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
                activeTab === 'bookings'
                  ? 'border-cyan-700 text-cyan-950 font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <span>My Reservations</span>
              <span className="px-1.5 py-0.5 text-xs bg-slate-200 text-slate-800 rounded-full font-mono">
                {myBookings.length}
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
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* =========================================================================
            TAB 1: DISCOVER EQUIPMENT & LABORATORIES
           ========================================================================= */}
        {activeTab === 'discover' && (
          <div className="space-y-6">
            {/* Search and Filters */}
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                <div className="md:col-span-6 relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by instrument name, facility, or technique..."
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-cyan-500"
                  />
                </div>

                {/* Resource Type Selector */}
                <div className="md:col-span-3 flex bg-slate-100 p-1 rounded-xl">
                  <button
                    onClick={() => setSelectedType('all')}
                    className={`flex-1 text-xs font-semibold py-1.5 rounded-lg transition-all ${
                      selectedType === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                    }`}
                  >
                    All Types
                  </button>
                  <button
                    onClick={() => setSelectedType('equipment')}
                    className={`flex-1 text-xs font-semibold py-1.5 rounded-lg transition-all ${
                      selectedType === 'equipment' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                    }`}
                  >
                    Instruments
                  </button>
                  <button
                    onClick={() => setSelectedType('laboratory')}
                    className={`flex-1 text-xs font-semibold py-1.5 rounded-lg transition-all ${
                      selectedType === 'laboratory' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                    }`}
                  >
                    Laboratories
                  </button>
                </div>

                {/* Category Dropdown */}
                <div className="md:col-span-3">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-cyan-500"
                  >
                    <option value="all">All Scientific Categories</option>
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Active filters pill display */}
              <div className="flex items-center gap-2 text-xs text-slate-500 pt-1">
                <span>Showing {filteredResources.length} verified scientific resources available for booking</span>
              </div>
            </div>

            {/* Resource Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredResources.map((res) => (
                <div
                  key={res.id}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col group"
                >
                  {/* Image container */}
                  <div className="relative h-48 bg-slate-100 overflow-hidden">
                    <img
                      src={res.imageUrl}
                      alt={res.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      <span className="px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider bg-slate-900/80 text-white backdrop-blur-xs">
                        {res.type === 'equipment' ? 'Instrument' : 'Lab Facility'}
                      </span>
                    </div>

                    <div className="absolute bottom-3 right-3 px-2 py-1 bg-white/90 backdrop-blur-xs rounded-md text-xs font-bold text-slate-900 shadow-xs">
                      ${res.dayRate} <span className="text-[10px] font-normal text-slate-500">/ day</span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                        <span className="font-semibold text-cyan-800">{res.category}</span>
                        <div className="flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                          <span className="font-bold text-slate-800">{res.rating}</span>
                          <span className="text-slate-400">({res.reviewCount})</span>
                        </div>
                      </div>

                      <h3 className="font-bold text-base text-slate-900 line-clamp-1 group-hover:text-cyan-800 transition-colors">
                        {res.name}
                      </h3>

                      <p className="text-xs text-slate-600 line-clamp-2 mt-2 leading-relaxed">
                        {res.description}
                      </p>

                      <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-3">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{res.location}</span>
                      </div>
                    </div>

                    <div className="pt-4 mt-4 border-t border-slate-100 flex items-center gap-2">
                      <button
                        onClick={() => setSelectedResource(res)}
                        className="flex-1 py-2 px-3 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                      >
                        Specifications
                      </button>
                      <button
                        onClick={() => handleOpenBookModal(res)}
                        className="flex-1 py-2 px-3 text-xs font-bold text-white bg-slate-900 hover:bg-cyan-800 rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <span>Reserve</span>
                        <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 2: MY RESERVATIONS & BOOKINGS
           ========================================================================= */}
        {activeTab === 'bookings' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Your Reserved Scientific Resources</h2>
                <p className="text-xs text-slate-500">
                  Track ongoing booking statuses, delivery logistics, and custody QR tokens.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {myBookings.map((b) => (
                <div
                  key={b.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5"
                >
                  <div className="flex items-start gap-4">
                    <img
                      src={b.resourceImage}
                      alt={b.resourceName}
                      className="w-20 h-20 rounded-xl object-cover border border-slate-200 shrink-0"
                    />
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="font-mono text-xs font-bold text-slate-900">{b.id}</span>
                        <span
                          className={`px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider ${
                            b.status === 'active'
                              ? 'bg-emerald-100 text-emerald-800'
                              : b.status === 'in_delivery'
                              ? 'bg-cyan-100 text-cyan-800'
                              : b.status === 'completed'
                              ? 'bg-slate-100 text-slate-700'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {b.status.replace(/_/g, ' ')}
                        </span>
                        {b.requiresDelivery && (
                          <span className="flex items-center gap-1 text-[11px] font-medium text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded">
                            <Truck className="w-3 h-3" />
                            <span>Delivery: {b.deliveryStatus.replace(/_/g, ' ')}</span>
                          </span>
                        )}
                      </div>

                      <h3 className="font-bold text-base text-slate-900">{b.resourceName}</h3>
                      <p className="text-xs text-slate-500 mt-1">
                        Provider: {b.providerName} · {b.providerLocation}
                      </p>
                      <p className="text-xs text-slate-600 mt-1">
                        Reservation Window: <span className="font-medium text-slate-800">{b.startDate}</span> to{' '}
                        <span className="font-medium text-slate-800">{b.endDate}</span> ({b.totalDays} days) · Total: ${b.totalCost}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-2.5">
                    {b.handoverVerifiedAt && (
                      <span className="text-xs text-emerald-700">
                        Checked in: {new Date(b.handoverVerifiedAt).toLocaleString()}
                      </span>
                    )}
                    {b.returnVerifiedAt && (
                      <span className="text-xs text-slate-600">
                        Returned: {new Date(b.returnVerifiedAt).toLocaleString()}
                      </span>
                    )}
                    {!b.handoverVerifiedAt && (b.status === 'approved' ||
                      (b.requiresDelivery && b.status === 'in_delivery' && b.deliveryStatus === 'in_transit')) && (
                    <button
                      onClick={() => openScanner('handover')}
                      className="w-full sm:w-auto px-4 py-2 bg-cyan-700 hover:bg-cyan-800 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
                    >
                      Scan Handover QR
                    </button>
                    )}
                    {!b.returnVerifiedAt && (
                      (!b.requiresDelivery && b.status === 'active') ||
                      (b.requiresDelivery && b.status === 'return_pending' && b.deliveryStatus === 'return_transit')
                    ) && (
                      <button
                        onClick={() => openScanner('return')}
                        className="w-full sm:w-auto px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
                      >
                        Scan Return QR
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 3: NOTIFICATIONS
           ========================================================================= */}
        {activeTab === 'notifications' && (
          <div className="space-y-4 max-w-3xl">
            <h2 className="text-lg font-bold text-slate-900">Notifications & Delivery Alerts</h2>
            <div className="space-y-3">
              {myNotifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => markNotificationRead(n.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    n.read ? 'bg-white border-slate-200 text-slate-600' : 'bg-cyan-50/60 border-cyan-200 text-slate-900 font-medium'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-cyan-600" />
                      <h3 className="font-bold text-sm text-slate-900">{n.title}</h3>
                    </div>
                    <span className="text-[11px] text-slate-400">{n.timestamp}</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1 pl-4 leading-relaxed">{n.message}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Specifications Modal */}
      {selectedResource && !isBookingModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-200">
            <div className="relative h-48 bg-slate-900">
              <img
                src={selectedResource.imageUrl}
                alt={selectedResource.name}
                className="w-full h-full object-cover opacity-80"
              />
              <button
                onClick={() => setSelectedResource(null)}
                className="absolute top-3 right-3 p-1.5 rounded-full bg-black/60 text-white hover:bg-black transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="absolute bottom-3 left-4 right-4 text-white">
                <span className="text-xs font-semibold text-cyan-300 uppercase">
                  {selectedResource.category}
                </span>
                <h3 className="text-xl font-bold">{selectedResource.name}</h3>
              </div>
            </div>

            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <p className="text-sm text-slate-600 leading-relaxed">{selectedResource.description}</p>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2">
                  Technical Specifications
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {Object.entries(selectedResource.specifications).map(([key, value]) => (
                    <div key={key} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                      <span className="text-slate-500 font-medium block">{key}</span>
                      <span className="text-slate-900 font-semibold">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2">
                  Operational & Safety Guidelines
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-600">
                  {selectedResource.guidelines.map((g, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{g}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-500">Security Deposit:</span>{' '}
                  <span className="font-bold text-slate-900">${selectedResource.securityDeposit}</span>
                </div>
                <div>
                  <span className="text-slate-500">Daily Rate:</span>{' '}
                  <span className="font-bold text-cyan-800 text-sm">${selectedResource.dayRate}</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-3">
              <button
                onClick={() => setSelectedResource(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
              >
                Close
              </button>
              <button
                onClick={() => handleOpenBookModal(selectedResource)}
                className="px-5 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-cyan-800 rounded-lg cursor-pointer"
              >
                Proceed to Reservation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Booking Form Modal */}
      {isBookingModalOpen && selectedResource && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200">
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
              <div>
                <span className="text-xs text-cyan-400 font-semibold uppercase">Booking Reservation</span>
                <h3 className="text-lg font-bold">{selectedResource.name}</h3>
              </div>
              <button
                onClick={() => setIsBookingModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {bookingSuccessMsg ? (
              <div className="p-8 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
                <h4 className="font-bold text-lg text-slate-900">Request Submitted</h4>
                <p className="text-xs text-slate-600">{bookingSuccessMsg}</p>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit} className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Start Date
                    </label>
                    <input
                      type="date"
                      required
                      value={bookingStartDate}
                      onChange={(e) => setBookingStartDate(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      End Date
                    </label>
                    <input
                      type="date"
                      required
                      value={bookingEndDate}
                      onChange={(e) => setBookingEndDate(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Research Objective / Project Description
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={bookingPurpose}
                    onChange={(e) => setBookingPurpose(e.target.value)}
                    placeholder="Briefly state the research experiment or application purpose..."
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                  />
                </div>

                {/* Delivery Option */}
                {selectedResource.type === 'equipment' && (
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={requiresDelivery}
                        onChange={(e) => setRequiresDelivery(e.target.checked)}
                        className="w-4 h-4 text-cyan-600 rounded"
                      />
                      <span className="text-xs font-bold text-slate-800">
                        Request Specialized Scientific Delivery Partner
                      </span>
                    </label>
                    <p className="text-[11px] text-slate-500 pl-6">
                      Coordinated cold-chain / vibration-isolated delivery between institutions.
                    </p>

                    {requiresDelivery && (
                      <div className="pt-2 pl-6">
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                          Delivery Drop-off Address / Department Annex
                        </label>
                        <input
                          type="text"
                          required
                          value={deliveryAddress}
                          onChange={(e) => setDeliveryAddress(e.target.value)}
                          placeholder="e.g. Molecular Oncology Lab, Room 204"
                          className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-md"
                        />
                      </div>
                    )}
                  </div>
                )}

                <div className="p-3 bg-cyan-50 border border-cyan-200 rounded-xl text-xs flex justify-between items-center text-cyan-950 font-medium">
                  <span>Day Rate: ${selectedResource.dayRate}</span>
                  <span>Deposit: ${selectedResource.securityDeposit}</span>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsBookingModalOpen(false)}
                    className="px-4 py-2 text-xs text-slate-600 hover:text-slate-900 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-slate-900 hover:bg-cyan-800 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer"
                  >
                    Submit Booking Request
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
};

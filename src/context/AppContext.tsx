import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import {
  User,
  UserRole,
  Resource,
  Booking,
  BookingStatus,
  DeliveryAssignment,
  DeliveryStatus,
  AppNotification,
} from '../types';
import {
  DEMO_USERS,
  INITIAL_RESOURCES,
  INITIAL_BOOKINGS,
  INITIAL_DELIVERIES,
  INITIAL_NOTIFICATIONS,
} from '../data/initialData';

interface AppContextType {
  user: User | null;
  activeView: 'home' | 'dashboard' | 'scanner';
  demoRole: UserRole | null;
  resources: Resource[];
  bookings: Booking[];
  deliveries: DeliveryAssignment[];
  notifications: AppNotification[];
  authModalOpen: boolean;
  authInitialTab: 'login' | 'signup';
  authPreselectedRole: UserRole;
  isScannerOpen: boolean;
  scannerRole: 'researcher' | null;
  scannerAction: 'handover' | 'return';

  // Actions
  returnToHome: () => void;
  openAuth: (tab?: 'login' | 'signup', preselectedRole?: UserRole) => void;
  closeAuth: () => void;
  loginUser: (email: string, role?: UserRole) => boolean;
  registerUser: (data: {
    name: string;
    email: string;
    role: UserRole;
    institution: string;
    department?: string;
    phone?: string;
  }) => void;
  logout: () => void;
  setDemoPersona: (role: UserRole) => void;

  // Resources
  addResource: (data: Omit<Resource, 'id' | 'providerId' | 'providerName' | 'rating' | 'reviewCount'>) => void;
  updateResource: (id: string, updates: Partial<Resource>) => void;

  // Bookings
  createBooking: (data: {
    resourceId: string;
    startDate: string;
    endDate: string;
    purpose: string;
    requiresDelivery: boolean;
    deliveryAddress?: string;
  }) => { success: boolean; bookingId?: string; error?: string };
  updateBookingStatus: (bookingId: string, status: BookingStatus, notes?: string) => void;

  // Deliveries
  updateDeliveryStatus: (deliveryId: string, status: DeliveryStatus, note?: string) => void;

  // Scanner
  openScanner: (action: 'handover' | 'return') => void;
  closeScanner: () => void;
  verifyQrCode: (
    qrContent: string,
    action: 'handover' | 'return'
  ) => { success: boolean; message: string; booking?: Booking; actionType?: 'handover' | 'return' };

  // Notifications
  markNotificationRead: (id: string) => void;
  unreadCount: number;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  USER: 'rdna_user',
  DEMO_ROLE: 'rdna_demo_role',
  RESOURCES: 'rdna_resources',
  BOOKINGS: 'rdna_bookings',
  DELIVERIES: 'rdna_deliveries',
  NOTIFICATIONS: 'rdna_notifications',
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // CRITICAL REQUIREMENT: HOMEPAGE MUST OPEN FIRST
  // Start with user = null and activeView = 'home'
  const [user, setUser] = useState<User | null>(() => {
    // We intentionally start as null on fresh URL load unless user is explicitly in session
    // But per instructions: "When anyone opens the website through its URL, the first page must be the public homepage"
    return null;
  });

  const [activeView, setActiveView] = useState<'home' | 'dashboard' | 'scanner'>('home');
  const [demoRole, setDemoRole] = useState<UserRole | null>(null);

  const [resources, setResources] = useState<Resource[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.RESOURCES);
      return saved ? JSON.parse(saved) : INITIAL_RESOURCES;
    } catch {
      return INITIAL_RESOURCES;
    }
  });

  const [bookings, setBookings] = useState<Booking[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
      return saved ? JSON.parse(saved) : INITIAL_BOOKINGS;
    } catch {
      return INITIAL_BOOKINGS;
    }
  });

  const [deliveries, setDeliveries] = useState<DeliveryAssignment[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.DELIVERIES);
      return saved ? JSON.parse(saved) : INITIAL_DELIVERIES;
    } catch {
      return INITIAL_DELIVERIES;
    }
  });

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  });

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authInitialTab, setAuthInitialTab] = useState<'login' | 'signup'>('login');
  const [authPreselectedRole, setAuthPreselectedRole] = useState<UserRole>('researcher');

  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [scannerRole, setScannerRole] = useState<'researcher' | null>(null);
  const [scannerAction, setScannerAction] = useState<'handover' | 'return'>('handover');
  const verifiedQrCodes = useRef(new Set<string>());

  // Sync state to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.RESOURCES, JSON.stringify(resources));
    } catch (e) {
      console.warn('Storage sync error', e);
    }
  }, [resources]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
    } catch (e) {
      console.warn('Storage sync error', e);
    }
  }, [bookings]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.DELIVERIES, JSON.stringify(deliveries));
    } catch (e) {
      console.warn('Storage sync error', e);
    }
  }, [deliveries]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
    } catch (e) {
      console.warn('Storage sync error', e);
    }
  }, [notifications]);

  const returnToHome = () => {
    setActiveView('home');
    setIsScannerOpen(false);
  };

  const openAuth = (tab: 'login' | 'signup' = 'login', preselectedRole: UserRole = 'researcher') => {
    setAuthInitialTab(tab);
    setAuthPreselectedRole(preselectedRole);
    setAuthModalOpen(true);
  };

  const closeAuth = () => {
    setAuthModalOpen(false);
  };

  const loginUser = (email: string, role?: UserRole): boolean => {
    const targetRole = role || 'researcher';
    const demoUser = DEMO_USERS[targetRole];
    const loggedInUser: User = {
      ...demoUser,
      email: email.trim() || demoUser.email,
    };
    setUser(loggedInUser);
    setDemoRole(loggedInUser.role);
    setActiveView('dashboard');
    setAuthModalOpen(false);
    return true;
  };

  const registerUser = (data: {
    name: string;
    email: string;
    role: UserRole;
    institution: string;
    department?: string;
    phone?: string;
  }) => {
    const newUser: User = {
      id: `user_${Date.now()}`,
      name: data.name,
      email: data.email,
      role: data.role,
      institution: data.institution,
      department: data.department || 'Scientific Research',
      verified: true,
      phone: data.phone || '+1 (555) 000-0000',
      avatarUrl: `https://images.unsplash.com/photo-${data.role === 'provider' ? '1507003211169-0a1dd7228f2d' : data.role === 'delivery' ? '1500648767791-00dcc994a43e' : '1534528741775-53994a69daeb'}?auto=format&fit=crop&w=256&q=80`,
    };
    setUser(newUser);
    setDemoRole(newUser.role);
    setActiveView('dashboard');
    setAuthModalOpen(false);

    // Welcome notification
    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        userId: newUser.id,
        targetRole: newUser.role,
        title: 'Welcome to Resource DNA',
        message: `Your ${newUser.role} profile has been verified for ${newUser.institution}.`,
        type: 'system',
        read: false,
        timestamp: 'Just now',
      },
      ...prev,
    ]);
  };

  const logout = () => {
    setUser(null);
    setDemoRole(null);
    setActiveView('home');
    setIsScannerOpen(false);
  };

  const setDemoPersona = (role: UserRole) => {
    const selected = DEMO_USERS[role];
    setUser(selected);
    setDemoRole(role);
    setActiveView('dashboard');
    setIsScannerOpen(false);
  };

  const addResource = (data: Omit<Resource, 'id' | 'providerId' | 'providerName' | 'rating' | 'reviewCount'>) => {
    const newId = `res-${Date.now()}`;
    const newResource: Resource = {
      ...data,
      id: newId,
      providerId: user?.id || 'user_prov_01',
      providerName: user?.name || 'Prof. Marcus Vance',
      rating: 5.0,
      reviewCount: 0,
    };
    setResources((prev) => [newResource, ...prev]);

    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        userId: user?.id || 'user_prov_01',
        targetRole: 'provider',
        title: 'New Resource Published',
        message: `"${data.name}" has been listed and is now discoverable by verified researchers.`,
        type: 'system',
        read: false,
        timestamp: 'Just now',
      },
      ...prev,
    ]);
  };

  const updateResource = (id: string, updates: Partial<Resource>) => {
    setResources((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...updates } : r))
    );
  };

  const createBooking = (data: {
    resourceId: string;
    startDate: string;
    endDate: string;
    purpose: string;
    requiresDelivery: boolean;
    deliveryAddress?: string;
  }): { success: boolean; bookingId?: string; error?: string } => {
    const targetResource = resources.find((r) => r.id === data.resourceId);
    if (!targetResource) {
      return { success: false, error: 'Resource not found' };
    }

    const start = new Date(data.startDate);
    const end = new Date(data.endDate);
    const diffTime = Math.max(1, Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
    const totalCost = diffTime * targetResource.dayRate;

    const bookingId = `BK-DNA-${Math.floor(1000 + Math.random() * 9000)}`;
    const newBooking: Booking = {
      id: bookingId,
      resourceId: targetResource.id,
      resourceName: targetResource.name,
      resourceType: targetResource.type,
      resourceImage: targetResource.imageUrl,
      researcherId: user?.id || 'user_res_01',
      researcherName: user?.name || 'Dr. Elena Rostova',
      researcherEmail: user?.email || 'elena.rostova@biotech-institute.edu',
      researcherInstitution: user?.institution || 'Institute for Molecular Oncology',
      providerId: targetResource.providerId,
      providerName: targetResource.providerName,
      providerLocation: targetResource.location,
      startDate: data.startDate,
      endDate: data.endDate,
      totalDays: diffTime,
      totalCost,
      purpose: data.purpose,
      requiresDelivery: data.requiresDelivery,
      deliveryAddress: data.deliveryAddress,
      deliveryStatus: data.requiresDelivery ? 'assigned' : 'not_applicable',
      status: 'pending',
      handoverQrCode: '',
      returnQrCode: '',
      createdAt: new Date().toISOString(),
      deliveryPartnerId: data.requiresDelivery ? 'user_del_01' : undefined,
      deliveryPartnerName: data.requiresDelivery ? 'Apex Scientific Logistics' : undefined,
    };

    setBookings((prev) => [newBooking, ...prev]);

    // Create delivery assignment if delivery requested
    if (data.requiresDelivery) {
      const newDelivery: DeliveryAssignment = {
        id: `DEL-DNA-${Math.floor(100 + Math.random() * 900)}`,
        bookingId: bookingId,
        equipmentName: targetResource.name,
        resourceType: targetResource.type,
        pickupLocation: targetResource.location,
        dropoffLocation: data.deliveryAddress || 'Research Department Drop-off Bay',
        providerName: targetResource.providerName,
        providerContact: '+1 (555) 876-1209',
        researcherName: user?.name || 'Dr. Elena Rostova',
        researcherContact: user?.phone || '+1 (555) 432-8901',
        status: 'assigned',
        assignedPartnerId: 'user_del_01',
        assignedPartnerName: 'Apex Scientific Logistics',
        instructions: 'Handle with high-precision scientific transport protocols.',
        scheduledPickupDate: `${data.startDate} 08:30 AM`,
        scheduledDeliveryDate: `${data.startDate} 11:30 AM`,
        updatedAt: new Date().toISOString(),
        deliveryNotes: ['Delivery dispatch scheduled upon provider approval.'],
      };
      setDeliveries((prev) => [newDelivery, ...prev]);
    }

    // Add notification for provider
    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        userId: targetResource.providerId,
        targetRole: 'provider',
        title: 'New Booking Request',
        message: `${user?.name || 'A researcher'} requested booking for "${targetResource.name}".`,
        type: 'booking',
        read: false,
        timestamp: 'Just now',
        bookingId,
      },
      ...prev,
    ]);

    return { success: true, bookingId };
  };

  const updateBookingStatus = (bookingId: string, status: BookingStatus, notes?: string) => {
    const booking = bookings.find((b) => b.id === bookingId);
    if (!booking || user?.role !== 'provider' || booking.providerId !== user.id) return;
    if (booking.status !== 'pending' || (status !== 'approved' && status !== 'rejected')) return;
    const isApproval = booking.status === 'pending' && status === 'approved';
    const nextStatus: BookingStatus = isApproval && booking.requiresDelivery ? 'in_delivery' : status;
    const nextBooking = {
      ...booking,
      status: nextStatus,
      providerNotes: notes || booking.providerNotes,
      handoverQrCode: isApproval
        ? `rdna:v1:handover:${crypto.randomUUID()}`
        : status === 'rejected'
          ? ''
          : booking.handoverQrCode,
      returnQrCode: isApproval
        ? `rdna:v1:return:${crypto.randomUUID()}`
        : status === 'rejected'
          ? ''
          : booking.returnQrCode,
    };
    setBookings((prev) => prev.map((b) => (b.id === bookingId ? nextBooking : b)));
    if (isApproval) {
      setResources((prev) =>
        prev.map((resource) =>
          resource.id === booking.resourceId && resource.availabilityStatus === 'available'
            ? { ...resource, availabilityStatus: 'booked' }
            : resource
        )
      );
    }

    // QR credentials become active only when the Provider approves the request.
    if (booking) {
      const readableStatus = nextStatus.replace('_', ' ').toUpperCase();
      setNotifications((prev) => [
        {
          id: `notif-${Date.now()}`,
          userId: booking.researcherId,
          targetRole: 'researcher',
          title: `Booking Request ${readableStatus}`,
          message: `Your booking for "${booking.resourceName}" status was updated to ${readableStatus}.`,
          type: 'booking',
          read: false,
          timestamp: 'Just now',
          bookingId,
        },
        ...prev,
      ]);
    }
  };

  const updateDeliveryStatus = (deliveryId: string, status: DeliveryStatus, note?: string) => {
    const delivery = deliveries.find((d) => d.id === deliveryId);
    if (!delivery || user?.role !== 'delivery' || delivery.assignedPartnerId !== user.id) return;
    const booking = bookings.find((b) => b.id === delivery.bookingId);
    if (!booking || booking.deliveryPartnerId !== delivery.assignedPartnerId) return;

    const allowedProgression: Partial<Record<DeliveryStatus, DeliveryStatus>> = {
      assigned: 'out_for_pickup',
      out_for_pickup: 'in_transit',
      delivered: 'return_transit',
    };
    const isAddingNote = status === delivery.status && Boolean(note);
    if (!isAddingNote && allowedProgression[delivery.status] !== status) return;
    if (status === 'return_transit' && booking.status !== 'active') return;

    const now = new Date().toISOString();
    setDeliveries((prev) =>
      prev.map((d) =>
        d.id === deliveryId
          ? {
              ...d,
              status,
              updatedAt: now,
              deliveryNotes: note ? [...d.deliveryNotes, note] : d.deliveryNotes,
            }
          : d
      )
    );
    setBookings((prev) =>
      prev.map((b) =>
        b.id === booking.id
          ? {
              ...b,
              deliveryStatus: status,
              status: status === 'return_transit' ? 'return_pending' : b.status,
            }
          : b
      )
    );
  };

  const openScanner = (action: 'handover' | 'return') => {
    setScannerRole('researcher');
    setScannerAction(action);
    setIsScannerOpen(true);
    setActiveView('scanner');
  };

  const closeScanner = () => {
    setIsScannerOpen(false);
    setActiveView('dashboard');
  };

  const verifyQrCode = (
    qrContent: string,
    action: 'handover' | 'return'
  ): { success: boolean; message: string; booking?: Booking; actionType?: 'handover' | 'return' } => {
    const cleanQr = qrContent.trim();

    if (user?.role !== 'researcher') {
      return { success: false, message: 'Only the authorized Researcher can scan a booking QR code.' };
    }

    const matchingBooking = bookings.find((b) =>
      action === 'handover' ? b.handoverQrCode === cleanQr : b.returnQrCode === cleanQr
    );

    if (!matchingBooking) {
      return {
        success: false,
        message: `Invalid ${action} QR code. This credential is unknown or belongs to the other action.`,
      };
    }

    if (matchingBooking.researcherId !== user.id) {
      return {
        success: false,
        message: 'Authorization denied: this booking belongs to another Researcher.',
        booking: matchingBooking,
      };
    }

    if (action === 'handover') {
      if (verifiedQrCodes.current.has(cleanQr)) {
        return { success: false, message: 'This QR credential has already been used.', booking: matchingBooking };
      }
      const eligibleStatus = matchingBooking.requiresDelivery
        ? matchingBooking.status === 'in_delivery' && matchingBooking.deliveryStatus === 'in_transit'
        : matchingBooking.status === 'approved';
      const delivery = matchingBooking.requiresDelivery
        ? deliveries.find((d) => d.bookingId === matchingBooking.id)
        : undefined;
      if (!eligibleStatus || (matchingBooking.requiresDelivery &&
        (!delivery || delivery.assignedPartnerId !== matchingBooking.deliveryPartnerId))) {
        return {
          success: false,
          message: `Booking status "${matchingBooking.status}" is not eligible for handover verification.`,
          booking: matchingBooking,
        };
      }
      if (matchingBooking.handoverVerifiedAt) {
        return {
          success: false,
          message: `Duplicate Action: Handover was already verified on ${new Date(matchingBooking.handoverVerifiedAt).toLocaleDateString()}.`,
          booking: matchingBooking,
        };
      }

      const now = new Date().toISOString();
      verifiedQrCodes.current.add(cleanQr);
      const updatedBooking = {
        ...matchingBooking,
        status: 'active' as const,
        handoverVerifiedAt: now,
        deliveryStatus: matchingBooking.requiresDelivery ? 'delivered' as const : matchingBooking.deliveryStatus,
      };
      setBookings((prev) =>
        prev.map((b) => (b.id === matchingBooking.id ? updatedBooking : b))
      );
      if (delivery) {
        setDeliveries((prev) =>
          prev.map((d) => d.id === delivery.id
            ? { ...d, status: 'delivered', updatedAt: now, deliveryNotes: [...d.deliveryNotes, `Handover verified at ${now}.`] }
            : d)
        );
      }

      setNotifications((prev) => [
        {
          id: `notif-handover-${matchingBooking.id}`,
          userId: matchingBooking.providerId,
          targetRole: 'provider',
          title: 'Handover Verified Successfully',
          message: `${matchingBooking.resourceName} (Booking ${matchingBooking.id}) was handed over to ${matchingBooking.researcherName} at ${new Date(now).toLocaleString()}.`,
          type: 'booking',
          read: false,
          timestamp: 'Just now',
          bookingId: matchingBooking.id,
        },
        ...prev,
      ]);

      return {
        success: true,
        message: `Handover verified! "${matchingBooking.resourceName}" is now officially checked out and active.`,
        booking: updatedBooking,
        actionType: 'handover',
      };
    }

    // Process Return
    if (action === 'return') {
      if (verifiedQrCodes.current.has(cleanQr)) {
        return { success: false, message: 'This QR credential has already been used.', booking: matchingBooking };
      }
      if (matchingBooking.returnVerifiedAt) {
        return {
          success: false,
          message: `Duplicate Action: Return verification was already completed on ${new Date(matchingBooking.returnVerifiedAt).toLocaleDateString()}.`,
          booking: matchingBooking,
        };
      }

      const eligibleStatus = matchingBooking.requiresDelivery
        ? matchingBooking.status === 'return_pending' && matchingBooking.deliveryStatus === 'return_transit'
        : matchingBooking.status === 'active' || matchingBooking.status === 'return_pending';
      const delivery = matchingBooking.requiresDelivery
        ? deliveries.find((d) => d.bookingId === matchingBooking.id)
        : undefined;
      if (!eligibleStatus || (matchingBooking.requiresDelivery &&
        (!delivery || delivery.assignedPartnerId !== matchingBooking.deliveryPartnerId))) {
        return {
          success: false,
          message: `Booking status "${matchingBooking.status}" is not eligible for return verification.`,
          booking: matchingBooking,
        };
      }
      if (!matchingBooking.handoverVerifiedAt) {
        return {
          success: false,
          message: 'Return cannot be verified because this booking has no verified handover.',
          booking: matchingBooking,
        };
      }

      const now = new Date().toISOString();
      verifiedQrCodes.current.add(cleanQr);
      const updatedBooking = {
        ...matchingBooking,
        status: 'completed' as const,
        returnVerifiedAt: now,
        deliveryStatus: matchingBooking.requiresDelivery ? 'returned' as const : matchingBooking.deliveryStatus,
      };
      setBookings((prev) =>
        prev.map((b) => (b.id === matchingBooking.id ? updatedBooking : b))
      );
      if (delivery) {
        setDeliveries((prev) =>
          prev.map((d) => d.id === delivery.id
            ? { ...d, status: 'returned', updatedAt: now, deliveryNotes: [...d.deliveryNotes, `Return verified at ${now}.`] }
            : d)
        );
      }

      // Mark resource available again
      const hasOtherActiveBookings = bookings.some((booking) =>
        booking.id !== matchingBooking.id &&
        booking.resourceId === matchingBooking.resourceId &&
        ['approved', 'in_delivery', 'active', 'return_pending'].includes(booking.status)
      );
      if (!hasOtherActiveBookings) {
        setResources((prev) =>
          prev.map((resource) =>
            resource.id === matchingBooking.resourceId && resource.availabilityStatus === 'booked'
              ? { ...resource, availabilityStatus: 'available' }
              : resource
          )
        );
      }

      setNotifications((prev) => [
        {
          id: `notif-return-${matchingBooking.id}`,
          userId: matchingBooking.providerId,
          targetRole: 'provider',
          title: 'Return Verified & Booking Completed',
          message: `${matchingBooking.resourceName} (Booking ${matchingBooking.id}) was returned by ${matchingBooking.researcherName} at ${new Date(now).toLocaleString()}.`,
          type: 'booking',
          read: false,
          timestamp: 'Just now',
          bookingId: matchingBooking.id,
        },
        ...prev,
      ]);

      return {
        success: true,
        message: `Return verified! "${matchingBooking.resourceName}" has been safely returned and the booking cycle is completed.`,
        booking: updatedBooking,
        actionType: 'return',
      };
    }

    return {
      success: false,
      message: 'Unknown QR verification token.',
    };
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <AppContext.Provider
      value={{
        user,
        activeView,
        demoRole,
        resources,
        bookings,
        deliveries,
        notifications,
        authModalOpen,
        authInitialTab,
        authPreselectedRole,
        isScannerOpen,
        scannerRole,
        scannerAction,
        returnToHome,
        openAuth,
        closeAuth,
        loginUser,
        registerUser,
        logout,
        setDemoPersona,
        addResource,
        updateResource,
        createBooking,
        updateBookingStatus,
        updateDeliveryStatus,
        openScanner,
        closeScanner,
        verifyQrCode,
        markNotificationRead,
        unreadCount,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

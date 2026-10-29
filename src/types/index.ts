export type UserRole = 'researcher' | 'provider' | 'delivery';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  institution: string;
  department?: string;
  avatarUrl?: string;
  verified: boolean;
  phone?: string;
}

export type ResourceType = 'equipment' | 'laboratory';

export type AvailabilityStatus = 'available' | 'booked' | 'maintenance';

export interface Resource {
  id: string;
  name: string;
  type: ResourceType;
  category: string;
  description: string;
  specifications: Record<string, string>;
  institution: string;
  location: string;
  dayRate: number;
  securityDeposit: number;
  availabilityStatus: AvailabilityStatus;
  imageUrl: string;
  guidelines: string[];
  providerId: string;
  providerName: string;
  rating: number;
  reviewCount: number;
  capacity?: string; // For laboratories (e.g., "12 workstations")
  certifications?: string[]; // e.g., ["BSL-2 Certified", "ISO 9001"]
}

export type BookingStatus =
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'in_delivery'
  | 'active' // handed over and in use
  | 'return_pending'
  | 'completed'
  | 'cancelled';

export type DeliveryStatus =
  | 'not_applicable'
  | 'assigned'
  | 'out_for_pickup'
  | 'in_transit'
  | 'delivered'
  | 'return_transit'
  | 'returned';

export interface Booking {
  id: string;
  resourceId: string;
  resourceName: string;
  resourceType: ResourceType;
  resourceImage: string;
  researcherId: string;
  researcherName: string;
  researcherEmail: string;
  researcherInstitution: string;
  providerId: string;
  providerName: string;
  providerLocation: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  totalCost: number;
  purpose: string;
  requiresDelivery: boolean;
  deliveryAddress?: string;
  deliveryPartnerId?: string;
  deliveryPartnerName?: string;
  deliveryStatus: DeliveryStatus;
  status: BookingStatus;
  handoverQrCode: string;
  returnQrCode: string;
  handoverVerifiedAt?: string;
  returnVerifiedAt?: string;
  createdAt: string;
  notes?: string;
  providerNotes?: string;
}

export interface DeliveryAssignment {
  id: string;
  bookingId: string;
  equipmentName: string;
  resourceType: ResourceType;
  pickupLocation: string;
  dropoffLocation: string;
  providerName: string;
  providerContact: string;
  researcherName: string;
  researcherContact: string;
  status: DeliveryStatus;
  assignedPartnerId: string;
  assignedPartnerName: string;
  instructions: string;
  scheduledPickupDate: string;
  scheduledDeliveryDate: string;
  updatedAt: string;
  deliveryNotes: string[];
}

export interface AppNotification {
  id: string;
  userId: string; // or 'all' or role
  targetRole?: UserRole;
  title: string;
  message: string;
  type: 'booking' | 'delivery' | 'system';
  read: boolean;
  timestamp: string;
  bookingId?: string;
}

export interface Review {
  id: string;
  resourceId: string;
  bookingId: string;
  researcherName: string;
  rating: number;
  comment: string;
  date: string;
}

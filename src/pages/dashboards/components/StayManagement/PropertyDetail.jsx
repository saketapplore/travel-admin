import React, { useState } from 'react';
import {
  X,
  MapPin,
  Phone,
  Mail,
  Clock,
  Users,
  Wifi,
  Wind,
  CookingPot,
  Shield,
  CreditCard,
  RefreshCw,
  Info,
  BedDouble,
  Globe,
  FileText,
  Compass,
  Loader2,
  Edit3,
  Calendar,
  Plus,
  Trash2
} from 'lucide-react';
import ImageUploader from './ImageUploader';
import EditPropertyModal from './EditPropertyModal';
import EditRoomModal from './EditRoomModal';
import CalendarModal from './CalendarModal';
import AddRoomModal from './AddRoomModal';
import AvailabilityCalendarEditor from './AvailabilityCalendarEditor';

/**
 * Maps feature codes to human-readable labels + icons
 */
const FEATURE_MAP = {
  WIFI: { label: 'Wi-Fi', icon: Wifi },
  AIR_CONDITIONING: { label: 'Air Conditioning', icon: Wind },
  KITCHEN: { label: 'Kitchen', icon: CookingPot },
  HEATING: { label: 'Heating', icon: Wind },
  TV: { label: 'TV', icon: Globe },
  PARKING: { label: 'Parking', icon: MapPin },
};

const getFeatureLabel = (code) => {
  const feature = FEATURE_MAP[code];
  if (feature) return feature;
  // Fallback: humanize the code
  return {
    label: code.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
    icon: Info
  };
};

/**
 * PropertyDetail - Slide-in detail panel for a selected property
 */
const PropertyDetail = ({
  property,
  open,
  onClose,
  onSync,
  syncing,
  onUpdateImages,
  updatingImages,
  imageUpdateTarget,
  onUpdatePropertyDetail,
  onUpdateRoomDetail,
  onUpdateRoomCalendar,
  onCreateRoom,
  onDeleteProperty,
}) => {
  const [propertyEditOpen, setPropertyEditOpen] = useState(false);
  const [roomEditOpen, setRoomEditOpen] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [addRoomOpen, setAddRoomOpen] = useState(false);
  const [activeRoomToEdit, setActiveRoomToEdit] = useState(null);
  const [deletingProperty, setDeletingProperty] = useState(false);

  if (!property) return null;

  const texts = property.texts?.[0] || {};
  const bookingRules = property.bookingRules || {};
  const paymentCollection = property.paymentCollection || {};
  const cardSettings = property.cardSettings || {};
  const depositInfo = paymentCollection.depositPayment1?.variableAmount || {};

  const acceptedCards = [
    cardSettings.cardAcceptVisa && 'Visa',
    cardSettings.cardAcceptMaster && 'Mastercard',
    cardSettings.cardAcceptAmex && 'Amex'
  ].filter(Boolean);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] transition-opacity duration-300 ${
          open ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Slide-in Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-2xl bg-white z-[70] shadow-2xl transition-transform duration-300 ease-out flex flex-col ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex-shrink-0 bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-5">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span
                  className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full ${
                    property.isSynced
                      ? 'bg-green-400/20 text-green-100'
                      : 'bg-yellow-400/20 text-yellow-100'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      property.isSynced ? 'bg-green-300' : 'bg-yellow-300'
                    }`}
                  />
                  {property.isSynced ? 'Synced' : 'Not Synced'}
                </span>
                <span className="text-xs text-white/60 capitalize">
                  {property.propertyType || 'Property'}
                </span>
              </div>
              <h2 className="text-xl font-bold text-white truncate">{property.name}</h2>
              {property.city && (
                <p className="text-white/80 text-sm flex items-center gap-1.5 mt-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {property.address ? `${property.address}, ` : ''}
                  {property.city}
                </p>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-colors flex-shrink-0 ml-3"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick actions */}
          <div className="flex items-center gap-2 mt-4 flex-wrap">
            {/* Sync only for Beds24 properties */}
            {!property.isCustomProperty && (
              <button
                onClick={() => onSync(property.id)}
                disabled={syncing}
                className="flex items-center gap-2 px-4 py-2 bg-white/15 hover:bg-white/25 text-white text-sm font-semibold rounded-xl transition-all disabled:opacity-50 border border-white/20"
              >
                {syncing ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                {syncing ? 'Syncing...' : 'Sync Property'}
              </button>
            )}

            <button
              onClick={() => setPropertyEditOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-orange-700/30 hover:bg-orange-700/50 text-white text-sm font-semibold rounded-xl transition-all border border-white/20"
            >
              <Edit3 className="w-4 h-4" />
              Edit Details
            </button>

            {/* Add Room — custom properties only */}
            {property.isCustomProperty && (
              <button
                onClick={() => setAddRoomOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-white/15 hover:bg-white/25 text-white text-sm font-semibold rounded-xl transition-all border border-white/20"
              >
                <Plus className="w-4 h-4" />
                Add Room
              </button>
            )}

            {/* Delete — custom properties only */}
            {property.isCustomProperty && (
              <button
                onClick={async () => {
                  if (!window.confirm(`Delete "${property.name}" and all its rooms? This cannot be undone.`)) return;
                  setDeletingProperty(true);
                  try { await onDeleteProperty(property._id || property.id); } finally { setDeletingProperty(false); }
                }}
                disabled={deletingProperty}
                className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/40 text-white text-sm font-semibold rounded-xl transition-all border border-white/20 disabled:opacity-50"
              >
                {deletingProperty ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                {deletingProperty ? 'Deleting...' : 'Delete'}
              </button>
            )}
          </div>
        </div>

        {/* Image protection notice — Beds24 only */}
        {!property.isCustomProperty && (
          <div className="flex-shrink-0 mx-6 mt-4 px-4 py-3 bg-blue-50 border border-blue-100 rounded-xl flex items-start gap-2.5">
            <Shield className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-blue-700 leading-relaxed">
              <span className="font-semibold">Image Protection:</span> Syncing metadata will{' '}
              <span className="font-bold underline">NOT</span> delete your custom uploaded images. Only
              address, rules, pricing, and occupancy data are overwritten.
            </p>
          </div>
        )}

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-6 pb-8">
          {/* Contact & Check-in Info */}
          <section className="mt-5">
            <div className="grid grid-cols-2 gap-3">
              {property.phone && (
                <div className="flex items-center gap-2 px-3 py-2.5 bg-gray-50 rounded-xl">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-700">{property.phone}</span>
                </div>
              )}
              {property.email && (
                <div className="flex items-center gap-2 px-3 py-2.5 bg-gray-50 rounded-xl">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-700 truncate">{property.email}</span>
                </div>
              )}
              {property.checkInStart && (
                <div className="flex items-center gap-2 px-3 py-2.5 bg-gray-50 rounded-xl">
                  <Clock className="w-4 h-4 text-green-500" />
                  <div>
                    <span className="text-[10px] text-gray-400 uppercase font-bold block">Check-in</span>
                    <span className="text-sm text-gray-700">
                      {property.checkInStart} – {property.checkInEnd || 'Flexible'}
                    </span>
                  </div>
                </div>
              )}
              {property.checkOutEnd && (
                <div className="flex items-center gap-2 px-3 py-2.5 bg-gray-50 rounded-xl">
                  <Clock className="w-4 h-4 text-red-400" />
                  <div>
                    <span className="text-[10px] text-gray-400 uppercase font-bold block">Check-out</span>
                    <span className="text-sm text-gray-700">By {property.checkOutEnd}</span>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Booking Rules & Payment */}
          <section className="mt-6">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
              Booking Rules & Payment
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="px-3 py-2.5 bg-gray-50 rounded-xl">
                <span className="text-[10px] text-gray-400 uppercase font-bold block">Booking Type</span>
                <span className="text-sm text-gray-700 capitalize">
                  {bookingRules.bookingType?.replace(/([A-Z])/g, ' $1') || 'N/A'}
                </span>
              </div>
              <div className="px-3 py-2.5 bg-gray-50 rounded-xl">
                <span className="text-[10px] text-gray-400 uppercase font-bold block">Cancellation</span>
                <span className="text-sm text-gray-700 capitalize">
                  {bookingRules.allowGuestCancellation?.type || 'N/A'}
                </span>
              </div>
              <div className="px-3 py-2.5 bg-gray-50 rounded-xl">
                <span className="text-[10px] text-gray-400 uppercase font-bold block">Deposit</span>
                <span className="text-sm text-gray-700">
                  {depositInfo.percentageValue
                    ? `${depositInfo.percentageValue}% (${depositInfo.type || 'percentage'})`
                    : 'N/A'}
                </span>
              </div>
              <div className="px-3 py-2.5 bg-gray-50 rounded-xl">
                <span className="text-[10px] text-gray-400 uppercase font-bold block">VAT Rate</span>
                <span className="text-sm text-gray-700">
                  {bookingRules.vatRatePercentage != null
                    ? `${bookingRules.vatRatePercentage}%`
                    : 'N/A'}
                </span>
              </div>
              {acceptedCards.length > 0 && (
                <div className="col-span-2 px-3 py-2.5 bg-gray-50 rounded-xl flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-700">
                    Accepted: {acceptedCards.join(', ')}
                  </span>
                </div>
              )}
            </div>
          </section>

          {/* Policies & Directions */}
          {(texts.generalPolicy || texts.directions) && (
            <section className="mt-6">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                Policies & Directions
              </h3>
              {texts.generalPolicy && (
                <div className="mb-3 px-4 py-3 bg-amber-50 border border-amber-100 rounded-xl">
                  <div className="flex items-center gap-2 mb-1">
                    <FileText className="w-3.5 h-3.5 text-amber-600" />
                    <span className="text-xs font-bold text-amber-700 uppercase">House Rules</span>
                  </div>
                  <p className="text-sm text-amber-800 leading-relaxed">{texts.generalPolicy}</p>
                </div>
              )}
              {texts.directions && (
                <div className="px-4 py-3 bg-blue-50 border border-blue-100 rounded-xl">
                  <div className="flex items-center gap-2 mb-1">
                    <Compass className="w-3.5 h-3.5 text-blue-600" />
                    <span className="text-xs font-bold text-blue-700 uppercase">Directions</span>
                  </div>
                  <p className="text-sm text-blue-800 leading-relaxed">{texts.directions}</p>
                </div>
              )}
            </section>
          )}

          {/* Property Images */}
          <section className="mt-6">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
              Property Images
            </h3>
            <div className="p-4 bg-gray-50/80 border border-gray-100 rounded-2xl">
              <ImageUploader
                images={property.images || []}
                onSave={(images) => onUpdateImages(property.id, images)}
                saving={
                  updatingImages &&
                  imageUpdateTarget?.propertyId === property.id &&
                  !imageUpdateTarget?.roomId
                }
                label="Property Photos"
              />
            </div>
          </section>

          {/* Room Types */}
          {property.roomTypes && property.roomTypes.length > 0 ? (
            <section className="mt-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Room Types ({property.roomTypes.length})
                </h3>
                {property.isCustomProperty && (
                  <button
                    onClick={() => setAddRoomOpen(true)}
                    className="flex items-center gap-1.5 text-xs font-semibold text-orange-600 hover:text-orange-700 hover:bg-orange-50 px-3 py-1.5 rounded-lg border border-orange-200 transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Room
                  </button>
                )}
              </div>
              <div className="space-y-3">
                {property.roomTypes.map((room) => {
                  const roomTexts = room.texts?.[0] || {};
                  // Flatten feature codes
                  const features = (room.featureCodes || [])
                    .flat()
                    .filter((code) => typeof code === 'string');

                  return (
                    <div
                      key={room.id}
                      className="border border-gray-200 rounded-2xl overflow-hidden bg-white"
                    >
                      {/* Room header */}
                      <div className="w-full flex items-center justify-between px-4 py-4 bg-gray-50/50 border-b border-gray-100">
                        <div className="flex items-center gap-3 text-left">
                          <div className="p-2 bg-orange-50 rounded-xl shadow-sm">
                            <BedDouble className="w-5 h-5 text-orange-500" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-gray-800">{room.name}</p>
                            <div className="flex items-center gap-3 text-xs text-gray-500 mt-0.5">
                              <span className="flex items-center gap-1">
                                <Users className="w-3 h-3 text-gray-400" /> Max {room.maxPeople || 'N/A'}
                              </span>
                              <span>Qty: {room.qty || 1}</span>
                              {room.rackRate && (
                                <span className="text-orange-600 font-bold bg-orange-50 px-1.5 py-0.5 rounded-md">
                                  {property.currency || '₹'} {room.rackRate.toLocaleString()}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        {property.isSynced && (
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => {
                                setActiveRoomToEdit(room);
                                setCalendarOpen(true);
                              }}
                              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                              title="Manage Pricing & Availability"
                            >
                              <Calendar className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                setActiveRoomToEdit(room);
                                setRoomEditOpen(true);
                              }}
                              className="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-all"
                              title="Edit Room Overrides"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Room details (Always visible now) */}
                      <div className="px-4 py-5 space-y-5">
                        {/* Features / Amenities */}
                        {(room.amenities?.length > 0 || features.length > 0) && (
                          <div>
                            <span className="text-[10px] text-gray-400 uppercase font-bold block mb-2.5">
                              Amenities
                            </span>
                            <div className="flex flex-wrap gap-2">
                              {/* Show custom amenities if they exist, otherwise fallback to feature codes */}
                              {room.amenities?.length > 0 ? (
                                room.amenities.map((amenity, idx) => (
                                  <span
                                    key={idx}
                                    className="inline-flex items-center gap-1.5 text-xs text-orange-700 bg-orange-50 border border-orange-100 px-2.5 py-1.5 rounded-lg font-medium"
                                  >
                                    <Shield className="w-3 h-3 text-orange-400" />
                                    {amenity}
                                  </span>
                                ))
                              ) : (
                                features.map((code) => {
                                  const { label, icon: FeatureIcon } = getFeatureLabel(code);
                                  return (
                                    <span
                                      key={code}
                                      className="inline-flex items-center gap-1.5 text-xs text-gray-600 bg-gray-50 border border-gray-200 px-2.5 py-1.5 rounded-lg"
                                    >
                                      <FeatureIcon className="w-3 h-3 text-orange-400" />
                                      {label}
                                    </span>
                                  );
                                })
                              )}
                            </div>
                          </div>
                        )}

                        {/* Room Description */}
                        {(roomTexts.roomDescription || room.roomDescription) && (
                          <div>
                            <span className="text-[10px] text-gray-400 uppercase font-bold block mb-1.5">
                              Description
                            </span>
                            <p className="text-sm text-gray-600 leading-relaxed">
                              {roomTexts.roomDescription || room.roomDescription}
                            </p>
                          </div>
                        )}

                        {/* Room Images */}
                        <div>
                          <span className="text-[10px] text-gray-400 uppercase font-bold block mb-3">
                            {room.name} Photos
                          </span>
                          <div className="p-4 bg-gray-50/50 border border-gray-100 rounded-2xl">
                            <ImageUploader
                              images={room.images || []}
                              onSave={(images) =>
                                onUpdateImages(property.id, images, room.id)
                              }
                              saving={
                                updatingImages &&
                                imageUpdateTarget?.propertyId === property.id &&
                                imageUpdateTarget?.roomId === room.id
                              }
                              label="Room Images"
                            />
                          </div>
                        </div>

                        {/* Inline availability calendar — custom rooms only */}
                        {room.isCustomRoom && (
                          <AvailabilityCalendarEditor
                            room={room}
                            property={property}
                            onUpdate={onUpdateRoomCalendar}
                          />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          ) : property.isSynced && (
            <section className="mt-6 p-8 border-2 border-dashed border-gray-100 rounded-2xl flex flex-col items-center justify-center text-center">
              <BedDouble className="w-8 h-8 text-gray-200 mb-2" />
              <p className="text-sm text-gray-400 font-medium">No Room Types found for this property.</p>
              {property.isCustomProperty ? (
                <button
                  onClick={() => setAddRoomOpen(true)}
                  className="mt-3 flex items-center gap-1.5 text-sm font-semibold text-orange-600 hover:text-orange-700 hover:bg-orange-50 px-4 py-2 rounded-xl border border-orange-200 transition-all"
                >
                  <Plus className="w-4 h-4" /> Add First Room
                </button>
              ) : (
                <p className="text-xs text-gray-400 mt-1">Try syncing again if you expect rooms to be here.</p>
              )}
            </section>
          )}

          {/* Coordinates */}
          {property.latitude && property.longitude && (
            <section className="mt-6 mb-4">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                Location
              </h3>
              <div className="px-3 py-2.5 bg-gray-50 rounded-xl flex items-center gap-2 text-sm text-gray-600">
                <Globe className="w-4 h-4 text-gray-400" />
                {property.latitude.toFixed(6)}, {property.longitude.toFixed(6)}
                <a
                  href={`https://www.google.com/maps?q=${property.latitude},${property.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-auto text-xs text-orange-500 hover:text-orange-600 font-semibold"
                >
                  Open in Maps →
                </a>
              </div>
            </section>
          )}
        </div>

        {/* Modals */}
        <EditPropertyModal
          isOpen={propertyEditOpen}
          onClose={() => setPropertyEditOpen(false)}
          property={property}
          onUpdate={onUpdatePropertyDetail}
        />

        <EditRoomModal
          isOpen={roomEditOpen}
          onClose={() => {
            setRoomEditOpen(false);
            setActiveRoomToEdit(null);
          }}
          room={property.roomTypes?.find(r => r.id === activeRoomToEdit?.id)}
          property={property}
          onUpdate={onUpdateRoomDetail}
        />

        <CalendarModal
          isOpen={calendarOpen}
          onClose={() => {
            setCalendarOpen(false);
            setActiveRoomToEdit(null);
          }}
          room={property.roomTypes?.find(r => r.id === activeRoomToEdit?.id)}
          property={property}
          onUpdate={onUpdateRoomCalendar}
        />

        <AddRoomModal
          isOpen={addRoomOpen}
          onClose={() => setAddRoomOpen(false)}
          property={property}
          onAddRoom={(roomData) => onCreateRoom(property._id || property.id, roomData)}
        />
      </div>
    </>
  );
};

export default PropertyDetail;

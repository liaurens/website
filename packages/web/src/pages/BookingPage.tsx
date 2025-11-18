import { useState, useEffect } from 'react';
import { format, addDays, startOfWeek } from 'date-fns';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { apiService } from '../services/api';
import { TimeSlot, CreateBookingRequest } from '@coaching-platform/shared';

export function BookingPage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    client_name: '',
    client_email: '',
    client_phone: '',
    notes: '',
  });

  // Load available slots when date changes
  useEffect(() => {
    loadAvailability();
  }, [selectedDate]);

  async function loadAvailability() {
    setLoading(true);
    setError(null);
    try {
      const dateStr = format(selectedDate, 'yyyy-MM-dd');
      const slots = await apiService.getAvailability(dateStr);
      setAvailableSlots(slots);
    } catch (err: any) {
      setError('Failed to load availability. Please try again.');
      console.error('Error loading availability:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!selectedSlot) {
      setError('Please select a time slot');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const booking: CreateBookingRequest = {
        ...formData,
        start_time: selectedSlot.start_time,
        end_time: selectedSlot.end_time,
      };

      await apiService.createBooking(booking);
      setSuccess(true);

      // Reset form
      setFormData({
        client_name: '',
        client_email: '',
        client_phone: '',
        notes: '',
      });
      setSelectedSlot(null);

      // Reload availability
      await loadAvailability();
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Failed to create booking. Please try again.');
      console.error('Error creating booking:', err);
    } finally {
      setSubmitting(false);
    }
  }

  // Generate week view
  const weekStart = startOfWeek(selectedDate);
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-primary text-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold">Book a Coaching Session</h1>
          <p className="text-blue-100 mt-2">Select a date and time that works for you</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
          {/* Calendar Section */}
          <div>
            <Card title="Select Date & Time">
              {/* Week Navigator */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setSelectedDate(addDays(selectedDate, -7))}
                  >
                    ← Previous Week
                  </Button>
                  <span className="font-medium">
                    {format(weekStart, 'MMM d')} - {format(addDays(weekStart, 6), 'MMM d, yyyy')}
                  </span>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setSelectedDate(addDays(selectedDate, 7))}
                  >
                    Next Week →
                  </Button>
                </div>

                {/* Week Days */}
                <div className="grid grid-cols-7 gap-2">
                  {weekDays.map((day) => {
                    const isSelected = format(day, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd');
                    const isToday = format(day, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');

                    return (
                      <button
                        key={day.toISOString()}
                        onClick={() => setSelectedDate(day)}
                        className={`
                          p-3 rounded-lg text-center transition-colors
                          ${isSelected ? 'bg-primary text-white' : 'bg-gray-100 hover:bg-gray-200'}
                          ${isToday && !isSelected ? 'ring-2 ring-primary' : ''}
                        `}
                      >
                        <div className="text-xs font-medium">{format(day, 'EEE')}</div>
                        <div className="text-lg font-bold">{format(day, 'd')}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Time Slots */}
              <div>
                <h4 className="font-semibold mb-3">Available Times</h4>

                {loading && (
                  <div className="text-center py-8 text-gray-500">
                    Loading available slots...
                  </div>
                )}

                {!loading && availableSlots.filter(s => s.available).length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No available slots for this date.
                  </div>
                )}

                {!loading && availableSlots.filter(s => s.available).length > 0 && (
                  <div className="grid grid-cols-2 gap-2 max-h-96 overflow-y-auto">
                    {availableSlots
                      .filter(slot => slot.available)
                      .map((slot) => {
                        const isSelected = selectedSlot?.start_time === slot.start_time;
                        return (
                          <button
                            key={slot.start_time}
                            onClick={() => setSelectedSlot(slot)}
                            className={`
                              p-3 rounded-lg text-center transition-colors
                              ${isSelected ? 'bg-success text-white' : 'bg-gray-100 hover:bg-gray-200'}
                            `}
                          >
                            {format(new Date(slot.start_time), 'h:mm a')}
                          </button>
                        );
                      })}
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Booking Form */}
          <div>
            <Card title="Your Information">
              {success ? (
                <div className="text-center py-8">
                  <div className="text-6xl mb-4">✓</div>
                  <h3 className="text-2xl font-bold text-success mb-2">Booking Requested!</h3>
                  <p className="text-gray-600 mb-6">
                    Your booking request has been submitted. You'll receive a confirmation email once it's approved.
                  </p>
                  <Button onClick={() => setSuccess(false)}>
                    Book Another Session
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {selectedSlot && (
                    <div className="bg-blue-50 border border-primary rounded-lg p-4 mb-4">
                      <p className="font-medium">Selected Time:</p>
                      <p className="text-lg">
                        {format(new Date(selectedSlot.start_time), 'EEEE, MMMM d, yyyy')}
                      </p>
                      <p className="text-2xl font-bold text-primary">
                        {format(new Date(selectedSlot.start_time), 'h:mm a')} -
                        {format(new Date(selectedSlot.end_time), 'h:mm a')}
                      </p>
                    </div>
                  )}

                  <Input
                    label="Full Name"
                    type="text"
                    required
                    value={formData.client_name}
                    onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                    placeholder="John Doe"
                  />

                  <Input
                    label="Email"
                    type="email"
                    required
                    value={formData.client_email}
                    onChange={(e) => setFormData({ ...formData, client_email: e.target.value })}
                    placeholder="john@example.com"
                  />

                  <Input
                    label="Phone Number"
                    type="tel"
                    value={formData.client_phone}
                    onChange={(e) => setFormData({ ...formData, client_phone: e.target.value })}
                    placeholder="(123) 456-7890"
                    helperText="Optional"
                  />

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Notes
                    </label>
                    <textarea
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      placeholder="What would you like to discuss?"
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>

                  {error && (
                    <div className="bg-red-50 border border-danger text-danger px-4 py-3 rounded-lg">
                      {error}
                    </div>
                  )}

                  <Button
                    type="submit"
                    fullWidth
                    loading={submitting}
                    disabled={!selectedSlot || submitting}
                  >
                    Request Booking
                  </Button>

                  <p className="text-sm text-gray-500 text-center">
                    Your booking will be pending until approved by the coach.
                  </p>
                </form>
              )}
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

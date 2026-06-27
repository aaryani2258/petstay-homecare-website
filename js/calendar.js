function formatDateLocal(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

document.addEventListener('DOMContentLoaded', function () {
  const dateInput = document.getElementById('bookingDate');
  const timeSlot = document.getElementById('timeSlot');
  if (!dateInput || !timeSlot) return;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  dateInput.min = formatDateLocal(today);

  dateInput.addEventListener('change', function () {
    const selected = new Date(this.value + 'T00:00:00');
    timeSlot.innerHTML = '';

    if (selected.getDay() === 0) {
      timeSlot.innerHTML = '<option value="">Closed on Sunday</option>';
      return;
    }

    const slots = [
      '9:00 AM - 10:00 AM',
      '10:00 AM - 11:00 AM',
      '11:00 AM - 12:00 PM',
      '12:00 PM - 1:00 PM',
      '1:00 PM - 2:00 PM',
      '2:00 PM - 3:00 PM',
      '3:00 PM - 4:00 PM',
      '4:00 PM - 5:00 PM',
      '5:00 PM - 6:00 PM'
    ];

    timeSlot.innerHTML = '<option value="">Select Time Slot</option>';
    slots.forEach((slot) => {
      const opt = document.createElement('option');
      opt.value = slot;
      opt.textContent = slot;
      timeSlot.appendChild(opt);
    });
  });
});
document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('bookingForm');
  const popup = document.getElementById('successPopup');
  const closePopup = document.getElementById('closePopup');
  const msg = document.getElementById('bookingMessage');
  const dateInput = document.getElementById('bookingDate');
  const timeSlot = document.getElementById('timeSlot');
  if (!form) return;

  let saved = [];
  try {
    saved = JSON.parse(localStorage.getItem('petstayBookings')) || [];
  } catch (e) {
    saved = [];
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (dateInput) dateInput.min = today.toISOString().split('T')[0];

  function setSlots() {
    if (!timeSlot) return;
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
    slots.forEach(slot => {
      const opt = document.createElement('option');
      opt.value = slot;
      opt.textContent = slot;
      timeSlot.appendChild(opt);
    });
  }

  if (dateInput) {
    dateInput.addEventListener('change', function () {
      const selected = new Date(this.value + 'T00:00:00');
      if (selected.getDay() === 0) {
        if (msg) {
          msg.textContent = 'Sunday bookings are not allowed.';
          msg.style.color = '#c2410c';
        }
        if (timeSlot) timeSlot.innerHTML = '<option value="">Closed on Sunday</option>';
        return;
      }
      setSlots();
      if (msg) msg.textContent = '';
    });
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const fd = new FormData(form);
    const data = Object.fromEntries(fd.entries());

    const required = ['ownerName', 'phoneNumber', 'email', 'petName', 'petType', 'petAge', 'petSize', 'bookingDate', 'timeSlot'];
    for (const key of required) {
      if (!data[key] || String(data[key]).trim() === '') {
        msg.textContent = 'Please fill all required fields.';
        msg.style.color = '#c2410c';
        return;
      }
    }

    const selectedDate = new Date(data.bookingDate + 'T00:00:00');
    if (selectedDate.getDay() === 0) {
      msg.textContent = 'Sunday bookings are not allowed.';
      msg.style.color = '#c2410c';
      return;
    }

    if (selectedDate < today) {
      msg.textContent = 'Past dates are not allowed.';
      msg.style.color = '#c2410c';
      return;
    }

    saved.push({ ...data, createdAt: new Date().toISOString() });
    localStorage.setItem('petstayBookings', JSON.stringify(saved));

    form.reset();
    if (timeSlot) timeSlot.innerHTML = '<option value="">Select date first</option>';
    if (msg) msg.textContent = '';

    if (popup) {
      popup.classList.add('show');
      popup.setAttribute('aria-hidden', 'false');
    }
  });

  if (closePopup) {
    closePopup.addEventListener('click', function () {
      if (popup) {
        popup.classList.remove('show');
        popup.setAttribute('aria-hidden', 'true');
      }
    });
  }
});
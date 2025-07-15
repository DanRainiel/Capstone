    import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
    import {
    getFirestore,
    doc,
    getDoc,
    setDoc,
    collection,      // <-- ADD THIS
    getDocs,         // <-- AND THIS
    query,
    where
    } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";



    const firebaseConfig = {
    apiKey: "AIzaSyDtDApHuFcav9QIZaJ8CDIcyI_fxcO4Kzw",
    authDomain: "fir-demo-66ae2.firebaseapp.com",
    projectId: "fir-demo-66ae2",
    storageBucket: "fir-demo-66ae2.appspot.com",
    messagingSenderId: "505962707376",
    appId: "1:505962707376:web:4fb32e2e4b04e9bca93e75",
    measurementId: "G-JYDG36FQMX"
    };

    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    async function loadUsername() {
    const userId = sessionStorage.getItem("userId");

    if (!userId) {
        console.log("No user logged in.");
        return;
    }

    try {
        let userRef = doc(db, "users", userId);
        let userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
        userRef = doc(db, "Admin", userId);
        userSnap = await getDoc(userRef);
        }

        if (userSnap.exists()) {
        const data = userSnap.data();
        const username = data.name || "User";
        const email = data.email || "Email";

        sessionStorage.setItem("username", username);
        sessionStorage.setItem("email", email);

        const usernameElements = [
            document.getElementById("welcome-username"),
            document.getElementById("profile-username"),
            document.getElementById("profilepage-username"),
            document.getElementById("account-username")
        ];
        usernameElements.forEach(el => {
            if (el) el.textContent = username;
        });

        const emailElements = [
            document.getElementById("account-email")
        ];
        emailElements.forEach(el => {
            if (el) el.textContent = email;
        });

        } else {
        console.log("User document not found.");
        }
    } catch (error) {
        console.error("Error loading username:", error);
    }
    }
    loadUsername();

    document.addEventListener("DOMContentLoaded", () => {
    const welcomeMsg = sessionStorage.getItem("welcomeMessage");
    if (welcomeMsg) {
        alert(welcomeMsg);
        sessionStorage.removeItem("welcomeMessage");
    }
    });


    if (sessionStorage.getItem("role") === "customer") {
    history.pushState(null, null, location.href);
    window.addEventListener('popstate', () => {
        location.replace(location.href);
    });
    }

    // Dropdown menu
    window.toggleMenu = function () {
    const dropMenu = document.getElementById("subMenu");
    dropMenu.classList.toggle("openMenu");
    };

    // Logout modal logic
    document.addEventListener('DOMContentLoaded', () => {
    const logoutBtn = document.getElementById("logout-btn");
    const logoutModal = document.getElementById("logoutModal");
    const confirmLogout = document.getElementById("confirmLogout");
    const cancelLogout = document.getElementById("cancelLogout");

    if (logoutBtn) {
        logoutBtn.addEventListener("click", (e) => {
        e.preventDefault();
        logoutModal.style.display = "flex";
        });
    }

    if (cancelLogout) {
        cancelLogout.addEventListener("click", () => {
        logoutModal.style.display = "none";
        });
    }

    if (confirmLogout) {
        confirmLogout.addEventListener("click", () => {
        sessionStorage.clear();
        location.replace("/index.html");
        });
    }

    window.addEventListener("click", (e) => {
        if (e.target === logoutModal) {
        logoutModal.style.display = "none";
        }
    });
    });

    // Navbar tab logic
    document.addEventListener("DOMContentLoaded", () => {
    const tabs = document.querySelectorAll(".second-navbar nav a");
    const sections = document.querySelectorAll("section");
    const navbar = document.querySelector(".second-navbar");

    tabs.forEach(tab => {
        tab.addEventListener("click", (e) => {
        e.preventDefault();
        const id = tab.id.replace("-tab", "");

        sections.forEach(section => {
            if (section.classList.contains('second-navbar')) return;
            section.style.display = (section.id === id || (id === "book" && section.id === "booking")) ? "block" : "none";
        });

        if (navbar) navbar.style.display = "flex";
        });
    });
    });


    document.addEventListener("DOMContentLoaded", () => {
        // Open modal when clicking on the button
        document.getElementById("lm-1").addEventListener("click", () => {
        document.getElementById("modal-1").style.display = "block";
        });

        document.getElementById("lm-2").addEventListener("click", () => {
        document.getElementById("modal-2").style.display = "block";
        });

        document.getElementById("lm-3").addEventListener("click", () => {
        document.getElementById("modal-3").style.display = "block";
        });

        document.getElementById("lm-4").addEventListener("click", () => {
        document.getElementById("modal-4").style.display = "block";
        });

        document.getElementById("lm-5").addEventListener("click", () => {
        document.getElementById("modal-5").style.display = "block";
        });

        document.getElementById("lm-6").addEventListener("click", () => {
        document.getElementById("modal-6").style.display = "block";
        });



        document.querySelectorAll(".modal-close").forEach(btn => {
        btn.addEventListener("click", () => {
            const modalId = btn.getAttribute("data-close");
            document.getElementById(modalId).style.display = "none";
        });
        });

        // Close when clicking outside modal-content
        window.addEventListener("click", (e) => {
        const modal = document.getElementById("modal-1");
        if (e.target === modal) {
            modal.style.display = "none";
        }
        });
    });

    // ✅ Appointment form submission logic
    document.addEventListener("DOMContentLoaded", () => {
    const submitBtn = document.getElementById("submit-appointment");

    if (!submitBtn) return;

    submitBtn.addEventListener("click", async (e) => {
        e.preventDefault();

        const userId = sessionStorage.getItem("userId");
        if (!userId) {
        alert("User not logged in.");
        return;
        }

        // Get form values
        const name = document.getElementById("appt-name")?.value.trim();
        const number = document.getElementById("appt-number")?.value.trim();
        const petName = document.getElementById("appt-petname")?.value.trim();
        const breed = document.getElementById("appt-breed")?.value.trim();
        const size = document.getElementById("appt-size")?.value;
        const sex = document.getElementById("appt-sex")?.value;
        const service = document.getElementById("appt-service")?.value;
        const time = document.getElementById("appt-time")?.value;
        const date = document.getElementById("appt-date")?.value;

        if (!name || !number || !petName || !breed || !size || !sex || !service || !time || !date) {
        alert("Please fill in all appointment fields.");
        return;
        }

        try {
        const appointmentsRef = collection(db, "Appointment");

        // ✅ Check if TIME is already booked by any user (REGARDLESS of date)
        const q = query(
        appointmentsRef,
        where("time", "==", time),
        where("date", "==", date)
        );

        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            alert("This time slot is already booked. Please choose another.");
            return;
        }

        // ✅ Proceed to save
        const uniqueId = `${userId}_${Date.now()}`;
        const appointmentRef = doc(db, "Appointment", uniqueId);
        await setDoc(appointmentRef, {
            userId,
            name,
            number,
            petName,
            breed,
            size,
            sex,
            service,
            time,
            date,
            createdAt: new Date().toISOString()
        });

        alert("Appointment submitted successfully!");
        } catch (error) {
        console.error("Error saving appointment:", error);
        alert("Failed to submit appointment.");
        }
    });
    });



    // Calendar state
            let currentDate = new Date();
            let selectedDate = null;
            let selectedTimeSlot = null;

            // Sample appointment data
            const appointments = {
                '2025-07-15': [
                    { id: 1, time: '09:00', petName: 'Buddy', type: 'checkup', owner: 'John Smith', phone: '(555) 123-4567' },
                    { id: 2, time: '10:30', petName: 'Whiskers', type: 'vaccination', owner: 'Sarah Johnson', phone: '(555) 234-5678' },
                    { id: 3, time: '14:00', petName: 'Max', type: 'surgery', owner: 'Mike Davis', phone: '(555) 345-6789' }
                ],
                '2025-07-16': [
                    { id: 4, time: '11:00', petName: 'Luna', type: 'grooming', owner: 'Emma Wilson', phone: '(555) 456-7890' }
                ],
                '2025-07-18': [
                    { id: 5, time: '09:30', petName: 'Charlie', type: 'dental', owner: 'Alex Brown', phone: '(555) 567-8901' },
                    { id: 6, time: '15:00', petName: 'Bella', type: 'checkup', owner: 'Lisa Garcia', phone: '(555) 678-9012' }
                ]
            };

            const timeSlots = [
                '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
                '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'
            ];

            const months = [
                'January', 'February', 'March', 'April', 'May', 'June',
                'July', 'August', 'September', 'October', 'November', 'December'
            ];

            // Initialize calendar
            function initCalendar() {
                updateCalendar();
                updateSidebar();
            }

            function updateCalendar() {
                const monthYear = document.getElementById('monthYear');
                const calendarGrid = document.getElementById('calendarGrid');
                
                monthYear.textContent = `${months[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
                
                // Clear calendar grid
                calendarGrid.innerHTML = '';
                
                // Add day headers
                const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                dayHeaders.forEach(day => {
                    const dayHeader = document.createElement('div');
                    dayHeader.className = 'calendar-day-header';
                    dayHeader.textContent = day;
                    calendarGrid.appendChild(dayHeader);
                });
                
                // Get first day of month and number of days
                const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
                const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
                const startingDayOfWeek = firstDay.getDay();
                const daysInMonth = lastDay.getDate();
                
                // Add empty cells for days before first day of month
                for (let i = 0; i < startingDayOfWeek; i++) {
                    const emptyCell = document.createElement('div');
                    emptyCell.className = 'calendar-day-cell';
                    calendarGrid.appendChild(emptyCell);
                }
                
                // Add days of month
                const today = new Date();
                for (let day = 1; day <= daysInMonth; day++) {
                    const dayCell = document.createElement('div');
                    const cellDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
                    const dateStr = formatDate(cellDate);
                    
                    dayCell.className = 'calendar-day-cell';
                    dayCell.innerHTML = `<div class="calendar-day-number">${day}</div>`;
                    
                    // Add classes based on date status
                    if (cellDate.toDateString() === today.toDateString()) {
                        dayCell.classList.add('today');
                    }
                    
                    if (cellDate < today.setHours(0, 0, 0, 0)) {
                        dayCell.classList.add('past');
                    } else {
                        dayCell.addEventListener('click', () => selectDate(cellDate));
                    }
                    
                    if (selectedDate && cellDate.toDateString() === selectedDate.toDateString()) {
                        dayCell.classList.add('selected');
                    }
                    
                    // Check for appointments
                    const dayAppointments = appointments[dateStr] || [];
                    if (dayAppointments.length > 0) {
                        dayCell.classList.add('has-appointments');
                        const countBadge = document.createElement('div');
                        countBadge.className = 'calendar-appointment-count';
                        countBadge.textContent = dayAppointments.length;
                        dayCell.appendChild(countBadge);
                    }
                    
                    // Check if fully booked
                    if (dayAppointments.length >= timeSlots.length) {
                        dayCell.classList.add('fully-booked');
                    } else if (dayAppointments.length < timeSlots.length && cellDate >= today.setHours(0, 0, 0, 0)) {
                        const availableIndicator = document.createElement('div');
                        availableIndicator.className = 'calendar-available-indicator';
                        availableIndicator.textContent = 'Available';
                        dayCell.appendChild(availableIndicator);
                    }
                    
                    calendarGrid.appendChild(dayCell);
                }
            }

            function navigateMonth(direction) {
                currentDate.setMonth(currentDate.getMonth() + direction);
                updateCalendar();
            }

            function selectDate(date) {
                selectedDate = date;
                selectedTimeSlot = null;
                updateCalendar();
                updateSidebar();
            }

            function updateSidebar() {
                const selectedDateDiv = document.getElementById('selectedDate');
                const timeSlotsDiv = document.getElementById('timeSlots');
                const appointmentsListDiv = document.getElementById('appointmentsList');
                const bookBtn = document.getElementById('bookBtn');
                
                if (!selectedDate) {
                    selectedDateDiv.textContent = 'Select a date to view appointments';
                    timeSlotsDiv.innerHTML = '';
                    appointmentsListDiv.innerHTML = '';
                    bookBtn.disabled = true;
                    return;
                }
                
                const dateStr = formatDate(selectedDate);
                selectedDateDiv.textContent = selectedDate.toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                });
                
                // Update time slots
                timeSlotsDiv.innerHTML = '';
                const dayAppointments = appointments[dateStr] || [];
                
                timeSlots.forEach(time => {
                    const timeSlot = document.createElement('div');
                    timeSlot.className = 'calendar-time-slot';
                    timeSlot.textContent = time;
                    
                    const isBooked = dayAppointments.some(apt => apt.time === time);
                    
                    if (isBooked) {
                        timeSlot.classList.add('booked');
                    } else {
                        timeSlot.addEventListener('click', () => selectTimeSlot(time));
                    }
                    
                    if (selectedTimeSlot === time) {
                        timeSlot.classList.add('selected');
                    }
                    
                    timeSlotsDiv.appendChild(timeSlot);
                });
                
                // Update appointments list
                appointmentsListDiv.innerHTML = '';
                if (dayAppointments.length > 0) {
                    dayAppointments.forEach(apt => {
                        const appointmentDiv = document.createElement('div');
                        appointmentDiv.className = 'calendar-appointment';
                        appointmentDiv.innerHTML = `
                            <div class="calendar-appointment-time">${apt.time}</div>
                            <div class="calendar-appointment-details">
                                <strong>${apt.petName}</strong> - ${apt.owner}
                                <div class="calendar-appointment-type calendar-type-${apt.type}">${getTypeDisplayName(apt.type)}</div>
                            </div>
                        `;
                        appointmentsListDiv.appendChild(appointmentDiv);
                    });
                } else {
                    appointmentsListDiv.innerHTML = '<p style="text-align: center; color: #6c757d;">No appointments scheduled</p>';
                }
                
                // Update book button
                bookBtn.disabled = !selectedTimeSlot;
            }

            function selectTimeSlot(time) {
                selectedTimeSlot = time;
                updateSidebar();
            }

            function formatDate(date) {
                return date.toISOString().split('T')[0];
            }

            function getTypeDisplayName(type) {
                const types = {
                    checkup: 'General Checkup',
                    vaccination: 'Vaccination',
                    surgery: 'Surgery',
                    grooming: 'Grooming',
                    dental: 'Dental Care'
                };
                return types[type] || type;
            }

            function showBookingModal() {
                const modal = document.getElementById('bookingModal');
                modal.style.display = 'block';
            }

            function hideBookingModal() {
                const modal = document.getElementById('bookingModal');
                modal.style.display = 'none';
                document.getElementById('bookingForm').reset();
            }

            // Handle form submission
            document.getElementById('bookingForm').addEventListener('submit', function(e) {
                e.preventDefault();
                
                const petName = document.getElementById('petName').value;
                const ownerName = document.getElementById('ownerName').value;
                const appointmentType = document.getElementById('appointmentType').value;
                const phone = document.getElementById('phone').value;
                
                // Add new appointment
                const dateStr = formatDate(selectedDate);
                if (!appointments[dateStr]) {
                    appointments[dateStr] = [];
                }
                
                appointments[dateStr].push({
                    id: Date.now(),
                    time: selectedTimeSlot,
                    petName: petName,
                    type: appointmentType,
                    owner: ownerName,
                    phone: phone
                });
                
                // Update UI
                updateCalendar();
                updateSidebar();
                hideBookingModal();
                
                // Show success message
                alert('Appointment booked successfully! 🎉');
            });

            // Close modal when clicking outside
            window.addEventListener('click', function(e) {
                const modal = document.getElementById('bookingModal');
                if (e.target === modal) {
                    hideBookingModal();
                }
            });

            // Initialize calendar when page loads
            document.addEventListener('DOMContentLoaded', function() {
                initCalendar();
            });


    //PETS//
    const PetManager = {
    pets: [],
    currentEditId: null,
    currentDeleteId: null,
    currentBookingPet: null,

    speciesIcons: {
        dog: 'fas fa-dog',
        cat: 'fas fa-cat',
        bird: 'fas fa-dove',
        rabbit: 'fas fa-rabbit',
        hamster: 'fas fa-hamster',
        other: 'fas fa-paw'
    },

    async init() {
        this.bindEvents();
        this.addAnimationStyles();
        await this.loadPetsFromFirestore();
    },

    async loadPetsFromFirestore() {
        try {
        const userId = sessionStorage.getItem("userId");
        if (!userId) {
            console.error("User not logged in.");
            return;
        }

        const q = query(collection(db, "Pets"), where("userId", "==", userId));
        const querySnapshot = await getDocs(q);

        this.pets = querySnapshot.docs.map(docSnap => {
            const data = docSnap.data();
            return {
            id: docSnap.id,
            name: data.petName || '',
            species: data.species || 'other',
            breed: data.breed || '',
            age: data.age ? parseInt(data.age) : 0,
            sex: data.sex || '',
            size: data.size || '',
            weight: data.weight ? parseFloat(data.weight) : null,
            color: data.color || '',
            medicalHistory: data.medicalHistory || ''
            };
        });

        this.renderPets();
        } catch (error) {
        console.error("Error loading pets from Firestore:", error);
        }
    },

    renderPets() {
        const petsGrid = document.getElementById('petsGrid');
        const emptyState = document.getElementById('emptyState');
        const searchTerm = document.getElementById('searchInput').value.toLowerCase();

        const filteredPets = this.pets.filter(pet =>
        pet.name.toLowerCase().includes(searchTerm) ||
        pet.species.toLowerCase().includes(searchTerm) ||
        (pet.breed && pet.breed.toLowerCase().includes(searchTerm))
        );

        if (filteredPets.length === 0) {
        petsGrid.innerHTML = '';
        emptyState.style.display = 'block';
        return;
        }

        emptyState.style.display = 'none';
        petsGrid.innerHTML = filteredPets.map(pet => `
        <div class="pet-card">
            <div class="pet-avatar">
            <i class="${this.speciesIcons[pet.species] || 'fas fa-paw'}"></i>
            </div>
            <div class="pet-info">
            <h3>${pet.name}</h3>
            <div class="pet-details">
                <div class="pet-detail"><i class="fas fa-paw"></i> <span>${pet.species}</span></div>
                <div class="pet-detail"><i class="fas fa-dna"></i> <span>${pet.breed || 'Mixed'}</span></div>
                <div class="pet-detail"><i class="fas fa-birthday-cake"></i> <span>${pet.age} years</span></div>
                <div class="pet-detail"><i class="fas fa-venus-mars"></i> <span>${pet.sex}</span></div>
                <div class="pet-detail"><i class="fas fa-ruler"></i> <span>${pet.size}</span></div>
                <div class="pet-detail"><i class="fas fa-weight"></i> <span>${pet.weight ? pet.weight + ' kg' : 'Not specified'}</span></div>
            </div>
            <div class="pet-actions">
                <button class="pet-btn btn-edit" onclick="PetManager.editPet('${pet.id}')"><i class="fas fa-edit"></i> Edit</button>
                <button class="pet-btn btn-book" onclick="PetManager.bookAppointment('${pet.id}')"><i class="fas fa-calendar-plus"></i> Book</button>
                <button class="pet-btn btn-delete" onclick="PetManager.confirmDelete('${pet.id}')"><i class="fas fa-trash"></i> Delete</button>
            </div>
            </div>
        </div>
        `).join('');
    },

    showAddPetModal() {
    // Ensure it's truly "Add New Pet" mode
    this.currentEditId = null;

    // Clear all input fields manually (more reliable than reset)
    const fields = ['petName', 'petSpecies', 'petBreed', 'petAge', 'petSex', 'petSize', 'petWeight', 'petColor', 'petMedicalHistory'];
    fields.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            if (el.tagName === 'SELECT') {
                el.selectedIndex = 0;
            } else {
                el.value = '';
            }
        }
    });

    // Update modal title and button
    document.getElementById('modalTitle').textContent = 'Add New Pet';
    document.getElementById('submitBtn').textContent = 'Add Pet';

    // Open modal
    document.getElementById('petModal').style.display = 'flex';
},



    editPet(id) {
        const pet = this.pets.find(p => p.id === id);
        if (!pet) return;

        document.getElementById('modalTitle').textContent = 'Edit Pet';
        document.getElementById('submitBtn').textContent = 'Update Pet';
        document.getElementById('petName').value = pet.name;
        document.getElementById('petSpecies').value = pet.species;
        document.getElementById('petBreed').value = pet.breed || '';
        document.getElementById('petAge').value = pet.age;
        document.getElementById('petSex').value = pet.sex;
        document.getElementById('petSize').value = pet.size;
        document.getElementById('petWeight').value = pet.weight || '';
        document.getElementById('petColor').value = pet.color || '';
        document.getElementById('petMedicalHistory').value = pet.medicalHistory || '';
        this.currentEditId = id;
        document.getElementById('petModal').style.display = 'flex';
    },

    closePetModal() {
        document.getElementById('petModal').style.display = 'none';
        this.currentEditId = null;
    },

    bookAppointment(id) {
        const pet = this.pets.find(p => p.id === id);
        if (!pet) return;

        this.currentBookingPet = pet;
        document.getElementById('appointmentPetName').textContent = pet.name;
        document.getElementById('appointmentForm').reset();
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('appointmentDate').min = today;
        document.getElementById('appointmentModal').style.display = 'block';
    },

    closeAppointmentModal() {
        document.getElementById('appointmentModal').style.display = 'none';
        this.currentBookingPet = null;
    },

    confirmDelete(id) {
        const pet = this.pets.find(p => p.id === id);
        if (!pet) return;

        this.currentDeleteId = id;
        document.getElementById('confirmTitle').textContent = 'Delete Pet';
        document.getElementById('confirmMessage').textContent = `Are you sure you want to delete ${pet.name}?`;
        document.getElementById('confirmModal').style.display = 'block';
    },

    closeConfirmModal() {
        document.getElementById('confirmModal').style.display = 'none';
        this.currentDeleteId = null;
    },

    async submitPetForm(formData) {
        const userId = sessionStorage.getItem("userId");
        if (!userId) {
        alert("User not logged in!");
        return;
        }
        try {
        if (this.currentEditId) {
            await setDoc(doc(db, "Pets", this.currentEditId), {
            userId,
            petName: formData.name,
            species: formData.species,
            breed: formData.breed,
            age: formData.age,
            sex: formData.sex,
            size: formData.size,
            weight: formData.weight,
            color: formData.color,
            medicalHistory: formData.medicalHistory
            }, { merge: true });
            this.showNotification('Pet updated successfully!', 'success');
        } else {
            const newDocRef = doc(collection(db, "Pets"));
            await setDoc(newDocRef, {
            userId,
            petName: formData.name,
            species: formData.species,
            breed: formData.breed,
            age: formData.age,
            sex: formData.sex,
            size: formData.size,
            weight: formData.weight,
            color: formData.color,
            medicalHistory: formData.medicalHistory
            });
            this.showNotification('Pet added successfully!', 'success');
        }
        await this.loadPetsFromFirestore();
        this.closePetModal();
        } catch (error) {
        console.error("Error saving pet:", error);
        this.showNotification('Failed to save pet', 'error');
        }
    },

    async deletePet() {
        if (!this.currentDeleteId) return;
        try {
        await deleteDoc(doc(db, "Pets", this.currentDeleteId));
        this.showNotification('Pet deleted successfully!', 'success');
        this.currentDeleteId = null;
        await this.loadPetsFromFirestore();
        this.closeConfirmModal();
        } catch (error) {
        console.error("Error deleting pet:", error);
        this.showNotification('Failed to delete pet', 'error');
        }
    },

    submitAppointmentForm(appointmentData) {
        if (!this.currentBookingPet) return;
        console.log('Appointment booked:', { ...appointmentData, pet: this.currentBookingPet });
        this.showNotification(`Appointment booked for ${this.currentBookingPet.name}!`, 'success');
        this.closeAppointmentModal();
    },

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.style.cssText = `
        position: fixed; top: 20px; right: 20px;
        background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
        color: white; padding: 15px 20px; border-radius: 8px; z-index: 10000;
        animation: slideIn 0.3s ease; box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        `;
        notification.textContent = message;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
    },

    bindEvents() {
        document.getElementById('petForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = {
            name: document.getElementById('petFormName').value,
            species: document.getElementById('petSpecies').value,
            breed: document.getElementById('petBreed').value,
            age: parseInt(document.getElementById('petAge').value),
            sex: document.getElementById('petSex').value,
            size: document.getElementById('petSize').value,
            weight: parseFloat(document.getElementById('petWeight').value) || null,
            color: document.getElementById('petColor').value,
            medicalHistory: document.getElementById('petMedicalHistory').value
        };
        this.submitPetForm(formData);
        });
        document.getElementById('appointmentForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const appointmentData = {
            ownerName: document.getElementById('ownerName').value,
            phone: document.getElementById('ownerPhone').value,
            service: document.getElementById('appointmentService').value,
            date: document.getElementById('appointmentDate').value,
            time: document.getElementById('appointmentTime').value,
            notes: document.getElementById('appointmentNotes').value
        };
        this.submitAppointmentForm(appointmentData);
        });
        document.getElementById('confirmButton').addEventListener('click', () => {
        if (this.currentDeleteId) this.deletePet();
        });
        document.getElementById('searchInput').addEventListener('input', () => this.renderPets());
        window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) e.target.style.display = 'none';
        if (e.target.classList.contains('confirm-modal')) e.target.style.display = 'none';
        });
    },

    addAnimationStyles() {
        const style = document.createElement('style');
        style.textContent = `
        @keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .pet-card { animation: fadeIn 0.3s ease; }
        `;
        document.head.appendChild(style);
    }
    };


    document.addEventListener('DOMContentLoaded', () => {
    PetManager.init();
    });

    window.PetManager = PetManager;
    window.showAddPetModal = () => PetManager.showAddPetModal();
    window.closePetModal = () => PetManager.closePetModal();
    window.closeAppointmentModal = () => PetManager.closeAppointmentModal();
    window.closeConfirmModal = () => PetManager.closeConfirmModal();


// Citizen Dashboard Specific Logic

let myIncidents = [];
let stats = { total: 0, pending: 0, resolved: 0 };

// Mock data for demonstration (Frontend-only)
function getMockIncidents() {
    const stored = localStorage.getItem('incidents');
    if (stored) {
        return JSON.parse(stored);
    }
    return [];
}

function saveMockIncidents(incidents) {
    localStorage.setItem('incidents', JSON.stringify(incidents));
}

// Section navigation
function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(section => {
        section.style.display = 'none';
    });
    
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    
    const section = document.getElementById(sectionId);
    if (section) {
        section.style.display = 'block';
    }
    
    const navItem = document.querySelector(`[data-section="${sectionId}"]`);
    if (navItem) {
        navItem.classList.add('active');
    }
    
    // Load data for the section
    if (sectionId === 'my-incidents') {
        loadMyIncidents();
    } else if (sectionId === 'overview') {
        loadOverview();
    }
}

// Setup navigation
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const section = item.getAttribute('data-section');
            showSection(section);
        });
    });
    
    loadOverview();
});

// Load overview data
async function loadOverview() {
    try {
        const incidents = getMockIncidents();
        myIncidents = incidents;
        
        // Calculate stats
        stats.total = incidents.length;
        stats.pending = incidents.filter(i => i.status === 'PENDING' || i.status === 'ASSIGNED').length;
        stats.resolved = incidents.filter(i => i.status === 'RESOLVED' || i.status === 'CLOSED').length;
        
        // Update stats display
        const totalElement = document.getElementById('totalIncidents');
        const pendingElement = document.getElementById('pendingIncidents');
        const resolvedElement = document.getElementById('resolvedIncidents');
        
        if (totalElement) totalElement.textContent = stats.total;
        if (pendingElement) pendingElement.textContent = stats.pending;
        if (resolvedElement) resolvedElement.textContent = stats.resolved;
        
        // Show recent incidents (last 5)
        renderRecentIncidents(incidents.slice(0, 5));
    } catch (error) {
        console.error('Error loading overview:', error);
        showToast('Error', 'Failed to load overview data', 'error');
    }
}

// Render recent incidents table
function renderRecentIncidents(incidents) {
    const tbody = document.getElementById('recentIncidentsBody');
    
    if (incidents.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="empty-state">
                    <i class="fas fa-inbox"></i>
                    <p>No incidents reported yet</p>
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = incidents.map(incident => `
        <tr>
            <td><span class="badge badge-${incident.type.toLowerCase()}">${incident.type}</span></td>
            <td>${incident.title}</td>
            <td><span class="badge badge-${incident.status.toLowerCase().replace('_', '-')}">${incident.status}</span></td>
            <td><span class="badge badge-${incident.priority.toLowerCase()}">${incident.priority}</span></td>
            <td>${formatDate(incident.createdAt)}</td>
            <td>
                <button class="btn btn-outline" onclick="viewIncident(${incident.id})" style="padding: 0.375rem 0.75rem;">
                    <i class="fas fa-eye"></i> View
                </button>
            </td>
        </tr>
    `).join('');
}

// Load my incidents
async function loadMyIncidents() {
    const tbody = document.getElementById('myIncidentsBody');
    if (tbody) {
        tbody.innerHTML = '<tr><td colspan="7" class="empty-state">Loading...</td></tr>';
    }
    
    try {
        const incidents = getMockIncidents();
        myIncidents = incidents;
        
        if (!tbody) return;
        
        if (incidents.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" class="empty-state">
                        <i class="fas fa-inbox"></i>
                        <p>No incidents reported yet</p>
                        <button class="btn btn-primary" onclick="showSection('report')" style="margin-top: 1rem;">
                            <i class="fas fa-plus"></i> Report an Incident
                        </button>
                    </td>
                </tr>
            `;
            return;
        }
        
        tbody.innerHTML = incidents.map(incident => `
            <tr>
                <td>#${incident.id}</td>
                <td><span class="badge badge-${incident.type.toLowerCase()}">${incident.type}</span></td>
                <td>${incident.title}</td>
                <td><span class="badge badge-${incident.status.toLowerCase().replace('_', '-')}">${incident.status}</span></td>
                <td><span class="badge badge-${incident.priority.toLowerCase()}">${incident.priority}</span></td>
                <td>${formatDate(incident.createdAt)}</td>
                <td>
                    <button class="btn btn-outline" onclick="viewIncident(${incident.id})" style="padding: 0.375rem 0.75rem;">
                        <i class="fas fa-eye"></i> View
                    </button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error loading incidents:', error);
        if (tbody) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" class="empty-state">
                        <i class="fas fa-exclamation-circle"></i>
                        <p>Error loading incidents</p>
                    </td>
                </tr>
            `;
        }
    }
}

// Report form submission
const reportForm = document.getElementById('reportForm');
if (reportForm) {
    reportForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitBtn = e.target.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
        
        try {
            const incident = {
                id: Date.now(),
                type: document.getElementById('incidentType').value,
                title: document.getElementById('incidentTitle').value,
                description: document.getElementById('incidentDescription').value,
                address: document.getElementById('incidentAddress').value,
                latitude: parseFloat(document.getElementById('latitude').value) || 0,
                longitude: parseFloat(document.getElementById('longitude').value) || 0,
                status: 'PENDING',
                priority: 'MEDIUM',
                createdAt: new Date().toISOString(),
                mediaUrls: []
            };
            
            // Save to local storage
            const incidents = getMockIncidents();
            incidents.unshift(incident);
            saveMockIncidents(incidents);
            
            showToast('Success', 'Incident reported successfully', 'success');
            
            // Reset form
            e.target.reset();
            document.getElementById('latitude').value = '';
            document.getElementById('longitude').value = '';
            
            // Refresh overview and switch to it
            loadOverview();
            showSection('overview');
        } catch (error) {
            console.error('Error submitting report:', error);
            showToast('Error', 'Failed to submit report. Please try again.', 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Submit Report';
        }
    });
}

// Get current location
function getCurrentLocation() {
    if (!navigator.geolocation) {
        showToast('Error', 'Geolocation is not supported by your browser', 'error');
        return;
    }
    
    showToast('Info', 'Getting your location...', 'info');
    
    navigator.geolocation.getCurrentPosition(
        async (position) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            
            document.getElementById('latitude').value = lat;
            document.getElementById('longitude').value = lng;
            
            // Reverse geocoding to get address (using a placeholder, implement with actual service)
            const address = `Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)}`;
            document.getElementById('incidentAddress').value = address;
            
            showToast('Success', 'Location captured', 'success');
        },
        (error) => {
            console.error('Geolocation error:', error);
            showToast('Error', 'Unable to get location. Please enter manually.', 'error');
        }
    );
}

// View incident details
async function viewIncident(incidentId) {
    try {
        const incidents = getMockIncidents();
        const incident = incidents.find(i => i.id === incidentId);
        
        if (!incident) {
            showToast('Error', 'Incident not found', 'error');
            return;
        }
        
        const modalBody = document.getElementById('incidentModalBody');
        if (!modalBody) return;
        
        modalBody.innerHTML = `
            <div style="margin-bottom: 1rem;">
                <strong>Type:</strong>
                <span class="badge badge-${incident.type.toLowerCase()}">${incident.type}</span>
            </div>
            
            <div style="margin-bottom: 1rem;">
                <strong>Status:</strong>
                <span class="badge badge-${incident.status.toLowerCase().replace('_', '-')}">${incident.status}</span>
                <strong style="margin-left: 1rem;">Priority:</strong>
                <span class="badge badge-${incident.priority.toLowerCase()}">${incident.priority}</span>
            </div>
            
            <div style="margin-bottom: 1rem;">
                <strong>Title:</strong>
                <p>${incident.title}</p>
            </div>
            
            <div style="margin-bottom: 1rem;">
                <strong>Description:</strong>
                <p>${incident.description}</p>
            </div>
            
            <div style="margin-bottom: 1rem;">
                <strong>Location:</strong>
                <p>${incident.address}</p>
            </div>
            
            <div style="margin-bottom: 1rem;">
                <strong>Reported:</strong>
                <p>${formatDateTime(incident.createdAt)}</p>
            </div>
            
            ${incident.assignedOfficerName ? `
                <div style="margin-bottom: 1rem;">
                    <strong>Assigned Officer:</strong>
                    <p>${incident.assignedOfficerName}</p>
                </div>
            ` : ''}
            
            ${incident.officerNotes ? `
                <div style="margin-bottom: 1rem;">
                    <strong>Officer Notes:</strong>
                    <p>${incident.officerNotes}</p>
                </div>
            ` : ''}
            
            ${incident.resolvedAt ? `
                <div style="margin-bottom: 1rem;">
                    <strong>Resolved:</strong>
                    <p>${formatDateTime(incident.resolvedAt)}</p>
                </div>
            ` : ''}
        `;
        
        const modal = document.getElementById('incidentModal');
        if (modal) modal.classList.add('show');
    } catch (error) {
        console.error('Error loading incident details:', error);
        showToast('Error', 'Failed to load incident details', 'error');
    }
}

// Close modal
function closeIncidentModal() {
    document.getElementById('incidentModal').classList.remove('show');
}

// Close modal when clicking outside
const incidentModal = document.getElementById('incidentModal');
if (incidentModal) {
    incidentModal.addEventListener('click', (e) => {
        if (e.target.id === 'incidentModal') {
            closeIncidentModal();
        }
    });
}

// Utility functions
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatDateTime(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit' 
    });
}

// Police Dashboard Specific Logic

let allIncidents = [];
let pendingIncidents = [];
let myIncidents = [];
let currentIncident = null;

// Mock data for demonstration (Frontend-only)
function getMockIncidents() {
    const stored = localStorage.getItem('incidents');
    if (stored) {
        return JSON.parse(stored);
    }
    return [];
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
    loadSectionData(sectionId);
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

// Load section specific data
async function loadSectionData(sectionId) {
    switch(sectionId) {
        case 'overview':
            loadOverview();
            break;
        case 'pending':
            loadPendingCases();
            break;
        case 'assigned':
            loadMyCases();
            break;
        case 'all':
            loadAllIncidents();
            break;
        case 'analytics':
            loadAnalytics();
            break;
    }
}

// Load overview
async function loadOverview() {
    try {
        const all = getMockIncidents();
        const pending = all.filter(i => i.status === 'PENDING');
        const assigned = all.filter(i => i.status === 'ASSIGNED');
        
        allIncidents = all;
        pendingIncidents = pending;
        myIncidents = assigned;
        
        // Update stats
        const totalElement = document.getElementById('totalIncidents');
        const pendingElement = document.getElementById('pendingCount');
        const assignedElement = document.getElementById('assignedCount');
        const resolvedElement = document.getElementById('resolvedCount');
        
        if (totalElement) totalElement.textContent = all.length;
        if (pendingElement) pendingElement.textContent = pending.length;
        if (assignedElement) assignedElement.textContent = assigned.length;
        if (resolvedElement) {
            resolvedElement.textContent = all.filter(i => i.status === 'RESOLVED' || i.status === 'CLOSED').length;
        }
        
        // Show high priority incidents
        const highPriority = all
            .filter(i => i.priority === 'HIGH' || i.priority === 'CRITICAL')
            .sort((a, b) => {
                if (a.priority === 'CRITICAL' && b.priority !== 'CRITICAL') return -1;
                if (a.priority !== 'CRITICAL' && b.priority === 'CRITICAL') return 1;
                return new Date(b.createdAt) - new Date(a.createdAt);
            })
            .slice(0, 10);
        
        renderHighPriority(highPriority);
    } catch (error) {
        console.error('Error loading overview:', error);
        showToast('Error', 'Failed to load dashboard data', 'error');
    }
}

// Render high priority incidents
function renderHighPriority(incidents) {
    const tbody = document.getElementById('highPriorityBody');
    
    if (incidents.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" class="empty-state">No high priority incidents</td></tr>';
        return;
    }
    
    tbody.innerHTML = incidents.map(incident => `
        <tr>
            <td>#${incident.id}</td>
            <td><span class="badge badge-${incident.type.toLowerCase()}">${incident.type}</span></td>
            <td>${incident.title}</td>
            <td><span class="badge badge-${incident.priority.toLowerCase()}">${incident.priority}</span></td>
            <td><span class="badge badge-${incident.status.toLowerCase().replace('_', '-')}">${incident.status}</span></td>
            <td>${incident.reporterName}</td>
            <td>${formatDate(incident.createdAt)}</td>
            <td>
                <button class="btn btn-outline" onclick="viewIncident(${incident.id})" style="padding: 0.375rem 0.75rem;">
                    <i class="fas fa-eye"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

// Load pending cases
async function loadPendingCases() {
    const tbody = document.getElementById('pendingCasesBody');
    if (tbody) {
        tbody.innerHTML = '<tr><td colspan="8" class="empty-state">Loading...</td></tr>';
    }
    
    try {
        pendingIncidents = getMockIncidents().filter(i => i.status === 'PENDING');
        
        if (!tbody) return;
        
        if (pendingIncidents.length === 0) {
            tbody.innerHTML = '<tr><td colspan="8" class="empty-state">No pending cases</td></tr>';
            return;
        }
        
        tbody.innerHTML = pendingIncidents.map(incident => `
            <tr>
                <td>#${incident.id}</td>
                <td><span class="badge badge-${incident.type.toLowerCase()}">${incident.type}</span></td>
                <td>${incident.title}</td>
                <td><span class="badge badge-${incident.priority.toLowerCase()}">${incident.priority}</span></td>
                <td>${incident.address}</td>
                <td>${incident.reporterName || 'Anonymous'}</td>
                <td>${formatDate(incident.createdAt)}</td>
                <td>
                    <button class="btn btn-primary" onclick="assignToMe(${incident.id})" style="padding: 0.375rem 0.75rem;">
                        <i class="fas fa-user-plus"></i> Assign
                    </button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error loading pending cases:', error);
        if (tbody) {
            tbody.innerHTML = '<tr><td colspan="8" class="empty-state">Error loading cases</td></tr>';
        }
    }
}

// Load my cases
async function loadMyCases() {
    const tbody = document.getElementById('myCasesBody');
    if (tbody) {
        tbody.innerHTML = '<tr><td colspan="7" class="empty-state">Loading...</td></tr>';
    }
    
    try {
        myIncidents = getMockIncidents().filter(i => i.status === 'ASSIGNED');
        
        if (!tbody) return;
        
        if (myIncidents.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" class="empty-state">No cases assigned to you</td></tr>';
            return;
        }
        
        tbody.innerHTML = myIncidents.map(incident => `
            <tr>
                <td>#${incident.id}</td>
                <td><span class="badge badge-${incident.type.toLowerCase()}">${incident.type}</span></td>
                <td>${incident.title}</td>
                <td><span class="badge badge-${incident.priority.toLowerCase()}">${incident.priority}</span></td>
                <td><span class="badge badge-${incident.status.toLowerCase().replace('_', '-')}">${incident.status}</span></td>
                <td>${formatDate(incident.createdAt)}</td>
                <td>
                    <button class="btn btn-outline" onclick="viewIncident(${incident.id})" style="padding: 0.375rem 0.75rem;">
                        <i class="fas fa-edit"></i> Manage
                    </button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error loading my cases:', error);
        tbody.innerHTML = '<tr><td colspan="7" class="empty-state">Error loading cases</td></tr>';
    }
}

// Load all incidents
async function loadAllIncidents() {
    const tbody = document.getElementById('allIncidentsBody');
    if (tbody) {
        tbody.innerHTML = '<tr><td colspan="8" class="empty-state">Loading...</td></tr>';
    }
    
    try {
        allIncidents = getMockIncidents();
        
        if (!tbody) return;
        
        tbody.innerHTML = allIncidents.map(incident => `
            <tr>
                <td>#${incident.id}</td>
                <td><span class="badge badge-${incident.type.toLowerCase()}">${incident.type}</span></td>
                <td>${incident.title}</td>
                <td><span class="badge badge-${incident.priority.toLowerCase()}">${incident.priority}</span></td>
                <td><span class="badge badge-${incident.status.toLowerCase().replace('_', '-')}">${incident.status}</span></td>
                <td>${incident.assignedOfficerName || 'Unassigned'}</td>
                <td>${formatDate(incident.createdAt)}</td>
                <td>
                    <button class="btn btn-outline" onclick="viewIncident(${incident.id})" style="padding: 0.375rem 0.75rem;">
                        <i class="fas fa-eye"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error loading all incidents:', error);
        if (tbody) {
            tbody.innerHTML = '<tr><td colspan="8" class="empty-state">Error loading incidents</td></tr>';
        }
    }
}

// Assign incident to me
async function assignToMe(incidentId) {
    try {
        const userData = Auth.getUserData();
        const incidents = getMockIncidents();
        const incident = incidents.find(i => i.id === incidentId);
        
        if (incident) {
            incident.status = 'ASSIGNED';
            incident.assignedOfficerName = userData.fullName;
            localStorage.setItem('incidents', JSON.stringify(incidents));
        }
        
        showToast('Success', 'Case assigned to you', 'success');
        
        // Refresh data
        loadOverview();
        loadPendingCases();
    } catch (error) {
        console.error('Error assigning incident:', error);
        showToast('Error', 'Failed to assign case', 'error');
    }
}

// View incident details
async function viewIncident(incidentId) {
    try {
        const incidents = getMockIncidents();
        currentIncident = incidents.find(i => i.id === incidentId);
        
        if (!currentIncident) {
            showToast('Error', 'Incident not found', 'error');
            return;
        }
        
        const modalBody = document.getElementById('incidentModalBody');
        if (!modalBody) return;
        
        modalBody.innerHTML = `
            <div style="margin-bottom: 1rem;">
                <strong>Type:</strong>
                <span class="badge badge-${currentIncident.type.toLowerCase()}">${currentIncident.type}</span>
                <strong style="margin-left: 1rem;">Priority:</strong>
                <span class="badge badge-${currentIncident.priority.toLowerCase()}">${currentIncident.priority}</span>
            </div>
            
            <div style="margin-bottom: 1rem;">
                <strong>Title:</strong>
                <p>${currentIncident.title}</p>
            </div>
            
            <div style="margin-bottom: 1rem;">
                <strong>Description:</strong>
                <p>${currentIncident.description}</p>
            </div>
            
            <div style="margin-bottom: 1rem;">
                <strong>Location:</strong>
                <p>${currentIncident.address}</p>
                <small>Lat: ${currentIncident.latitude}, Lng: ${currentIncident.longitude}</small>
            </div>
            
            <div style="margin-bottom: 1rem;">
                <strong>Reporter:</strong>
                <p>${currentIncident.reporterName}</p>
            </div>
            
            <div style="margin-bottom: 1rem;">
                <strong>Reported:</strong>
                <p>${formatDateTime(currentIncident.createdAt)}</p>
            </div>
            
            ${currentIncident.assignedOfficerName ? `
                <div style="margin-bottom: 1rem;">
                    <strong>Assigned Officer:</strong>
                    <p>${currentIncident.assignedOfficerName}</p>
                </div>
            ` : ''}
            
            <div style="margin-bottom: 1rem;">
                <strong>Status:</strong>
                <select class="form-select" id="statusSelect">
                    <option value="PENDING" ${currentIncident.status === 'PENDING' ? 'selected' : ''}>Pending</option>
                    <option value="ASSIGNED" ${currentIncident.status === 'ASSIGNED' ? 'selected' : ''}>Assigned</option>
                    <option value="IN_PROGRESS" ${currentIncident.status === 'IN_PROGRESS' ? 'selected' : ''}>In Progress</option>
                    <option value="RESOLVED" ${currentIncident.status === 'RESOLVED' ? 'selected' : ''}>Resolved</option>
                    <option value="CLOSED" ${currentIncident.status === 'CLOSED' ? 'selected' : ''}>Closed</option>
                </select>
            </div>
            
            <div style="margin-bottom: 1rem;">
                <strong>Officer Notes:</strong>
                <textarea class="form-textarea" id="notesTextarea" placeholder="Add notes about this incident...">${currentIncident.officerNotes || ''}</textarea>
            </div>
        `;
        
        const modalFooter = document.getElementById('incidentModalFooter');
        modalFooter.innerHTML = `
            <button class="btn btn-outline" onclick="closeModal()">Cancel</button>
            <button class="btn btn-primary" onclick="updateIncident()">
                <i class="fas fa-save"></i> Update
            </button>
        `;
        
        document.getElementById('incidentModal').classList.add('show');
    } catch (error) {
        console.error('Error loading incident:', error);
        showToast('Error', 'Failed to load incident details', 'error');
    }
}

// Update incident
async function updateIncident() {
    if (!currentIncident) return;
    
    const status = document.getElementById('statusSelect')?.value;
    const notes = document.getElementById('notesTextarea')?.value;
    
    try {
        const incidents = getMockIncidents();
        const incident = incidents.find(i => i.id === currentIncident.id);
        
        if (incident) {
            incident.status = status;
            incident.officerNotes = notes;
            if (status === 'RESOLVED' || status === 'CLOSED') {
                incident.resolvedAt = new Date().toISOString();
            }
            localStorage.setItem('incidents', JSON.stringify(incidents));
        }
        
        showToast('Success', 'Incident updated successfully', 'success');
        
        closeModal();
        loadOverview();
    } catch (error) {
        console.error('Error updating incident:', error);
        showToast('Error', 'Failed to update incident', 'error');
    }
}

// Close modal
function closeModal() {
    const modal = document.getElementById('incidentModal');
    if (modal) modal.classList.remove('show');
    currentIncident = null;
}

// Load analytics
async function loadAnalytics() {
    const container = document.getElementById('analyticsContent');
    if (!container) return;
    
    try {
        const incidents = getMockIncidents();
        const now = new Date();
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        
        const stats = {
            totalUsers: 0, // Not tracked in frontend-only version
            totalIncidents: incidents.length,
            incidentsLast30Days: incidents.filter(i => new Date(i.createdAt) >= thirtyDaysAgo).length,
            incidentsLast7Days: incidents.filter(i => new Date(i.createdAt) >= sevenDaysAgo).length
        };
        
        container.innerHTML = `
            <div class="stats-grid">
                <div class="stat-card">
                    <h3>Total Incidents</h3>
                    <div class="stat-value">${stats.totalIncidents}</div>
                </div>
                <div class="stat-card">
                    <h3>Last 30 Days</h3>
                    <div class="stat-value">${stats.incidentsLast30Days}</div>
                </div>
                <div class="stat-card">
                    <h3>Last 7 Days</h3>
                    <div class="stat-value">${stats.incidentsLast7Days}</div>
                </div>
            </div>
            
            <div class="card" style="margin-top: 2rem;">
                <div class="card-header">
                    <h2 class="card-title">Incidents by Type</h2>
                </div>
                <div class="card-body">
                    ${Object.entries(stats.incidentsByType || {})
                        .map(([type, count]) => `
                            <div style="display: flex; justify-content: space-between; margin-bottom: 1rem;">
                                <span>${type}</span>
                                <strong>${count}</strong>
                            </div>
                        `).join('')}
                </div>
            </div>
        `;
    } catch (error) {
        console.error('Error loading analytics:', error);
        container.innerHTML = '<p class="empty-state">Error loading analytics</p>';
    }
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

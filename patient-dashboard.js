// Patient Dashboard - Interactive Functions

// ========== MEDICATION FUNCTIONS ==========

/**
 * Mark medication as taken
 */
function markAsTaken(button) {
    const listItem = button.closest('.list-group-item');
    button.textContent = '✓ Taken';
    button.classList.remove('btn-success');
    button.classList.add('btn-secondary');
    button.disabled = true;
    
    // Add visual feedback
    listItem.style.opacity = '0.6';
    
    // Show success message
    showToast('Medication marked as taken!', 'success');
}

// ========== ACTIVITY FUNCTIONS ==========

/**
 * Start an activity
 */
function startActivity(button) {
    const listItem = button.closest('.list-group-item');
    const activityName = listItem.querySelector('h6').textContent;
    
    button.textContent = '⏱️ In Progress...';
    button.classList.remove('btn-primary');
    button.classList.add('btn-warning');
    button.disabled = true;
    
    // Simulate activity completion after 3 seconds (for demo)
    setTimeout(() => {
        button.textContent = '✓ Completed';
        button.classList.remove('btn-warning');
        button.classList.add('btn-success');
        listItem.style.opacity = '0.6';
        showToast(`Activity "${activityName}" completed!`, 'success');
    }, 3000);
}

// ========== MEMORY LANE FUNCTIONS ==========

/**
 * Handle memory form submission
 */
document.getElementById('memoryForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const memoryInput = document.getElementById('memoryInput');
    const memoryText = memoryInput.value.trim();
    
    if (memoryText) {
        // Save to localStorage
        const memories = JSON.parse(localStorage.getItem('echocare_memories') || '[]');
        memories.push({
            id: Date.now(),
            text: memoryText,
            date: new Date().toISOString()
        });
        localStorage.setItem('echocare_memories', JSON.stringify(memories));
        
        // Show success
        showToast('Memory saved successfully!', 'success');
        memoryInput.value = '';
    }
});

// ========== ECHO AI COMPANION FUNCTIONS ==========

/**
 * Handle Echo AI conversation
 */
document.getElementById('echoForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const userInput = document.getElementById('echoInput').value.trim();
    
    if (userInput) {
        // Show loading state
        const responseArea = document.getElementById('echoResponseArea');
        const responseText = document.getElementById('echoResponseText');
        
        responseArea.classList.remove('d-none');
        responseText.innerHTML = '<em>Echo is thinking...</em>';
        
        // Simulate AI response (MVP - predefined supportive responses)
        setTimeout(() => {
            const response = generateEchoResponse(userInput);
            responseText.textContent = response;
        }, 1500);
        
        // Clear input
        document.getElementById('echoInput').value = '';
    }
});

/**
 * Generate supportive Echo response (MVP version)
 */
function generateEchoResponse(userInput) {
    const input = userInput.toLowerCase();
    
    // Simple keyword-based responses for MVP
    if (input.includes('tired') || input.includes('exhausted')) {
        return "It sounds like you're feeling tired. Caregiving can be exhausting. Remember to take breaks when you can, and don't hesitate to ask family or friends for support. Your well-being matters too. Consider a short walk or a few minutes of deep breathing.";
    } else if (input.includes('worried') || input.includes('anxious') || input.includes('stressed')) {
        return "I hear that you're feeling worried. It's completely normal to feel this way when caring for a loved one. Try to focus on one moment at a time. You're doing an amazing job. If concerns persist, consider talking to a healthcare professional or counselor.";
    } else if (input.includes('frustrated') || input.includes('angry')) {
        return "Frustration is a natural part of caregiving. You're doing your best in a challenging situation. It's okay to feel this way. Take a moment for yourself when possible, and remember that asking for help is a sign of strength, not weakness.";
    } else if (input.includes('lonely') || input.includes('alone')) {
        return "Feeling lonely is common among caregivers. You're not alone in this journey. Consider connecting with caregiver support groups, either locally or online. Sharing experiences with others who understand can be incredibly helpful.";
    } else if (input.includes('happy') || input.includes('good') || input.includes('better')) {
        return "I'm so glad to hear things are going well! It's wonderful that you're finding positive moments. Celebrate these small victories - they're important. Your positive attitude makes a real difference in your loved one's care.";
    } else if (input.includes('help') || input.includes('don\'t know')) {
        return "It's okay to feel uncertain. Caregiving is a learning process. Don't hesitate to reach out to healthcare professionals, support groups, or trusted friends and family. The EchoCare dashboard can help you track patterns and share information with doctors.";
    } else {
        // Default supportive response
        return "Thank you for sharing with me. Remember, you're doing important work as a caregiver. Your dedication makes a real difference. Take care of yourself too - your health and well-being are essential. If you have specific concerns, please consult with a healthcare professional.";
    }
}

// ========== DATA EXPORT FUNCTIONS ==========

/**
 * Export all data
 */
function exportData() {
    try {
        const data = {
            logs: JSON.parse(localStorage.getItem('echocare_logs') || '[]'),
            appointments: JSON.parse(localStorage.getItem('echocare_appointments') || '[]'),
            memories: JSON.parse(localStorage.getItem('echocare_memories') || '[]'),
            exportDate: new Date().toISOString()
        };
        
        const dataStr = JSON.stringify(data, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `echocare-data-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        
        showToast('Data exported successfully!', 'success');
    } catch (error) {
        console.error('Export error:', error);
        showToast('Error exporting data', 'danger');
    }
}

/**
 * Confirm and clear all data
 */
function confirmClearData() {
    if (confirm('Are you sure you want to clear ALL data? This cannot be undone.')) {
        if (confirm('This will permanently delete all logs, appointments, and memories. Continue?')) {
            localStorage.removeItem('echocare_logs');
            localStorage.removeItem('echocare_appointments');
            localStorage.removeItem('echocare_memories');
            
            showToast('All data cleared successfully', 'info');
            
            // Reload page
            setTimeout(() => {
                location.reload();
            }, 1500);
        }
    }
}

// ========== UTILITY FUNCTIONS ==========

/**
 * Show toast notification
 */
function showToast(message, type = 'info') {
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `alert alert-${type} position-fixed top-0 start-50 translate-middle-x mt-3`;
    toast.style.zIndex = '9999';
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// ========== INITIALIZATION ==========

document.addEventListener('DOMContentLoaded', function() {
    console.log('Patient Dashboard loaded successfully');
});
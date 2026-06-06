// EchoCare - Main JavaScript File
// Handles localStorage operations for symptom tracking

// ========== CONSTANTS ==========
const STORAGE_KEYS = {
    LOGS: 'echocare_logs',
    APPOINTMENTS: 'echocare_appointments'
};

// ========== CORE STORAGE FUNCTIONS ==========

/**
 * Save a new symptom log entry to localStorage
 * @param {Object} logEntry - The log entry object containing date, symptoms, notes, etc.
 * @returns {boolean} - Success status
 */
function saveLogEntry(logEntry) {
    try {
        // Get existing logs
        const logs = getLogEntries();
        
        // Add new entry
        logs.push(logEntry);
        
        // Save back to localStorage
        localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(logs));
        
        return true;
    } catch (error) {
        console.error('Error saving log entry:', error);
        return false;
    }
}

/**
 * Retrieve all symptom log entries from localStorage
 * @returns {Array} - Array of log entries
 */
function getLogEntries() {
    try {
        const logs = localStorage.getItem(STORAGE_KEYS.LOGS);
        return logs ? JSON.parse(logs) : [];
    } catch (error) {
        console.error('Error retrieving log entries:', error);
        return [];
    }
}

/**
 * Retrieve logs filtered by date range
 * @param {number} days - Number of days to look back (e.g., 7 for last week)
 * @returns {Array} - Filtered array of log entries
 */
function getRecentLogs(days) {
    try {
        const allLogs = getLogEntries();
        
        if (days === 'all') {
            return allLogs;
        }
        
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - days);
        
        return allLogs.filter(log => new Date(log.date) >= cutoffDate);
    } catch (error) {
        console.error('Error getting recent logs:', error);
        return [];
    }
}

/**
 * Delete a specific log entry by ID
 * @param {number} logId - The ID of the log to delete
 * @returns {boolean} - Success status
 */
function deleteLogEntry(logId) {
    try {
        let logs = getLogEntries();
        logs = logs.filter(log => log.id !== logId);
        localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(logs));
        return true;
    } catch (error) {
        console.error('Error deleting log entry:', error);
        return false;
    }
}

/**
 * Clear all log entries (use with caution)
 * @returns {boolean} - Success status
 */
function clearAllLogs() {
    try {
        localStorage.removeItem(STORAGE_KEYS.LOGS);
        return true;
    } catch (error) {
        console.error('Error clearing logs:', error);
        return false;
    }
}

// ========== SYMPTOM ANALYSIS FUNCTIONS ==========

/**
 * Count frequency of a specific symptom
 * @param {string} symptomName - Name of symptom to count (e.g., 'confusion')
 * @param {number} days - Number of days to analyze (default: 7)
 * @returns {number} - Count of symptom occurrences
 */
function countSymptom(symptomName, days = 7) {
    try {
        const logs = getRecentLogs(days);
        return logs.filter(log => log.symptoms.includes(symptomName)).length;
    } catch (error) {
        console.error('Error counting symptom:', error);
        return 0;
    }
}

/**
 * Get all symptom frequencies for a time period
 * @param {number} days - Number of days to analyze
 * @returns {Object} - Object with symptom names as keys and counts as values
 */
function getSymptomFrequencies(days = 7) {
    try {
        const logs = getRecentLogs(days);
        const frequencies = {
            confusion: 0,
            wandering: 0,
            agitation: 0,
            sleep: 0,
            appetite: 0,
            medication: 0,
            falls: 0
        };
        
        logs.forEach(log => {
            log.symptoms.forEach(symptom => {
                if (frequencies.hasOwnProperty(symptom)) {
                    frequencies[symptom]++;
                }
            });
        });
        
        return frequencies;
    } catch (error) {
        console.error('Error getting symptom frequencies:', error);
        return {};
    }
}

/**
 * Count falls with injury
 * @param {number} days - Number of days to analyze
 * @returns {number} - Count of falls with injury
 */
function countFallsWithInjury(days = 7) {
    try {
        const logs = getRecentLogs(days);
        return logs.filter(log => log.fallInjury === true).length;
    } catch (error) {
        console.error('Error counting falls with injury:', error);
        return 0;
    }
}

/**
 * Get symptom trend (increasing, decreasing, stable)
 * Compares current period with previous period
 * @param {string} symptomName - Name of symptom to analyze
 * @param {number} days - Number of days for current period
 * @returns {Object} - Trend information {direction: 'increasing'|'decreasing'|'stable', change: number}
 */
function getSymptomTrend(symptomName, days = 7) {
    try {
        const currentCount = countSymptom(symptomName, days);
        
        // Get previous period count
        const allLogs = getLogEntries();
        const currentCutoff = new Date();
        currentCutoff.setDate(currentCutoff.getDate() - days);
        const previousCutoff = new Date();
        previousCutoff.setDate(previousCutoff.getDate() - (days * 2));
        
        const previousLogs = allLogs.filter(log => {
            const logDate = new Date(log.date);
            return logDate >= previousCutoff && logDate < currentCutoff;
        });
        
        const previousCount = previousLogs.filter(log => 
            log.symptoms.includes(symptomName)
        ).length;
        
        const change = currentCount - previousCount;
        let direction = 'stable';
        
        if (change > 0) {
            direction = 'increasing';
        } else if (change < 0) {
            direction = 'decreasing';
        }
        
        return {
            direction: direction,
            change: change,
            currentCount: currentCount,
            previousCount: previousCount
        };
    } catch (error) {
        console.error('Error getting symptom trend:', error);
        return { direction: 'stable', change: 0 };
    }
}

// ========== APPOINTMENT FUNCTIONS ==========

/**
 * Save appointment request to localStorage
 * @param {Object} appointmentData - Appointment request details
 * @returns {boolean} - Success status
 */
function saveAppointmentRequest(appointmentData) {
    try {
        let appointments = JSON.parse(localStorage.getItem(STORAGE_KEYS.APPOINTMENTS) || '[]');
        appointments.push(appointmentData);
        localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(appointments));
        return true;
    } catch (error) {
        console.error('Error saving appointment request:', error);
        return false;
    }
}

/**
 * Get all appointment requests
 * @returns {Array} - Array of appointment requests
 */
function getAppointmentRequests() {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.APPOINTMENTS) || '[]');
    } catch (error) {
        console.error('Error retrieving appointments:', error);
        return [];
    }
}

// ========== UTILITY FUNCTIONS ==========

/**
 * Format date for display
 * @param {string} dateString - ISO date string
 * @returns {string} - Formatted date
 */
function formatDate(dateString) {
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    } catch (error) {
        console.error('Error formatting date:', error);
        return dateString;
    }
}

/**
 * Get symptom display label
 * @param {string} symptomKey - Internal symptom key
 * @returns {string} - Human-readable label
 */
function getSymptomLabel(symptomKey) {
    const labels = {
        'confusion': 'Confusion or Disorientation',
        'wandering': 'Wandering or Restlessness',
        'agitation': 'Agitation or Aggression',
        'sleep': 'Sleep Issues',
        'appetite': 'Appetite Changes',
        'medication': 'Missed Medication',
        'falls': 'Falls or Balance Issues'
    };
    
    return labels[symptomKey] || symptomKey;
}

/**
 * Export logs as JSON for download
 * @returns {string} - JSON string of all logs
 */
function exportLogsAsJSON() {
    try {
        const logs = getLogEntries();
        return JSON.stringify(logs, null, 2);
    } catch (error) {
        console.error('Error exporting logs:', error);
        return '[]';
    }
}

/**
 * Get summary statistics for all logs
 * @returns {Object} - Summary statistics
 */
function getSummaryStatistics() {
    try {
        const logs = getLogEntries();
        const frequencies = getSymptomFrequencies('all');
        
        return {
            totalEntries: logs.length,
            dateRange: {
                earliest: logs.length > 0 ? logs[0].date : null,
                latest: logs.length > 0 ? logs[logs.length - 1].date : null
            },
            symptomFrequencies: frequencies,
            fallsWithInjury: countFallsWithInjury('all'),
            mostCommonSymptom: getMostCommonSymptom(frequencies)
        };
    } catch (error) {
        console.error('Error getting summary statistics:', error);
        return null;
    }
}

/**
 * Get most common symptom from frequencies
 * @param {Object} frequencies - Symptom frequency object
 * @returns {string} - Most common symptom name
 */
function getMostCommonSymptom(frequencies) {
    let maxCount = 0;
    let mostCommon = 'None';
    
    for (const [symptom, count] of Object.entries(frequencies)) {
        if (count > maxCount) {
            maxCount = count;
            mostCommon = symptom;
        }
    }
    
    return maxCount > 0 ? getSymptomLabel(mostCommon) : 'None';
}

// ========== CONSOLE UTILITIES (for development/debugging) ==========

/**
 * Display storage info in console
 */
function displayStorageInfo() {
    console.log('=== EchoCare Storage Info ===');
    console.log('Total Logs:', getLogEntries().length);
    console.log('Total Appointments:', getAppointmentRequests().length);
    console.log('Summary:', getSummaryStatistics());
    console.log('===========================');
}

// ========== INITIALIZATION ==========

// Check if localStorage is available
function checkLocalStorageAvailable() {
    try {
        const test = '__localStorage_test__';
        localStorage.setItem(test, test);
        localStorage.removeItem(test);
        return true;
    } catch (error) {
        console.error('localStorage is not available:', error);
        return false;
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Check localStorage availability
    if (!checkLocalStorageAvailable()) {
        console.warn('Warning: localStorage is not available. Data will not persist.');
    }
    
    // Optional: Display storage info in console for debugging
    // displayStorageInfo();
});

// ========== EXPORT FOR MODULE USAGE (if needed) ==========
// Uncomment if using ES6 modules
/*
export {
    saveLogEntry,
    getLogEntries,
    getRecentLogs,
    deleteLogEntry,
    clearAllLogs,
    countSymptom,
    getSymptomFrequencies,
    countFallsWithInjury,
    getSymptomTrend,
    saveAppointmentRequest,
    getAppointmentRequests,
    formatDate,
    getSymptomLabel,
    exportLogsAsJSON,
    getSummaryStatistics
};
*/
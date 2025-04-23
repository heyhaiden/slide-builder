/**
 * Handles toast notifications
 */
export class Toast {
    /**
     * Shows a toast notification
     * @param {string} message - The message to display
     * @param {string} type - The type of toast ('success' or 'error')
     * @param {number} duration - Duration in milliseconds
     */
    static show(message, type = 'success', duration = 3000) {
        // Get or create the toast container
        let container = document.getElementById('toastContainer');
        if (!container) {
            container = document.createElement('div');
            container.id = 'toastContainer';
            container.className = 'toast-container';
            document.body.appendChild(container);
        }
        
        // Create the toast element
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        // Add an icon based on type
        const icon = type === 'success' ? '✅' : '❌';
        
        // Set the content
        toast.innerHTML = `<span class="toast-icon">${icon}</span><span class="toast-message">${message}</span>`;
        
        // Add to the container
        container.appendChild(toast);
        
        // Animate in
        requestAnimationFrame(() => {
            toast.style.animation = 'slideIn 0.3s ease forwards';
        });
        
        // Set a timeout to remove the toast
        setTimeout(() => {
            toast.style.animation = 'slideOut 0.3s ease forwards';
            
            // Remove from DOM after animation
            setTimeout(() => {
                if (container.contains(toast)) {
                    container.removeChild(toast);
                }
                
                // Remove container if empty
                if (container.children.length === 0) {
                    document.body.removeChild(container);
                }
            }, 300);
        }, duration);
    }
}
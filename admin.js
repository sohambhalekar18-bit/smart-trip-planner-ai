// --- Confirmation Dialog ---
function confirmAction(action) {
    return confirm(`Are you sure you want to ${action}? This cannot be undone.`);
}

// --- Theme Toggling ---
document.addEventListener('DOMContentLoaded', () => {
    const themeToggleButton = document.getElementById('theme-toggle');
    const body = document.body;

    // Function to apply the theme
    const applyTheme = (theme) => {
        if (theme === 'dark') {
            body.classList.add('dark-mode');
        } else {
            body.classList.remove('dark-mode');
        }
    };

    // Get preferred theme from localStorage or system settings
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    let currentTheme = savedTheme || (prefersDark ? 'dark' : 'light');
    
    // Apply the initial theme
    applyTheme(currentTheme);

    // Add click event listener to the button
    if (themeToggleButton) {
        themeToggleButton.addEventListener('click', () => {
            currentTheme = body.classList.contains('dark-mode') ? 'light' : 'dark';
            applyTheme(currentTheme);
            localStorage.setItem('theme', currentTheme);
        });
    }
});

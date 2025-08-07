async function loadAlerts() {
  const response = await fetch('/alerts/api/alerts');
  const alerts = await response.json();
  
  const alertSection = document.createElement('section');
  alertSection.className = 'alert-list';
  
  alerts.forEach(alert => {
    const alertDiv = document.createElement('div');
    alertDiv.className = 'alert';
    alertDiv.style.backgroundColor = alert.background;
    alertDiv.style.color = alert.color;
    alertDiv.textContent = alert.message;
    alertSection.appendChild(alertDiv);
  });
  
  document.querySelector('main').prepend(alertSection);
}

document.addEventListener('DOMContentLoaded', loadAlerts);
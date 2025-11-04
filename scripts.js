function waitForChart(callback) {
    if (typeof Chart !== 'undefined') {
        callback();
    } else {
        setTimeout(() => waitForChart(callback), 50);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.nav-link');
    const mainContent = document.querySelector('.main-content');
    const contentSections = document.querySelectorAll('.content-wrapper');
    let currentSection = document.getElementById('dashboard-content');
    let isAnimating = false;
    let charts = {};

    currentSection.classList.add('active');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            if (isAnimating) return;
            
            const sectionId = this.getAttribute('data-section') + '-content';
            const targetSection = document.getElementById(sectionId);
            if (!targetSection || targetSection === currentSection) return;
            
            isAnimating = true;
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');

            const exitClone = currentSection.cloneNode(true);
            exitClone.classList.remove('active');
            exitClone.classList.add('content-exit');
            mainContent.appendChild(exitClone);
            requestAnimationFrame(() => exitClone.classList.add('exiting'));

            setTimeout(() => {
                currentSection.classList.remove('active');
                targetSection.classList.add('active');
                currentSection = targetSection;

                setTimeout(() => {
                    if (exitClone.parentNode) exitClone.parentNode.removeChild(exitClone);
                    isAnimating = false;
                }, 800);

                waitForChart(() => initChartsForSection(targetSection.id));
            }, 400);
        });
    });

    function initChartsForSection(sectionId) {
        Object.values(charts).forEach(chart => {
            if (chart && typeof chart.destroy === 'function') chart.destroy();
        });
        charts = {};

        if (sectionId === 'dashboard-content') {
            charts.flightShare = createChart('flightShareChart', {
                type: 'doughnut',
                data: {
                    labels: ['Business', 'Economy', 'First Class'],
                    datasets: [{
                        data: [35, 40, 25],
                        backgroundColor: ['#f9a826', '#50c878', '#4a90e2'],
                        borderWidth: 0,
                        cutout: '70%',
                        borderRadius: 10
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { position: 'bottom', labels: { padding: 20, font: { size: 12 } } },
                        tooltip: { backgroundColor: '#1a3c34', titleColor: '#f9a826' }
                    }
                }
            });

            charts.flightSchedule = createChart('flightScheduleChart', {
                type: 'line',
                data: {
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                    datasets: [{
                        label: 'Passengers',
                        data: [1200, 1900, 3000, 5000, 3200, 3500],
                        borderColor: '#f9a826',
                        backgroundColor: 'rgba(249, 168, 38, 0.15)',
                        borderWidth: 4,
                        fill: true,
                        tension: 0.4,
                        pointBackgroundColor: '#f9a826',
                        pointRadius: 6,
                        pointHoverRadius: 8
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false },
                        tooltip: { backgroundColor: '#1a3c34' }
                    },
                    scales: {
                        y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.05)' } },
                        x: { grid: { display: false } }
                    }
                }
            });
        }

        if (sectionId === 'statistics-content') {
            charts.traffic = createChart('trafficChart', {
                type: 'line',
                data: {
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                    datasets: [{
                        label: 'Passengers',
                        data: [12000, 15000, 18000, 22000, 25000, 28000, 32000, 30000, 27000, 24000, 21000, 19000],
                        borderColor: '#f9a826',
                        backgroundColor: 'rgba(249, 168, 38, 0.1)',
                        borderWidth: 3,
                        fill: true,
                        tension: 0.4,
                        pointRadius: 5
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                        y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.05)' } },
                        x: { grid: { display: false } }
                    }
                }
            });

            charts.revenueRoute = createChart('revenueRouteChart', {
                type: 'bar',
                data: {
                    labels: ['JFK-LHR', 'LAX-NRT', 'DXB-SYD', 'MIA-CDG', 'ORD-PEK'],
                    datasets: [{
                        label: 'Revenue ($)',
                        data: [850000, 720000, 680000, 590000, 520000],
                        backgroundColor: '#f9a826',
                        borderRadius: 10,
                        borderSkipped: false
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                        y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.05)' } },
                        x: { grid: { display: false } }
                    }
                }
            });

            charts.loadFactor = createChart('loadFactorChart', {
                type: 'doughnut',
                data: {
                    labels: ['Occupied', 'Available'],
                    datasets: [{
                        data: [78, 22],
                        backgroundColor: ['#f9a826', '#e9ecef'],
                        borderWidth: 0,
                        cutout: '75%',
                        borderRadius: 8
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { position: 'bottom' },
                        tooltip: { backgroundColor: '#1a3c34' }
                    }
                }
            });

            charts.satisfaction = createChart('satisfactionChart', {
                type: 'polarArea',
                data: {
                    labels: ['Comfort', 'Service', 'Food', 'Entertainment', 'Value'],
                    datasets: [{
                        data: [4.5, 4.8, 4.2, 4.6, 4.7],
                        backgroundColor: [
                            'rgba(249, 168, 38, 0.9)',
                            'rgba(244, 180, 0, 0.9)',
                            'rgba(249, 168, 38, 0.7)',
                            'rgba(244, 180, 0, 0.7)',
                            'rgba(249, 168, 38, 0.5)'
                        ],
                        borderWidth: 0
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { position: 'bottom' } },
                    scales: { r: { grid: { color: 'rgba(0,0,0,0.1)' } } }
                }
            });
        }

        if (sectionId === 'reports-content') {
            charts.revenue = createChart('revenueChart', {
                type: 'bar',
                data: {
                    labels: ['Q1', 'Q2', 'Q3', 'Q4'],
                    datasets: [{ data: [450000, 620000, 580000, 850000], backgroundColor: '#f9a826', borderRadius: 8 }]
                },
                options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }
            });

            charts.route = createChart('routeChart', {
                type: 'doughnut',
                data: {
                    labels: ['Domestic', 'International'],
                    datasets: [{ data: [65, 35], backgroundColor: ['#f9a826', '#f4b400'], borderWidth: 0, cutout: '70%' }]
                },
                options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }
            });

            charts.customer = createChart('customerChart', {
                type: 'radar',
                data: {
                    labels: ['Satisfaction', 'Loyalty', 'Service', 'Comfort', 'Value'],
                    datasets: [{ data: [4.7, 4.2, 4.5, 4.3, 4.6], backgroundColor: 'rgba(249, 168, 38, 0.2)', borderColor: '#f9a826', borderWidth: 2 }]
                },
                options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }
            });

            charts.ops = createChart('opsChart', {
                type: 'line',
                data: {
                    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
                    datasets: [{ data: [99.2, 99.8, 98.5, 99.9, 99.1, 99.7], borderColor: '#f9a826', backgroundColor: 'rgba(249, 168, 38, 0.1)', borderWidth: 3, fill: true, tension: 0.4 }]
                },
                options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }
            });
        }
    }

    function createChart(canvasId, config) {
        const canvas = document.getElementById(canvasId);
        if (canvas && typeof Chart !== 'undefined') {
            const ctx = canvas.getContext('2d');
            if (ctx) return new Chart(ctx, config);
        }
        return null;
    }

    waitForChart(() => initChartsForSection('dashboard-content'));

    document.querySelectorAll('.toggle-switch').forEach(toggle => {
        toggle.addEventListener('click', function() {
            this.classList.toggle('active');
        });
    });
});

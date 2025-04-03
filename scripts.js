// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize live score updates
    initLiveScoreUpdates();
    
    // Initialize prediction bars
    initPredictionBars();
    
    // Initialize player tabs
    initTabs();
    
    // Initialize charts
    initCharts();
});

// Live Score Updates
function initLiveScoreUpdates() {
    // Simulate live ball updates
    const possibleBalls = ['0', '1', '2', '4', '6', 'W', 'WD', 'NB'];
    const lastBallElement = document.getElementById('last-ball');
    const recentBallsElement = document.getElementById('recent-balls');
    const currentOverElement = document.getElementById('current-over');
    const currentRRElement = document.getElementById('current-rr');
    
    // Update ball every 15 seconds for live matches
    if (lastBallElement) {
        setInterval(function() {
            const newBall = possibleBalls[Math.floor(Math.random() * possibleBalls.length)];
            
            // Create new ball element
            const ballElement = document.createElement('div');
            ballElement.className = `ball ball-${newBall.toLowerCase()} animated-ball`;
            ballElement.textContent = newBall;
            
            // Update last ball
            if (lastBallElement.querySelector('.ball')) {
                lastBallElement.querySelector('.ball').remove();
            }
            lastBallElement.appendChild(ballElement);
            
            // Update recent balls
            if (recentBallsElement) {
                const newBallForRecent = document.createElement('div');
                newBallForRecent.className = `ball ball-${newBall.toLowerCase()}`;
                newBallForRecent.textContent = newBall;
                
                recentBallsElement.insertBefore(newBallForRecent, recentBallsElement.firstChild);
                
                // Keep only the last 6 balls
                if (recentBallsElement.children.length > 6) {
                    recentBallsElement.removeChild(recentBallsElement.lastChild);
                }
            }
            
            // Update over count
            if (currentOverElement) {
                const currentOver = parseFloat(currentOverElement.textContent);
                const ballsInOver = Math.round((currentOver - Math.floor(currentOver)) * 10);
                
                if (newBall !== 'WD' && newBall !== 'NB') {
                    if (ballsInOver < 5) {
                        currentOverElement.textContent = `${Math.floor(currentOver)}.${ballsInOver + 1}`;
                    } else {
                        currentOverElement.textContent = `${Math.floor(currentOver) + 1}.0`;
                    }
                }
            }
            
            // Update run rate
            if (currentRRElement) {
                const currentRR = parseFloat(currentRRElement.textContent);
                const change = (Math.random() * 0.4) - 0.2; // Random change between -0.2 and 0.2
                currentRRElement.textContent = (currentRR + change).toFixed(1);
            }
            
        }, 15000);
    }
    
    // Update win probability
    const miProbabilityElement = document.getElementById('mi-probability');
    const cskProbabilityElement = document.getElementById('csk-probability');
    const winProbOverElement = document.getElementById('win-prob-over');
    
    if (miProbabilityElement && cskProbabilityElement && winProbOverElement) {
        setInterval(function() {
            const currentMIProbability = parseInt(miProbabilityElement.textContent);
            const change = Math.floor(Math.random() * 5) - 2; // Random change between -2 and 2
            
            const newMIProbability = Math.min(Math.max(currentMIProbability + change, 10), 90);
            const newCSKProbability = 100 - newMIProbability;
            
            miProbabilityElement.textContent = `${newMIProbability}%`;
            cskProbabilityElement.textContent = `${newCSKProbability}%`;
            
            document.querySelector('.mi-bar').style.width = `${newMIProbability}%`;
            document.querySelector('.csk-bar').style.width = `${newCSKProbability}%`;
            
            // Update over
            const currentOver = parseInt(winProbOverElement.textContent);
            if (currentOver < 20) {
                winProbOverElement.textContent = currentOver + 1;
            }
        }, 30000); // Update every 30 seconds
    }
}

// Initialize prediction bars
function initPredictionBars() {
    // Animate prediction percentages
    const predictionPercentages = document.querySelectorAll('.prediction-percentage');
    predictionPercentages.forEach(function(element) {
        const percentage = element.getAttribute('data-percentage');
        let count = 0;
        const interval = setInterval(function() {
            if (count >= percentage) {
                clearInterval(interval);
            } else {
                count++;
                element.textContent = `${count}%`;
            }
        }, 20);
    });
    
    // Animate prediction bars
    setTimeout(function() {
        const predictionBar1 = document.getElementById('prediction-bar-1');
        const predictionBar2 = document.getElementById('prediction-bar-2');
        
        if (predictionBar1) {
            predictionBar1.style.width = '62%';
        }
        
        if (predictionBar2) {
            predictionBar2.style.width = '45%';
        }
    }, 500);
}

// Initialize tabs
function initTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    
    tabButtons.forEach(function(button) {
        button.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            const tabPane = document.getElementById(tabId);
            
            // Remove active class from all buttons and panes
            const parentTabButtons = this.parentElement.querySelectorAll('.tab-btn');
            parentTabButtons.forEach(function(btn) {
                btn.classList.remove('active');
            });
            
            const parentTabContent = this.closest('.tab-buttons').nextElementSibling;
            const tabPanes = parentTabContent.querySelectorAll('.tab-pane');
            tabPanes.forEach(function(pane) {
                pane.classList.remove('active');
            });
            
            // Add active class to clicked button and corresponding pane
            this.classList.add('active');
            tabPane.classList.add('active');
        });
    });
}

// Toggle prediction factors
function toggleFactors(element) {
    element.classList.toggle('active');
    const factorsList = element.nextElementSibling;
    factorsList.classList.toggle('show');
}

// Set reminder
function setReminder(matchId) {
    const button = event.currentTarget;
    button.innerHTML = '<i class="fas fa-check-circle"></i> Reminder Set';
    button.disabled = true;
    button.style.color = '#28a745';
    
    // Show notification
    alert('Reminder set! We\'ll notify you before the match starts.');
}

// Initialize charts
function initCharts() {
    // Win Probability Chart
    const winProbabilityChartElement = document.getElementById('winProbabilityChart');
    if (winProbabilityChartElement) {
        const ctx = winProbabilityChartElement.getContext('2d');
        
        // Generate data for win probability chart
        const labels = ['Start'];
        const miData = [50];
        const cskData = [50];
        
        for (let i = 1; i <= 20; i++) {
            labels.push(`Over ${i}`);
            
            if (i <= 16) {
                // Historical data
                const miProb = 50 + (i * 1.2) - (Math.random() * 5);
                miData.push(miProb);
                cskData.push(100 - miProb);
            } else {
                // Future projection
                miData.push(null);
                cskData.push(null);
            }
        }
        
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Mumbai Indians',
                        data: miData,
                        borderColor: '#004ba0',
                        backgroundColor: 'rgba(0, 75, 160, 0.1)',
                        fill: true,
                        tension: 0.4,
                        pointRadius: 4,
                        pointHoverRadius: 6
                    },
                    {
                        label: 'Chennai Super Kings',
                        data: cskData,
                        borderColor: '#f7ca00',
                        backgroundColor: 'rgba(247, 202, 0, 0.1)',
                        fill: true,
                        tension: 0.4,
                        pointRadius: 4,
                        pointHoverRadius: 6
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    tooltip: {
                        mode: 'index',
                        intersect: false
                    },
                    legend: {
                        position: 'top',
                    }
                },
                scales: {
                    y: {
                        min: 0,
                        max: 100,
                        ticks: {
                            callback: function(value) {
                                return value + '%';
                            }
                        }
                    }
                }
            }
        });
    }
    
    // Player Performance Charts
    for (let i = 1; i <= 3; i++) {
        const performanceChartElement = document.getElementById(`playerPerformanceChart${i}`);
        if (performanceChartElement) {
            const ctx = performanceChartElement.getContext('2d');
            
            // Generate random performance data
            const labels = [];
            const data = [];
            
            for (let j = 1; j <= 8; j++) {
                labels.push(`Match ${j}`);
                data.push(Math.floor(Math.random() * 60) + 20);
            }
            
            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [
                        {
                            label: i === 2 ? 'Wickets' : 'Runs',
                            data: data,
                            backgroundColor: '#0e3b7e',
                            borderRadius: 5
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        }
        
        const historyChartElement = document.getElementById(`playerHistoryChart${i}`);
        if (historyChartElement) {
            const ctx = historyChartElement.getContext('2d');
            
            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: ['2020', '2021', '2022', '2023', '2024'],
                    datasets: [
                        {
                            label: i === 2 ? 'Wickets' : 'Runs',
                            data: [
                                Math.floor(Math.random() * 300) + 200,
                                Math.floor(Math.random() * 300) + 200,
                                Math.floor(Math.random() * 300) + 200,
                                Math.floor(Math.random() * 300) + 200,
                                Math.floor(Math.random() * 300) + 200
                            ],
                            borderColor: '#0e3b7e',
                            backgroundColor: 'rgba(14, 59, 126, 0.1)',
                            fill: true,
                            tension: 0.4
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        }
                    }
                }
            });
        }
    }
    
    // Head to Head Chart
    const headToHeadChartElement = document.getElementById('headToHeadChart');
    if (headToHeadChartElement) {
        const ctx = headToHeadChartElement.getContext('2d');
        
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Total Matches', 'Matches Won', 'Last 5 Matches'],
                datasets: [
                    {
                        label: 'Mumbai Indians',
                        data: [14, 8, 3],
                        backgroundColor: '#004ba0'
                    },
                    {
                        label: 'Chennai Super Kings',
                        data: [14, 6, 2],
                        backgroundColor: '#f7ca00'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
    
    // Team Strength Chart
    const teamStrengthChartElement = document.getElementById('teamStrengthChart');
    if (teamStrengthChartElement) {
        const ctx = teamStrengthChartElement.getContext('2d');
        
        new Chart(ctx, {
            type: 'radar',
            data: {
                labels: ['Batting', 'Bowling', 'Fielding', 'Experience', 'Form'],
                datasets: [
                    {
                        label: 'Mumbai Indians',
                        data: [85, 75, 78, 90, 82],
                        borderColor: '#004ba0',
                        backgroundColor: 'rgba(0, 75, 160, 0.2)',
                        pointBackgroundColor: '#004ba0',
                        pointBorderColor: '#fff',
                        pointHoverBackgroundColor: '#fff',
                        pointHoverBorderColor: '#004ba0'
                    },
                    {
                        label: 'Chennai Super Kings',
                        data: [80, 82, 75, 85, 78],
                        borderColor: '#f7ca00',
                        backgroundColor: 'rgba(247, 202, 0, 0.2)',
                        pointBackgroundColor: '#f7ca00',
                        pointBorderColor: '#fff',
                        pointHoverBackgroundColor: '#fff',
                        pointHoverBorderColor: '#f7ca00'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top'
                    }
                },
                scales: {
                    r: {
                        angleLines: {
                            display: true
                        },
                        suggestedMin: 0,
                        suggestedMax: 100
                    }
                }
            }
        });
    }
    
    // Player Comparison Chart
    const playerComparisonChartElement = document.getElementById('playerComparisonChart');
    if (playerComparisonChartElement) {
        const ctx = playerComparisonChartElement.getContext('2d');
        
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Top Order', 'Middle Order', 'All-rounders', 'Pace Bowlers', 'Spin Bowlers'],
                datasets: [
                    {
                        label: 'Mumbai Indians',
                        data: [85, 78, 75, 82, 70],
                        backgroundColor: '#004ba0'
                    },
                    {
                        label: 'Chennai Super Kings',
                        data: [82, 80, 85, 78, 88],
                        backgroundColor: '#f7ca00'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                indexAxis: 'y',
                plugins: {
                    legend: {
                        position: 'top'
                    }
                },
                scales: {
                    x: {
                        beginAtZero: true,
                        max: 100
                    }
                }
            }
        });
    }
}
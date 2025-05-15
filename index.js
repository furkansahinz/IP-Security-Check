async function checkMultipleIPs() {
    const ipInput = document.getElementById('ipInput');
    // Using Set to remove duplicate IPs
    const uniqueIPs = [...new Set(ipInput.value.split(',').map(ip => ip.trim()).filter(ip => ip))];
    
    if (uniqueIPs.length === 0) {
        alert('Please enter at least one IP address');
        return;
    }

    // IP address format validation
    const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
    const invalidIPs = uniqueIPs.filter(ip => !ipRegex.test(ip));
    if (invalidIPs.length > 0) {
        alert(`Invalid IP addresses: ${invalidIPs.join(', ')}`);
        return;
    }

    document.querySelector('.loading').style.display = 'block';
    document.getElementById('results').innerHTML = '';
    document.getElementById('ipCount').innerHTML = '';

    let allResults = '';

    for (const ipAddress of uniqueIPs) {
        try {
            const response = await fetch(`http://localhost:3000/check-ip/${ipAddress}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (!data || !data.data) {
                throw new Error('API response contains invalid format');
            }

            allResults += `
                <div class="result-row">
                    <div class="result-card">
                        <h3>${ipAddress} - AbuseIPDB Result</h3>
                        <div class="score ${getScoreClass(data.data.abuseConfidenceScore)}">${data.data.abuseConfidenceScore}%</div>
                        <p>Security Score: ${100 - data.data.abuseConfidenceScore}%</p>
                        <p style="margin-bottom: 20px;">Last Report: ${data.data.lastReportedAt || 'None'}</p>
                        <button onclick="window.open('https://www.abuseipdb.com/check/${ipAddress}', '_blank')" class="visit-abuse-button">Visit Abuse</button>
                    </div>
                    <div class="result-card">
                        <h3>${ipAddress} - General Assessment</h3>
                        <p>${getSecurityAssessment(data.data.abuseConfidenceScore)}</p>
                        <p>Domain: ${data.data.domain || 'Unknown'}</p>
                        <p>Country: ${data.data.countryCode || 'Unknown'}</p>
                    </div>
                </div>
            `;
        } catch (error) {
            console.error('API Error:', error);
            allResults += `
                <div class="result-row">
                    <div class="result-card">
                        <h3>${ipAddress} - Error</h3>
                        <p>An error occurred during API connection. Please check your API key and try again.</p>
                        <p>Error details: ${error.message}</p>
                    </div>
                </div>
            `;
        }
    }

    document.getElementById('results').innerHTML = allResults;
    document.querySelector('.loading').style.display = 'none';
    document.getElementById('ipCount').innerHTML = `${uniqueIPs.length} IP addresses checked.`;
}

function getScoreClass(score) {
    if (score < 25) return 'safe';
    if (score < 75) return 'warning';
    return 'danger';
}

function getSecurityAssessment(score) {
    if (score < 1) {
        return 'This IP address appears to be safe. No threats detected.';
    } else if (score < 10) {
        return 'This IP address has low risk. Low probability of suspicious activity, but caution is advised.';
    } else if (score < 15) {
        return 'This IP address has low-medium risk. May have suspicious behavior history, detailed analysis recommended.';
    } else if (score < 25) {
        return 'This IP address has medium risk. Some threat elements may have been detected in previous activities.';
    } else if (score < 50) {
        return 'This IP address carries medium-high risk. May be associated with potentially threatening activities.';
    } else if (score < 75) {
        return 'This IP address is high risk. May have malicious activity history, restrict or block access to your network.';
    } else {
        return 'This IP address is very high risk. Associated with known threat sources. Should be immediately isolated or blocked.';
    }
}
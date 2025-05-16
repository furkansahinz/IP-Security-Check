# IP Security Check 🔍
This tool allows you to analyze multiple IP addresses simultaneously. It uses the AbuseIPDB API to check the reputation of IPs and determine whether they are malicious.

## Features
- Analyze multiple IP addresses at the same time
- Retrieve threat scores and detailed information via AbuseIPDB
- Easy to use from the command line
- ✅ New: Whitelist module to exclude trusted IPs from analysis

## 🆕 Whitelist Module
You can now define a list of trusted IP addresses using a whitelist file (e.g., whitelist.txt).
Any IP address included in this list will be skipped during the analysis, allowing you to avoid false positives for known or internal IPs.

How to use:
Create a whitelist.txt file in the project directory and add one IP address per line. Example:

192.168.1.1
203.0.113.10

These IPs will be ignored by the checker during scanning.

## Requirements
- Node.js
- AbuseIPDB API Key

## Installation and Usage
Clone the repository:

```bash
git clone https://github.com/furkansahinz/IP-Security-Check
cd IP-Security-Check
npm install
npm start
````
![image](https://github.com/user-attachments/assets/5be84f9b-7d9c-4713-b06f-bae7a4ba9425)


const { app } = require('electron');
const fs = require('fs').promises;
const path = require('path');

const configPath = path.join(app.getPath('userData'), 'config.json');

export async function saveConfig(config: any) {
    try {
        await fs.writeFile(configPath, JSON.stringify(config, null, 2), 'utf8');
        console.log('DB config saved successfully');
    } catch (err) {
        console.error('Error saving DB config:', err);
    }
}

export async function loadConfig() {
    try {
        const data = await fs.readFile(configPath, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error('Error loading DB config:', err);
        return null;
    }
}
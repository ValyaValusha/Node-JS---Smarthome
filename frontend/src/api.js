import axios from 'axios';

const serverUrl = 'http://localhost:3010';
let index = 3;
let devices = {
    device1: {
        id: 'device1',
        name: 'Device #1',
        address: '192.168.1.50',
        port: 90,
        state: 'on'
    },
    device2: {
        id: 'device2',
        name: 'Device #2',
        address: '192.168.1.60',
        port: 80,
        state: 'off'
    }
};

export async function getDevices() {
    const response = await axios.get(`${serverUrl}/devices`);
    return response.data;
}

export async function getDeviceById(deviceId) {
    const response = await axios.get(`${serverUrl}/devices/${deviceId}`);
    return response.data;
}

export async function addDevice(device) {
    return axios.post(`${serverUrl}/devices`, device);
}

export async function removeDevice(deviceId) {
    return axios.delete(`${serverUrl}/devices/${deviceId}`);
}

export async function updateDevice(deviceId, data) {
    return axios.put(`${serverUrl}/devices/${deviceId}`, data);
}

export async function updateDeviceState(deviceId, data) {
    return axios.put(`${serverUrl}/devices/log/${deviceId}`, data);
}

export async function switchOn(deviceId) {
    await updateDeviceState(deviceId, {
        state: 'on'
    });
}

export async function switchOff(deviceId) {
    await updateDeviceState(deviceId, {
        state: 'off'
    });
}

export async function getDeviceLog(deviceId) {
    const response = await axios.get(`${serverUrl}/devices/log/${deviceId}`);
    return response.data;
}
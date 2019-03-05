import axios from 'axios';

const serverUrl = 'http://localhost:3010';

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

export async function getGroups() {
    const response = await axios.get(`${serverUrl}/groups`);
    return response.data;
}

export async function getGroupById(groupId) {
    const response = await axios.get(`${serverUrl}/groups/${groupId}`);
    return response.data;
}

export async function postGroup(data) {
    return axios.post(`${serverUrl}/groups`, data);
}

export async function removeGroup(groupId) {
    return axios.delete(`${serverUrl}/groups/${groupId}`);
}

export async function updateGroup(groupId, data) {
    return axios.put(`${serverUrl}/groups/${groupId}`, data);
}

export async function addDeviceToGroup(groupId, data) {
    return axios.put(`${serverUrl}/groups/addDevice/${groupId}`, data);
}

export async function removeDeviceFromGroup(groupId, data) {
    return axios.put(`${serverUrl}/groups/deleteDevice/${groupId}`, data);
}

export async function switchOnGroup(groupId) {
    await updateGroupState(groupId, {
        state: 'on'
    });
}

export async function switchOffGroup(groupId) {
    await updateGroupState(groupId, {
        state: 'off'
    });
}

export async function updateGroupState(groupId, data) {
    return axios.put(`${serverUrl}/groups/log/${groupId}`, data);
}

export async function getGroupLog(groupId) {
    const response = await axios.get(`${serverUrl}/groups/log/${groupId}`);
    return response.data;
}
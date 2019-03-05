import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { groupPropType } from '../constants';
import { getDevices, addDeviceToGroup, removeDeviceFromGroup } from '../api';

export default class GroupForm extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            devices: [],
            selectedDevices: []
        }
    }

    componentDidMount() {
        this.refreshDevices();
    }

    refreshDevices = async () => {
        this.setState({
            devices: await getDevices(),
            selectedDevices: this.props.group.devices
        });
    };

    handleCancelClick = () => {
        window.history.back();
    };

    handleSubmit = (event) => {
        this.props.onSubmit({
            ...this.props.group,
            name: event.target.groupName.value,
            devices: this.state.selectedDevices
        });
        event.preventDefault();
    };

    checkDeviceUniq = (event) => {
        let { selectedDevices, devices } = this.state;
        let { selectedIndex } = event.target;
        let findDevice = selectedDevices.findIndex(device => device.id === devices[selectedIndex].id);
        return (findDevice === -1) ? this.addSelectedDevice(selectedIndex): 1;  
    }

    addSelectedDevice = async (index) => {
        let { selectedDevices, devices } = this.state;
        if (this.props.group.id) {
            await addDeviceToGroup(this.props.group.id, devices[index]);
        }
        this.setState({selectedDevices: [...selectedDevices, devices[index] ]});
    }

    deleteSelected = async (event) => {
        let { selectedDevices } = this.state;
        let selectedId = event.currentTarget.attributes.getNamedItem('index').value;
        selectedId = selectedDevices[selectedId].id;
        selectedDevices = selectedDevices.filter(function(device) {
            return device.id !== selectedId;
        });
        await this.setState({selectedDevices: selectedDevices},() => {console.log('updated')} );
        this.removeDevice(this.props.group.id, selectedDevices);
    }

    removeDevice = async (groupId, devices) => {
        console.log(devices);
        await removeDeviceFromGroup(groupId, devices);
    }


    render() {
        const { group } = this.props;
        let { devices, selectedDevices } = this.state;

        return (
            <form onSubmit={this.handleSubmit}>
                <div className="form-group">
                    <label htmlFor="groupName">Group Name</label>
                    <input type="text"
                           className="form-control"
                           id="groupName"
                           name="groupName"
                           placeholder="Group Name"
                           defaultValue = {group.name}
                           required/>
                </div>
                { group.id &&
                <div className="form-group">
                    <label htmlFor="selectDevice">Add device to group</label>
                    <select className="form-control" 
                            id="selectDevice" 
                            name="selectDevice" 
                            placeholder="Select device to group"
                            onChange = {this.checkDeviceUniq}>
                        {devices.map((device, index) =>
                            <option key={device.id}> {device.name}</option>
                        )}
                    </select>
                </div>  
                }


                <ul className="list-group" style={{margin :'1.5rem 0'}}>
                    {selectedDevices.length > 0  &&
                    selectedDevices.map((device, index) =>
                        <li className="list-group-item disabled" key={index}>
                            {device.name}
                            <button type="button" className="close" index={index} aria-label="Close" onClick={this.deleteSelected}>
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </li>
                    )}
                </ul>

                <div className="float-right">
                    <button type="submit" className="btn btn-primary mr-2">Submit</button>
                    <button type="button" className="btn btn-default" onClick={this.handleCancelClick}>Cancel</button>
                </div>
            </form>
        );
    }
}

GroupForm.defaultProps = {
    group: {
        name: '',
        devices: []
    }
};

GroupForm.propTypes = {
    group: groupPropType,
    onSubmit: PropTypes.func.isRequired
};
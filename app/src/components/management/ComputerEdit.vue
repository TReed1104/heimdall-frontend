<template>
    <div id="computer-edit" class="container">
        <h1 class="page-title">Edit Computer</h1>
        <div v-if="this.computer != null" id="edit_form_wrapper">
            <h2>General</h2>
            <p>
                Machine Name: {{ this.computer.machine_name }}<br/>
                ID: {{ this.computer.id }}<br/>
                Status: {{ this.computer.status }}<br/>
                Last Seen: {{ this.computer.updated_at }}
            </p>
            <h2>Networking</h2>
            <p>
                MAC Address: {{ this.computer.mac_address.toUpperCase()}}<br/>
                IP Address: {{ this.computer.ip_address.toUpperCase()}}
            </p>
            <h2>Operating System</h2>
            <p>
                OS Name: {{ this.computer.os_name }}<br/>
                OS Release: {{ this.computer.os_release }}<br/>
                OS Build: {{ this.computer.os_build }}
            </p>
            <h2>Location</h2>
            <p>
                Room: {{ this.computer.room.toUpperCase()}}<br/>
                Desk: {{ this.computer.desk.toUpperCase()}}
            </p>
            <h2>New Location</h2>
            <div id="room_select_wrapper">
                <label for="room_input">Room:</label>
                <select v-if="this.rooms.length == 0" id="room_input" class="form-control w-25">
                    <option :id="'room_option_default'" value="room_option_default">Loading Rooms...</option>
                </select>
                <select v-else-if="this.rooms.length > 0" id="room_input" class="form-control w-25" @change="OnRoomChange($event)">
                    <option :id="'room_option_default'" value="room_option_default">No Room Selected</option>
                    <option v-for="room in this.rooms" :key="room.id" :id="'room_option_' + room.id" :value="room.name">{{ room.name.toUpperCase() }}</option>
                </select>
            </div>
            <br/>
            <div v-if="showDeskSelect" id="desk_select_wrapper">
                <label for="desk_input">Desk:</label>
                <select id="desk_input" class="form-control w-25" @change="OnDeskChange($event)">
                    <option :id="'desk_option_default'" value="desk_option_default">No Desk Selected</option>
                    <option v-for="desk in this.desks" :key="desk.id" :id="'desk_option_' + desk.id" :value="desk.name">{{ desk.name }}</option>
                </select>
            </div>
            <br/>
            <button :disabled="disableSaveButton" id="submit_button" class="btn btn-dark" @click="SubmitChanges">Save Changes</button>
            <router-link :to="{name: 'Computer View', params: {id: this.computer.id}}" tag="button" class="btn btn-dark" push>Cancel</router-link>
        </div>
        <div v-else id="edit_form_wrapper">
            <h2>{{ DefaultPageText }}</h2>
            <br/>
            <router-link :to="{name: 'Monitoring'}" tag="button" class="btn btn-dark" push>Cancel</router-link>
        </div>
    </div>
</template>

<script>
    import axios from 'axios'
    import router from '../../router'
    export default {
        data() {
            return {
                loading: true,
                computer: null,
                rooms: [],
                desks: [],
                showDeskSelect: false,
                disableSaveButton: true,
                roomChoice: "default",
                deskChoice: "default"
            }
        },
        computed: {
            DefaultPageText(){
                if (this.loading) {
                    return "Loading...";
                }
                else {
                    let ComputerID = undefined;
                    if (Object.keys(this.$route.params).length != 0) {
                        ComputerID = this.$route.params.id;
                    }
                    if (ComputerID == undefined) {
                        return "No Computer Selected";
                    }
                    if (this.Computer == null) {
                        return "Computer not found";
                    }
                }
            }
        },
        methods: {
           GetComputerDetails() {
                this.loading = true;
                // Get the computer ID from the vue-router param
                let computerID = 0;
                if (Object.keys(this.$route.params).length != 0) {
                    computerID = this.$route.params.id;
                }
                // Check the computer ID param was supplied
                if (computerID == undefined) {
                    this.computer = null;
                    this.loading = false;
                    return;
                }
                // Get the computer details from the Heimdall API
                axios.get(this.$store.getters.heimdallServerAddress + "/computer_handler?id=" + computerID).then(response => {
                    this.computer = response.data.data.computer;
                    this.loading = false;
                    this.GetRoomList();
                }).catch(error => {
                    console.log(error);
                    this.computer = null;
                    this.loading = false;
                });
            },
            GetRoomList() {
                axios.get(this.$store.getters.heimdallServerAddress + "/rooms").then(response => {
                    this.rooms = response.data.data.rooms;
                }).catch(error => {
                    console.log(error);
                });
            },
            SubmitChanges() {
                // Our request payload to send to the Heimdall API
                let requestBody = {
                    mac_address: this.computer.mac_address,
                    room: this.roomChoice,
                    desk: this.deskChoice
                };
                // Check the desk select and save are activated
                if (this.showDeskSelect && !this.disableSaveButton) {
                    axios.put(this.$store.getters.heimdallServerAddress + "/computer_handler", requestBody)
                    .then(response=> {
                        router.push({name: 'Computer View', params: {id: this.computer.id}});
                    })
                    .catch(error => {
                        // Output our error response from the API to the user
                        console.log(error);
                        alert(error.response.status + ": " + error.response.data.message);
                    });
                }
            },
            OnRoomChange(event) {
                // If the room has been chosen
                let roomID = event.target.value;
                if (event.target.value != "room_option_default") {
                    axios.get(this.$store.getters.heimdallServerAddress + "/desks?room_name=" + roomID).then(response => {
                        this.desks = response.data.data.desks;
                        this.roomChoice = event.target.value;
                        this.showDeskSelect = true;
                    }).catch(error => {
                        console.log(error);
                        this.ResetFormStates()
                    });
                }
                else {
                    this.ResetFormStates();
                }
            },
            OnDeskChange(event) {
                // Store the desk value ready for the save button submit
                this.disableSaveButton = (event.target.value == "desk_option_default");
                if (event.target.value != "desk_option_default") {
                    this.deskChoice = event.target.value;
                }
                else {
                    this.deskChoice = "default";
                }
            },
            ResetFormStates() {
                this.desks = [];
                this.roomChoice = "default";
                this.deskChoice = "default";
                this.showDeskSelect = false;
                this.disableSaveButton = true;
            }
        },
        mounted() {
            this.GetComputerDetails();
        }
    }
</script>

<template>
    <div id="desk-edit" class="container">
        <h1 class="page-title">Edit Desk</h1>
        <div v-if="this.desk != null" id="edit_form_wrapper">
            <h2>General</h2>
            <p>
                Name: {{ this.desk.name.toUpperCase() }}<br/>
                ID: {{ this.desk.id }} <br/>
                Room: {{ this.desk.room.toUpperCase() }} <br/>
                Number Of Computers: {{ this.desk.number_of_computers }}
            </p>
            <h2>Computers</h2>
            <ul class="list-group w-50">
                <li v-for="computer in this.desk.computers" :key="computer.id" class="list-group-item">
                    <div class="col- float-left">
                        <h5>{{ computer.machine_name }}</h5>
                    </div>
                    <div class="col- float-right">
                        <router-link :to="{name: 'Computer View', params: {id: computer.id}}" tag="button" class="btn btn-dark" push>View</router-link>
                        <router-link :to="{name: 'Computer Edit', params: {id: computer.id}}" tag="button" class="btn btn-dark" push>Edit</router-link>
                    </div>
                </li>
                <template v-if="this.desk.computers.length == 0">There are no computers assigned to this desk</template>
            </ul>
            <br/>
            <div id="room_select_wrapper">
                <h2>Room</h2>
                <select v-if="this.rooms.length == 0" id="room_input" class="form-control w-25">
                    <option :id="'room_option_default'" value="room_option_default">Loading Rooms...</option>
                </select>
                <select v-else-if="this.rooms.length > 0" id="room_input" class="form-control w-25" @change="OnRoomChange($event)">
                    <option :id="'room_option_default'" value="room_option_default">No Room Selected</option>
                    <option v-for="room in this.rooms" :key="room.id" :id="'room_option_' + room.id" :value="room.name">{{ room.name.toUpperCase() }}</option>
                </select>
            </div>
            <br/>
            <button :disabled="disableSaveButton" id="submit_button" class="btn btn-dark" @click="SubmitChanges">Save Changes</button>
            <router-link :to="{name: 'Desk View', params: { id: this.desk.id }}" tag="button" class="btn btn-dark" push>Cancel</router-link>
        </div>
        <div v-else id="edit_form_wrapper">
            <h2>{{ DefaultPageText }}</h2>
            <br/>
            <router-link :to="{name: 'Desks List'}" tag="button" class="btn btn-dark" push>Back To Desk List</router-link>
        </div>
    </div>
</template>

<script>
    import axios from 'axios'
    import router from '../../router'
    export default {
        data() {
            return {
                desk: null,
                loading: true,
                disableSaveButton: true,
                rooms: [],
                newRoomChoice: "default"
            }
        },
        computed: {
            DefaultPageText(){
                if (this.loading) {
                    return "Loading...";
                }
                else {
                    let deskID = undefined;
                    if (Object.keys(this.$route.params).length != 0) {
                        deskID = this.$route.params.id;
                    }
                    if (deskID == undefined) {
                        return "No Desk Selected";
                    }
                    if (this.desk == null) {
                        return "Desk not found";
                    }
                }
            }
        },
        methods: {
            GetDeskDetails() {
                this.loading = true;
                // Get the computer ID from the vue-router param
                let deskID = undefined;
                if (Object.keys(this.$route.params).length != 0) {
                    deskID = this.$route.params.id;
                }
                // Check the computer ID param was supplied
                if (deskID == undefined) {
                    this.desk = null;
                    this.loading = false;
                    return;
                }
                // Get the computer details from the Heimdall API
                axios.get(this.$store.getters.heimdallServerAddress + "/desk_handler?id=" + deskID).then(response => {
                    this.desk = response.data.data.desk;
                    this.loading = false;
                    this.GetRoomList();
                }).catch(error => {
                    console.log(error);
                    this.desk = null;
                    this.loading = false;
                });
            },
            GetRoomList() {
                axios.get(this.$store.getters.heimdallServerAddress + "/rooms").then(response => {
                    response.data.data.rooms.forEach(room => {
                        // Filter out the room we are already set to
                        if (room.name != this.desk.room) {
                            this.rooms.push(room);
                        }
                    }, this);
                }).catch(error => {
                    console.log(error);
                });
            },
            SubmitChanges() {
                // Our data to send over the POST request to the endpoint
                let requestBody = {
                    id: this.desk.id,
                    new_room: this.newRoomChoice
                };
                // Check the submit button is activated
                if (!this.disableSaveButton) {
                    axios.put(this.$store.getters.heimdallServerAddress + "/desk_handler", requestBody)
                    .then(response => {
                        if (response.status == 202) {
                            router.push({name: 'Desks List'});
                        }
                    })
                    .catch(error => {
                        // Output our error response from the API to the user
                        console.log(error);
                        alert(error.response.status + ": " + error.response.data.message);
                    });
                }
            },
            OnRoomChange(event) {
                this.disableSaveButton = (event.target.value == "room_option_default");
                if (event.target.value != "room_option_default") {
                    this.newRoomChoice = event.target.value;
                }
            }
        },
        mounted() {
            this.GetDeskDetails();
        }
    }
</script>

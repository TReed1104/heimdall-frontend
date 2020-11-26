<template>
    <div id="desk-create" class="container">
        <h1 class="page-title">Create Desk</h1>
        <div id="room_select_wrapper">
            <h2>Desk Name</h2>
            <p>
                Please enter the name for the new desk
            </p>
            <input id="name_input" type="text" class="form-control w-25" placeholder="Desk Name" required @input="InputDeskName"/>
            <br/>
            <h2>Room</h2>
            <p>
                Please select a room to create a desk in.
            </p>
            <select v-if="this.rooms.length == 0" id="room_input" class="form-control w-25">
                <option :id="'room_option_default'" value="room_option_default">Loading Rooms...</option>
            </select>
            <select v-else-if="this.rooms.length > 0" id="room_input" class="form-control w-25" @change="OnRoomChange($event)">
                <option :id="'room_option_default'" value="room_option_default">No Room Selected</option>
                <option v-for="room in this.rooms" :key="room.id" :id="'room_option_' + room.id" :value="room.name">{{ room.name.toUpperCase() }}</option>
            </select>
            <br/>
            <button :disabled="disableSubmitButton" id="submit_button" type="submit" class="btn btn-dark" @click="SubmitChanges">Submit</button>
            <router-link :to="{name: 'Desks List'}" tag="button" class="btn btn-dark" push>Cancel</router-link>
        </div>
    </div>
</template>

<script>
    import axios from 'axios'
    import router from '../../router'
    export default {
        data() {
            return {
                rooms: [],
                enteredRoomChoice: "",
                enteredDeskName: "",
                disableSubmitButton: true
            }
        },
        computed: {
        },
        methods: {
            GetRoomList() {
                // Get the rooms list to generate the select box
                axios.get(this.$store.getters.heimdallServerAddress + "/rooms").then(response => {
                    this.rooms = response.data.data.rooms;
                }).catch(error => {
                    console.log(error);
                });
            },
            OnRoomChange(event) {
                // Get the input room name and store it locally on the component
                this.enteredRoomChoice = event.target.value;
                this.ToggleSubmitButton();
            },
            InputDeskName(event) {
                // Get the input desk name and store it locally on the component
                this.enteredDeskName = event.target.value;
                this.ToggleSubmitButton();
            },
            ToggleSubmitButton(event) {
                // Toggle the submit buttom
                this.disableSubmitButton = !(this.enteredDeskName != "" && (this.enteredRoomChoice != "" && this.enteredRoomChoice != "room_option_default"));
            },
            SubmitChanges() {
                // Generate our request body to send
                let requestBody = {
                    desk: this.enteredDeskName,
                    room: this.enteredRoomChoice
                };
                // POST the data to the endpoint
                axios.post(this.$store.getters.heimdallServerAddress + "/desk_handler", requestBody)
                .then(response => {
                    router.push({name: 'Desks List'});
                })
                .catch(error => {
                    // Output our error response from the API to the user
                    console.log(error);
                    alert(error.response.status + ": " + error.response.data.message);
                });
            }
        },
        mounted() {
            this.GetRoomList();
        }
    }
</script>

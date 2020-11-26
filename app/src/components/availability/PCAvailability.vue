<template>
    <div id="page-content" class="container">
        <h1 class="page-title">Find a PC</h1>
        <p>
            Welcome to the Heimdall Find a PC application, below is a map of the chosen room.
            <br/>
            <b>Please Note:</b> This system is currently in Beta and therefore may not be 100% accurate, please bear with the Technician team as we work to fix any issues.
        </p>
        <br/>
        <h2 id="room-name">Room: {{ this.currentRoomMap.name.toUpperCase()}}</h2>
        <RoomMap :key="this.currentRoomMap.name" :map="this.currentRoomMap.map"></RoomMap>
        <br/>
        <div class="colour-key">
            <h4 style="padding-left: 10px;">Colour Key:</h4>
            <p style="padding-left: 10px;">
                <span style="background-color: green;">Green</span> - Available<br/>
                <span style="background-color: red;">Red</span> - In Use<br/>
                <span style="background-color: yellow;">Yellow</span> - Unavailable<br/>
                <span style="background-color: lightblue;">Light Blue</span> - No computer
            </p>
        </div>
    </div>
</template>

<script>
    import axios from 'axios'
    import RoomMap from './RoomMap.vue'
    import Room from '../../classes/Room.js'
    import { setInterval, clearInterval } from 'timers-browserify';
    export default {
        components: {
            RoomMap
        },
        data() {
            return {
                currentRoomMap: new Room(""),
                registeredComputers: [],
                timer: ''
            }
        },
        methods: {
            // The function for getting the data from Heimdall
            GetPCAvailability() {
                // Get the name of our room (default to inb1102)
                let roomID = 'inb1102'
                if (Object.keys(this.$route.params).length != 0) {
                    roomID = this.$route.params.room;
                }

                // Check if the room being rendered is the room we want
                if (this.currentRoomMap.name != roomID) {
                    // Current room is not right, load the right one
                    axios.get("./content/room_maps/" + roomID + ".json").then(json => {
                        let roomKey = json.data.data.room;
                        this.currentRoomMap = new Room(roomKey.id, roomKey.dimensions.x, roomKey.dimensions.y, roomKey.map);
                        // Update the status of each desk
                        this.UpdateAvailabilityStatus(roomID);
                    });
                }
                else {
                    // The current room is correct, just update the machijne status
                    this.UpdateAvailabilityStatus(roomID);
                }
            },
            UpdateAvailabilityStatus(roomID) {
                // Get the status data from the Heimdall API
                let url = this.$store.getters.heimdallEndpointAvailability + roomID;
                axios.get(url).then(response => {
                    // Copy the responses data to memory
                    this.registeredComputers = response.data.data.availability;
                    // Reset each machine status
                    for (let y = 0; y < this.currentRoomMap.height; y++) {
                        for (let x = 0; x < this.currentRoomMap.width; x++) {
                            var desk = this.currentRoomMap.GetDeskAtPosition(x, y);
                            desk.machineName = "";
                            desk.status = "";
                        }
                    }
                    // Update the status of the machines which the request contains
                    this.registeredComputers.forEach(function (computer) {
                        // Grab the correct desk for the response item, and set its attributes
                        let desk = this.currentRoomMap.GetDeskByID(computer.desk);
                        desk.machineName = computer.machine_name;
                        desk.status = computer.availability_status;
                    }, this);
                }).catch(error => {
                    console.log(error);
                });
            }
        },
        mounted() {
            this.GetPCAvailability();
            this.timer = setInterval(this.GetPCAvailability, 15000);
        },
        beforeDestroy() {
            clearInterval(this.timer)
        }
    }
</script>
<template>
    <div id="page-content" class="container">
        <h1 class="page-title">PC Status Monitoring</h1>
        <p>Welcome to the Heimdall monitoring application, below is the list of machines registered with the system.</p>
        <br/>
        <div v-if="this.flaggedComputers != null && this.flaggedComputers.length > 0">
            <CheckComputerList :computers="this.flaggedComputers" :key="'flaggedComputers_' + this.flaggedComputers.length"></CheckComputerList>
        </div>
        <div v-if="this.sortedComputerLists != null && this.sortedComputerLists.length > 0">
            <RoomComputers v-for="(computerArray, computerArrayIndex) in this.sortedComputerLists" :key="'roomComputers_' + computerArrayIndex" :room="computerArray"></RoomComputers>
        </div>
        <div v-else>
            <h2>{{ DefaultPageText }}</h2>
        </div>
    </div>
</template>

<script>
    import axios from 'axios'
    import { setInterval, clearInterval } from 'timers-browserify';
    import RoomComputers from './RoomComputers.vue'
    import CheckComputerList from './CheckComputerList.vue'
    export default {
        data() {
            return {
                loading: true,
                rooms: null,
                computers: null,
                timer: '',
                sortedComputerLists: [],
                flaggedComputers: []
            }
        },
        components: {
            RoomComputers,
            CheckComputerList
        },
        computed: {
            DefaultPageText(){
                if (this.loading) {
                    return "Loading...";
                }
                else {
                    return "No Computers found";
                }
            }
        },
        methods: {
            // The function for getting the data from Heimdall
            GetPCStatus() {
                // Get all the computers
                axios.get(this.$store.getters.heimdallServerAddress + "/computers").then(response => {
                    this.computers = response.data.data.computers;

                    // Get all the rooms
                    axios.get(this.$store.getters.heimdallServerAddress + "/rooms").then(response => {
                        // Clear the cached sorted list of computers
                        this.sortedComputerLists = [];
                        this.flaggedComputers = [];

                        // Get the room list
                        this.rooms = response.data.data.rooms;
                        this.GenerateRoomsArray();

                        // Sort the computers
                        this.SortComputers();

                        this.loading = false;
                    }).catch(error => {
                        console.log(error);
                    });
                }).catch(error => {
                    console.log(error);
                    this.computers = null;
                    this.loading = false;
                })
            },
            GenerateRoomsArray(){
                // For each room, create a room object ready to store its computers
                this.rooms.forEach((room, index) => {
                    this.sortedComputerLists.push({
                        name: room.name,
                        index: index,
                        computers: []
                    });
                }, this);

                // Add a default room
                this.sortedComputerLists.push({
                    name: "Not Set",
                    index: this.sortedComputerLists.length,
                    computers: []
                });
            },
            SortComputers(){
                // for each computer, sort them into an array of their computers
                this.computers.forEach(computer => {
                    // Sort the computer into its corresponding room
                    let indexOfRoom = this.sortedComputerLists.findIndex(roomObject => roomObject.name == computer.room);
                    this.sortedComputerLists[indexOfRoom].computers.push(computer);

                    // If the Computer is marked as needing to be checked, add it to the flagged computer array
                    if (computer.status == "Check PC") {
                        this.flaggedComputers.push(computer)
                    }
                }, this);
            }
        },
        mounted() {
            this.GetPCStatus();
            this.timer = setInterval(this.GetPCStatus, 30000);
        },
        beforeDestroy() {
            clearInterval(this.timer)
        }
    }
</script>
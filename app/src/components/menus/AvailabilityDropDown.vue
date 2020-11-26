<template>
    <div class="dropdown">
        <a class="nav-item nav-link dropdown-toggle" href="#" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            Find A PC
        </a>
        <div class="dropdown-menu" aria-labelledby="dropdownMenuLink">
            <router-link tag="a" v-for="room in this.availableRooms" :key="'menu_link_' + room" class="dropdown-item" :to="{name: 'PC Availability', params: {room: room}}">{{room.toUpperCase()}}</router-link>
        </div>
    </div>
</template>

<script>
    import axios from 'axios'
    import { setInterval, clearInterval } from 'timers-browserify';
    export default {
        data() {
            return {
                availableRooms: [],
                timer: ''
            }
        },
        methods: {
            GetRoomsForList() {
                // Get the list of rooms from the Heimdall API
                axios.get(this.$store.getters.heimdallEndpointRooms).then(response => {
                    // Clear the room list
                    this.availableRooms = [];
                    // Use the response to store the routes in the Vuex Store
                    response.data.data.rooms.forEach(function (room) {
                        // Check the room has been enabled for the availabiltiy system
                        if (room.has_availability_map) {
                            this.availableRooms.push(room.name);
                        }
                    }, this);
                }).catch(error => {
                    console.log(error);
                });
            }
        },
        mounted() {
            this.GetRoomsForList();
            this.timer = setInterval(this.GetRoomsForList, 30000);
        },
        beforeDestroy() {
            clearInterval(this.timer)
        }
    }
</script>
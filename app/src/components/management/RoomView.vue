<template>
    <div id="room-view" class="container">
        <h1 class="page-title">Room Details</h1>
        <div v-if="this.room != null" id="view_form_wrapper">
            <h2>General</h2>
            <p>
                Name: {{ this.room.name.toUpperCase() }}<br/>
                ID: {{ this.room.id }} <br/>
                Capacity: {{ this.room.capacity }}<br/>
                Enabled for Availability System: {{ this.room.has_availability_map }} <br/>
                Number of Desks: {{ this.room.number_of_desks }}<br/>
                Number of Computer: {{ this.room.number_of_computers }}
            </p>
            <router-link :to="{name: 'Desks List', params: {id: this.room.id}}" tag="button" class="btn btn-dark" push>View Desks</router-link>
            <br/>
            <br/>
            <h2>Subnets</h2>
            <ul class="list-group w-25">
                <li v-for="subnet in this.room.subnets.split(',')" :key="subnet" class="list-group-item">{{ subnet }}</li>
            </ul>
            <br/>
            <br/>
            <router-link :to="{name: 'Room Edit', params: {id: this.room.id}}" tag="button" class="btn btn-dark" push>Edit Room</router-link>
            <router-link :to="{name: 'Rooms List'}" tag="button" class="btn btn-dark" push>Back To Room List</router-link>
        </div>
        <div v-else id="view_form_wrapper">
            <h2>{{ DefaultPageText }}</h2>
            <br/>
            <router-link :to="{name: 'Rooms List'}" tag="button" class="btn btn-dark" push>Back To Room List</router-link>
        </div>
    </div>
</template>

<script>
    import axios from 'axios'
    import { setInterval, clearInterval } from 'timers-browserify';
    export default {
        data() {
            return {
                room: null,
                loading: true,
                timer: ''
            }
        },
        computed: {
            DefaultPageText(){
                if (this.loading) {
                    return "Loading...";
                }
                else {
                    let roomID = undefined;
                    if (Object.keys(this.$route.params).length != 0) {
                        roomID = this.$route.params.id;
                    }
                    if (roomID == undefined) {
                        return "No Room Selected";
                    }
                    if (this.room == null) {
                        return "Room not found";
                    }
                }
            }
        },
        methods: {
            GetRoomDetails() {
                this.loading = true;
                // Get the Room ID from the router
                let roomID = undefined;
                if (Object.keys(this.$route.params).length != 0) {
                    roomID = this.$route.params.id;
                }
                if (roomID == undefined) {
                    this.room = null;
                    this.loading = false;
                    return;
                }
                // Get the computer details from the Heimdall API
                axios.get(this.$store.getters.heimdallServerAddress + "/room_handler?id=" + roomID).then(response => {
                    this.room = response.data.data.room;
                    this.loading = false;
                }).catch(error => {
                    console.log(error);
                    this.room = null;
                    this.loading = false;
                });
            }
        },
        mounted() {
            this.GetRoomDetails();
            this.timer = setInterval(this.GetRoomDetails, 60000);
        },
        beforeDestroy() {
            clearInterval(this.timer)
        }
    }
</script>

<template>
    <div id="desks-list" class="container">
        <h1 class="page-title">Desks</h1>
        <div v-if="this.room != null" id="room_details_wrapper">
            <router-link :to="{name: 'Desk Create'}" tag="button" class="btn btn-dark" push>Create Desk</router-link>
            <br/>
            <br/>
            <h2>Desks for {{ this.room.name.toUpperCase() }}</h2>
        </div>
        <div v-else-if="this.room == null && !this.noRoom" id="room_details_wrapper">
            <router-link :to="{name: 'Desk Create'}" tag="button" class="btn btn-dark" push>Create Desk</router-link>
            <br/>
            <br/>
            <h2>{{ DefaultPageTextRoom }}</h2>
        </div>
        <div v-else-if="this.noRoom" id="room_details_wrapper">
            <router-link :to="{name: 'Desk Create'}" tag="button" class="btn btn-dark" push>Create Desk</router-link>
            <br/>
            <br/>
            <h2>All Desks</h2>
        </div>
        <br/>
        <div v-if="this.desks != null && this.desks.length > 0" id="desks_list_wrapper">
            <div class="scrollable-div-500 black-border">
                <ul class="list-group">
                     <li v-for="desk in this.desks" :key="desk.id" class="list-group-item">
                        <div class="col- float-left">
                            <h5 class="text-uppercase">{{ desk.room + " - " + desk.name }}</h5>
                        </div>
                        <div class="col- float-right">
                            <router-link :to="{name: 'Desk View', params: {id: desk.id}}" tag="button" class="btn btn-dark" push>View Desk</router-link>
                            <router-link :to="{name: 'Desk Edit', params: {id: desk.id}}" tag="button" class="btn btn-dark" push>Edit Desk</router-link>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
        <div v-else-if="this.desks != null && this.desks.length == 0" id="desks_list_wrapper">
            <h2>No Desks Found</h2>
        </div>
        <div v-else-if="this.desks == null && !this.roomNotFound" id="desks_list_wrapper">
            <h2>{{ DefaultPageTextDesks }}</h2>
        </div>
    </div>
</template>

<script>
    import axios from 'axios'
    import { setInterval, clearInterval } from 'timers-browserify';
    export default {
        data() {
            return {
                roomLoading: true,
                room: null,
                noRoom: false,
                roomNotFound: false,
                desksLoading: true,
                desks: null,
                timer: ''
            }
        },
        computed: {
            DefaultPageTextRoom() {
                if (this.roomLoading) {
                    return "Loading Room Details...";
                }
                else {
                    return "Room not found";
                }
            },
            DefaultPageTextDesks() {
                if (this.desksLoading) {
                    return "Loading Desk Details...";
                }
                else {
                    return "No Desks Found";
                }
            }
        },
        methods: {
            GetRoomInfo() {
                this.roomLoading = true;
                let roomID = undefined;
                if (Object.keys(this.$route.params).length != 0) {
                    roomID = this.$route.params.id;
                }
                // If no room id was supplied, dont try and load a Room's details
                if (roomID == undefined) {
                    this.room = null;
                    this.roomLoading = false;
                    this.noRoom = true;
                    this.roomNotFound = false;
                    return;
                }

                // Get the computer details from the Heimdall API
                axios.get(this.$store.getters.heimdallServerAddress + "/room_handler?id=" + roomID).then(response => {
                    this.room = response.data.data.room;
                    this.roomLoading = false;
                    this.roomNotFound = false;
                }).catch(error => {
                    console.log(error);
                    this.room = null;
                    this.roomLoading = false;
                    this.roomNotFound = true;
                });
            },
            GetDeskList() {
                this.desksLoading = true;
                let roomID = undefined;
                if (Object.keys(this.$route.params).length != 0) {
                    roomID = this.$route.params.id;
                }
                // If no room id was supplied, list all desks
                if (roomID == undefined) {
                    // Call to Heimdalls Desks endpoint
                    axios.get(this.$store.getters.heimdallServerAddress + "/desks").then(response => {
                        this.desks = response.data.data.desks;
                        this.desksLoading = false;
                    }).catch(error => {
                        console.log(error);
                        this.desks = null;
                        this.desksLoading = false;
                    });
                }
                // If a room id was supplied, list only its desks
                else {
                    // Call to Heimdalls Desks endpoint
                    axios.get(this.$store.getters.heimdallServerAddress + "/desks?room_id=" + roomID).then(response => {
                        this.desks = response.data.data.desks;
                        this.desksLoading = false;
                    }).catch(error => {
                        console.log(error);
                        this.desks = null;
                        this.desksLoading = false;
                    });
                }
            }
        },
        mounted() {
            this.GetRoomInfo();
            this.GetDeskList();
            this.timer = setInterval(this.GetDeskList, 15000);
        },
        beforeDestroy() {
            clearInterval(this.timer)
        }
    }
</script>

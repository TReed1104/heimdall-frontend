<template>
    <div id="room-list" class="container">
        <h1 class="page-title">Rooms</h1>
        <div v-if="this.rooms != null" id="list_form_wrapper">
            <router-link :to="{name: 'Room Create'}" tag="button" class="btn btn-dark" push>Create Room</router-link>
            <br/>
            <br/>
            <div class="scrollable-div-500 black-border">
                <ul class="list-group">
                    <li v-for="room in this.rooms" :key="room.id" class="list-group-item">
                        <div class="col- float-left">
                            <h3>{{ room.name.toUpperCase() }}</h3>
                        </div>
                        <div class="col- float-right">
                            <router-link :to="{name: 'Room View', params: {id: room.id}}" tag="button" class="btn btn-dark" push>View Room</router-link>
                            <router-link :to="{name: 'Desks List', params: {id: room.id}}" tag="button" class="btn btn-dark" push>View Desks</router-link>
                            <router-link :to="{name: 'Room Edit', params: {id: room.id}}" tag="button" class="btn btn-dark" push>Edit Room</router-link>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
        <div v-else id="list_form_wrapper">
            <router-link :to="{name: 'Room Create'}" tag="button" class="btn btn-dark" push>Create Room</router-link>
            <br/>
            <br/>
            <h2>{{ DefaultPageText }}</h2>
        </div>
    </div>
</template>

<script>
    import axios from 'axios'
    import { setInterval, clearInterval } from 'timers-browserify';
    export default {
        data() {
            return {
                loading: true,
                rooms: null,
                timer: ''
            }
        },
        computed: {
            DefaultPageText(){
                if (this.loading) {
                    return "Loading...";
                }
                else {
                    return "No Rooms Found";
                }
            }
        },
        methods: {
            GetRoomList() {
                this.loading = true;
                // Get the computer details from the Heimdall API
                axios.get(this.$store.getters.heimdallServerAddress + "/rooms").then(response => {
                    this.rooms = response.data.data.rooms;
                    this.loading = false;
                }).catch(error => {
                    console.log(error);
                    this.rooms = null;
                    this.loading = false;
                });
            }
        },
        mounted() {
            this.GetRoomList();
            this.timer = setInterval(this.GetRoomList, 15000);
        },
        beforeDestroy() {
            clearInterval(this.timer)
        }
    }
</script>

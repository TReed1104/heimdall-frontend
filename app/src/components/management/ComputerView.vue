<template>
    <div id="computer-view" class="container">
        <h1 class="page-title">Computer Details</h1>
        <div v-if="this.computer != null" id="view_form_wrapper">
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
                Desk: {{ this.computer.desk.toUpperCase() }}
            </p>
            <br/>
            <router-link :to="{name: 'Computer Edit', params: {id: this.computer.id}}" tag="button" class="btn btn-dark" push>Edit Location</router-link>
            <router-link :to="{name: 'Monitoring'}" tag="button" class="btn btn-dark" push>Back To Computer List</router-link>
        </div>
        <div v-else id="view_form_wrapper">
            <h2>{{ DefaultPageText }}</h2>
            <br/>
            <router-link :to="{name: 'Monitoring'}" tag="button" class="btn btn-dark" push>Back To Computer List</router-link>
        </div>
    </div>
</template>

<script>
    import axios from 'axios'
    import { setInterval, clearInterval } from 'timers-browserify';
    export default {
        data() {
            return {
                computer: null,
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
                let computerID = undefined;
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
                }).catch(error => {
                    console.log(error);
                    this.computer = null;
                    this.loading = false;
                });
            }
        },
        mounted() {
            this.GetComputerDetails();
            this.timer = setInterval(this.GetComputerDetails, 10000);
        },
        beforeDestroy() {
            clearInterval(this.timer)
        }
    }
</script>

<template>
    <div id="room-edit" class="container">
        <h1 class="page-title">Edit Room</h1>
        <div v-if="this.room != null" id="edit_form_wrapper">
            <h2>General</h2>
            <p>
                Name: {{ this.room.name.toUpperCase() }}<br/>
                ID: {{ this.room.id }} <br/>
                Capacity: {{ this.room.capacity }}<br/>
                Enabled for Availability System: {{ this.room.has_availability_map }} <br/>
                Number of Desks: {{ this.room.number_of_desks }}<br/>
                Number of Computer: {{ this.room.number_of_computers }}
            </p>
            <h2>Subnets</h2>
            <div v-for="(subnet, subnet_index) in this.subnets" :key=subnet_index style="margin-bottom: 5px;">
                <input type="text" class="form-control w-25 float-left" placeholder="Room Subnets" @input="InputChangeSubnet($event, subnet_index)" :value="subnets[subnet_index]"/>
                <button class="btn btn-dark" style="margin-left: 5px" @click="AddSubnetEntryBox($event, subnet_index)">+</button>
                <button v-if="subnets.length > 1" class="btn btn-dark" @click="RemoveSubnetEntryBox($event, subnet_index)">-</button>
            </div>
            <br/>
            <br/>
            <button :disabled="disableSubmitButton" id="submit_button" type="submit" class="btn btn-dark" @click="SubmitChanges">Save Changes</button>
            <router-link :to="{name: 'Room View', params: {id: this.room.id}}" tag="button" class="btn btn-dark" push>Cancel</router-link>
        </div>
        <div v-else id="edit_form_wrapper">
            <h2>{{ DefaultPageText }}</h2>
            <br/>
            <router-link :to="{name: 'Rooms List'}" tag="button" class="btn btn-dark" push>Cancel</router-link>
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
                disableSubmitButton: true,
                room: null,
                subnets: []
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
                this.room = null;
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

                    let splitSubnetString = this.room.subnets.split(',');
                    splitSubnetString.forEach(subnetString => {
                        this.subnets.push(subnetString);
                    }, this);

                    this.loading = false;
                    this.ToggleSubmitButton();
                }).catch(error => {
                    console.log(error);
                    this.room = null;
                    this.loading = false;
                    this.ToggleSubmitButton();
                });
            },
            InputChangeSubnet(event, enteryIndex) {
                this.subnets[enteryIndex] = event.target.value;
                this.ToggleSubmitButton();
            },
            AddSubnetEntryBox(event, buttonIndex) {
                if (this.subnets[buttonIndex] != "") {
                    this.subnets.push("");
                    this.ToggleSubmitButton();
                }
                else {
                    alert("Please ensure you have entered the previous subnet before adding another")
                }
            },
            RemoveSubnetEntryBox(event, buttonIndex) {
                // Remove the last
                this.subnets.splice(buttonIndex, 1);
                this.ToggleSubmitButton();
            },
            ToggleSubmitButton() {
                // check if any of the subnet entries are blank
                let anyBlank = false;
                this.subnets.forEach(subnet => {
                    if (subnet == "") {
                        anyBlank = true;
                    }
                });
                // Check if all the fields are entered
                if (!anyBlank) {
                    this.disableSubmitButton = false;
                }
                else {
                    this.disableSubmitButton = true;
                }
            },
            SubmitChanges() {
                // Collate the subnets into a CSV
                let collateSubnets = "";
                this.subnets.forEach(function(subnet, index) {
                    if (index == this.subnets.length - 1) {
                        collateSubnets += subnet;
                    }
                    else {
                        collateSubnets += subnet + ",";
                    }
                }, this);
                // Our data to send over the POST request to the endpoint
                let requestBody = {
                    id: this.room.id,
                    capacity: this.room.capacity,
                    subnets: collateSubnets
                };
                // Check the submit button is activated
                if (!this.disableSubmitButton) {
                    axios.put(this.$store.getters.heimdallServerAddress + "/room_handler", requestBody)
                    .then(response => {
                        if (response.status == 202) {
                            router.push({name: 'Rooms List'});
                        }
                    })
                    .catch(error => {
                        // Output our error response from the API to the user
                        console.log(error);
                        alert(error.response.status + ": " + error.response.data.message);
                    });
                }
            }
        },
        mounted() {
            this.GetRoomDetails();
        }
    }
</script>

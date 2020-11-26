<template>
    <div id="room-create" class="container">
        <h1 class="page-title">Create Room</h1>
        <div id="create_form_wrapper">
            <h2>Name</h2>
            <p>
                Please enter the unique identifying name of the room.
            </p>
            <input id="name_input" type="text" class="form-control w-25" placeholder="Room Name" required @input="InputChangeName"/>
            <br/>
            <h2>Capacity</h2>
            <p>
                Please enter the Room's teaching or staff capacity.
            </p>
            <input id="capacity_input" type="number" min="0" max="99" class="form-control w-25" placeholder="Room Capacity" @input="InputChangeCapacity"/>
            <br/>
            <h2>Subnets</h2>
            <p>
                Please enter the network subnets available in the room.<br/>
                Example: "127.0.0"
            </p>
            <div v-for="(subnet, subnet_index) in this.enteredSubnets" :key=subnet_index style="margin-bottom: 5px;">
                <input type="text" class="form-control w-25 float-left" placeholder="Room Subnets" @input="InputChangeSubnet($event, subnet_index)" :value="enteredSubnets[subnet_index]"/>
                <button class="btn btn-dark" style="margin-left: 5px" @click="AddSubnetEntryBox($event, subnet_index)">+</button>
                <button v-if="enteredSubnets.length > 1" class="btn btn-dark" @click="RemoveSubnetEntryBox($event, subnet_index)">-</button>
            </div>
            <br/>
            <br/>
            <button :disabled="disableSubmitButton" id="submit_button" type="submit" class="btn btn-dark" @click="SubmitChanges">Submit</button>
            <router-link :to="{name: 'Rooms List'}" tag="button" class="btn btn-dark" push>Back To Room List</router-link>
        </div>
    </div>
</template>

<script>
    import axios from 'axios'
    import router from '../../router'
    export default {
        data() {
            return {
                disableSubmitButton: true,
                enteredName: "",
                enteredCapacity: undefined,
                enteredSubnets: []
            }
        },
        computed: {
        },
        methods: {
            SubmitChanges() {
                let collateSubnets = "";
                this.enteredSubnets.forEach(function(subnet, index) {
                    if (index == this.enteredSubnets.length - 1) {
                        collateSubnets += subnet;
                    }
                    else {
                        collateSubnets += subnet + ",";
                    }
                }, this);
                // Our data to send over the POST request to the endpoint
                let requestBody = {
                    room: this.enteredName.toLowerCase(),
                    capacity: this.enteredCapacity,
                    subnets: collateSubnets,
                    has_availability_map: false
                };
                // Make sure the submit button is enabled before we do the actual creation
                if(!this.disableSubmitButton) {
                    axios.post(this.$store.getters.heimdallServerAddress + "/room_handler", requestBody)
                    .then(response=> {
                        if (response.status == 201) {
                            // Redirect to the index page
                            router.push({name: 'Rooms List'});
                        }
                        else {
                            alert("The API responded with an invalid response.");
                        }
                    })
                    .catch(error => {
                        // Output our error response from the API to the user
                        console.log(error);
                        alert(error.response.status + ": " + error.response.data.message);
                    });
                }
            },
            InputChangeName(event) {
                this.enteredName = event.target.value;
                this.ToggleSubmitButton();
            },
            InputChangeCapacity(event) {
                this.enteredCapacity = event.target.value;
                // If the capacity field has been cleared, reset the component data field to 0
                if (event.target.value == "") {
                    this.enteredCapacity = undefined;
                }
                this.ToggleSubmitButton();
            },
            InputChangeSubnet(event, enteryIndex) {
                this.enteredSubnets[enteryIndex] = event.target.value;
                this.ToggleSubmitButton();
            },
            AddSubnetEntryBox(event, buttonIndex) {
                if (this.enteredSubnets[buttonIndex] != "") {
                    this.enteredSubnets.push("");
                    this.ToggleSubmitButton();
                }
                else {
                    alert("Please ensure you have entered the previous subnet before adding another")
                }
            },
            RemoveSubnetEntryBox(event, buttonIndex) {
                // Remove the last
                this.enteredSubnets.splice(buttonIndex, 1);
                this.ToggleSubmitButton();
            },
            ToggleSubmitButton() {
                // check if any of the subnet entries are blank
                let anyBlank = false;
                this.enteredSubnets.forEach(subnet => {
                    if (subnet == "") {
                        anyBlank = true;
                    }
                });
                // Check if all the fields are entered
                if (this.enteredName != "" && (this.enteredCapacity >= 0 && this.enteredCapacity <= 100) && !anyBlank) {
                    this.disableSubmitButton = false;
                }
                else {
                    this.disableSubmitButton = true;
                }
            }
        },
        mounted() {
            this.enteredSubnets.push("")
        }
    }
</script>

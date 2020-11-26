import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        // The address of the server hosting the Heimdall API
        serverAddress: "http://127.0.0.1/heimdall-api",
    },
    getters: {
        // Endpoints
        heimdallServerAddress: state => state.serverAddress,
        heimdallEndpointRooms: state => { return state.serverAddress + "/rooms" },
        heimdallEndpointComputers: state => { return state.serverAddress + "/computers" },
        heimdallEndpointAvailability: state => { return state.serverAddress + "/availability?room=" },
    },
    mutations: {
    },
    actions: {
    }
})
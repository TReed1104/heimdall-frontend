<template>
    <div class="dropdown">
        <a class="nav-item nav-link dropdown-toggle" href="#" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            Management
        </a>
        <div class="dropdown-menu" aria-labelledby="dropdownMenuLink">
            <router-link tag="a" class="dropdown-item" :to="{name: 'Rooms List'}">Rooms</router-link>
            <router-link tag="a" class="dropdown-item" :to="{name: 'Desks List'}">Desks</router-link>
            <router-link tag="a" class="dropdown-item" :to="{name: 'Monitoring'}">Computers</router-link>
            <router-link tag="a" class="dropdown-item" :to="{name: 'Operating System List'}">OS</router-link>
        </div>
    </div>
</template>

<script>
    export default {
    }
</script>
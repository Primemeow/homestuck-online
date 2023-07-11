<template>
    <div class="settings-form">
        <h1>User Settings</h1>
        <form @submit.prevent="storeSettings">
        <label v-for="setting in independentSettings" :key="setting.name">
            {{ setting.label }}
            <input v-model="settings[setting.name]" type="text" v-if="setting.type === 'string'" />
            <input v-model="settings[setting.name]" type="number" v-if="setting.type === 'number'" />
            <input v-model="settings[setting.name]" type="checkbox" v-if="setting.type === 'boolean'" />
            <select v-model="settings[setting.name]" v-if="setting.type === 'multiple'">
                <option v-for="option in setting.options" :key="option" :value="option">
                    {{ option }}
                </option>
            </select>
        </label>
        <button type="submit">Save</button>
        </form>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { loadSettings, saveSettings, settingAttributes } from '../helpers/settingsService';

// Load settings from the service
const settings = ref(loadSettings());


// resolve 'dependency' parameter. if the name in 'dependency' is not truthy, do not include in array
const independentSettings = settingAttributes.filter((setting) => 
!setting.dependency || !!settings.value[setting.dependency.name]);

// Save settings using the service
const storeSettings = () => {
  saveSettings(settings.value);
};
</script>

<style scoped>
.settings-form {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 1rem;
    align-items: center;
}

.settings-form h1 {
    grid-column: 1 / -1;
}

.settings-form label {
    display: flex;
    align-items: center;
}

.settings-form input {
    margin-left: 0.5rem;
}

.settings-form button {
    grid-column: 1 / -1;
    justify-self: end;
}

@media (min-width: 1024px) {
    .settings-form {
        grid-template-columns: 1fr 1fr 1fr;
    }
}

@media (min-width: 1440px) {
    .settings-form {
        grid-template-columns: 1fr 1fr 1fr 1fr;
    }
}

@media (min-width: 1920px) {
    .settings-form {
        grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
    }
}

@media (min-width: 2560px) {
    .settings-form {
        grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
    }
}

@media (min-width: 3840px) {
    .settings-form {
        grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
    }
}

</style>
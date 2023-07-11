// defines the label, name in localStorage.userSettings and default content
// these only apply to the settings page settings, not all of them
// some like saveData are handled separately
export const settingAttributes = [
    {
        label: 'Show Notifications',
        description: 'Show notifications when new pages or content are available',
        name: 'notifications',
        default: true,
        type: 'boolean'
    },
    {
        label: 'Show Subnotifications',
        description: 'TODO: I have no idea what this controls yet',
        name: 'subNotifications',
        default: false,
        type: 'boolean'
    },
    {
        label: 'Enable New Reader Mode',
        description: 'Hides content that has not been reached yet from being displayed',
        name: 'newReaderMode',
        default: false,
        type: 'boolean'
    },
    {
        label: 'New Reader Mode Page',
        description: 'Sets the currently reached page. Automatically set to the latest page when a new page is released.',
        name: 'newReader',
        dependency: 'newReaderMode',
        default: '001901',
        type: 'string'
    },
    {
        label: 'Enable MSPA Mode',
        description: 'TODO: I have no idea what this controls yet',
        name: 'mspaMode',
        default: false,
        type: 'boolean'
    },
    {
        label: 'Enable developer mode',
        description: 'This setting is for Makin only, or other Github contributors I guess',
        name: 'devMode',
        default: false,
        type: 'boolean'
    },
    {
        label: 'Used theme override',
        description: 'Change the theme used by the site, unless an important page or section takes priority',
        name: 'themeOverride',
        default: 'default',
        type: 'multiple',
        options: [ 'default' ]
    },
    {
        label: 'Forced theme override',
        description: 'Forces the theme chosen above in every single case',
        default: false,
        type: 'boolean',
    },
    {
        label: 'Font family',
        description: 'Change the font used by the site. Uses fonts installed in your device. Leave blank to use the default site font.',
        name: 'fontFamily',
        default: '',
        type: 'string'
    },
    {
        label: 'Embolden text',
        description: 'Change the boldness of the text, true if bold.',
        name: 'bold',
        default: false,
    },
    {
        label: 'Font size',
        description: 'Change the size of the text, set to 0 to use default size',
        name: 'fontSize',
        default: 0,
        type: 'number'
    },
    {
        label: 'Line height',
        description: 'Change the line height of the text, set to 0 to use default size',
        name: 'lineHeight',
        default: 0,
        type: 'number'
    },
    {
        label: 'Increase paragraph spacing',
        description: 'Increases the spacing between paragraphs if set to true',
        name: 'paragraphSpacing',
        default: false,
        type: 'boolean'
    },
    {
        label: 'Enable high contrast mode',
        description: 'Enables high contrast mode if set to true',
        name: 'highContrast',
        default: false,
        type: 'boolean'
    },
    {
        label: 'Enable arrow navigation',
        description: 'Enables arrow navigation (left and right arrows change page) if set to true',
        name: 'arrowNav',
        default: true,
        type: 'boolean'
    },
    {
        label: 'Automatically open logs',
        description: 'Automatically open dialogs and pesterlogs when a new page is loaded',
        name: 'openLogs',
        default: false,
        type: 'boolean'
    },
    {
        label: 'Use High Quality audio in flashes',
        description: 'Uses higher quality audio that was originally used in flashes, sacrificing some "realism"',
        name: 'hqAudio',
        default: true,
        type: 'boolean'
    },
    {
        label: 'Enable sound credits',
        description: 'Shows the song title and artist below flash animations that have them',
        name: 'credits',
        default: true,
        type: 'boolean'
    },
    {
        label: 'Enable fastforward',
        description: 'TODO: No idea what this does',
        name: 'fastForward',
        default: false,
        type: 'boolean'
    },
    {
        label: 'Enable B.B. songs',
        description: 'Certain songs were replaced in flash animations, making for a comparatively worse experience. This setting restores the original songs for the artist B.B.',
        name: 'bolin',
        default: true,
        type: 'boolean'
    },
    {
        label: 'Enable SolusLunes song',
        description: 'This setting restores an original song by the artist SolusLunes in a certain flash animation',
        name: 'soluslunes',
        default: true,
        type: 'boolean'
    },
    {
        label: 'Enable controversial joke',
        description: 'This setting restores a removed peach-related joke in a certain page',
        name: 'unpeachy',
        default: true,
        type: 'boolean'
    },
    {
        label: 'Enable PXS Body Horror',
        description: 'This setting restores a removed body horror image in a Paradox Space comic',
        name: 'pxsTavros',
        default: true,
    }
]

// Define the default settings
export const defaultSettings = {
    // user editable settings
    ...settingAttributes.reduce((acc, cur) => {
        acc[cur.name] = cur.default;
        return acc;
    }, {}),
    // non-user editable settings
    saveData: {
        saves: {},
        saveList: [],
    }
};

// Sets the default settings if not already in localStorage
export function setDefaultSettingsIfNeeded() {
    if (!localStorage.getItem('userSettings')) {
        localStorage.setItem('userSettings', JSON.stringify(defaultSettings));
    }
}

// Load settings from localStorage or use defaults
export function loadSettings() {
    this.setDefaultSettingsIfNeeded();
    const settings = JSON.parse(localStorage.getItem('userSettings'));
    return settings || defaultSettings;
}

// Save settings to localStorage
export function saveSettings(settings) {
    localStorage.setItem('userSettings', JSON.stringify(settings));
}
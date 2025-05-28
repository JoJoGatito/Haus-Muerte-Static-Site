// Google Form customization module
export const formCustomization = {
    // Form customization using Google Forms API
    formId: '1FAIpQLSdnNGFAkgZuc84sPHKkfhDMAoM4c34lxmwJsYDzXHLxet2YGw',
    theme: {
        // Match site's gothic theme colors from main.css
        backgroundColor: '#0A0000', // --background-dark
        headerColor: '#800000',     // --primary-color
        accentColor: '#C0C0C0',     // --accent-color
        textColor: '#F0F0F0',       // --text-light
        fontFamily: 'serif'         // Closest to EB Garamond
    },

    // Function to get customized form URL
    getCustomFormUrl: function() {
        return `https://docs.google.com/forms/d/e/${this.formId}/viewform?embedded=true&usp=pp_url` +
            `&theme=dark` +
            `&bc=${this.theme.backgroundColor.substring(1)}` +
            `&tc=${this.theme.textColor.substring(1)}` +
            `&ac=${this.theme.headerColor.substring(1)}`;
    }
};
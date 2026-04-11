const config = {
    appName: import.meta.env.VITE_APP_NAME, 
    client: import.meta.env.VITE_CLIENT,
    server: import.meta.env.VITE_SERVER,
    images: `${import.meta.env.VITE_CLIENT}/images`,
    api: `${import.meta.env.VITE_SERVER}/api`,
    valuesType: import.meta.env.VITE_APP_DATA,
};

export default config;
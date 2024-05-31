const ENABLE_DEBUG = false;

export const Constants = (() => {
    const IS_DEVELOPMENT = process.env.NODE_ENV === "development";
    const ALLOW_OFFLINE_SAVING = process.env.ALLOW_OFFLINE_SAVING === "true";
    const DEBUG_ENABLED = IS_DEVELOPMENT && ENABLE_DEBUG;

    return {
        APPLICATION_NAME: "Granjas de Chile",
        BACKEND_URL: "http://192.168.1.13:3000",
        LOGO_PATH: "assets/images/logo.png",
        APPLICATION_VERSION: "0.0.1",
        IS_DEVELOPMENT,
        DEBUG_ENABLED,
        ALLOW_OFFLINE_SAVING,
    };
})();
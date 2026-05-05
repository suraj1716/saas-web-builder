import axios from "axios";

window.axios = axios;

// =====================================
// BASE AXIOS CONFIG (keep this)
// =====================================
window.axios.defaults.headers.common["X-Requested-With"] =
    "XMLHttpRequest";

window.axios.defaults.withCredentials = true; // 🔥 IMPORTANT for Sanctum

// =====================================
// SANCTUM CSRF BOOTSTRAP (GLOBAL ONCE)
// =====================================
let sanctumInitialized = false;

const initSanctum = async () => {
    if (sanctumInitialized) return;
    sanctumInitialized = true;

    try {
        await window.axios.get("/sanctum/csrf-cookie");

        console.log("✅ Sanctum initialized globally");
    } catch (error) {
        console.error("❌ Sanctum init failed:", error);
    }
};

// Run immediately on app load
initSanctum();
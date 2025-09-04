// Z.Electronic Dashboard JavaScript

import { CONFIG } from './config.js';

const TIMEZONE = "Africa/Cairo";

// Translations
const TRANSLATIONS = {
  ar: {
    login_title: "تسجيل الدخول",
    username_placeholder: "اسم المستخدم",
    password_placeholder: "كلمة المرور",
    login_button: "دخول",
    verifying: "جاري التحقق...",
    connection_error: "فشل الاتصال. تحقق من الرابط والإعدادات.",
    logout_button: "تسجيل خروج",
    job_title: "المسمى الوظيفي",
    email_title: "البريد الإلكتروني",
    projects_card: "المشاريع",
    timeline_card: "الجدول الزمني",
    reports_card: "التقارير",
    contracts_card: "العقود",
    violations_card: "المخالفات",
    requests: "الطلبات",
    trainings: "التدريبات",
    evaluation: "التقييم",
    job_tasks: "مهام وظيفية",
    settings: "الإعدادات",
    empty_fields_error: "يرجى إدخال اسم المستخدم وكلمة المرور"
  },
  en: {
    login_title: "Login",
    username_placeholder: "Username",
    password_placeholder: "Password",
    login_button: "Login",
    verifying: "Verifying...",
    connection_error: "Connection failed. Check URL and deployment settings.",
    logout_button: "Logout",
    job_title: "Job Title",
    email_title: "Email",
    projects_card: "Projects",
    timeline_card: "Timeline",
    reports_card: "Reports",
    contracts_card: "Contracts",
    violations_card: "Violations",
    requests: "Requests",
    trainings: "Trainings",
    evaluation: "Evaluation",
    job_tasks: "Job Tasks",
    settings: "Settings",
    empty_fields_error: "Please enter username and password"
  }
};

// Utility Functions
class Utils {
  static getCurrentLang() {
    return localStorage.getItem("lang") || "ar";
  }

  static setLanguage(lang) {
    localStorage.setItem("lang", lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    
    const langSwitcher = document.getElementById("lang-switcher");
    if (langSwitcher) {
      langSwitcher.textContent = lang === "ar" ? "EN" : "ع";
    }
    
    // Update translated elements
    document.querySelectorAll("[data-translate]").forEach(el => {
      const key = el.getAttribute("data-translate");
      if (TRANSLATIONS[lang][key]) {
        el.textContent = TRANSLATIONS[lang][key];
      }
    });
    
    // Update placeholder texts
    document.querySelectorAll("[data-translate-placeholder]").forEach(el => {
      const key = el.getAttribute("data-translate-placeholder");
      if (TRANSLATIONS[lang][key]) {
        el.placeholder = TRANSLATIONS[lang][key];
      }
    });
  }

  static updateClock() {
    const now = new Date(new Date().toLocaleString("en-US", {timeZone: TIMEZONE}));
    let hours = now.getHours();
    
    const timeIcon = document.getElementById("time-icon");
    const timeElement = document.getElementById("time");
    const dateElement = document.getElementById("date");
    
    if (timeIcon) {
      timeIcon.textContent = (hours >= 6 && hours < 18) ? "wb_sunny" : "nightlight_round";
    }
    
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12;
    
    if (timeElement) {
      timeElement.textContent = `${hours.toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")} ${ampm}`;
    }
    
    if (dateElement) {
      const currentLang = Utils.getCurrentLang();
      dateElement.textContent = now.toLocaleDateString(currentLang === "ar" ? "ar-EG" : "en-GB");
    }
  }

  static async translateText(text, sourceLang, targetLang) {
    if (!text) return text;
    try {
      const response = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${sourceLang}|${targetLang}`);
      const data = await response.json();
      return data.responseData.translatedText;
    } catch (error) {
      console.error("Translation error:", error);
      return text;
    }
  }

  static showError(message, duration = 5000) {
    const errorMsg = document.getElementById("error-msg");
    if (errorMsg) {
      errorMsg.textContent = message;
      errorMsg.classList.add("show");
      setTimeout(() => {
        errorMsg.classList.remove("show");
      }, duration);
    }
  }

  static getUserData() {
    const userDataString = localStorage.getItem("userData");
    if (!userDataString) return null;
    
    try {
      return JSON.parse(userDataString);
    } catch(e) {
      console.error("Error parsing user data:", e);
      localStorage.removeItem("userData");
      return null;
    }
  }

  static logout() {
    localStorage.removeItem("userData");
    localStorage.removeItem("lang");
    window.location.href = "index.html";
  }
}

// Authentication Class
class Auth {
  static checkLoginStatus() {
    const userData = Utils.getUserData();
    if (!userData) {
      window.location.href = "index.html";
      return false;
    }
    return userData;
  }

  static async login(username, password) {
    if (!username || !password) {
      const currentLang = Utils.getCurrentLang();
      Utils.showError(TRANSLATIONS[currentLang].empty_fields_error);
      return false;
    }

    const loginBtn = document.getElementById("loginBtn");
    const currentLang = Utils.getCurrentLang();
    
    // Show loading state
    loginBtn.disabled = true;
    loginBtn.innerHTML = `<span class="loading-spinner"></span>${TRANSLATIONS[currentLang].verifying}`;
    
    const errorMsg = document.getElementById("error-msg");
    if (errorMsg) {
      errorMsg.classList.remove("show");
    }

    try {
      const urlWithParams = new URL(CONFIG.API_URL);
      urlWithParams.searchParams.append("action", "login");
      urlWithParams.searchParams.append("username", username);
      urlWithParams.searchParams.append("password", password);

      const response = await fetch(urlWithParams, {
        method: "GET",
        redirect: "follow"
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      
      if (data.success && data.userData) {
        // Ensure profileImg uses the local path if the API doesn't provide one
        if (!data.userData.profileImg || data.userData.profileImg.includes('ibb.co')) {
          data.userData.profileImg = 'assets/images/User.webp';
        }
        localStorage.setItem("userData", JSON.stringify(data.userData));
        window.location.href = "dashboard.html";
        return true;
      } else {
        Utils.showError(data.message || "خطأ غير معروف");
        return false;
      }
    } catch (error) {
      console.error("Login error:", error);
      Utils.showError(TRANSLATIONS[currentLang].connection_error);
      return false;
    } finally {
      // Reset login button
      loginBtn.disabled = false;
      loginBtn.innerHTML = TRANSLATIONS[currentLang].login_button;
    }
  }
}

// Dashboard Class
class Dashboard {
  static init() {
    const userData = Auth.checkLoginStatus();
    if (!userData) return;

    Dashboard.populateUserData(userData);
    Dashboard.setupPermissions(userData);
    Dashboard.setupDropdownMenu();
    Dashboard.setupCardHandlers();
  }

  static populateUserData(userData) {
    const elements = {
      empName: document.getElementById("empName"),
      empJob: document.getElementById("empJob"),
      empEmail: document.getElementById("empEmail"),
      profileImg: document.getElementById("profileImg"),
      topBarAvatar: document.getElementById("top-bar-avatar"),
      userMenuName: document.getElementById("user-menu-name"),
      userMenuNameEn: document.getElementById("user-menu-name-en")
    };

    if (elements.empName) elements.empName.textContent = userData.empName;
    if (elements.empJob) elements.empJob.textContent = userData.empJob;
    if (elements.empEmail) elements.empEmail.textContent = userData.empEmail;
    
    // Use the profile image from userData, or default to local if not provided or is the old ibb.co link
    const profileImagePath = userData.profileImg && !userData.profileImg.includes('ibb.co') 
                             ? userData.profileImg 
                             : 'assets/images/User.webp';

    if (elements.profileImg) elements.profileImg.src = profileImagePath;
    if (elements.topBarAvatar) elements.topBarAvatar.src = profileImagePath;
    if (elements.userMenuName) elements.userMenuName.textContent = userData.empName;

    // Translate name based on current language
    const currentLang = Utils.getCurrentLang();
    if (currentLang === 'ar') {
      // If current language is Arabic, translate English name to Arabic
      Utils.translateText(userData.empName, 'en', 'ar').then(translatedName => {
        if (elements.userMenuName) elements.userMenuName.textContent = translatedName;
        if (elements.userMenuNameEn) elements.userMenuNameEn.textContent = userData.empName; // Keep original English name in 'en' field
      });
    } else {
      // If current language is English, translate Arabic name to English
      Utils.translateText(userData.empName, 'ar', 'en').then(translatedName => {
        if (elements.userMenuNameEn) elements.userMenuNameEn.textContent = translatedName;
        if (elements.userMenuName) elements.userMenuName.textContent = userData.empName; // Keep original Arabic name in 'ar' field
      });
    }
  }

  static setupPermissions(userData) {
    if (userData.permissions) {
      Object.keys(userData.permissions).forEach(key => {
        const cardId = `card${key.charAt(0).toUpperCase() + key.slice(1)}`;
        const card = document.getElementById(cardId);
        if (card && userData.permissions[key]) {
          card.classList.add("active");
        }
      });
    }
  }

  static setupDropdownMenu() {
    const menuButton = document.getElementById("user-menu-button");
    const dropdown = document.getElementById("dropdown-content");
    
    if (!menuButton || !dropdown) return;
    
    const dropdownItems = dropdown.querySelectorAll("a");

    function toggleDropdown(show) {
      if (show) {
        dropdown.classList.add("show");
        let delay = 0;
        dropdownItems.forEach(item => {
          setTimeout(() => {
            item.style.opacity = "1";
            item.style.transform = "translateX(0)";
          }, delay);
          delay += 50;
        });
      } else {
        let delay = 0;
        [...dropdownItems].reverse().forEach(item => {
          setTimeout(() => {
            item.style.opacity = "0";
            item.style.transform = "translateX(20px)";
          }, delay);
          delay += 50;
        });
        setTimeout(() => dropdown.classList.remove("show"), delay + 50);
      }
    }

    menuButton.addEventListener("click", (event) => {
      event.stopPropagation();
      toggleDropdown(!dropdown.classList.contains("show"));
    });

    window.addEventListener("click", () => {
      if (dropdown.classList.contains("show")) {
        toggleDropdown(false);
      }
    });
  }

  static setupCardHandlers() {
    document.querySelectorAll(".card").forEach(card => {
      card.addEventListener("click", function() {
        console.log("Card clicked:", this.id);
        // Add your card click functionality here
        // You can add specific handlers for each card type
      });
    });
  }
}

// Event Listeners Setup
class EventListeners {
  static init() {
    // Language switcher
    const langSwitcher = document.getElementById("lang-switcher");
    if (langSwitcher) {
      langSwitcher.addEventListener("click", () => {
        const currentLang = Utils.getCurrentLang();
        Utils.setLanguage(currentLang === "ar" ? "en" : "ar");
      });
    }

    // Login form
    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
      loginForm.addEventListener("submit", async function(e) {
        e.preventDefault();
        const username = document.getElementById("username").value.trim();
        const password = document.getElementById("password").value.trim();
        await Auth.login(username, password);
      });
    }

    // Global logout function
    window.logout = Utils.logout;
  }
}

// Main Application Initialization
document.addEventListener("DOMContentLoaded", function() {
  // Check if user is already logged in on login page
  if (window.location.pathname.includes("index.html") || window.location.pathname === "/") {
    if (localStorage.getItem("userData")) {
      window.location.href = "dashboard.html";
      return;
    }
  }

  // Initialize components
  EventListeners.init();
  
  // Initialize dashboard if on dashboard page
  if (window.location.pathname.includes("dashboard.html")) {
    Dashboard.init();
  }

  // Set initial language and start clock
  const currentLang = Utils.getCurrentLang();
  Utils.setLanguage(currentLang);
  Utils.updateClock();
  setInterval(Utils.updateClock, 1000);
});


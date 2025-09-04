// Z.Electronic Dashboard JavaScript (مقتطف مع التعديل المطلوب فقط)

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

    document.querySelectorAll("[data-translate]").forEach(el => {
      const key = el.getAttribute("data-translate");
      if (TRANSLATIONS[lang][key]) {
        el.textContent = TRANSLATIONS[lang][key];
      }
    });

    document.querySelectorAll("[data-translate-placeholder]").forEach(el => {
      const key = el.getAttribute("data-translate-placeholder");
      if (TRANSLATIONS[lang][key]) {
        el.placeholder = TRANSLATIONS[lang][key];
      }
    });
  }
  static updateClock() {
    const now = new Date(new Date().toLocaleString("en-US", { timeZone: TIMEZONE }));
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
}

// إضافة التحكم في عرض الوقت والتاريخ
document.addEventListener("DOMContentLoaded", () => {
  const datetimeWidget = document.getElementById("datetime-widget");
  if (!datetimeWidget) return;

  const timeElement = document.getElementById("time");
  const dateElement = document.getElementById("date");

  // البداية بحجم الوقت فقط (تصغير)
  datetimeWidget.classList.add("collapsed");

  // عند الضغط يوسع لإظهار التاريخ جانب الوقت
  datetimeWidget.addEventListener("click", (e) => {
    e.stopPropagation();
    if (datetimeWidget.classList.contains("collapsed")) {
      datetimeWidget.classList.remove("collapsed");
      datetimeWidget.classList.add("expanded");
    } else {
      datetimeWidget.classList.remove("expanded");
      datetimeWidget.classList.add("collapsed");
    }
  });

  // عند الضغط في أي مكان خارج العنصر يتم تصغيره ثانية
  document.addEventListener("click", () => {
    if (datetimeWidget.classList.contains("expanded")) {
      datetimeWidget.classList.remove("expanded");
      datetimeWidget.classList.add("collapsed");
    }
  });

  // تكبير وتصغير عند استخدام عجلة الماوس أو اللمس (تكبير/تصغير)
  datetimeWidget.addEventListener("wheel", (e) => {
    e.preventDefault();
    if(e.deltaY < 0) {
      datetimeWidget.style.transform = 'scale(1.2)';
    } else {
      datetimeWidget.style.transform = 'scale(1)';
    }
  });

  datetimeWidget.addEventListener("touchstart", () => {
    datetimeWidget.style.transform = 'scale(1.2)';
  });

  datetimeWidget.addEventListener("touchend", () => {
    datetimeWidget.style.transform = 'scale(1)';
  });
});

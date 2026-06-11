function capFirst(text) {
    return text.charAt(0).toUpperCase() + text.slice(1);
}

function updateClock() {
    const now = new Date();

    const time = now.toLocaleTimeString("ru-RU", {
        hour: "numeric",
        minute: "2-digit"
    });

    const date = capFirst(now.toLocaleDateString("ru-RU", {
        weekday: "long",
        day: "numeric",
        month: "long"
    }));

    [
        ["lockTime", time],
        ["phoneTime", time],
        ["lockDate", date],
        ["phoneDate", date]
    ].forEach(([id, val]) => {
        const el = document.getElementById(id);
        if (el) el.textContent = val;
    });
}

updateClock();
setInterval(updateClock, 60000);

const windowsLock = document.getElementById("windowsLock");
const phoneLock = document.getElementById("phoneLock");

function unlock() {
    windowsLock?.classList.add("unlocked");
    phoneLock?.classList.add("unlocked");

    setTimeout(() => {
        if (windowsLock) windowsLock.style.display = "none";
        if (phoneLock) phoneLock.style.display = "none";
    }, 830);
}

windowsLock?.addEventListener("click", unlock);
phoneLock?.addEventListener("click", unlock);

window.addEventListener("keydown", e => {
    if (e.key === "Enter") unlock();
});

window.addEventListener("wheel", e => {
    if (e.deltaY > 10) unlock();
}, { passive: true });

const ieApp = document.getElementById("ieApp");
const ieLoading = document.getElementById("ieLoading");
const pcIeTile = document.getElementById("pcIeTile");
const phoneIeTile = document.getElementById("phoneIeTile");

function launchIE(page = "about") {
    unlock();

    phoneIeTile?.classList.add("launching");
    pcIeTile?.classList.add("launching");

    setTimeout(() => {
        phoneIeTile?.classList.remove("launching");
        pcIeTile?.classList.remove("launching");
    }, 680);

    setTimeout(() => {
        if (ieApp) {
            ieApp.classList.remove("active");
            void ieApp.offsetWidth;
            ieApp.classList.add("active");
        }

        if (ieLoading) {
            ieLoading.style.animation = "none";
            void ieLoading.offsetWidth;
            ieLoading.style.animation = "";
        }

        openPage(page);
    }, 360);
}

phoneIeTile?.addEventListener("click", () => launchIE("about"));
pcIeTile?.addEventListener("click", () => launchIE("about"));

document.querySelectorAll("[data-page]").forEach(el => {
    if (el.classList.contains("phone-tile") || el.classList.contains("tile")) {
        el.addEventListener("click", () => launchIE(el.dataset.page));
    }
});

function openPage(page) {
    document.querySelectorAll(".bio-page").forEach(section => {
        section.classList.remove("active");
    });

    const target = document.getElementById("page-" + page);
    if (target) target.classList.add("active");

    document.querySelectorAll(".site-nav button[data-page]").forEach(button => {
        button.classList.toggle("active", button.dataset.page === page);
    });

    const address = document.getElementById("addressBar");
    if (address) {
        address.textContent = "https://vertaw.local/" + page;
    }

    const tab = document.getElementById("tabTitle");
    if (tab) {
        tab.textContent = "vertaw — " + page;
    }
}

document.querySelectorAll(".site-nav button[data-page]").forEach(button => {
    button.addEventListener("click", () => openPage(button.dataset.page));
});

document.getElementById("backToStart")?.addEventListener("click", () => {
    ieApp?.classList.remove("active");
});

document.getElementById("phoneBack")?.addEventListener("click", () => {
    ieApp?.classList.remove("active");
});

document.getElementById("phoneHome")?.addEventListener("click", () => {
    document.querySelector(".phone-start")?.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});

document.getElementById("phoneSearch")?.addEventListener("click", () => {
    launchIE("contacts");
});

const musicToggle = document.getElementById("musicToggle");
const inlineMusicBtn = document.getElementById("inlineMusicBtn");
const siteMusic = document.getElementById("siteMusic");

let isMusicPlaying = false;

function toggleMusic() {
    if (!siteMusic) {
        alert("Файл музыки не найден. Проверь: assets/music.mp3");
        return;
    }

    if (!isMusicPlaying) {
        siteMusic.volume = 0.45;

        siteMusic.play()
            .then(() => {
                isMusicPlaying = true;

                musicToggle?.classList.add("playing");

                if (musicToggle) {
                    const label = musicToggle.querySelector(".music-label");
                    if (label) label.textContent = "Музыка играет";
                }
            })
            .catch(() => {
                alert("Браузер не дал включить музыку. Нажми кнопку ещё раз.");
            });

    } else {
        siteMusic.pause();

        isMusicPlaying = false;

        musicToggle?.classList.remove("playing");

        if (musicToggle) {
            const label = musicToggle.querySelector(".music-label");
            if (label) label.textContent = "Включить музыку";
        }
    }
}

musicToggle?.addEventListener("click", toggleMusic);
inlineMusicBtn?.addEventListener("click", toggleMusic);

const loading = document.querySelector("#loading");

if (loading) {
    window.addEventListener("load", () => {
        loading.classList.add("is-hidden");
    });
}

const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector(".site-nav");

if (navToggle && siteNav) {
    navToggle.addEventListener("click", () => {
        const isOpen = siteNav.classList.toggle("is-open");
        navToggle.classList.toggle("is-open", isOpen);
        navToggle.setAttribute("aria-expanded", String(isOpen));
    });

    siteNav.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
            siteNav.classList.remove("is-open");
            navToggle.classList.remove("is-open");
            navToggle.setAttribute("aria-expanded", "false");
        });
    });
}

const fadeElements = document.querySelectorAll(".fadein");

if ("IntersectionObserver" in window) {
    const fadeObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
        });
    }, { rootMargin: "-10% 0px", threshold: 0.12 });

    fadeElements.forEach((element) => fadeObserver.observe(element));
} else {
    fadeElements.forEach((element) => element.classList.add("is-visible"));
}

const sliderMedia = window.matchMedia("(max-width: 860px)");

document.querySelectorAll(".horizontal-area").forEach((area) => {
    const scroller = area.querySelector("[data-scroll-group]");
    const button = area.querySelector(".slider-arrow");
    if (!scroller || !button) return;

    const originalCards = Array.from(scroller.querySelectorAll(".work-card"));
    let loopEnabled = false;
    let originalStart = 0;
    let loopWidth = 0;
    let stride = 0;
    let scrollTimer = 0;

    const getGap = () => {
        const styles = getComputedStyle(scroller);
        return Number.parseFloat(styles.columnGap || styles.gap || "0");
    };

    const getStride = () => {
        const card = originalCards[0];
        if (!card) return 0;
        return card.getBoundingClientRect().width + getGap();
    };

    const measureLoop = () => {
        stride = getStride();
        if (!stride) return;
        originalStart = originalCards[0].offsetLeft;
        loopWidth = originalCards.length * stride;
    };

    const makeClone = (card) => {
        const clone = card.cloneNode(true);
        clone.classList.add("loop-clone", "is-visible");
        clone.setAttribute("aria-hidden", "true");
        clone.querySelectorAll("a, button").forEach((control) => {
            control.setAttribute("tabindex", "-1");
        });
        return clone;
    };

    const removeClones = () => {
        scroller.querySelectorAll(".loop-clone").forEach((clone) => clone.remove());
        loopEnabled = false;
        originalStart = 0;
        loopWidth = 0;
        stride = 0;
    };

    const jumpTo = (left) => {
        scroller.scrollTo({ left, behavior: "auto" });
    };

    const normalizeLoop = () => {
        if (!loopEnabled || !loopWidth || !stride) return;

        const left = scroller.scrollLeft;
        const beforeOriginal = originalStart - stride;
        const afterOriginal = originalStart + loopWidth + stride;

        if (left <= beforeOriginal) {
            jumpTo(left + loopWidth);
        } else if (left >= afterOriginal) {
            jumpTo(left - loopWidth);
        }
    };

    const scheduleNormalize = () => {
        if (!loopEnabled) return;
        window.clearTimeout(scrollTimer);
        scrollTimer = window.setTimeout(normalizeLoop, 120);
    };

    // Smartphone-only loop: clone cards around the real cards so swiping keeps feeling continuous.
    const enableMobileLoop = () => {
        if (loopEnabled || originalCards.length < 2) return;

        originalCards.slice().reverse().forEach((card) => {
            scroller.prepend(makeClone(card));
        });
        originalCards.forEach((card) => {
            scroller.append(makeClone(card));
        });

        loopEnabled = true;
        requestAnimationFrame(() => {
            measureLoop();
            jumpTo(originalStart);
        });
    };

    // Desktop keeps the normal scrollbar. Smartphone gets the loop clones and starts at the real first card.
    const syncSliderMode = () => {
        window.clearTimeout(scrollTimer);
        if (sliderMedia.matches) {
            removeClones();
            enableMobileLoop();
        } else {
            removeClones();
            jumpTo(0);
        }
    };

    scroller.addEventListener("scroll", scheduleNormalize, { passive: true });

    button.addEventListener("click", () => {
        const step = getStride();
        if (!step) return;

        if (loopEnabled) {
            scroller.scrollTo({ left: scroller.scrollLeft + step, behavior: "smooth" });
            window.clearTimeout(scrollTimer);
            scrollTimer = window.setTimeout(normalizeLoop, 380);
            return;
        }

        const maxScroll = scroller.scrollWidth - scroller.clientWidth;
        const nextLeft = scroller.scrollLeft + step;

        if (nextLeft >= maxScroll - 8) {
            scroller.scrollTo({ left: 0, behavior: "smooth" });
        } else {
            scroller.scrollTo({ left: nextLeft, behavior: "smooth" });
        }
    });

    sliderMedia.addEventListener("change", syncSliderMode);
    window.addEventListener("resize", () => {
        if (!sliderMedia.matches) return;
        syncSliderMode();
    });
    syncSliderMode();
});

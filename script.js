document.addEventListener("DOMContentLoaded", () => {
    /* =========================================
       MENU MOBILE
    ========================================= */

    const menuToggle = document.querySelector(".menu-toggle");
    const mainNav = document.querySelector(".main-nav");

    if (menuToggle && mainNav) {
        menuToggle.addEventListener("click", () => {
            const isOpen = mainNav.classList.toggle("is-open");

            menuToggle.setAttribute("aria-expanded", isOpen);
            menuToggle.setAttribute(
                "aria-label",
                isOpen ? "Fechar menu" : "Abrir menu"
            );
        });

        document.querySelectorAll(".nav-link").forEach((link) => {
            link.addEventListener("click", () => {
                mainNav.classList.remove("is-open");
                menuToggle.setAttribute("aria-expanded", "false");
                menuToggle.setAttribute("aria-label", "Abrir menu");
            });
        });
    }


    /* =========================================
       ANIMAÇÕES DE ENTRADA
    ========================================= */

    const revealElements = document.querySelectorAll(".reveal");

    const revealObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    revealObserver.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.12
        }
    );

    revealElements.forEach((element) => {
        revealObserver.observe(element);
    });


    /* =========================================
       NAVBAR — SEÇÃO ATIVA
    ========================================= */

    const sections = document.querySelectorAll("section[id]");
    const navLinks = document.querySelectorAll(".nav-link");

    const sectionObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const currentId = entry.target.getAttribute("id");

                    navLinks.forEach((link) => {
                        link.classList.toggle(
                            "is-active",
                            link.getAttribute("href") === `#${currentId}`
                        );
                    });
                }
            });
        },
        {
            threshold: 0.35
        }
    );

    sections.forEach((section) => {
        sectionObserver.observe(section);
    });


    /* =========================================
       BARRA DE PROGRESSO DO SCROLL
    ========================================= */

    const progressBar = document.querySelector(".scroll-progress span");

    function updateScrollProgress() {
        if (!progressBar) return;

        const scrollTop = window.scrollY;
        const documentHeight =
            document.documentElement.scrollHeight - window.innerHeight;

        const progress =
            documentHeight > 0
                ? (scrollTop / documentHeight) * 100
                : 0;

        progressBar.style.width = `${progress}%`;
    }

    window.addEventListener("scroll", updateScrollProgress, {
        passive: true
    });

    updateScrollProgress();


    /* =========================================
       EFEITO DE CURSOR
    ========================================= */

    const cursorGlow = document.querySelector(".cursor-glow");

    if (
        cursorGlow &&
        window.matchMedia("(pointer: fine)").matches
    ) {
        window.addEventListener("pointermove", (event) => {
            cursorGlow.style.left = `${event.clientX}px`;
            cursorGlow.style.top = `${event.clientY}px`;
        });
    }


    /* =========================================
       EFEITO TILT NOS CARDS
    ========================================= */

    const tiltCards = document.querySelectorAll(".tilt-card");

    if (window.matchMedia("(pointer: fine)").matches) {
        tiltCards.forEach((card) => {
            card.addEventListener("pointermove", (event) => {
                const rect = card.getBoundingClientRect();

                const x = event.clientX - rect.left;
                const y = event.clientY - rect.top;

                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                const rotateX =
                    ((y - centerY) / centerY) * -4;

                const rotateY =
                    ((x - centerX) / centerX) * 4;

                card.style.transform = `
                    perspective(900px)
                    rotateX(${rotateX}deg)
                    rotateY(${rotateY}deg)
                    translateY(-4px)
                `;
            });

            card.addEventListener("pointerleave", () => {
                card.style.transform = "";
            });
        });
    }


    /* =========================================
       CARROSSEL — CACAU SHOW
    ========================================= */

    const gallery = document.querySelector("[data-gallery]");

    if (gallery) {
        const track = gallery.querySelector(".gallery-track");
        const slides = gallery.querySelectorAll(".gallery-slide");
        const prevButton = gallery.querySelector(".gallery-prev");
        const nextButton = gallery.querySelector(".gallery-next");
        const counter = gallery.querySelector("[data-gallery-current]");

        let currentIndex = 0;
        let autoplay;

        function updateGallery() {
            if (!track || !slides.length) return;

            track.style.transform =
                `translateX(-${currentIndex * 100}%)`;

            slides.forEach((slide, index) => {
                slide.classList.toggle(
                    "is-active",
                    index === currentIndex
                );
            });

            if (counter) {
                counter.textContent = String(currentIndex + 1).padStart(2, "0");
            }
        }

        function nextSlide() {
            currentIndex =
                (currentIndex + 1) % slides.length;

            updateGallery();
        }

        function previousSlide() {
            currentIndex =
                (currentIndex - 1 + slides.length) % slides.length;

            updateGallery();
        }

        if (nextButton) {
            nextButton.addEventListener("click", (event) => {
                event.stopPropagation();
                nextSlide();
                restartAutoplay();
            });
        }

        if (prevButton) {
            prevButton.addEventListener("click", (event) => {
                event.stopPropagation();
                previousSlide();
                restartAutoplay();
            });
        }


        /* -----------------------------------------
           LIGHTBOX / IMAGEM AMPLIADA
        ----------------------------------------- */

        const lightbox = document.getElementById("lightbox");
        const lightboxImage =
            document.getElementById("lightbox-image");

        const lightboxClose =
            document.querySelector(".lightbox-close");

        const lightboxPrev =
            document.querySelector(".lightbox-prev");

        const lightboxNext =
            document.querySelector(".lightbox-next");

        const lightboxCount =
            document.getElementById("lightbox-count");


        function openLightbox(index) {
            if (!lightbox || !lightboxImage) return;

            currentIndex = index;

            const imagePath =
                slides[currentIndex].dataset.image;

            lightboxImage.src = imagePath;

            lightboxImage.alt =
                slides[currentIndex]
                    .querySelector("img")
                    ?.alt || "Imagem ampliada";

            if (lightboxCount) {
                lightboxCount.textContent =
                    `${String(currentIndex + 1).padStart(2, "0")} / ${String(slides.length).padStart(2, "0")}`;
            }

            lightbox.classList.add("is-open");
            lightbox.setAttribute("aria-hidden", "false");

            document.body.classList.add("lightbox-open");

            stopAutoplay();
        }


        function closeLightbox() {
            if (!lightbox) return;

            lightbox.classList.remove("is-open");
            lightbox.setAttribute("aria-hidden", "true");

            document.body.classList.remove("lightbox-open");

            startAutoplay();
        }


        function updateLightbox() {
            if (!lightboxImage) return;

            const imagePath =
                slides[currentIndex].dataset.image;

            lightboxImage.src = imagePath;

            lightboxImage.alt =
                slides[currentIndex]
                    .querySelector("img")
                    ?.alt || "Imagem ampliada";

            if (lightboxCount) {
                lightboxCount.textContent =
                    `${String(currentIndex + 1).padStart(2, "0")} / ${String(slides.length).padStart(2, "0")}`;
            }

            updateGallery();
        }


        function lightboxNextSlide() {
            currentIndex =
                (currentIndex + 1) % slides.length;

            updateLightbox();
        }


        function lightboxPreviousSlide() {
            currentIndex =
                (currentIndex - 1 + slides.length) % slides.length;

            updateLightbox();
        }


        /* Clique em cada imagem */

        slides.forEach((slide, index) => {
            slide.addEventListener("click", () => {
                openLightbox(index);
            });
        });


        /* Botão "Expandir projeto" */

        const galleryOpenButton =
            document.querySelector(".gallery-open");

        if (galleryOpenButton) {
            galleryOpenButton.addEventListener("click", () => {
                openLightbox(currentIndex);
            });
        }


        /* Fechar */

        if (lightboxClose) {
            lightboxClose.addEventListener(
                "click",
                closeLightbox
            );
        }


        /* Navegação dentro do Lightbox */

        if (lightboxNext) {
            lightboxNext.addEventListener(
                "click",
                lightboxNextSlide
            );
        }

        if (lightboxPrev) {
            lightboxPrev.addEventListener(
                "click",
                lightboxPreviousSlide
            );
        }


        /* Clicar no fundo fecha */

        if (lightbox) {
            lightbox.addEventListener("click", (event) => {
                if (event.target === lightbox) {
                    closeLightbox();
                }
            });
        }


        /* Teclado */

        document.addEventListener("keydown", (event) => {
            if (!lightbox?.classList.contains("is-open")) {
                return;
            }

            if (event.key === "Escape") {
                closeLightbox();
            }

            if (event.key === "ArrowRight") {
                lightboxNextSlide();
            }

            if (event.key === "ArrowLeft") {
                lightboxPreviousSlide();
            }
        });


        /* -----------------------------------------
           AUTOPLAY
        ----------------------------------------- */

        function startAutoplay() {
            if (
                window.matchMedia(
                    "(prefers-reduced-motion: reduce)"
                ).matches
            ) {
                return;
            }

            stopAutoplay();

            autoplay = setInterval(() => {
                nextSlide();
            }, 5000);
        }

        function stopAutoplay() {
            if (autoplay) {
                clearInterval(autoplay);
                autoplay = null;
            }
        }

        function restartAutoplay() {
            stopAutoplay();
            startAutoplay();
        }


        gallery.addEventListener("mouseenter", stopAutoplay);
        gallery.addEventListener("mouseleave", startAutoplay);

        gallery.addEventListener("focusin", stopAutoplay);
        gallery.addEventListener("focusout", startAutoplay);


        updateGallery();
        startAutoplay();
    }


    /* =========================================
       ANO AUTOMÁTICO DO FOOTER
    ========================================= */

    const yearElement =
        document.querySelector("[data-current-year]");

    if (yearElement) {
        yearElement.textContent =
            new Date().getFullYear();
    }
});

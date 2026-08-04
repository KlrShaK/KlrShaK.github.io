document.addEventListener("DOMContentLoaded", () => {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const videos = Array.from(document.querySelectorAll(".portfolio-video"));

  const loadVideo = (video) => {
    if (reducedMotion.matches || video.dataset.loaded === "true") return;
    const source = video.querySelector("source[data-src]");
    if (!source) return;
    source.src = source.dataset.src;
    source.removeAttribute("data-src");
    video.dataset.loaded = "true";
    video.load();
  };

  const setVideoState = (video, playing) => {
    const toggle = video.parentElement.querySelector(".portfolio-video-toggle");
    if (!toggle) return;
    toggle.setAttribute("aria-label", playing ? "Pause video preview" : "Play video preview");
    const icon = toggle.querySelector("i");
    icon.classList.toggle("fa-pause", playing);
    icon.classList.toggle("fa-play", !playing);
  };

  videos.forEach((video) => {
    const toggle = video.parentElement.querySelector(".portfolio-video-toggle");
    if (!toggle) return;
    toggle.addEventListener("click", () => {
      if (video.paused) {
        video.dataset.userPaused = "false";
        loadVideo(video);
        video
          .play()
          .then(() => setVideoState(video, true))
          .catch(() => {});
      } else {
        video.dataset.userPaused = "true";
        video.pause();
        setVideoState(video, false);
      }
    });
  });

  if ("IntersectionObserver" in window) {
    const videoObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target;
          if (entry.isIntersecting && !video.closest("[hidden]") && video.dataset.userPaused !== "true") {
            loadVideo(video);
            video
              .play()
              .then(() => setVideoState(video, true))
              .catch(() => {});
          } else {
            video.pause();
            setVideoState(video, false);
          }
        });
      },
      { rootMargin: "180px 0px", threshold: 0.15 }
    );
    videos.forEach((video) => videoObserver.observe(video));
  } else if (!reducedMotion.matches) {
    videos.forEach((video) => {
      loadVideo(video);
      video
        .play()
        .then(() => setVideoState(video, true))
        .catch(() => {});
    });
  }

  reducedMotion.addEventListener("change", (event) => {
    if (event.matches) {
      videos.forEach((video) => {
        video.pause();
        setVideoState(video, false);
      });
    }
  });

  const filterButtons = Array.from(document.querySelectorAll(".portfolio-filter"));
  const filterableItems = Array.from(document.querySelectorAll(".portfolio-filterable"));
  const emptyMessage = document.querySelector(".portfolio-empty");

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const selected = button.dataset.filter;
      filterButtons.forEach((candidate) => {
        const active = candidate === button;
        candidate.classList.toggle("is-active", active);
        candidate.setAttribute("aria-pressed", String(active));
      });

      let visibleCount = 0;
      filterableItems.forEach((item) => {
        const categories = (item.dataset.categories || "").split(" ");
        const visible = selected === "all" || categories.includes(selected);
        item.hidden = !visible;
        if (visible) visibleCount += 1;

        const video = item.querySelector(".portfolio-video");
        if (video && !visible) {
          video.pause();
          setVideoState(video, false);
        }
      });

      if (emptyMessage) emptyMessage.hidden = visibleCount !== 0;
    });
  });
});

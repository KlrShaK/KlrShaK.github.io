document.addEventListener("DOMContentLoaded", () => {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const videos = Array.from(document.querySelectorAll(".portfolio-video"));
  const youtubeEmbeds = Array.from(document.querySelectorAll(".portfolio-youtube"));

  const sendYouTubeCommand = (embed, command) => {
    const iframe = embed.querySelector("iframe");
    if (!iframe?.contentWindow) return;
    iframe.contentWindow.postMessage(JSON.stringify({ event: "command", func: command, args: [] }), "*");
  };

  const loadYouTube = (embed, { autoplay = true, muted = true } = {}) => {
    embed.dataset.shouldPlay = String(autoplay);
    embed.dataset.shouldMute = String(muted);

    if (embed.dataset.loaded === "true") {
      sendYouTubeCommand(embed, muted ? "mute" : "unMute");
      if (autoplay) sendYouTubeCommand(embed, "playVideo");
      return;
    }

    const videoId = embed.dataset.youtubeId;
    if (!videoId) return;

    const parameters = new URLSearchParams({
      autoplay: autoplay ? "1" : "0",
      mute: muted ? "1" : "0",
      controls: "1",
      enablejsapi: "1",
      loop: "1",
      playlist: videoId,
      playsinline: "1",
      rel: "0",
    });

    if (window.location.origin.startsWith("http")) parameters.set("origin", window.location.origin);

    const iframe = document.createElement("iframe");
    iframe.src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(videoId)}?${parameters}`;
    iframe.title = `${embed.dataset.youtubeTitle || "Portfolio project"} video`;
    iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
    iframe.allowFullscreen = true;
    iframe.loading = "lazy";
    iframe.referrerPolicy = "strict-origin-when-cross-origin";
    iframe.addEventListener("load", () => {
      sendYouTubeCommand(embed, embed.dataset.shouldMute === "true" ? "mute" : "unMute");
      sendYouTubeCommand(embed, embed.dataset.shouldPlay === "true" ? "playVideo" : "pauseVideo");
    });

    embed.replaceChildren(iframe);
    embed.dataset.loaded = "true";
  };

  youtubeEmbeds.forEach((embed) => {
    const loadButton = embed.querySelector(".portfolio-youtube-load");
    loadButton?.addEventListener("click", () => loadYouTube(embed, { autoplay: true, muted: false }));
  });

  if ("IntersectionObserver" in window) {
    const youtubeObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const embed = entry.target;
          if (entry.isIntersecting && !embed.closest("[hidden]") && !reducedMotion.matches) {
            loadYouTube(embed, { autoplay: true, muted: true });
          } else if (embed.dataset.loaded === "true") {
            embed.dataset.shouldPlay = "false";
            sendYouTubeCommand(embed, "pauseVideo");
          }
        });
      },
      { rootMargin: "120px 0px", threshold: 0.35 }
    );
    youtubeEmbeds.forEach((embed) => youtubeObserver.observe(embed));
  } else if (!reducedMotion.matches) {
    youtubeEmbeds.forEach((embed) => loadYouTube(embed, { autoplay: true, muted: true }));
  }

  document.querySelectorAll("[data-youtube-trigger]").forEach((trigger) => {
    trigger.addEventListener("click", (event) => {
      const videoId = trigger.dataset.youtubeTrigger;
      const localContainer = trigger.closest(".portfolio-card, .portfolio-detail")?.querySelector(".portfolio-youtube");
      const embed = localContainer || youtubeEmbeds.find((candidate) => candidate.dataset.youtubeId === videoId);
      if (!embed) return;

      event.preventDefault();
      loadYouTube(embed, { autoplay: true, muted: false });
      embed.scrollIntoView({ behavior: reducedMotion.matches ? "auto" : "smooth", block: "center" });
    });
  });

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
      youtubeEmbeds.forEach((embed) => {
        embed.dataset.shouldPlay = "false";
        sendYouTubeCommand(embed, "pauseVideo");
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

        const youtube = item.querySelector(".portfolio-youtube");
        if (youtube && !visible) {
          youtube.dataset.shouldPlay = "false";
          sendYouTubeCommand(youtube, "pauseVideo");
        }
      });

      if (emptyMessage) emptyMessage.hidden = visibleCount !== 0;
    });
  });
});

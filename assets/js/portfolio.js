document.addEventListener("DOMContentLoaded", () => {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const videos = Array.from(document.querySelectorAll(".portfolio-video"));
  const youtubeEmbeds = Array.from(document.querySelectorAll(".portfolio-youtube"));
  const mediaItems = videos.concat(youtubeEmbeds);
  const mediaDialog = document.querySelector(".portfolio-media-dialog");
  const dialogVideo = mediaDialog ? mediaDialog.querySelector(".portfolio-media-dialog-video") : null;
  const dialogTitle = mediaDialog ? mediaDialog.querySelector("#portfolio-media-dialog-title") : null;
  const dialogClose = mediaDialog ? mediaDialog.querySelector(".portfolio-media-dialog-close") : null;
  let activeMedia = null;
  let mediaUpdateFrame = null;
  let dialogTrigger = null;

  const sendYouTubeCommand = (embed, command) => {
    const iframe = embed.querySelector("iframe");
    if (!iframe || !iframe.contentWindow) return;
    iframe.contentWindow.postMessage(JSON.stringify({ event: "command", func: command, args: [] }), "*");
  };

  const loadYouTube = (embed, { autoplay = true, muted = true } = {}) => {
    embed.dataset.shouldPlay = String(autoplay);
    embed.dataset.shouldMute = String(muted);

    if (embed.dataset.loaded === "true") {
      sendYouTubeCommand(embed, muted ? "mute" : "unMute");
      sendYouTubeCommand(embed, autoplay ? "playVideo" : "pauseVideo");
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

  const loadVideo = (video) => {
    if (video.dataset.loaded === "true") return;
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
    if (!icon) return;
    icon.classList.toggle("fa-pause", playing);
    icon.classList.toggle("fa-play", !playing);
  };

  const pauseMedia = (media) => {
    media.dataset.userActivated = "false";

    if (media.classList.contains("portfolio-video")) {
      media.pause();
      setVideoState(media, false);
      return;
    }

    media.dataset.shouldPlay = "false";
    sendYouTubeCommand(media, "pauseVideo");
  };

  const playMedia = (media, muted = true) => {
    if (media.classList.contains("portfolio-video")) {
      loadVideo(media);
      media
        .play()
        .then(() => setVideoState(media, activeMedia === media && !media.paused))
        .catch(() => setVideoState(media, false));
      return;
    }

    loadYouTube(media, { autoplay: true, muted });
  };

  const activateMedia = (media, muted = true) => {
    mediaItems.forEach((candidate) => {
      if (candidate === media) {
        playMedia(candidate, muted);
      } else {
        pauseMedia(candidate);
      }
    });
    activeMedia = media;
  };

  const isMediaVisible = (media) => {
    if (media.closest("[hidden]")) return false;
    if (media.classList.contains("portfolio-video") && media.dataset.userPaused === "true") return false;

    const rect = media.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0 && rect.bottom > 0 && rect.top < window.innerHeight && rect.right > 0 && rect.left < window.innerWidth;
  };

  const distanceFromViewportCenter = (media) => {
    const rect = media.getBoundingClientRect();
    const horizontalDistance = rect.left + rect.width / 2 - window.innerWidth / 2;
    const verticalDistance = rect.top + rect.height / 2 - window.innerHeight / 2;
    return Math.hypot(horizontalDistance, verticalDistance);
  };

  const updateActiveMedia = () => {
    mediaUpdateFrame = null;

    if (document.hidden || (mediaDialog && mediaDialog.open)) {
      activateMedia(null);
      return;
    }

    if (reducedMotion.matches) {
      if (!activeMedia || activeMedia.dataset.userActivated !== "true") activateMedia(null);
      return;
    }

    const nearestMedia = mediaItems
      .filter(isMediaVisible)
      .sort((first, second) => distanceFromViewportCenter(first) - distanceFromViewportCenter(second))[0];

    if (nearestMedia === activeMedia) return;
    const muted = !nearestMedia || nearestMedia.dataset.userActivated !== "true";
    activateMedia(nearestMedia || null, muted);
  };

  const scheduleMediaUpdate = () => {
    if (mediaUpdateFrame !== null) return;
    mediaUpdateFrame = window.requestAnimationFrame(updateActiveMedia);
  };

  youtubeEmbeds.forEach((embed) => {
    const loadButton = embed.querySelector(".portfolio-youtube-load");
    if (!loadButton) return;
    loadButton.addEventListener("click", () => {
      embed.dataset.userActivated = "true";
      activateMedia(embed, false);
      embed.scrollIntoView({ behavior: reducedMotion.matches ? "auto" : "smooth", block: "center" });
    });
  });

  document.querySelectorAll("[data-youtube-trigger]").forEach((trigger) => {
    trigger.addEventListener("click", (event) => {
      const videoId = trigger.dataset.youtubeTrigger;
      const card = trigger.closest(".portfolio-card, .portfolio-detail");
      const localContainer = card ? card.querySelector(".portfolio-youtube") : null;
      const embed = localContainer || youtubeEmbeds.find((candidate) => candidate.dataset.youtubeId === videoId);
      if (!embed) return;

      event.preventDefault();
      embed.dataset.userActivated = "true";
      activateMedia(embed, false);
      embed.scrollIntoView({ behavior: reducedMotion.matches ? "auto" : "smooth", block: "center" });
    });
  });

  videos.forEach((video) => {
    setVideoState(video, false);
    const toggle = video.parentElement.querySelector(".portfolio-video-toggle");
    if (!toggle) return;
    toggle.addEventListener("click", () => {
      if (video.paused) {
        video.dataset.userPaused = "false";
        video.dataset.userActivated = "true";
        activateMedia(video);
        video.scrollIntoView({ behavior: reducedMotion.matches ? "auto" : "smooth", block: "center" });
      } else {
        video.dataset.userPaused = "true";
        pauseMedia(video);
        activeMedia = null;
        scheduleMediaUpdate();
      }
    });
  });

  document.querySelectorAll("[data-image-expand]").forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const image = trigger.parentElement.querySelector("img[data-zoomable]");
      if (image) image.click();
    });
  });

  const closeMediaDialog = () => {
    if (!mediaDialog || !mediaDialog.open) return;
    mediaDialog.close();
  };

  const resetMediaDialog = () => {
    if (!dialogVideo) return;
    dialogVideo.pause();
    dialogVideo.removeAttribute("src");
    dialogVideo.removeAttribute("poster");
    dialogVideo.load();
    document.body.classList.remove("portfolio-dialog-open");
    if (dialogTrigger) dialogTrigger.focus();
    dialogTrigger = null;
    scheduleMediaUpdate();
  };

  document.querySelectorAll("[data-video-expand]").forEach((trigger) => {
    trigger.addEventListener("click", () => {
      if (!mediaDialog || !dialogVideo || !dialogTitle) return;

      activateMedia(null);
      dialogTrigger = trigger;
      dialogTitle.textContent = trigger.dataset.mediaTitle || "Project video";
      dialogVideo.src = trigger.dataset.videoExpand;
      if (trigger.dataset.videoPoster) dialogVideo.poster = trigger.dataset.videoPoster;
      document.body.classList.add("portfolio-dialog-open");
      mediaDialog.showModal();
      dialogVideo.play().catch(() => undefined);
    });
  });

  if (dialogClose) dialogClose.addEventListener("click", closeMediaDialog);
  if (mediaDialog) {
    mediaDialog.addEventListener("click", (event) => {
      if (event.target === mediaDialog) closeMediaDialog();
    });
    mediaDialog.addEventListener("close", resetMediaDialog);
  }

  window.addEventListener("message", (event) => {
    const embed = youtubeEmbeds.find((candidate) => {
      const iframe = candidate.querySelector("iframe");
      return iframe && iframe.contentWindow === event.source;
    });
    if (!embed || embed === activeMedia) return;

    let message = event.data;
    if (typeof message === "string") {
      try {
        message = JSON.parse(message);
      } catch (_error) {
        return;
      }
    }

    if (message && message.info && message.info.playerState === 1) pauseMedia(embed);
  });

  window.addEventListener("scroll", scheduleMediaUpdate, { passive: true });
  window.addEventListener("resize", scheduleMediaUpdate);
  document.addEventListener("visibilitychange", scheduleMediaUpdate);

  reducedMotion.addEventListener("change", () => {
    activeMedia = null;
    scheduleMediaUpdate();
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

        if (!visible) {
          item.querySelectorAll(".portfolio-video, .portfolio-youtube").forEach(pauseMedia);
        }
      });

      if (emptyMessage) emptyMessage.hidden = visibleCount !== 0;
      scheduleMediaUpdate();
    });
  });

  scheduleMediaUpdate();
});

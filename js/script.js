(function ($) {
  "use strict";

  // header
  $(function () {
    const $header = $(".header_wrapper");
    const isMobile = () => window.matchMedia("(max-width: 768px)").matches;

    let lastScrollY = window.scrollY;
    let ticking = false;

    function handleScroll() {
      const currentScrollY = window.scrollY;
      if (!isMobile()) {
        if (currentScrollY > lastScrollY) {
            $header.addClass("header_hidden");
        }
        else {
            $header.removeClass("header_hidden");
        }
      } else {
        $header.removeClass("header_hidden");
      }
      lastScrollY = currentScrollY;
      ticking = false;
    }

    $(window).on("scroll", () => {
      if (!ticking) {
        window.requestAnimationFrame(handleScroll);
        ticking = true;
      }
    });
    handleScroll();

    // gnb (mobile)
    const $menuBtn = $(".gnb.mb .menu_on");
    const $panel = $(".gnb.mb .gnb_wrapper");
    const $closeBtn = $(".gnb.mb .close");
    const $backdrop = $(".mb-backdrop");

    function openMenu() {
      if ($panel.length) {
        $panel.addClass("open");
        $("body").addClass("menu-open");
      }
    }
    function closeMenu() {
      if ($panel.length) {
        $panel.removeClass("open");
        $("body").removeClass("menu-open");
      }
    }

    if ($menuBtn.length && $panel.length && $backdrop.length) {
      $menuBtn.on("click", function (e) {
        e.preventDefault();
        openMenu();
      });
      if ($closeBtn.length) {
        $closeBtn.on("click", function (e) {
          e.preventDefault();
          closeMenu();
        });
      }
      $backdrop.on("click", closeMenu);
      $(document).on("keydown", function (e) {
        if (e.key === "Escape") closeMenu();
      });
    }

    $(window).on("resize", () => {
      if (!isMobile()) closeMenu();
    });

    // menu click
    $(".gnb_wrapper ul li a").on("click", function (event) {
      const targetId = $(this).attr("href");
      if (targetId && targetId.startsWith("/#")) {
        event.preventDefault();
        const sel = targetId.replace("/", "");
        const $section = $(sel);
        if ($section.length) {
          $section[0].scrollIntoView({ behavior: "smooth" });
        }
      }
    });
  });

  // mouse cursor
  (function () {
    const $cursor = $(".cursor");
    if (!$cursor.length) return;

    $(document).on("mousemove", function (e) {
      $cursor.css({ left: e.clientX + "px", top: e.clientY + "px" });
    });

    $("header, .banner")
      .on("mouseenter", function () {
        $cursor.css({ opacity: "0" });
      })
      .on("mouseleave", function () {
        $cursor.css({ opacity: "1" });
      });

    $("a")
      .on("mouseenter", function () {
        $cursor.css({ width: "80px", height: "80px" });
      })
      .on("mouseleave", function () {
        $cursor.css({ width: "12px", height: "12px" });
      });
  })();

  // canvas effect
  (function () {
    const canvas = document.getElementById("imageCanvas");
    const $wrapper = $(".banner.pc .banner_wrapper");
    if (!canvas || !$wrapper.length) return;

    const ctx = canvas.getContext("2d");
    const image = new Image();
    image.src = "img/banner_pc.png";

    let particles = [];
    let lastMouseX = 0,
      lastMouseY = 0;

    function resizeCanvas() {
      const rect = $wrapper[0].getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;

      const ir =
        image.naturalWidth && image.naturalHeight
          ? image.naturalWidth / image.naturalHeight
          : 16 / 9;

      const targetCssWidth = rect.width;
      const targetCssHeight = Math.round(targetCssWidth / ir);

      $wrapper.css({ aspectRatio: "auto", height: targetCssHeight + "px" });

      canvas.width = Math.round(targetCssWidth * dpr);
      canvas.height = Math.round(targetCssHeight * dpr);

      $(canvas).css({
        width: targetCssWidth + "px",
        height: targetCssHeight + "px",
      });

      drawImage();
    }

    function drawImage() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.imageSmoothingEnabled = true;
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    }

    // mouse effect - color / scroll
    class SmokeParticle {
      constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 15 + 5;
        this.alpha = 1;
        this.vx = (Math.random() - 0.5) * 2;
        this.vy = (Math.random() - 0.5) * 2 - Math.random() * 2;
        this.color = color;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.alpha -= 0.015;
        this.size *= 0.99;
        if (this.alpha <= 0 || this.size < 1) {
          const idx = particles.indexOf(this);
          if (idx >= 0) particles.splice(idx, 1);
        }
      }
      draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.shadowBlur = 10;
        ctx.shadowColor = `rgba(${this.color.r}, ${this.color.g}, ${
          this.color.b
        }, ${this.alpha * 0.6})`;
        ctx.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.alpha})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
        ctx.restore();
      }
    }

    function getCanvasXY(e) {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY,
      };
    }

    function spawnParticlesAt(x, y) {
      const ix = Math.max(0, Math.min(canvas.width - 1, Math.floor(x)));
      const iy = Math.max(0, Math.min(canvas.height - 1, Math.floor(y)));

      drawImage();
      const data = ctx.getImageData(ix, iy, 1, 1).data;
      const r = data[0],
        g = data[1],
        b = data[2];

      for (let i = 0; i < 15; i++) {
        particles.push(new SmokeParticle(x, y, { r, g, b }));
      }
    }

    function onMouseMove(e) {
      const pos = getCanvasXY(e);
      lastMouseX = e.clientX;
      lastMouseY = e.clientY;
      spawnParticlesAt(pos.x, pos.y);
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawImage();
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.update();
        p.draw();
      }
      requestAnimationFrame(animate);
    }

    image.onload = function () {
      resizeCanvas();
      animate();
    };

    $(window).on("resize", resizeCanvas);

    $(window).on("mousemove", function (e) {
      onMouseMove(e);
    });

    $(window).on("scroll", function () {
      const evt = $.Event("mousemove", {
        clientX: lastMouseX,
        clientY: lastMouseY,
      });
      $(window).trigger(evt);
    });
  })();

  // Swiper
  var swiper = new Swiper(".itemSwiper", {
    slidesPerView: "auto",
    spaceBetween: 40,
    centeredSlides: false,
    breakpoints: {
      1024: { spaceBetween: 40 },
      768: { spaceBetween: 30 },
      0: { spaceBetween: 18 },
    },
  });

  // video
  $(function () {
    const $videoContainer = $(".video_container");
    const $video = $(".video_wrapper video");
    if (!$videoContainer.length || !$video.length) return;

    let hasPlayed = false;

    $videoContainer.on("mouseenter", function () {
      if (!hasPlayed) {
        $videoContainer.addClass("hovered");
        $video.get(0).play();
        hasPlayed = true;
      }
    });

    $video.on("ended", function () {
      const v = $video.get(0);
      v.pause();
      v.currentTime = 0;
      $videoContainer.removeClass("hovered").addClass("reset");
      setTimeout(() => {
        $videoContainer.removeClass("reset");
        hasPlayed = false;
      }, 800);
    });

    $video.removeAttr("autoplay").removeAttr("loop");
  });

  // personal - season list click
  $(function () {
    const $seasonLists = $(".season_list");
    const $seasons = $(".season");
    if (!$seasonLists.length || !$seasons.length) return;

    $seasonLists.each(function (idx) {
      $(this).on("mousedown", function () {
        $(".season_list.active").removeClass("active");
        $(".season.active").removeClass("active");
        $(this).addClass("active");
        $seasons.eq(idx).addClass("active");
      });
    });
  });

  // footer
  $(".footer_wrapper.mb .footer_menu > a").on("click", function (e) {
    e.preventDefault();
    const $item = $(this).parent(".footer_menu");
    const $panel = $item.children(".footer_detail");

    $item.toggleClass("on");
    $panel.stop(true, true).slideToggle(300);

    $item
      .siblings(".footer_menu")
      .removeClass("on")
      .children(".footer_detail")
      .stop(true, true)
      .slideUp(300);
  });
})(jQuery);

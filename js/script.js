// header
document.addEventListener("DOMContentLoaded", () => {
    const header = document.querySelector(".header_wrapper");
    let lastScrollY = window.scrollY;
    let ticking = false;

    const handleScroll = () => {
        const currentScrollY = window.scrollY;

        if (currentScrollY > lastScrollY) {
            header.classList.add("header_hidden");
        } else {
            header.classList.remove("header_hidden");
        }

        lastScrollY = currentScrollY;
        ticking = false;
    };

    window.addEventListener("scroll", () => {
        if (!ticking) {
            window.requestAnimationFrame(handleScroll);
            ticking = true;
        }
    });
});

// menu click
document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".gnb_wrapper ul li a").forEach((link) => {
        link.addEventListener("click", (event) => {
            const targetId = link.getAttribute("href"); 
            if (targetId.startsWith("/#")) {
                event.preventDefault(); 
                const section = document.querySelector(targetId.replace("/", "")); 
                
                if (section) {
                    section.scrollIntoView({ behavior: "smooth" });
                }
            }
        });
    });
});


// mouse cursor 
const cursor = document.querySelector(".cursor");

document.addEventListener("mousemove", (e) => {
    cursor.style.left = `${e.clientX}px`;
    cursor.style.top = `${e.clientY}px`;
});

document.querySelectorAll("header, .banner").forEach((element) => {
    element.addEventListener("mouseenter", () => {
        cursor.style.opacity = "0";
    });

    element.addEventListener("mouseleave", () => {
        cursor.style.opacity = "1";
    });
});

document.querySelectorAll("a").forEach((link) => {
    link.addEventListener("mouseenter", () => {
        cursor.style.width = "80px"; 
        cursor.style.height = "80px"; 
    });

    link.addEventListener("mouseleave", () => {
        cursor.style.width = "12px"; 
        cursor.style.height = "12px"; 
    });
});

// canvas effect
const canvas = document.getElementById("imageCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const image = new Image();
image.src = "img/banner1.png"; 

let particles = [];

function drawImage() {
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
}

class SmokeParticle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 15 + 5; 
        this.alpha = 1; 
        this.velocityX = (Math.random() - 0.5) * 2; 
        this.velocityY = (Math.random() - 0.5) * 2 - Math.random() * 2; 
        this.color = color; 
    }

    update() {
        this.x += this.velocityX;
        this.y += this.velocityY;
        this.alpha -= 0.015;
        this.size *= 0.99; 

        if (this.alpha <= 0 || this.size < 1) {
            const index = particles.indexOf(this);
            particles.splice(index, 1);
        }
    }

    draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha; 
        ctx.shadowBlur = 10; 
        ctx.shadowColor = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.alpha * 0.6})`; 
        ctx.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.alpha})`; 
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
        ctx.restore();
    }
}

// mouse effect - color / scroll
window.addEventListener("mousemove", (e) => {
    const rect = canvas.getBoundingClientRect();
    
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    const imageData = ctx.getImageData(x, y, 1, 1).data;
    const color = { r: imageData[0], g: imageData[1], b: imageData[2] };

    for (let i = 0; i < 15; i++) { 
        particles.push(new SmokeParticle(x, y, color)); 
    }
});

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawImage(); 

    particles.forEach((particle) => {
        particle.update();
        particle.draw();
    });

    requestAnimationFrame(animate);
}

image.onload = () => {
    drawImage();
    animate();
};

window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    drawImage();
});

window.addEventListener("scroll", () => {
    window.dispatchEvent(new MouseEvent("mousemove", {
        clientX: lastMouseX,
        clientY: lastMouseY
    }));
});

let lastMouseX = 0;
let lastMouseY = 0;

window.addEventListener("mousemove", (e) => {
    lastMouseX = e.clientX;
    lastMouseY = e.clientY;
});

var swiper = new Swiper(".itemSwiper", {
    slidesPerView: 'auto',
    spaceBetween: 40,
    centeredSlides: false,
    
});

// video
document.addEventListener("DOMContentLoaded", () => {
    const videoContainer = document.querySelector(".video_container");
    const video = document.querySelector(".video_wrapper video");

    let hasPlayed = false; 

    videoContainer.addEventListener("mouseenter", () => {
        if (!hasPlayed) {
            videoContainer.classList.add("hovered"); 
            video.play(); 
            hasPlayed = true; 
        }
    });

    video.addEventListener("ended", () => {
        video.pause(); 
        video.currentTime = 0; 
        videoContainer.classList.remove("hovered"); 
        videoContainer.classList.add("reset"); 

        setTimeout(() => {
            videoContainer.classList.remove("reset");
            hasPlayed = false; 
        }, 800);
    });

    
    video.removeAttribute("autoplay");
    video.removeAttribute("loop");
});



// personal - season list click
document.addEventListener("DOMContentLoaded", function() {
    const seasonLists = document.querySelectorAll(".season_list");
    const seasons = document.querySelectorAll('.season');

    seasonLists.forEach(function(seasonList, index) {
        seasonList.addEventListener("mousedown", function() {
            document.querySelector(".season_list.active").classList.remove("active");
            document.querySelector(".season.active").classList.remove("active");
            
            seasonList.classList.add("active");

            seasons[index].classList.add("active");
        });
    });
});
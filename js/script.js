document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const nav = document.getElementById("mainNav");
  const backTop = document.getElementById("backToTop");
  const themeToggle = document.getElementById("themeToggle");
  const year = document.getElementById("currentYear");
  const typingText = document.getElementById("typingText");
  const contactForm = document.getElementById("contactForm");
  const formStatus = document.getElementById("formStatus");

  // Dynamic year
  year.textContent = new Date().getFullYear();

  // Theme switching using localStorage
  const savedTheme = localStorage.getItem("portfolio-theme");
  if (savedTheme === "light") {
    body.classList.add("light-mode");
    themeToggle.innerHTML = '<i class="bi bi-sun-fill"></i>';
  }

  themeToggle.addEventListener("click", () => {
    body.classList.toggle("light-mode");
    const light = body.classList.contains("light-mode");
    localStorage.setItem("portfolio-theme", light ? "light" : "dark");
    themeToggle.innerHTML = light
      ? '<i class="bi bi-sun-fill"></i>'
      : '<i class="bi bi-moon-stars-fill"></i>';
  });

  // Navbar scroll state + back-to-top
  const handleScroll = () => {
    nav.classList.toggle("scrolled", window.scrollY > 20);
    backTop.classList.toggle("show", window.scrollY > 450);
  };
  window.addEventListener("scroll", handleScroll);
  handleScroll();

  backTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  // Active navigation link based on section
  const sections = document.querySelectorAll("main section[id]");
  const navLinks = document.querySelectorAll(".nav-link");

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
        });
      }
    });
  }, { rootMargin: "-35% 0px -55% 0px" });

  sections.forEach(section => observer.observe(section));

  // Close mobile navbar after clicking a link
  navLinks.forEach(link => {
    link.addEventListener("click", () => {
      const collapse = document.getElementById("portfolioNav");
      if (collapse.classList.contains("show")) {
        bootstrap.Collapse.getOrCreateInstance(collapse).hide();
      }
    });
  });

  // Typing effect
  const phrases = [
    "AI-powered solutions.",
    "responsive web apps.",
    "practical ML projects.",
    "clean user experiences."
  ];
  let phraseIndex = 0, charIndex = 0, deleting = false;

  function typeLoop() {
    const phrase = phrases[phraseIndex];
    typingText.textContent = deleting
      ? phrase.substring(0, charIndex--)
      : phrase.substring(0, charIndex++);

    let speed = deleting ? 45 : 75;
    if (!deleting && charIndex > phrase.length) {
      deleting = true;
      speed = 1300;
    } else if (deleting && charIndex < 0) {
      deleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      charIndex = 0;
      speed = 350;
    }
    setTimeout(typeLoop, speed);
  }
  typeLoop();

  // Skill progress animation
  const progressBars = document.querySelectorAll(".progress-bar");
  const progressObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.width = `${entry.target.dataset.width}%`;
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.35 });

  progressBars.forEach(bar => progressObserver.observe(bar));

  // Project filtering
  const filterButtons = document.querySelectorAll(".filter-btn");
  const projectItems = document.querySelectorAll(".project-item");

  filterButtons.forEach(button => {
    button.addEventListener("click", () => {
      filterButtons.forEach(btn => btn.classList.remove("active"));
      button.classList.add("active");

      const filter = button.dataset.filter;

      projectItems.forEach(item => {
        const categories = item.dataset.category.split(" ");
        const show = filter === "all" || categories.includes(filter);

        item.style.display = show ? "" : "none";
        if (show) {
          item.animate(
            [{ opacity: 0, transform: "translateY(10px)" }, { opacity: 1, transform: "translateY(0)" }],
            { duration: 280, easing: "ease-out" }
          );
        }
      });
    });
  });

  // Client-side contact form validation
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    formStatus.textContent = "";
    formStatus.className = "form-status";

    const fields = [
      document.getElementById("name"),
      document.getElementById("email"),
      document.getElementById("subject"),
      document.getElementById("message")
    ];

    let valid = true;
    fields.forEach(field => {
      if (!field.checkValidity()) {
        field.classList.add("is-invalid");
        valid = false;
      } else {
        field.classList.remove("is-invalid");
        field.classList.add("is-valid");
      }
    });

    if (!valid) {
      formStatus.textContent = "Please correct the highlighted fields.";
      formStatus.classList.add("error");
      return;
    }

    formStatus.textContent = "Message validated successfully! Connect the form to a backend/email service to receive submissions.";
    formStatus.classList.add("success");
    contactForm.reset();
    fields.forEach(field => field.classList.remove("is-valid"));
  });

  // Remove invalid state while typing
  document.querySelectorAll("#contactForm input, #contactForm textarea").forEach(field => {
    field.addEventListener("input", () => {
      if (field.checkValidity()) field.classList.remove("is-invalid");
    });
  });
});

// Initialize global variables
let lenis;
let playSynthSound;

document.addEventListener('DOMContentLoaded', () => {
  // Prevent browser scrolling to autofocus elements on reload
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }
  window.scrollTo(0, 0);

  // Initialize Lenis safely (fallback if offline or blocked)
  if (typeof Lenis !== 'undefined') {
    lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smooth: true,
      smoothTouch: false
    });

    function raf(time) {
      if (lenis) lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
  } else {
    console.warn("Lenis library is not loaded. Falling back to native scroll.");
  }

  initGlassHoverEffect();
  initScrollReveals();
  initThemeSwitcher();
  initTerminalEmulator();
  initDashboardTabs();
  initSkillsInspector();
  initVideoTimelinePlayer();
  initMacOSDock();
  initChatbot();
  initNavigation();
  initContactForm();
  initAdvancedUpgrades();
});

/* ==========================================================================
   1. Glass Hover Effects: Mouse light-glow & 3D Tilt rotation
   ========================================================================== */
function initGlassHoverEffect() {
  const cards = document.querySelectorAll('.glass-card');
  
  cards.forEach(card => {
    const maxTilt = 5; // degrees of tilt
    
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);

      const normX = (x / rect.width) - 0.5;
      const normY = (y / rect.height) - 0.5;
      
      const rotateX = -(normY * maxTilt).toFixed(2);
      const rotateY = (normX * maxTilt).toFixed(2);
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.015, 1.015, 1.015)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    });
  });
}

/* ==========================================================================
   2. Scroll Reveal Animations (Intersection Observer)
   ========================================================================== */
function initScrollReveals() {
  const revealElements = document.querySelectorAll('.reveal, .reveal-stagger');

  if (!('IntersectionObserver' in window)) {
    revealElements.forEach(el => el.classList.add('active'));
    return;
  }

  const observerOptions = {
    root: null,
    threshold: 0.02,
    rootMargin: '0px 0px -10px 0px'
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        obs.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealElements.forEach(el => {
    observer.observe(el);
  });
}

/* ==========================================================================
   3. Accent Palette Theme Switcher
   ========================================================================== */
function initThemeSwitcher() {
  const buttons = document.querySelectorAll('.theme-btn');
  
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTheme = btn.getAttribute('data-theme');
      
      // Update switcher active states
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      // Swap classes on body tag
      document.body.className = ''; // Reset classes
      if (targetTheme !== 'blue') {
        document.body.classList.add(`theme-${targetTheme}`);
      }
      
      // Sync color grading glowing blobs to theme change
      const blob1 = document.getElementById('glow-blob-1');
      const blob2 = document.getElementById('glow-blob-2');
      const blob3 = document.getElementById('glow-blob-3');
      
      if (targetTheme === 'blue') {
        if (blob1) blob1.style.background = 'radial-gradient(circle, #0070f3 0%, transparent 70%)';
        if (blob2) blob2.style.background = 'radial-gradient(circle, #00f0ff 0%, transparent 70%)';
      } else if (targetTheme === 'purple') {
        if (blob1) blob1.style.background = 'radial-gradient(circle, #8a2be2 0%, transparent 70%)';
        if (blob2) blob2.style.background = 'radial-gradient(circle, #e433f5 0%, transparent 70%)';
      } else if (targetTheme === 'orange') {
        if (blob1) blob1.style.background = 'radial-gradient(circle, #ea7600 0%, transparent 70%)';
        if (blob2) blob2.style.background = 'radial-gradient(circle, #ffbd2e 0%, transparent 70%)';
      }
    });
  });
}

/* ==========================================================================
   4. Interactive Terminal Emulator
   ========================================================================== */
function initTerminalEmulator() {
  const input = document.getElementById('terminal-input');
  const body = document.getElementById('terminal-body');
  const cursor = document.querySelector('.terminal-cursor');
  
  if (!input || !body) return;

  const updateCursorPosition = () => {
    const tempSpan = document.createElement('span');
    tempSpan.style.font = window.getComputedStyle(input).font;
    tempSpan.style.visibility = 'hidden';
    tempSpan.style.whiteSpace = 'pre';
    tempSpan.textContent = input.value;
    document.body.appendChild(tempSpan);
    
    const textWidth = tempSpan.getBoundingClientRect().width;
    cursor.style.left = `${textWidth}px`;
    
    document.body.removeChild(tempSpan);
  };

  input.addEventListener('input', updateCursorPosition);
  
  body.addEventListener('click', () => {
    input.focus({ preventScroll: true });
  });

  input.focus({ preventScroll: true });

  const commands = {
    help: () => `
Available commands:
  <span class="text-info">about</span>       - Brief overview of Shrey's engineering profile
  <span class="text-info">experience</span>  - Print professional internships and freelance details
  <span class="text-info">skills</span>      - List technical software and editing suites
  <span class="text-info">contact</span>     - Display email address and LinkedIn link
  <span class="text-info">banner</span>      - Display Shrey's signature tagline block
  <span class="text-info">clear</span>       - Clear the console logs
  <span class="text-info">help</span>        - Display this menu
    `,
    about: () => `
<span class="text-info">Shrey Vora</span> - B.Tech IT Undergraduate Student
Shah & Anchor Kutchhi Engineering College (2025 - 2029)
Focus: Software Engineering, Frontend Web Development, and Visual Media Editing.
Status: Video Editor Intern @ Genovia Solutions Pvt. Ltd.
    `,
    experience: () => `
<span class="text-info">1. Video Editor Intern</span> | Genovia Solutions Pvt. Ltd. (Feb 2026 - Present)
   - Edited company marketing reels.
   - Built faceless 2D motion graphics in After Effects.
   - Collaborated with design lead for storytelling production.

<span class="text-info">2. Freelance Editor</span> | Self-Employed (Aug 2024 - Apr 2025)
   - Specialized in anime speed-ramp edits and graphics layout.
    `,
    skills: () => `
<span class="text-info">Technical & Software Engineering:</span>
   - C Language, JavaScript, HTML5, CSS3, Git, GitHub

<span class="text-info">Creative Motion & editing:</span>
   - Adobe After Effects, Premiere Pro, Photoshop, Lightroom, Blender
    `,
    contact: () => `
Email  : <span class="text-info">shreyvora2007@gmail.com</span>
LinkIn : <span class="text-info">linkedin.com/in/shreyy-vora</span>
    `,
    banner: () => `
&gt;_ Aspiring Software Engineer
&gt;_ Problem Solver
&gt;_ Continuous Learner
&gt;_ Building for the future.
    `
  };

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const rawCmd = input.value.trim();
      const cmd = rawCmd.toLowerCase();
      
      const promptLine = document.createElement('div');
      promptLine.className = 'terminal-line text-prompt';
      promptLine.innerHTML = `
        <span class="prompt-user">visitor@shrey-vora:~$</span>
        <span class="prompt-typing">${rawCmd}</span>
      `;
      
      body.insertBefore(promptLine, input.closest('.terminal-interactive-line'));

      if (cmd !== '') {
        const outputLine = document.createElement('div');
        outputLine.className = 'terminal-line terminal-output';
        
        if (cmd === 'clear') {
          const lines = body.querySelectorAll('.terminal-line');
          lines.forEach(l => l.remove());
        } else if (commands[cmd]) {
          outputLine.innerHTML = commands[cmd]().trim().replace(/\n/g, '<br>');
          body.insertBefore(outputLine, input.closest('.terminal-interactive-line'));
        } else {
          outputLine.innerHTML = `Command not found: <span style="color: #ff5f56">${rawCmd}</span>. Type <span class="text-info">'help'</span> for list.`;
          body.insertBefore(outputLine, input.closest('.terminal-interactive-line'));
        }
      }

      input.value = '';
      updateCursorPosition();
      body.scrollTop = body.scrollHeight;
    }
  });
}

/* ==========================================================================
   5. Career SaaS Hub Tabs & Active Background Pill Selector
   ========================================================================== */
function initDashboardTabs() {
  const buttons = document.querySelectorAll('.sidebar-menu-btn');
  const panels = document.querySelectorAll('.tab-panel');
  const activePill = document.getElementById('sidebar-active-pill');

  const movePill = (btn) => {
    if (!activePill) return;
    activePill.style.transform = `translateY(${btn.offsetTop}px)`;
    activePill.style.height = `${btn.offsetHeight}px`;
  };

  const initialActive = document.querySelector('.sidebar-menu-btn.active');
  if (initialActive) {
    setTimeout(() => movePill(initialActive), 100);
  }

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-tab');
      
      movePill(btn);

      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      panels.forEach(p => {
        if (p.classList.contains('active')) {
          p.classList.remove('active');
          setTimeout(() => {
            if (!p.classList.contains('active')) {
              p.style.display = 'none';
            }
          }, 350);
        } else {
          p.style.display = 'none';
        }
      });
      
      const activePanel = document.getElementById(`panel-${targetTab}`);
      if (activePanel) {
        setTimeout(() => {
          activePanel.style.display = 'block';
          activePanel.offsetHeight; // force reflow
          activePanel.classList.add('active');
          
          const staggerGrid = activePanel.querySelector('.reveal-stagger');
          if (staggerGrid) {
            staggerGrid.classList.remove('active');
            staggerGrid.offsetHeight; // force reflow
            staggerGrid.classList.add('active');
          }
        }, 150);
      }
    });
  });

  window.addEventListener('resize', () => {
    const currentActive = document.querySelector('.sidebar-menu-btn.active');
    if (currentActive) {
      movePill(currentActive);
    }
  });
}

/* ==========================================================================
   6. Skills Node-Matrix Detailed Inspector & Card Highlight Links
   ========================================================================== */
function initSkillsInspector() {
  const skillItems = document.querySelectorAll('.skill-item-interactive');
  const inspector = document.getElementById('skills-inspector');
  const inspectorContent = document.getElementById('inspector-content');
  const emptyMessage = inspector.querySelector('.inspector-empty');
  
  const insBadge = document.getElementById('inspector-badge');
  const insName = document.getElementById('inspector-name');
  const insType = document.getElementById('inspector-type');
  const insDesc = document.getElementById('inspector-desc');
  const insPct = document.getElementById('inspector-pct');
  const insProgress = document.getElementById('inspector-progress');
  const insBullets = document.getElementById('inspector-bullets');

  // Skill Database
  const skillDetails = {
    html: { name: 'HTML5', type: 'Markup Architecture', badge: '5', badgeClass: 'logo-html', tab: 'education', desc: 'Deep structural expertise in semantic HTML tags, accessible web structures (ARIA guidelines), search engine optimizations, and document tree modularity.', competency: '90%', bullets: ['Organized standard DOM elements for rapid SaaS interfaces.', 'Maintained structured metadata parameters for organic indexing.', 'Wrote cross-platform semantic wrappers for modern web apps.'] },
    css: { name: 'CSS3', type: 'Layout & Styling System', badge: '3', badgeClass: 'logo-css', tab: 'education', desc: 'Expert layouts with Grid networks, flexbox containers, media queries for high responsiveness, and visual styling like backdrop blur filters, smooth glass cards, and keyframe animations.', competency: '88%', bullets: ['Created high-performance liquid glassmorphism components.', 'Built full mobile-responsive CSS layouts without bootstrap dependencies.', 'Designed custom CSS variables, themes, and dynamic dark mode glows.'] },
    js: { name: 'JavaScript', type: 'Interactivity Engine', badge: 'JS', badgeClass: 'logo-js', tab: 'education', desc: 'Vanilla ES6+ scripting for DOM manipulation, custom event listeners, state tracking, visual components control, and async requests handling.', competency: '82%', bullets: ['Created a dynamic local Terminal simulation parser.', 'Designed custom audio/video scrubber timeline controllers.', 'Developed interactive node matrix filters for skill lookups.'] },
    c: { name: 'C Language', type: 'Systems & Logic Programming', badge: 'C', badgeClass: 'logo-c', tab: 'education', desc: 'Strong foundation in structured programming logic, algorithmic complexities, variables pointers, custom arrays, memory structures, and data handling structures.', competency: '75%', bullets: ['Programmed basic array manipulations and memory indexing algorithms.', 'Resolved structural computer engineering logical problems.', 'Understood foundational system stack execution principles.'] },
    git: { name: 'Git & GitHub', type: 'Version Control', badge: 'Git', badgeClass: 'logo-git', tab: 'education', desc: 'Version tracking command flows, branches management, merge integrations, conflict resolutions, and remote repositories hosting via GitHub.', competency: '85%', bullets: ['Created isolated feature branches to build components safely.', 'Tracked changes commits history with semantic clean details.', 'Hosted static web assets and open source projects portfolio.'] },
    pr: { name: 'Premiere Pro', type: 'Video Editing Suite', badge: 'Pr', badgeClass: 'logo-pr', tab: 'experience', desc: 'Professional editing capabilities including multi-cam synchronization, color correction (Lumetri), audio cleanup, pace tracking, narrative building, and short form reels delivery.', competency: '90%', bullets: ['Produced high engagement social media reels for Genovia Solutions.', 'Mastered rapid audio editing sync and pacing workflows.', 'Integrated Lumetri color curves for high cinematic grade look.'] },
    ae: { name: 'After Effects', type: 'Motion Graphics & VFX', badge: 'Ae', badgeClass: 'logo-ae', tab: 'experience', desc: 'Motion visuals creation utilizing custom keyframes speed ramping, expressions scripting, camera trackers, mask tracking pathing, and vector character animations.', competency: '88%', bullets: ['Created complete faceless animations for marketing reels.', 'Built custom kinetic typography templates and neon text glows.', 'Designed advanced transitions and anime visual effects edits.'] },
    ps: { name: 'Photoshop', type: 'Raster Graphics Design', badge: 'Ps', badgeClass: 'logo-ps', tab: 'experience', desc: 'Digital composition editing, lighting adjustment filters, layered canvas systems, masking selections, content-aware fills, and high-impact custom thumbnails styling.', competency: '85%', bullets: ['Styled professional high-contrast thumbnails for social media videos.', 'Manipulated assets lighting properties to blend visuals.', 'Designed layout frames, icons, and textures for digital portfolios.'] },
    lr: { name: 'Lightroom', type: 'Color Grading & Photo Development', badge: 'Lr', badgeClass: 'logo-lr', tab: 'experience', desc: 'Advanced light balance adjustments, tone curve manipulation, color-specific HSL calibration, batch development profiles, and local lighting adjustments.', competency: '80%', bullets: ['Designed custom color grading presets for consistent visual branding.', 'Processed raw image photographs for high quality profile portfolios.', 'Optimized dynamic range exposure profiles across image outputs.'] },
    blender: { name: 'Blender 3D', type: '3D Modeling & Rendering', badge: 'Bl', badgeClass: 'logo-blender', tab: 'experience', desc: 'Basic mesh modeling structures, node-based material textures setup, light sourcing configurations, camera rigging paths, and 3D motion animations.', competency: '70%', bullets: ['Created basic low-poly 3D models and abstract designs.', 'Configured camera lighting setups in Cycles/Eevee engines.', 'Rendered basic abstract loops for background motion graphics.'] }
  };

  const highlightTimelineCards = (skillKey) => {
    const cards = document.querySelectorAll('.timeline-item, .education-card');
    let hasMatches = false;

    cards.forEach(card => {
      const cardSkills = card.getAttribute('data-skills');
      if (cardSkills) {
        const skillsArray = cardSkills.split(',');
        if (skillsArray.includes(skillKey)) {
          card.classList.remove('dimmed');
          card.classList.add('highlighted');
          hasMatches = true;
        } else {
          card.classList.remove('highlighted');
          card.classList.add('dimmed');
        }
      } else {
        card.classList.remove('highlighted');
        card.classList.add('dimmed');
      }
    });

    // If no specific card has data-skills, remove dims
    if (!hasMatches) {
      resetHighlights();
    }
  };

  const resetHighlights = () => {
    const cards = document.querySelectorAll('.timeline-item, .education-card');
    cards.forEach(card => {
      card.classList.remove('highlighted', 'dimmed');
    });
  };

  skillItems.forEach(item => {
    item.addEventListener('click', () => {
      const skillKey = item.getAttribute('data-skill');
      const details = skillDetails[skillKey];
      
      if (!details) return;

      // Toggle off if clicking already selected skill
      if (item.classList.contains('selected')) {
        item.classList.remove('selected');
        emptyMessage.classList.remove('hidden');
        inspectorContent.classList.add('hidden');
        resetHighlights();
        return;
      }

      skillItems.forEach(i => i.classList.remove('selected'));
      item.classList.add('selected');

      // 1. Highlight relevant cards in career dashboard
      highlightTimelineCards(skillKey);

      // 2. Automatically focus/switch to the dashboard tab representing this skill
      const matchingTabBtn = document.querySelector(`.sidebar-menu-btn[data-tab="${details.tab}"]`);
      if (matchingTabBtn && !matchingTabBtn.classList.contains('active')) {
        matchingTabBtn.click();
      }

      // 3. Render inspector info panel details reveal
      inspectorContent.classList.add('hidden');

      setTimeout(() => {
        const logoMap = {
          html: 'html.png',
          css: 'css-3.png',
          js: 'java-script.png',
          c: 'letter-c.png',
          git: 'github-sign.png',
          pr: 'logo-pr.png',
          ae: 'logo-ae.png',
          ps: 'logo-ps.png',
          lr: 'logo-lr.png',
          blender: 'logo-blender.png'
        };
        if (logoMap[skillKey]) {
          insBadge.innerHTML = `<img src="${logoMap[skillKey]}" alt="${details.name}" style="width: 100%; height: 100%; object-fit: cover; border-radius: inherit;">`;
        } else {
          insBadge.innerHTML = '';
          insBadge.textContent = details.badge;
        }
        insBadge.className = 'inspector-badge ' + details.badgeClass;
        insName.textContent = details.name;
        insType.textContent = details.type;
        insDesc.textContent = details.desc;
        insPct.textContent = details.competency;
        insProgress.style.width = details.competency;

        insBullets.innerHTML = '';
        details.bullets.forEach(bullet => {
          const li = document.createElement('li');
          li.textContent = bullet;
          insBullets.appendChild(li);
        });

        emptyMessage.classList.add('hidden');
        inspectorContent.classList.remove('hidden');
      }, 150);
    });
  });
}

/* ==========================================================================
   7. Custom Video Timeline Editor Player with Drag Scrubbing
   ========================================================================== */
function initVideoTimelinePlayer() {
  const clips = document.querySelectorAll('.timeline-clip.clip-video');
  const scenes = document.querySelectorAll('.scene');
  const playhead = document.getElementById('timeline-playhead');
  const trackWrapper = document.getElementById('video-track-contents');
  const btnPlay = document.getElementById('btn-play-pause');
  const btnStop = document.getElementById('btn-stop');
  const iconPlay = btnPlay.querySelector('.icon-play');
  const iconPause = btnPlay.querySelector('.icon-pause');
  
  const scrubberBar = document.getElementById('scrubber-bar');
  const scrubberFill = document.getElementById('scrubber-fill');
  const scrubberHandle = document.getElementById('scrubber-handle');
  const activeTrackLabel = document.getElementById('active-track-name');
  const timeCurrentLabel = document.getElementById('time-current');
  const overlayPlay = document.getElementById('video-overlay-play');
  
  // Cinematic components
  const playerScreen = document.getElementById('player-screen');
  const btnLetterbox = document.getElementById('btn-letterbox');
  const lutButtons = document.querySelectorAll('.lut-btn');
  const btnRenderSim = document.getElementById('btn-render-sim');
  const renderModal = document.getElementById('render-modal');

  if (!trackWrapper || !playhead) return;

  let isPlaying = false;
  let animationFrameId = null;
  let lastTimestamp = 0;
  
  let currentTime = 0; // seconds
  const totalDuration = 32; 
  const fps = 29.97;

  const formatTimecode = (seconds) => {
    const hrs = 0;
    const mins = 0;
    const secs = Math.floor(seconds);
    const frames = Math.floor((seconds - secs) * fps);
    
    const pad = (n) => String(n).padStart(2, '0');
    return `${pad(hrs)}:${pad(mins)}:${pad(secs)}:${pad(frames)}`;
  };

  const updateSceneForTime = (time) => {
    let activeScene = 'intro';
    let labelText = 'Track 1: Shrey Vora Banner Intro';
    
    if (time >= 0 && time < 8) {
      activeScene = 'intro';
      labelText = 'Track 1: Shrey Vora Banner Intro';
    } else if (time >= 8 && time < 16) {
      activeScene = 'anime';
      labelText = 'Track 2: Anime Visual edits';
    } else if (time >= 16 && time < 24) {
      activeScene = 'motion';
      labelText = 'Track 3: Faceless After Effects edits';
    } else if (time >= 24 && time <= 32) {
      activeScene = 'branding';
      labelText = 'Track 4: Genovia Client reels';
    }

    scenes.forEach(s => {
      if (s.id === `scene-${activeScene}`) {
        s.classList.add('scene-active');
      } else {
        s.classList.remove('scene-active');
      }
    });

    clips.forEach(clip => {
      if (clip.getAttribute('data-scene') === activeScene) {
        clip.classList.add('active');
      } else {
        clip.classList.remove('active');
      }
    });

    activeTrackLabel.textContent = labelText;
  };

  const updateTimelineUI = () => {
    const percentage = (currentTime / totalDuration) * 100;
    const wrapperWidth = trackWrapper.getBoundingClientRect().width;
    
    const playheadLeft = (percentage / 100) * (wrapperWidth - 20) + 10;
    playhead.style.left = `${playheadLeft}px`;

    scrubberFill.style.width = `${percentage}%`;
    scrubberHandle.style.left = `${percentage}%`;
    timeCurrentLabel.textContent = formatTimecode(currentTime);
  };

  const seekToTime = (time) => {
    currentTime = Math.max(0, Math.min(time, totalDuration));
    updateSceneForTime(currentTime);
    updateTimelineUI();
  };

  const playStep = (timestamp) => {
    if (!isPlaying) return;
    if (!lastTimestamp) lastTimestamp = timestamp;
    
    const elapsed = (timestamp - lastTimestamp) / 1000;
    lastTimestamp = timestamp;
    
    currentTime += elapsed;
    
    if (currentTime >= totalDuration) {
      currentTime = 0;
      pausePlayback();
    }
    
    seekToTime(currentTime);
    animationFrameId = requestAnimationFrame(playStep);
  };

  const startPlayback = () => {
    if (isPlaying) return;
    isPlaying = true;
    iconPlay.classList.add('hidden');
    iconPause.classList.remove('hidden');
    overlayPlay.classList.add('hidden');
    
    lastTimestamp = performance.now();
    animationFrameId = requestAnimationFrame(playStep);
  };

  const pausePlayback = () => {
    isPlaying = false;
    iconPlay.classList.remove('hidden');
    iconPause.classList.add('hidden');
    
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }
    lastTimestamp = 0;
  };

  const stopPlayback = () => {
    pausePlayback();
    seekToTime(0);
    overlayPlay.classList.remove('hidden');
  };

  btnPlay.addEventListener('click', () => {
    if (isPlaying) {
      pausePlayback();
    } else {
      startPlayback();
    }
  });

  btnStop.addEventListener('click', stopPlayback);
  overlayPlay.addEventListener('click', startPlayback);

  clips.forEach(clip => {
    clip.addEventListener('click', (e) => {
      // Prevent timeline track scrubbing handler conflict
      e.stopPropagation();
      
      const sceneType = clip.getAttribute('data-scene');
      let targetSeek = 0;
      
      if (sceneType === 'intro') targetSeek = 0;
      else if (sceneType === 'anime') targetSeek = 8.01;
      else if (sceneType === 'motion') targetSeek = 16.01;
      else if (sceneType === 'branding') targetSeek = 24.01;
      
      pausePlayback();
      seekToTime(targetSeek);
    });
  });

  // Scrubber dragging
  let isDraggingScrubber = false;
  const handleScrubberAction = (e) => {
    const rect = scrubberBar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percent = Math.max(0, Math.min(clickX / rect.width, 1));
    seekToTime(percent * totalDuration);
  };

  scrubberBar.addEventListener('mousedown', (e) => {
    isDraggingScrubber = true;
    pausePlayback();
    handleScrubberAction(e);
  });

  // Playhead dragging in timeline tracks ruler
  let isDraggingPlayhead = false;
  const trackRuler = document.getElementById('timeline-ruler');
  const tracksBody = document.getElementById('timeline-tracks-body');

  const handlePlayheadAction = (e) => {
    const rect = trackWrapper.getBoundingClientRect();
    const clickX = e.clientX - rect.left - 10;
    const width = rect.width - 20;
    const percent = Math.max(0, Math.min(clickX / width, 1));
    seekToTime(percent * totalDuration);
  };

  const startDragPlayhead = (e) => {
    isDraggingPlayhead = true;
    pausePlayback();
    handlePlayheadAction(e);
  };

  trackRuler.addEventListener('mousedown', startDragPlayhead);
  tracksBody.addEventListener('mousedown', (e) => {
    // Only scrub if clicking empty background area, not actual clips
    if (e.target.classList.contains('track-contents') || e.target.classList.contains('timeline-track') || e.target.classList.contains('timeline-tracks-body')) {
      startDragPlayhead(e);
    }
  });

  // Global mousemove listeners to manage drag releases
  window.addEventListener('mousemove', (e) => {
    if (isDraggingScrubber) {
      handleScrubberAction(e);
    }
    if (isDraggingPlayhead) {
      handlePlayheadAction(e);
    }
  });

  window.addEventListener('mouseup', () => {
    isDraggingScrubber = false;
    isDraggingPlayhead = false;
  });

  // Cinematic Letterbox Toggle
  if (btnLetterbox && playerScreen) {
    btnLetterbox.addEventListener('click', () => {
      btnLetterbox.classList.toggle('active');
      playerScreen.classList.toggle('letterbox-active');
    });
  }

  // Cinematic LUT Presets Switching
  lutButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      lutButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      const targetLut = btn.getAttribute('data-lut');
      playerScreen.setAttribute('data-lut', targetLut);
    });
  });

  // Adobe Media Encoder Render simulator progress launcher
  if (btnRenderSim && renderModal) {
    btnRenderSim.addEventListener('click', () => {
      pausePlayback();
      
      const fill = document.getElementById('render-progress-fill');
      const pctText = document.getElementById('render-pct-text');
      const consoleLog = document.getElementById('render-log-console');
      const elapsedLabel = document.getElementById('render-time-elapsed');
      
      renderModal.classList.remove('hidden');
      fill.style.width = '0%';
      pctText.textContent = '0%';
      consoleLog.innerHTML = '<div class="log-line">Status: Ready to compile.</div>';
      
      let pct = 0;
      let start = performance.now();
      
      const renderTick = () => {
        if (pct >= 100) {
          fill.style.width = '100%';
          pctText.textContent = '100%';
          consoleLog.innerHTML += '<div class="log-line log-line-success">Success: Render completed! File exported.</div>';
          
          setTimeout(() => {
            renderModal.classList.add('hidden');
            // Trigger screen flash animation and start showreel play automatically
            playerScreen.style.animation = 'none';
            playerScreen.offsetHeight; // trigger reflow
            playerScreen.style.animation = 'rotationRing 0.5s ease-out';
            seekToTime(0);
            startPlayback();
          }, 1200);
          return;
        }

        pct += Math.floor(Math.random() * 8) + 3;
        pct = Math.min(pct, 100);
        if (typeof playSynthSound === 'function') playSynthSound('pop');
        
        fill.style.width = `${pct}%`;
        pctText.textContent = `${pct}%`;

        // Update elapsed timer label
        const elapsedSecs = ((performance.now() - start) / 1000).toFixed(1);
        elapsedLabel.textContent = `00:00:${String(Math.floor(elapsedSecs)).padStart(2, '0')}:${String(Math.floor((elapsedSecs % 1) * 30)).padStart(2, '0')}`;

        // Print log steps based on thresholds
        if (pct >= 15 && !consoleLog.innerHTML.includes('Linking assets')) {
          consoleLog.innerHTML += '<div class="log-line">→ Linking local video stream assets...</div>';
        }
        if (pct >= 35 && !consoleLog.innerHTML.includes('Parsing Premiere V1')) {
          consoleLog.innerHTML += '<div class="log-line">→ Parsing V1 Track clips and cuts...</div>';
        }
        if (pct >= 55 && !consoleLog.innerHTML.includes('Applying AE color')) {
          consoleLog.innerHTML += '<div class="log-line">→ Applying After Effects color gradings and adjustment adjustment layers...</div>';
        }
        if (pct >= 75 && !consoleLog.innerHTML.includes('Baking Blender 3D')) {
          consoleLog.innerHTML += '<div class="log-line">→ Baking Blender 3D models and lighting...</div>';
        }
        if (pct >= 90 && !consoleLog.innerHTML.includes('Encoding H.264')) {
          consoleLog.innerHTML += '<div class="log-line">→ Encoding H.264 video stream wrapper...</div>';
        }
        
        consoleLog.scrollTop = consoleLog.scrollHeight;
        
        // Loop ticks
        setTimeout(renderTick, 180 + Math.random() * 150);
      };

      setTimeout(renderTick, 200);
    });
  }

  seekToTime(0);
  window.addEventListener('resize', updateTimelineUI);
}

/* ==========================================================================
   8. macOS Dock Magnification scaling
   ========================================================================== */
function initMacOSDock() {
  const dock = document.getElementById('macos-dock');
  const items = document.querySelectorAll('.dock-item');
  
  if (!dock) return;

  dock.addEventListener('mousemove', (e) => {
    const dockRect = dock.getBoundingClientRect();
    const mouseX = e.clientX;
    
    items.forEach(item => {
      const rect = item.getBoundingClientRect();
      const center = rect.left + rect.width / 2;
      
      // Calculate horizontal distance from cursor center
      const distance = Math.abs(mouseX - center);
      const maxDistance = 140; // pixel range of zoom bubble
      
      if (distance < maxDistance) {
        // Compute exponential zoom magnification scale (up to 1.55x)
        const factor = 1 - (distance / maxDistance);
        const scale = 1 + (factor * 0.55);
        
        item.style.width = `${38 * scale}px`;
        item.style.height = `${38 * scale}px`;
        item.style.transform = `translateY(-${(scale - 1) * 16}px)`;
        item.style.margin = `0 ${(scale - 1) * 4}px`;
      } else {
        resetItem(item);
      }
    });
  });

  dock.addEventListener('mouseleave', () => {
    items.forEach(resetItem);
  });

  // Connect macOS dock anchor links to Lenis scrollTo
  const dockAnchors = dock.querySelectorAll('.dock-item[href^="#"]');
  dockAnchors.forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = anchor.getAttribute('href');
      const targetSection = document.querySelector(targetId);
      if (targetSection) {
        if (lenis) {
          lenis.scrollTo(targetSection, {
            offset: -70,
            duration: 1.2
          });
        } else {
          window.scrollTo({
            top: targetSection.offsetTop - 70,
            behavior: 'smooth'
          });
        }
      }
    });
  });

  function resetItem(item) {
    item.style.width = '38px';
    item.style.height = '38px';
    item.style.transform = 'translateY(0)';
    item.style.margin = '0 0px';
  }
}

/* ==========================================================================
   9. Glassmorphic AI Recruiter Chatbot Drawer
   ========================================================================== */
function initChatbot() {
  const container = document.getElementById('chatbot-container');
  const trigger = document.getElementById('chatbot-trigger');
  const close = document.getElementById('chatbot-close');
  const drawer = document.getElementById('chatbot-drawer');
  
  const chatMessages = document.getElementById('chat-messages');
  const chatPrompts = document.getElementById('chat-prompts');
  const badge = trigger.querySelector('.chatbot-badge-alert');

  if (!container || !trigger || !drawer) return;

  // Toggle open
  trigger.addEventListener('click', () => {
    drawer.classList.remove('hidden');
    // Hide notification alert dot once read
    if (badge) badge.style.display = 'none';
  });

  // Toggle close
  close.addEventListener('click', (e) => {
    e.stopPropagation();
    drawer.classList.add('hidden');
  });

  // Answers Database
  const answers = {
    stack: 'Shrey is skilled in software coding stacks including <b>C, JavaScript, HTML5, CSS3</b>, and version control tools like <b>Git/GitHub</b>. On the design side, he is proficient in <b>Adobe After Effects, Premiere Pro, Photoshop, Lightroom</b>, and <b>Blender</b>!',
    intern: 'Shrey currently works as a <b>Video Editor Intern</b> at <b>Genovia Solutions Pvt. Ltd.</b> (Feb 2026 - Present). His work involves creating high-engagement social media reels, 2D vector animations using After Effects, and producing Premiere Pro commercial videos.',
    roles: 'Absolutely! Although he has a strong visual media editing profile, Shrey is pursuing a Bachelor of Technology in Information Technology and actively building web projects. He is highly open to <b>Software Engineering</b>, <b>Frontend Development</b>, or hybrid creative coder roles.',
    contact: 'You can contact Shrey directly via email at <a href="mailto:shreyvora2007@gmail.com" class="text-info">shreyvora2007@gmail.com</a>. You can also view his professional profile on LinkedIn at <a href="https://www.linkedin.com/in/shreyy-vora" target="_blank" class="text-info">linkedin.com/in/shreyy-vora</a>.'
  };

  const promptsWrap = document.getElementById('chat-prompts');
  
  promptsWrap.addEventListener('click', (e) => {
    const btn = e.target.closest('.chat-prompt-pill');
    if (!btn) return;
    
    const questionKey = btn.getAttribute('data-question');
    const questionText = btn.textContent;
    const responseText = answers[questionKey];

    if (!responseText) return;

    // 1. Append User Message
    const userMsg = document.createElement('div');
    userMsg.className = 'msg msg-user';
    userMsg.textContent = questionText;
    chatMessages.appendChild(userMsg);
    
    // Hide clicked pill button
    btn.style.display = 'none';
    
    // Scroll chat down
    chatMessages.scrollTop = chatMessages.scrollHeight;

    // 2. Append Blinking Bot Typing Indicator
    const typingBubble = document.createElement('div');
    typingBubble.className = 'msg msg-typing msg-bot';
    typingBubble.innerHTML = `
      <span class="typing-dot"></span>
      <span class="typing-dot"></span>
      <span class="typing-dot"></span>
    `;
    
    setTimeout(() => {
      chatMessages.appendChild(typingBubble);
      chatMessages.scrollTop = chatMessages.scrollHeight;
      
      // 3. Append Bot Response Bubble after typing delay
      setTimeout(() => {
        typingBubble.remove();
        
        const botMsg = document.createElement('div');
        botMsg.className = 'msg msg-bot';
        botMsg.innerHTML = `<p>${responseText}</p>`;
        chatMessages.appendChild(botMsg);
        if (typeof playSynthSound === 'function') playSynthSound('chime');
        
        chatMessages.scrollTop = chatMessages.scrollHeight;
      }, 1000);

    }, 300);
  });
}

/* ==========================================================================
   10. Navigation scrolls & scrollspy header class selectors
   ========================================================================== */
function initNavigation() {
  const toggle = document.querySelector('.mobile-nav-toggle');
  const linksWrap = document.querySelector('.nav-links');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section');
  const header = document.querySelector('.glass-nav');
  let lastActiveSectionId = '';

  if (toggle && linksWrap) {
    toggle.addEventListener('click', () => {
      linksWrap.classList.toggle('mobile-active');
      toggle.classList.toggle('open');
    });
  }

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href');
      const targetSection = document.querySelector(targetId);
      if (targetSection) {
        if (lenis) {
          lenis.scrollTo(targetSection, {
            offset: -70,
            duration: 1.2
          });
        } else {
          window.scrollTo({
            top: targetSection.offsetTop - 70,
            behavior: 'smooth'
          });
        }
      }
      if (linksWrap) linksWrap.classList.remove('mobile-active');
      if (toggle) toggle.classList.remove('open');
    });
  });

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('nav-scrolled');
    } else {
      header.classList.remove('nav-scrolled');
    }

    let currentSectionId = '';
    const scrollPos = window.scrollY + 220;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      
      if (scrollPos >= top && scrollPos < top + height) {
        currentSectionId = section.getAttribute('id');
      }
    });

    if (currentSectionId && currentSectionId !== lastActiveSectionId) {


      lastActiveSectionId = currentSectionId;

      navLinks.forEach(link => {
        if (link.getAttribute('href') === `#${currentSectionId}`) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });
    }
  });
}

/* ==========================================================================
   11. Email Copier Tooltips & Message Forms
   ========================================================================== */
function initContactForm() {
  const btnCopy = document.getElementById('btn-copy-email');
  const emailVal = document.getElementById('email-value');
  const tooltip = btnCopy ? btnCopy.querySelector('.copy-tooltip') : null;
  const form = document.getElementById('contact-form');

  if (btnCopy && emailVal && tooltip) {
    btnCopy.addEventListener('click', () => {
      const textToCopy = emailVal.textContent;
      navigator.clipboard.writeText(textToCopy).then(() => {
        tooltip.textContent = 'Copied!';
        setTimeout(() => {
          tooltip.textContent = 'Copy';
        }, 2000);
      }).catch(err => {
        console.error('Failed to copy email:', err);
      });
    });
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = form.querySelector('.form-submit-btn');
      
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
          <span>Sending Message...</span>
          <svg class="spinner" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line></svg>
        `;
        
        setTimeout(() => {
          form.reset();
          submitBtn.disabled = false;
          submitBtn.innerHTML = `
            <span>Message Sent!</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
          `;
          
          setTimeout(() => {
            submitBtn.innerHTML = `
              <span>Send Message</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
            `;
          }, 3000);
        }, 1500);
      }
    });
  }
}

/* ==========================================================================
   12. Advanced Upgrades: Web Audio Foley, CRT toggles, & Bezier Keyframe graphs
   ========================================================================== */
let audioCtx = null;
let isAudioMuted = false;

// Global Web Audio synth sound generator
playSynthSound = function(type) {
  if (isAudioMuted) return;
  try {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    const now = audioCtx.currentTime;

    if (type === 'click') {
      // Mechanical typewriter tick
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.exponentialRampToValueAtTime(10, now + 0.04);
      
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.005, now + 0.04);
      
      osc.start(now);
      osc.stop(now + 0.04);
    } else if (type === 'pop') {
      // Glitch render status pop
      osc.type = 'sine';
      osc.frequency.setValueAtTime(90, now);
      osc.frequency.linearRampToValueAtTime(320, now + 0.07);
      
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.005, now + 0.07);
      
      osc.start(now);
      osc.stop(now + 0.07);
    } else if (type === 'pluck') {
      // Settings switch pluck
      osc.type = 'sine';
      osc.frequency.setValueAtTime(580, now);
      osc.frequency.exponentialRampToValueAtTime(260, now + 0.1);
      
      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.002, now + 0.1);
      
      osc.start(now);
      osc.stop(now + 0.1);
    } else if (type === 'glitch') {
      // VHS static noise burst (Web Audio noise buffer)
      const bufferSize = audioCtx.sampleRate * 0.22;
      const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      
      const noiseNode = audioCtx.createBufferSource();
      noiseNode.buffer = buffer;
      
      const filter = audioCtx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(500, now);
      filter.frequency.exponentialRampToValueAtTime(120, now + 0.22);
      
      const noiseGain = audioCtx.createGain();
      noiseGain.gain.setValueAtTime(0.25, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.002, now + 0.22);
      
      noiseNode.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(audioCtx.destination);
      
      noiseNode.start(now);
      noiseNode.stop(now + 0.22);
    } else if (type === 'chime') {
      // Dual plucks chime chord C5-E5
      const osc2 = audioCtx.createOscillator();
      const gain2 = audioCtx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, now); // C5
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.002, now + 0.12);
      
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(659.25, now + 0.04); // E5
      gain2.gain.setValueAtTime(0.06, now + 0.04);
      gain2.gain.exponentialRampToValueAtTime(0.002, now + 0.16);
      
      osc2.connect(gain2);
      gain2.connect(audioCtx.destination);
      
      osc.start(now);
      osc.stop(now + 0.12);
      osc2.start(now + 0.04);
      osc2.stop(now + 0.16);
    }
  } catch (err) {
    console.warn("Web Audio Context not permitted:", err);
  }
};

function initAdvancedUpgrades() {
  // 1. CRT Monitor filter click handler
  const btnCrt = document.getElementById('dock-btn-crt');
  if (btnCrt) {
    btnCrt.addEventListener('click', () => {
      document.body.classList.toggle('crt-active');
      btnCrt.classList.toggle('active');
      playSynthSound('pluck');
    });
  }

  // 2. Foley Audio Mute settings
  const btnAudio = document.getElementById('dock-btn-audio');
  if (btnAudio) {
    btnAudio.addEventListener('click', () => {
      isAudioMuted = !isAudioMuted;
      btnAudio.classList.toggle('muted', isAudioMuted);
      if (!isAudioMuted) {
        // Trigger soft foley cue when unmuted
        playSynthSound('pluck');
      }
    });
  }

  // 3. Document global clicks intercept for audio feedback
  document.addEventListener('click', (e) => {
    const target = e.target.closest('a, button, .skill-item-interactive, .theme-btn, .lut-btn');
    if (target) {
      if (target.id === 'dock-btn-audio' || target.id === 'dock-btn-crt') return;
      
      if (target.classList.contains('dock-item')) {
        playSynthSound('pluck');
      } else {
        playSynthSound('click');
      }
    }
  });

  // 4. Bezier keyframe curve graph workspaces
  initKeyframeEditor();

  // 5. Premium aesthetic and transition setups
  initCustomCursor();
  initMagneticHover();
  initAmbientParticles();
}

function initKeyframeEditor() {
  const svg = document.getElementById('curve-svg');
  const path = document.getElementById('curve-path');
  const node1 = document.getElementById('handle-node-1');
  const node2 = document.getElementById('handle-node-2');
  const line1 = document.getElementById('handle-line-1');
  const line2 = document.getElementById('handle-line-2');
  const codeText = document.getElementById('bezier-val-text');
  const btnPlay = document.getElementById('btn-play-curve');
  const previewBall = document.getElementById('preview-ball');

  if (!svg || !path || !node1 || !node2 || !line1 || !line2 || !codeText) return;

  let activeNode = null;

  // Handle default coordinates in scale of 200
  let p1 = { x: 50, y: 200 }; // ease-in-out defaults
  let p2 = { x: 150, y: 0 };

  const updateCurve = () => {
    // Redraw SVG path curve
    path.setAttribute('d', `M 0 200 C ${p1.x} ${p1.y}, ${p2.x} ${p2.y}, 200 0`);
    
    // Update vector handle helper lines
    line1.setAttribute('x2', p1.x);
    line1.setAttribute('y2', p1.y);
    line2.setAttribute('x2', p2.x);
    line2.setAttribute('y2', p2.y);
    
    // Reposition handle anchors
    node1.setAttribute('cx', p1.x);
    node1.setAttribute('cy', p1.y);
    node2.setAttribute('cx', p2.x);
    node2.setAttribute('cy', p2.y);
    
    // Calculate CSS cubic-bezier parameters
    const x1 = (p1.x / 200).toFixed(2);
    const y1 = (1 - p1.y / 200).toFixed(2);
    const x2 = (p2.x / 200).toFixed(2);
    const y2 = (1 - p2.y / 200).toFixed(2);
    
    codeText.textContent = `cubic-bezier(${x1}, ${y1}, ${x2}, ${y2})`;
  };

  const getRelativeMouse = (e) => {
    const rect = svg.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 200;
    const y = ((e.clientY - rect.top) / rect.height) * 200;
    return {
      x: Math.max(0, Math.min(200, x)),
      y: Math.max(0, Math.min(200, y))
    };
  };

  node1.addEventListener('mousedown', (e) => {
    e.preventDefault();
    activeNode = 1;
    playSynthSound('click');
  });

  node2.addEventListener('mousedown', (e) => {
    e.preventDefault();
    activeNode = 2;
    playSynthSound('click');
  });

  window.addEventListener('mousemove', (e) => {
    if (!activeNode) return;
    const coords = getRelativeMouse(e);
    if (activeNode === 1) {
      p1 = coords;
    } else if (activeNode === 2) {
      p2 = coords;
    }
    updateCurve();
  });

  window.addEventListener('mouseup', () => {
    if (activeNode) {
      activeNode = null;
      playSynthSound('click');
    }
  });

  // Load presets curves clicks
  const presets = document.querySelectorAll('.curve-presets button');
  presets.forEach(btn => {
    btn.addEventListener('click', () => {
      presets.forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      
      const preset = btn.getAttribute('data-preset');
      if (preset === 'ease-in-out') {
        p1 = { x: 50, y: 200 };
        p2 = { x: 150, y: 0 };
      } else if (preset === 'ease-in') {
        p1 = { x: 84, y: 200 };
        p2 = { x: 200, y: 200 };
      } else if (preset === 'ease-out') {
        p1 = { x: 0, y: 0 };
        p2 = { x: 116, y: 0 };
      } else if (preset === 'linear') {
        p1 = { x: 50, y: 150 };
        p2 = { x: 150, y: 50 };
      }
      updateCurve();
      playSynthSound('pluck');
    });
  });

  // Play easing timing preview animation loop
  if (btnPlay && previewBall) {
    btnPlay.addEventListener('click', () => {
      const x1 = (p1.x / 200).toFixed(2);
      const y1 = (1 - p1.y / 200).toFixed(2);
      const x2 = (p2.x / 200).toFixed(2);
      const y2 = (1 - p2.y / 200).toFixed(2);
      
      // Reset position
      previewBall.style.transition = 'none';
      previewBall.style.bottom = '20px';
      
      previewBall.offsetHeight; // trigger reflow
      
      // Execute easing timing transition curve
      previewBall.style.transition = `bottom 1.3s cubic-bezier(${x1}, ${y1}, ${x2}, ${y2})`;
      previewBall.style.bottom = 'calc(100% - 44px)';
      playSynthSound('pop');
      
      setTimeout(() => {
        previewBall.style.transition = 'none';
        previewBall.style.bottom = '20px';
      }, 1400);
    });
  }

  updateCurve();
}

/* ==========================================================================
   13. Premium Aesthetic Features: Custom Cursor, Hover Magnetics & Particles
   ========================================================================== */
function initCustomCursor() {
  const dot = document.getElementById('custom-cursor-dot');
  const ring = document.getElementById('custom-cursor-ring');
  
  if (!dot || !ring) return;

  let mouseX = 0;
  let mouseY = 0;
  let ringX = 0;
  let ringY = 0;
  let lastMouseX = 0;
  let lastMouseY = 0;
  let isHovering = false;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  const renderCursor = () => {
    // Position dot inside frame tick
    dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;

    // Lerp ring coordinates for smooth trail
    ringX += (mouseX - ringX) * 0.22;
    ringY += (mouseY - ringY) * 0.22;

    // Calculate mouse speed to stretch ring elastically
    const dx = mouseX - lastMouseX;
    const dy = mouseY - lastMouseY;
    const speed = Math.sqrt(dx * dx + dy * dy);
    
    lastMouseX = mouseX;
    lastMouseY = mouseY;

    const stretch = Math.min(speed * 0.04, 0.35);
    const angle = Math.atan2(dy, dx);

    // Apply elastic scale and rotation when moving
    if (isHovering) {
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%) scale(1.1)`;
    } else {
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%) rotate(${angle}rad) scale3d(${1 + stretch}, ${1 - stretch * 0.35}, 1)`;
    }

    requestAnimationFrame(renderCursor);
  };

  requestAnimationFrame(renderCursor);

  // Mouse hover listeners on active click items
  const updateHoverElements = () => {
    const clickables = document.querySelectorAll('a, button, .skill-item-interactive, .theme-btn, .lut-btn');
    clickables.forEach(el => {
      if (el.dataset.cursorBound) return;
      el.dataset.cursorBound = 'true';

      el.addEventListener('mouseenter', () => {
        isHovering = true;
        ring.classList.add('cursor-hover');
        dot.classList.add('cursor-hover');
      });

      el.addEventListener('mouseleave', () => {
        isHovering = false;
        ring.classList.remove('cursor-hover');
        dot.classList.remove('cursor-hover');
      });
    });
  };

  updateHoverElements();
  
  // Re-run hover binds when DOM tabs/timeline redraw nodes dynamically
  document.addEventListener('click', () => {
    setTimeout(updateHoverElements, 300);
  });
}

function initMagneticHover() {
  // Add magnetism to select premium elements
  const magneticElements = document.querySelectorAll('.dock-item, .theme-btn, .sidebar-menu-btn');
  
  magneticElements.forEach(el => {

    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const elX = rect.left + rect.width / 2;
      const elY = rect.top + rect.height / 2;
      
      const dx = e.clientX - elX;
      const dy = e.clientY - elY;
      
      // Pull element gently elastically (max offset 15px)
      const pullX = dx * 0.35;
      const pullY = dy * 0.35;
      
      el.style.transform = `translate3d(${pullX}px, ${pullY}px, 0) scale(1.05)`;
    });

    el.addEventListener('mouseleave', () => {
      el.style.transform = '';
    });
  });
}

function initAmbientParticles() {
  const canvas = document.getElementById('ambient-particles');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let particles = [];
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  // Spawn 65 ambient particles
  const particleCount = 65;
  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 1.5 + 0.5,
      baseVx: (Math.random() - 0.5) * 0.2,
      baseVy: -Math.random() * 0.3 - 0.1,
      vx: 0,
      vy: 0,
      alpha: Math.random() * 0.5 + 0.15
    });
  }

  particles.forEach(p => {
    p.vx = p.baseVx;
    p.vy = p.baseVy;
  });

  // Scroll physics - accelerate particles up/down matching scroll speed
  let lastScrollY = window.scrollY;

  const handleScrollInertia = () => {
    const currentScrollY = window.scrollY;
    const delta = currentScrollY - lastScrollY;
    lastScrollY = currentScrollY;

    // Apply scroll push
    particles.forEach(p => {
      p.vy += delta * 0.015;
    });

  };

  window.addEventListener('scroll', handleScrollInertia);
  if (typeof lenis !== 'undefined' && lenis) {
    lenis.on('scroll', handleScrollInertia);
  }

  // Mouse wind repelling force coordinate
  let mouseX = -1000;
  let mouseY = -1000;
  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  const animate = () => {
    ctx.clearRect(0, 0, width, height);

    particles.forEach(p => {
      // Pull velocity back to base slow velocity elastically
      p.vx += (p.baseVx - p.vx) * 0.08;
      p.vy += (p.baseVy - p.vy) * 0.08;

      // Mouse repelling wave field
      const dx = p.x - mouseX;
      const dy = p.y - mouseY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      if (dist < 100) {
        const force = (100 - dist) / 100;
        p.vx += (dx / dist) * force * 0.5;
        p.vy += (dy / dist) * force * 0.5;
      }

      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) {
        p.y = height;
        p.x = Math.random() * width;
      }
      if (p.y > height) {
        p.y = 0;
        p.x = Math.random() * width;
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0, 240, 255, ${p.alpha})`;
      ctx.fill();
    });

    requestAnimationFrame(animate);
  };

  animate();
}




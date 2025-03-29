window.onload = function() {
    document.body.classList.remove('is-preload');

    // Mapping of link IDs to slider and track IDs
    const sliderMap = {
        'twitter-link': { slider: 'slider', track: 'image-track' },
        'about-link': { slider: 'about-slider', track: 'about-image-track' },
        'experience-link': { slider: 'experience-slider', track: 'experience-image-track' },
        'threeD-link': { slider: 'threeD-slider', track: 'threeD-image-track' },
        'achievement-link': { slider: 'achievement-slider', track: 'achievement-image-track' }
    };

    let activeTrack = null;

    // Function to open a specific slider
    function openSlider(sliderId, trackId) {
        document.querySelectorAll('.image-slider').forEach(slider => slider.classList.remove('active'));
        const sliderElement = document.getElementById(sliderId);
        sliderElement.classList.add('active');
        activeTrack = document.getElementById(trackId);
        document.body.classList.add('slider-active');
    }

    // Add event listeners to navigation links
    Object.keys(sliderMap).forEach(linkId => {
        document.getElementById(linkId).addEventListener('click', function(event) {
            event.preventDefault();
            const { slider, track } = sliderMap[linkId];
            openSlider(slider, track);
        });
    });

    // Add event listeners to close buttons (click for desktop)
    document.querySelectorAll('.image-slider button').forEach(button => {
        button.addEventListener('click', function() {
            this.parentElement.classList.remove('active');
            document.body.classList.remove('slider-active');
            activeTrack = null;
        });
    });

    // Add touchend listeners to close buttons (touch for mobile)
    document.querySelectorAll('.image-slider button').forEach(button => {
        button.addEventListener('touchend', function(e) {
            e.preventDefault();
            this.parentElement.classList.remove('active');
            document.body.classList.remove('slider-active');
            activeTrack = null;
        });
    });

    // Toggle card descriptions on touch for mobile
    document.querySelectorAll('.card__article').forEach(card => {
        card.addEventListener('touchstart', function(e) {
            e.preventDefault();
            const data = this.querySelector('.card__data');
            if (data.classList.contains('visible')) {
                data.classList.remove('visible');
                data.style.animation = 'hide-data 0.3s forwards';
            } else {
                data.classList.add('visible');
                data.style.animation = 'show-data 0.3s forwards';
            }
        });
    });

    // Dragging functionality
    function startDrag(e) {
        if (activeTrack === null) return;
        if (e.target.closest('.image-slider button')) return;
        let clientX;
        if (e.type === 'touchstart') {
            clientX = e.touches[0].clientX;
        } else {
            clientX = e.clientX;
        }
        activeTrack.dataset.mouseDownAt = clientX;
        e.preventDefault();
    }

    function moveDrag(e) {
        if (activeTrack === null) return;
        if (activeTrack.dataset.mouseDownAt === "0") return;

        let clientX;
        if (e.type === 'touchmove') {
            clientX = e.touches[0].clientX;
        } else {
            clientX = e.clientX;
        }

        const mouseDelta = parseFloat(activeTrack.dataset.mouseDownAt) - clientX;
        const maxDelta = window.innerWidth;
        const percentage = (mouseDelta / maxDelta) * -100;
        let nextPercentage = parseFloat(activeTrack.dataset.prevPercentage) + percentage;

        nextPercentage = Math.max(Math.min(nextPercentage, 0), -100);
        activeTrack.dataset.percentage = nextPercentage;

        activeTrack.style.transform = `translate(${nextPercentage}%, -50%)`;
        e.preventDefault();
    }

    function endDrag(e) {
        if (activeTrack === null) return;
        activeTrack.dataset.mouseDownAt = "0";
        activeTrack.dataset.prevPercentage = activeTrack.dataset.percentage || 0;
        e.preventDefault();
    }

    // Attach event listeners for both mouse and touch events
    window.addEventListener('mousedown', startDrag);
    window.addEventListener('touchstart', startDrag, { passive: false });
    window.addEventListener('mousemove', moveDrag);
    window.addEventListener('touchmove', moveDrag, { passive: false });
    window.addEventListener('mouseup', endDrag);
    window.addEventListener('touchend', endDrag, { passive: false });

    // Allow links to work on mobile by stopping propagation
    document.querySelectorAll('.card__data .icon').forEach(link => {
        link.addEventListener('touchstart', function(e) {
            e.stopPropagation();
        }, { passive: false });
        link.addEventListener('touchend', function(e) {
            e.stopPropagation();
        }, { passive: false });
    });
};

document.addEventListener('DOMContentLoaded', function() {
    const galleryElement = document.querySelector('#gallery');
    const items = [];
    
    // Pre-populate items array
    galleryElement.querySelectorAll('a').forEach(element => {
        const isVideo = element.classList.contains('video-link');
        
        if (isVideo) {
            items.push({
                html: `<div class="pswp-video-wrapper">
                        <video 
                            src="${element.href}"
                            controls
                            playsinline
                            preload="metadata">
                        </video>
                      </div>`,
                width: parseInt(element.dataset.pswpWidth),
                height: parseInt(element.dataset.pswpHeight)
            });
        } else {
            items.push({
                src: element.href,
                width: parseInt(element.dataset.pswpWidth),
                height: parseInt(element.dataset.pswpHeight)
            });
        }
    });

    const lightbox = new PhotoSwipeLightbox({
        pswpModule: PhotoSwipe,
        bgOpacity: 0.9,
        dataSource: items
    });

    // Add event handlers
    lightbox.on('uiRegister', function() {
        lightbox.pswp.on('openComplete', () => {
            const video = document.querySelector('.pswp-video-wrapper video');
            if (video) {
                video.play().catch(e => console.log('Autoplay prevented:', e));
            }
        });
        
        lightbox.pswp.on('close', () => {
            const video = document.querySelector('.pswp-video-wrapper video');
            if (video) {
                video.pause();
            }
        });

        lightbox.pswp.on('beforeChange', () => {
            const video = document.querySelector('.pswp-video-wrapper video');
            if (video) {
                video.pause();
            }
        });
    });

    lightbox.init();

    // Handle thumbnail clicks
    galleryElement.querySelectorAll('a').forEach((element, index) => {
        element.addEventListener('click', (e) => {
            e.preventDefault();
            lightbox.loadAndOpen(index);
        });
    });
});

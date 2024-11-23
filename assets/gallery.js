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
                height: parseInt(element.dataset.pswpHeight),
                isVideo: true
            });
        } else {
            items.push({
                src: element.href,
                width: parseInt(element.dataset.pswpWidth),
                height: parseInt(element.dataset.pswpHeight),
                isVideo: false
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
        let currentVideo = null;

        lightbox.pswp.on('openComplete', () => {
            if (items[lightbox.pswp.currIndex].isVideo) {
                currentVideo = lightbox.pswp.container.querySelector('.pswp-video-wrapper video');
                if (currentVideo) {
                    currentVideo.play().catch(e => console.log('Autoplay prevented:', e));
                }
            }
        });
        
        lightbox.pswp.on('close', () => {
            if (currentVideo) {
                currentVideo.pause();
                currentVideo = null;
            }
        });

        lightbox.pswp.on('beforeChange', () => {
            if (currentVideo) {
                currentVideo.pause();
                currentVideo = null;
            }
        });

        lightbox.pswp.on('change', () => {
            // Find any playing videos and stop them
            const videos = lightbox.pswp.container.querySelectorAll('.pswp-video-wrapper video');
            videos.forEach(video => {
                video.pause();
            });
            
            // Update current video reference
            if (items[lightbox.pswp.currIndex].isVideo) {
                currentVideo = lightbox.pswp.container.querySelector('.pswp-video-wrapper video');
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
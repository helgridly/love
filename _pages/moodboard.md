---
layout: gallery
title: moodboard
permalink: /moodboard/
photoswipe: true
---


<div class="pswp-gallery" id="gallery">
    <a 
        href="{{site.baseurl}}/images/fooddrive.mp4"
        class="video-link"
        data-pswp-width="1200"
        data-pswp-height="800">
        <img src="{{site.baseurl}}/images/london-satellite.jpg" alt="Sample video" />
    </a>
    <a 
        href="https://picsum.photos/1200/800"
        data-pswp-width="1200"
        data-pswp-height="800">
        <img src="https://picsum.photos/200/200" alt="Sample image" />
    </a>
</div>

<script>
document.addEventListener('DOMContentLoaded', function() {
    // Create a separate lightbox instance for the video
    const videoLightbox = new PhotoSwipeLightbox({
        pswpModule: PhotoSwipe,
        bgOpacity: 0.9,
        
        // Use a custom data source for the video
        dataSource: [
            {
                html: `<div class="pswp-video-wrapper">
                        <video 
                            src="{{site.baseurl}}/images/fooddrive.mp4"
                            controls
                            playsinline
                            preload="metadata">
                        </video>
                      </div>`,
                width: 1200,
                height: 800
            }
        ]
    });

    // Add event handlers for the video lightbox
    videoLightbox.on('uiRegister', function() {
        videoLightbox.pswp.on('openComplete', () => {
            const video = document.querySelector('.pswp-video-wrapper video');
            console.log('Video element after open:', video);
            if (video) {
                video.play().catch(e => console.log('Autoplay prevented:', e));
            }
        });
        
        videoLightbox.pswp.on('close', () => {
            const video = document.querySelector('.pswp-video-wrapper video');
            if (video) {
                video.pause();
            }
        });
    });

    // Initialize video lightbox
    videoLightbox.init();

    // Handle video link click
    document.querySelector('.video-link').addEventListener('click', (e) => {
        e.preventDefault();
        videoLightbox.loadAndOpen(0);
    });

    // Create a separate lightbox for regular images
    const imageLightbox = new PhotoSwipeLightbox({
        gallery: '#gallery',
        children: 'a:not(.video-link)',
        pswpModule: PhotoSwipe
    });

    imageLightbox.init();
});
</script>


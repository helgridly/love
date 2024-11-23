---
layout: gallery
title: moodboard
permalink: /moodboard/
# photoswipe: true
glightbox: true
---

<script type="text/javascript">
var lightboxVideo = GLightbox({
                selector: '.glightbox3'
            });
            lightboxVideo.on('slide_changed', ({ prev, current }) => {
                console.log('Prev slide', prev);
                console.log('Current slide', current);

                const { slideIndex, slideNode, slideConfig, player } = current;

                if (player) {
                    if (!player.ready) {
                        // If player is not ready
                        player.on('ready', (event) => {
                            // Do something when video is ready
                        });
                    }

                    player.on('play', (event) => {
                        console.log('Started play');
                    });

                    player.on('volumechange', (event) => {
                        console.log('Volume change');
                    });

                    player.on('ended', (event) => {
                        console.log('Video ended');
                    });
                }
            });
</script>

<a href="{{site.baseurl}}/images/london-satellite.jpg" class="glightbox3" data-gallery="gallery1">
  <img src="{{site.baseurl}}/images/london-satellite.jpg" alt="image" />
</a>
<a href="{{site.baseurl}}/images/img_7863_1.mp4" class="glightbox3" data-gallery="gallery1">
  <img src="{{site.baseurl}}/images/london-satellite.jpg" alt="image" />
</a>

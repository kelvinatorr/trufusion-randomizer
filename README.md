# trufusion-randomizer
A Progressive Web App for viewing and randomizing [Trufusion's class schedule](https://trufusion.com/schedule/). 
It pulls live data from their MindBody server using a NodeJS+Express backend, and displays it using AngularJS and Angular Material. The service worker keeps everything fast and allows offline viewing of cached schedules.

Hosted for free by [NOW](https://zeit.co/now)

https://trufusion-randomizer-poveocmtjy.now.sh

It is called a randomizer because I initially made it as a toy app to randomly pick a yoga class when I have an entire day free and I am 
bored. But I use it primarily to view the schedule now. Thanks to the service worker and a cache first strategy using [idb](https://github.com/jakearchibald/idb), 
it is a lot faster than the official TF website.

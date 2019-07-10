import {TimelineMax} from 'gsap'

let tl = new TimelineMax();
tl
    .fromTo('.header', 2.5, {y:-200,opacity: 0}, {y: 0, opacity: 1})



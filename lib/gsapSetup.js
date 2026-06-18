import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CustomEase } from "gsap/CustomEase";

gsap.registerPlugin(ScrollTrigger, CustomEase);

CustomEase.create("signature", "M0,0 C0.16,1 0.3,1 1,1");
CustomEase.create("cinematic", "M0,0 C0.22,1 0.36,1 1,1");
CustomEase.create("snap", "M0,0 C0.34,1.56 0.64,1 1,1");
CustomEase.create("settle", "M0,0 C0.32,0.72 0,1 1,1");

ScrollTrigger.config({ ignoreMobileResize: true });
export { gsap, ScrollTrigger };

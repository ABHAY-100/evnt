import AOS from 'aos';
import 'aos/dist/aos.css';

export const initAOS = () => {
  AOS.init({
    duration: 800,
    once: true,
    // Add any other global AOS configurations here
  });
};

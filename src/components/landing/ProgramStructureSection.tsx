
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { useIsMobile } from "@/hooks/use-mobile";

const ProgramStructureSection = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const rocketRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    // Register GSAP plugins
    gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);
    gsap.defaults({
      ease: "none"
    });

    // Create stars dynamically
    const starsContainer = document.querySelector('.stars');
    if (starsContainer) {
      const starsCount = isMobile ? 50 : 200;
      for (let i = 0; i < starsCount; i++) {
        const star = document.createElement('div');
        star.classList.add('star');
        const size = Math.random() * 2 + 1;
        star.style.width = size + 'px';
        star.style.height = size + 'px';
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        star.style.animationDelay = Math.random() * 4 + 's';
        starsContainer.appendChild(star);
      }
    }

    // Create comets
    const sectionContainer = document.querySelector('.program-structure-section');
    if (sectionContainer && !isMobile) {
      for (let i = 0; i < 2; i++) {
        const comet = document.createElement('div');
        comet.classList.add('comet');
        comet.style.animationDelay = `${i * 20}s`;
        comet.style.top = `${20 + i * 40}%`;
        sectionContainer.appendChild(comet);
      }
    }

    // Set rocket initial position
    if (rocketRef.current) {
      const rocketSize = isMobile ? 80 : 150;
      gsap.set(rocketRef.current, {
        x: 70 - rocketSize / 2,
        y: 100 - rocketSize / 2,
        width: rocketSize,
        height: rocketSize,
        autoAlpha: 1
      });
    }

    // Animation for milestone circles, text, and month labels
    const pulses = gsap.timeline({
      defaults: {
        duration: 0.05,
        autoAlpha: 1,
        scale: isMobile ? 1.5 : 2.0,
        transformOrigin: 'center',
        ease: "elastic(1.5, 1)"
      }
    }).to(".ball01, .text01, .m-text1, .month1", {}, 0.08).to(".ball02, .text02, .m-text2, .month2", {}, 0.16).to(".ball03, .text03, .m-text3, .month3", {}, 0.24).to(".ball04, .text04, .m-text4, .month4", {}, 0.32).to(".ball05, .text05, .m-text5, .month5", {}, 0.40).to(".ball06, .text06, .m-text6, .month6", {}, 0.48).to(".ball07, .text07, .m-text7, .month7", {}, 0.56).to(".ball08, .text08, .m-text8, .month8", {}, 0.64).to(".ball09, .text09, .m-text9, .month9", {}, 0.72).to(".ball10, .text10, .m-text10, .month10", {}, 0.80).to(".ball11, .text11, .m-text11, .month11", {}, 0.88).to(".ball12, .text12, .m-text12, .month12", {}, 0.96);

    // Main timeline with scroll trigger
    const main = gsap.timeline({
      defaults: {
        duration: 1
      },
      scrollTrigger: {
        trigger: svgRef.current,
        scrub: 1.5,
        start: "top 80%",
        end: "bottom 20%",
        markers: false,
        onUpdate: function (self) {
          const progress = self.progress;
          gsap.set(".theLine", {
            strokeDashoffset: 3500 * (1 - progress)
          });

          const sectionElement = document.querySelector('.program-structure-section');
          if (sectionElement) {
            if (progress >= 0.95) {
              sectionElement.setAttribute('data-bg', 'deep-blue');
            } else if (progress >= 0.7) {
              sectionElement.setAttribute('data-bg', 'medium-blue');
            } else if (progress >= 0.4) {
              sectionElement.setAttribute('data-bg', 'light-blue');
            } else {
              sectionElement.setAttribute('data-bg', 'default');
            }
          }
        }
      }
    });

    // Rocket movement timeline
    const rocketTL = gsap.timeline();
    gsap.to(rocketRef.current, {
      filter: "drop-shadow(0 0 25px rgba(0, 174, 255, 1))",
      duration: 1,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });
    
    rocketTL.to(rocketRef.current, {
      motionPath: {
        path: ".theLine",
        align: ".theLine",
        alignOrigin: [0.5, 0.5],
        autoRotate: true
      },
      duration: 1,
      onUpdate: function () {
        if (rocketRef.current) {
          const containerRotation = rocketRef.current._gsap?.rotation || 0;
          const horizontalComponent = Math.sin(containerRotation * Math.PI / 180) * 90;
          const rocketImg = rocketRef.current.querySelector('.rocket') as HTMLElement;
          if (rocketImg) {
            gsap.set(rocketImg, {
              rotation: 180 + horizontalComponent
            });
          }
        }
      }
    });

    main.add(rocketTL, 0);
    main.add(pulses, 0);

    // Animate planets only on desktop
    if (!isMobile) {
      gsap.to(".planet-1", { rotation: 360, duration: 80, repeat: -1, ease: "linear" });
      gsap.to(".planet-2", { rotation: 360, duration: 120, repeat: -1, ease: "linear" });
      gsap.to(".planet-3", { rotation: 360, duration: 60, repeat: -1, ease: "linear" });
      gsap.to(".planet-4", { rotation: 360, duration: 100, repeat: -1, ease: "linear" });
      gsap.to(".planet-5", { rotation: 360, duration: 90, repeat: -1, ease: "linear" });
    }

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
      gsap.killTweensOf("*");
    };
  }, [isMobile]);

  return (
    <section 
      className="program-structure-section relative overflow-hidden" 
      style={{
        background: "#000010",
        minHeight: isMobile ? "150vh" : "200vh",
        paddingTop: "2rem",
        paddingBottom: isMobile ? "2rem" : "10rem"
      }} 
      data-bg="default"
    >
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-8 md:mb-16">
          <h6 className="text-xs md:text-sm font-semibold uppercase tracking-wider text-brand-purple mb-2 md:mb-3 text-white">
            Program Structure
          </h6>
          <h2 className="text-2xl md:text-4xl font-bold mb-4 md:mb-6 text-white">
            Our 6-Month Journey to Success
          </h2>
          <p className="text-sm md:text-lg text-white/70 px-4">
            Follow your journey from beginner to professional with our comprehensive 6-month program.
          </p>
        </div>
      </div>

      {/* Stars background */}
      <div className="stars fixed top-0 left-0 w-full h-full z-0 pointer-events-none"></div>
      
      {/* Planets - hidden on mobile */}
      {!isMobile && (
        <>
          <div className="planet planet-1 absolute w-16 md:w-20 h-16 md:h-20 rounded-full top-[15%] right-[10%] z-0" style={{
            background: "radial-gradient(circle at 30% 30%, #ff9966, #ff5e62)",
            boxShadow: "0 0 30px rgba(255, 94, 98, 0.6)"
          }}></div>
          
          <div className="planet planet-2 absolute w-20 md:w-28 h-20 md:h-28 rounded-full bottom-[15%] left-[5%] z-0" style={{
            background: "radial-gradient(circle at 40% 40%, #5433ff, #20bdff)",
            boxShadow: "0 0 40px rgba(32, 189, 255, 0.5)"
          }}></div>
          
          <div className="planet planet-3 absolute w-12 md:w-16 h-12 md:h-16 rounded-full top-[40%] left-[8%] z-0" style={{
            background: "radial-gradient(circle at 30% 30%, #a17fe0, #5d26c1)",
            boxShadow: "0 0 25px rgba(161, 127, 224, 0.6)"
          }}></div>
          
          <div className="planet planet-4 absolute w-18 md:w-24 h-18 md:h-24 rounded-full top-[60%] right-[8%] z-0" style={{
            background: "radial-gradient(circle at 70% 30%, #76b852, #8DC26F)",
            boxShadow: "0 0 35px rgba(118, 184, 82, 0.5)"
          }}></div>
          
          <div className="planet planet-5 absolute w-16 md:w-20 h-16 md:h-20 rounded-full top-[80%] right-[15%] z-0" style={{
            background: "radial-gradient(circle at 40% 40%, #ffb347, #ffcc33)",
            boxShadow: "0 0 30px rgba(255, 179, 71, 0.6)"
          }}>
            <div className="absolute h-1.5 md:h-2.5 bg-[rgba(255,204,51,0.3)] left-[-15px] md:left-[-20px] right-[-15px] md:right-[-20px] rounded-full top-[20px] md:top-[30px] rotate-[-15deg]"></div>
            <div className="absolute h-0.5 md:h-1 bg-[rgba(255,204,51,0.2)] left-[-15px] md:left-[-20px] right-[-15px] md:right-[-20px] rounded-full top-[23px] md:top-[35px] rotate-[-15deg]"></div>
          </div>
        </>
      )}

      <svg 
        id="svg-stage" 
        ref={svgRef} 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 1000 1950" 
        className={`${isMobile ? 'w-full' : 'max-w-full md:max-w-4xl lg:max-w-5xl'} mx-auto block px-2 md:px-5 box-border relative z-10 mt-4 md:mt-8 mb-2 md:mb-4`}
        style={isMobile ? { transform: 'scale(1.1)', transformOrigin: 'center top' } : {}}
      >
        
        {/* Month labels - Smaller text for mobile */}
        <text className="month-label month1" x="40" y="190" fill="#00BFFF" fontSize={isMobile ? "10px" : "14px"} fontWeight="bold" visibility="hidden">MONTH 1</text>
        <text className="month-label month2" x="40" y="360" fill="#00BFFF" fontSize={isMobile ? "10px" : "14px"} fontWeight="bold" visibility="hidden">MONTH 1</text>
        <text className="month-label month3" x="40" y="530" fill="#00BFFF" fontSize={isMobile ? "10px" : "14px"} fontWeight="bold" visibility="hidden">MONTH 2</text>
        <text className="month-label month4" x="40" y="700" fill="#00BFFF" fontSize={isMobile ? "10px" : "14px"} fontWeight="bold" visibility="hidden">MONTH 2</text>
        <text className="month-label month5" x="40" y="870" fill="#00BFFF" fontSize={isMobile ? "10px" : "14px"} fontWeight="bold" visibility="hidden">MONTH 3</text>
        <text className="month-label month6" x="40" y="1040" fill="#00BFFF" fontSize={isMobile ? "10px" : "14px"} fontWeight="bold" visibility="hidden">MONTH 3</text>
        <text className="month-label month7" x="40" y="1210" fill="#00BFFF" fontSize={isMobile ? "10px" : "14px"} fontWeight="bold" visibility="hidden">MONTH 4</text>
        <text className="month-label month8" x="40" y="1380" fill="#00BFFF" fontSize={isMobile ? "10px" : "14px"} fontWeight="bold" visibility="hidden">MONTH 4</text>
        <text className="month-label month9" x="40" y="1550" fill="#00BFFF" fontSize={isMobile ? "10px" : "14px"} fontWeight="bold" visibility="hidden">MONTH 5</text>
        <text className="month-label month10" x="40" y="1670" fill="#00BFFF" fontSize={isMobile ? "10px" : "14px"} fontWeight="bold" visibility="hidden">MONTH 5</text>
        <text className="month-label month11" x="40" y="1790" fill="#00BFFF" fontSize={isMobile ? "10px" : "14px"} fontWeight="bold" visibility="hidden">MONTH 6</text>
        <text className="month-label month12" x="40" y="1890" fill="#00BFFF" fontSize={isMobile ? "10px" : "14px"} fontWeight="bold" visibility="hidden">MONTH 6</text>
        
        {/* Milestone descriptions - Better positioning for mobile */}
        <text className="milestone-text m-text1" x={isMobile ? "200" : "300"} y="190" fill="white" fontSize={isMobile ? "8px" : "10px"} visibility="hidden">Begin Course 1</text>
        <text className="milestone-text m-text2" x={isMobile ? "260" : "360"} y="360" fill="white" fontSize={isMobile ? "8px" : "10px"} visibility="hidden">Grow Through Course 1</text>
        <text className="milestone-text m-text3" x={isMobile ? "260" : "360"} y="530" fill="white" fontSize={isMobile ? "8px" : "10px"} visibility="hidden">Certification 1 Achieved</text>
        <text className="milestone-text m-text4" x={isMobile ? "260" : "360"} y="700" fill="white" fontSize={isMobile ? "8px" : "10px"} visibility="hidden">Start Internship 1</text>
        <text className="milestone-text m-text5" x={isMobile ? "300" : "400"} y="870" fill="white" fontSize={isMobile ? "8px" : "10px"} visibility="hidden">Progress Internship 1</text>
        <text className="milestone-text m-text6" x={isMobile ? "280" : "380"} y="1040" fill="white" fontSize={isMobile ? "8px" : "10px"} visibility="hidden">Complete Internship 1</text>
        <text className="milestone-text m-text7" x={isMobile ? "300" : "400"} y="1210" fill="white" fontSize={isMobile ? "8px" : "10px"} visibility="hidden">Begin Course 2</text>
        <text className="milestone-text m-text8" x={isMobile ? "300" : "400"} y="1380" fill="white" fontSize={isMobile ? "8px" : "10px"} visibility="hidden">Grow Through Course 2</text>
        <text className="milestone-text m-text9" x={isMobile ? "250" : "350"} y="1550" fill="white" fontSize={isMobile ? "8px" : "10px"} visibility="hidden">Certification 2 Achieved</text>
        <text className="milestone-text m-text10" x={isMobile ? "290" : "390"} y="1670" fill="white" fontSize={isMobile ? "8px" : "10px"} visibility="hidden">Start Internship 2</text>
        <text className="milestone-text m-text11" x={isMobile ? "300" : "400"} y="1790" fill="white" fontSize={isMobile ? "8px" : "10px"} visibility="hidden">Progress Internship 2</text>
        <text className="milestone-text m-text12" x={isMobile ? "400" : "500"} y="1890" fill="white" fontSize={isMobile ? "7px" : "10px"} visibility="hidden">Complete Internship 2 & Program Completion</text>
        
        {/* The curved path */}
        <path className="theLine" d="M 150,100
           C 220 200 180 300 200 370
           C 220 440 240 490 260 540
           C 270 600 240 650 250 710
           C 260 780 280 820 300 880
           C 310 950 290 990 280 1050
           C 270 1120 250 1160 260 1220
           C 270 1290 240 1330 230 1390
           C 220 1460 230 1510 240 1560
           C 250 1620 280 1650 290 1680
           C 300 1740 280 1770 260 1800
           C 270 1850 330 1880 380 1900" 
           fill="none" 
           stroke="rgba(0, 195, 255, 0.8)" 
           strokeWidth={isMobile ? "3px" : "4px"} 
           strokeDasharray="3500" 
           strokeDashoffset="3500" 
           strokeLinecap="round" 
           style={{
             filter: "drop-shadow(0 0 8px rgba(0, 174, 255, 0.8))"
           }}
        ></path>
        
        {/* Milestone circles - Smaller on mobile */}
        <circle className="ball ball01" r={isMobile ? "10" : "15"} cx="200" cy="200" fill="white" visibility="hidden"></circle>
        <circle className="ball ball02" r={isMobile ? "10" : "15"} cx="230" cy="370" fill="white" visibility="hidden"></circle>
        <circle className="ball ball03" r={isMobile ? "10" : "15"} cx="260" cy="540" fill="white" visibility="hidden"></circle>
        <circle className="ball ball04" r={isMobile ? "10" : "15"} cx="250" cy="710" fill="white" visibility="hidden"></circle>
        <circle className="ball ball05" r={isMobile ? "10" : "15"} cx="300" cy="880" fill="white" visibility="hidden"></circle>
        <circle className="ball ball06" r={isMobile ? "10" : "15"} cx="280" cy="1050" fill="white" visibility="hidden"></circle>
        <circle className="ball ball07" r={isMobile ? "10" : "15"} cx="260" cy="1220" fill="white" visibility="hidden"></circle>
        <circle className="ball ball08" r={isMobile ? "10" : "15"} cx="230" cy="1390" fill="white" visibility="hidden"></circle>
        <circle className="ball ball09" r={isMobile ? "10" : "15"} cx="240" cy="1560" fill="white" visibility="hidden"></circle>
        <circle className="ball ball10" r={isMobile ? "10" : "15"} cx="290" cy="1680" fill="white" visibility="hidden"></circle>
        <circle className="ball ball11" r={isMobile ? "10" : "15"} cx="260" cy="1800" fill="white" visibility="hidden"></circle>
        <circle className="ball ball12" r={isMobile ? "10" : "15"} cx="380" cy="1900" fill="white" visibility="hidden"></circle>
      </svg>

      <div className="rocket-container absolute" ref={rocketRef}>
        <img className="rocket w-full h-full object-contain origin-center" src="/internity-assets/rocket.gif" alt="rocket" />
      </div>

      <style>
        {`
        .program-structure-section {
          transition: background-color 1.5s ease;
        }
        
        .program-structure-section[data-bg="deep-blue"] {
          background-color: #004080;
        }
        
        .program-structure-section[data-bg="medium-blue"] {
          background-color: #002050;
        }
        
        .program-structure-section[data-bg="light-blue"] {
          background-color: #001030;
        }
        
        .program-structure-section[data-bg="default"] {
          background-color: #000010;
        }
        
        .star {
          position: absolute;
          background-color: white;
          border-radius: 50%;
          animation: twinkle 4s infinite ease-in-out;
        }
        
        @keyframes twinkle {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 1; }
        }
        
        .comet {
          position: absolute;
          width: 4px;
          height: 4px;
          background: white;
          border-radius: 50%;
          z-index: 1;
          animation: comet-fly 35s linear infinite;
          box-shadow: 0 0 20px 6px rgba(255, 255, 255, 0.6);
        }
        
        .comet::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 80px;
          height: 1px;
          background: linear-gradient(to left, white, transparent);
          transform: translateX(-100%);
        }
        
        @keyframes comet-fly {
          0% { transform: translate(-100vw, 100vh); }
          100% { transform: translate(200vw, -100vh); }
        }

        .planet {
          animation: float 15s infinite ease-in-out;
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        `}
      </style>
    </section>
  );
};

export default ProgramStructureSection;

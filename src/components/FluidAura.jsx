export function FluidAura({ isOpen = false, compact = false }) {
  return (
    <svg
      className={`fluid-aura ${isOpen ? 'is-open' : ''} ${compact ? 'is-compact' : ''}`}
      viewBox="0 0 1000 1000"
      role="presentation"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <radialGradient id="cyanGradient" cx="46%" cy="44%" r="62%">
          <stop offset="0%" stopColor="hsl(184 96% 56% / 0.68)" />
          <stop offset="36%" stopColor="hsl(176 92% 54% / 0.50)" />
          <stop offset="54%" stopColor="hsl(178 88% 52% / 0.28)" />
          <stop offset="100%" stopColor="hsl(184 96% 56% / 0)" />
        </radialGradient>

        <radialGradient id="purpleGradient" cx="50%" cy="42%" r="64%">
          <stop offset="0%" stopColor="hsl(250 90% 60% / 0.66)" />
          <stop offset="42%" stopColor="hsl(238 86% 58% / 0.48)" />
          <stop offset="58%" stopColor="hsl(245 82% 56% / 0.26)" />
          <stop offset="100%" stopColor="hsl(250 90% 60% / 0)" />
        </radialGradient>

        <radialGradient id="yellowGradient" cx="52%" cy="54%" r="62%">
          <stop offset="0%" stopColor="hsl(48 96% 58% / 0.56)" />
          <stop offset="42%" stopColor="hsl(44 94% 56% / 0.38)" />
          <stop offset="58%" stopColor="hsl(42 90% 54% / 0.22)" />
          <stop offset="100%" stopColor="hsl(48 96% 58% / 0)" />
        </radialGradient>

        <filter id="fluidDisplace" x="-20%" y="-20%" width="140%" height="140%" colorInterpolationFilters="sRGB">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.012 0.018"
            numOctaves="2"
            seed="4"
            result="noise"
          >
            <animate
            attributeName="baseFrequency"
            dur="10s"
              values="0.012 0.018; 0.022 0.014; 0.014 0.020; 0.012 0.018"
              repeatCount="indefinite"
            />
          </feTurbulence>

          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale="44"
            xChannelSelector="R"
            yChannelSelector="G"
            result="displaced"
          >
            <animate attributeName="scale" dur="8s" values="30;56;38;46" repeatCount="indefinite" />
          </feDisplacementMap>

          <feGaussianBlur in="displaced" stdDeviation="5" />
        </filter>
      </defs>

      <g className="fluid-aura-blob fluid-aura-cyan" filter="url(#fluidDisplace)" opacity="0.86">
        <animateTransform
          attributeName="transform"
          type="translate"
          dur="11s"
          values="-42 -20; -126 -94; -168 -30; -112 52; -70 -58; -42 -20"
          repeatCount="indefinite"
        />
        <path
          fill="url(#cyanGradient)"
          d="M328 470 C288 384 348 294 454 276 C552 260 622 318 638 414 C656 518 580 606 468 626 C382 642 340 558 328 470 Z"
        >
          <animate
            attributeName="d"
            dur="11s"
            values="M328 470 C288 384 348 294 454 276 C552 260 622 318 638 414 C656 518 580 606 468 626 C382 642 340 558 328 470 Z; M298 500 C270 404 362 318 472 292 C578 268 652 352 626 454 C604 550 520 648 416 610 C338 582 314 560 298 500 Z; M318 474 C276 392 342 312 446 288 C548 264 636 324 646 422 C658 524 578 626 460 620 C374 616 332 544 318 474 Z; M352 452 C306 364 380 296 486 282 C592 268 642 340 648 438 C656 546 564 622 458 612 C374 604 338 530 352 452 Z; M340 440 C296 362 374 306 476 294 C584 282 638 356 630 450 C620 548 542 604 438 596 C360 588 324 512 340 440 Z; M328 470 C288 384 348 294 454 276 C552 260 622 318 638 414 C656 518 580 606 468 626 C382 642 340 558 328 470 Z"
            repeatCount="indefinite"
          />
          <animateTransform
            attributeName="transform"
            type="scale"
            additive="sum"
            dur="11s"
            values="0.96; 1.12; 1.18; 1.08; 1.04; 0.96"
            repeatCount="indefinite"
          />
        </path>
      </g>

      <g className="fluid-aura-blob fluid-aura-purple" filter="url(#fluidDisplace)" opacity="0.88">
        <animateTransform
          attributeName="transform"
          type="translate"
          dur="14s"
          begin="-2s"
          values="0 -60; 26 -156; 92 -114; 70 -32; -58 -102; 0 -60"
          repeatCount="indefinite"
        />
        <path
          fill="url(#purpleGradient)"
          d="M418 354 C448 262 568 220 654 284 C748 354 744 480 658 558 C578 630 438 596 394 500 C362 430 390 398 418 354 Z"
        >
          <animate
            attributeName="d"
            dur="14s"
            begin="-2s"
            values="M418 354 C448 262 568 220 654 284 C748 354 744 480 658 558 C578 630 438 596 394 500 C362 430 390 398 418 354 Z; M386 388 C426 282 534 230 640 268 C744 306 772 426 704 532 C638 634 498 638 422 544 C364 474 360 446 386 388 Z; M444 328 C502 248 618 240 690 312 C766 388 724 520 632 584 C544 644 424 592 390 486 C366 410 404 374 444 328 Z; M398 362 C452 270 582 236 664 300 C744 362 742 480 652 548 C568 612 438 574 392 486 C362 428 372 398 398 362 Z; M430 336 C486 256 604 238 684 306 C758 368 730 500 634 564 C544 624 432 580 392 486 C366 424 390 378 430 336 Z; M418 354 C448 262 568 220 654 284 C748 354 744 480 658 558 C578 630 438 596 394 500 C362 430 390 398 418 354 Z"
            repeatCount="indefinite"
          />
          <animateTransform
            attributeName="transform"
            type="rotate"
            additive="sum"
            dur="14s"
            begin="-2s"
            values="0 520 440; 8 520 440; -4 520 440; 5 520 440; -6 520 440; 0 520 440"
            repeatCount="indefinite"
          />
          <animateTransform
            attributeName="transform"
            type="scale"
            additive="sum"
            dur="14s"
            begin="-2s"
            values="0.96; 1.14; 1.1; 1.04; 1.12; 0.96"
            repeatCount="indefinite"
          />
        </path>
      </g>

      <g className="fluid-aura-blob fluid-aura-yellow" filter="url(#fluidDisplace)" opacity="0.82">
        <animateTransform
          attributeName="transform"
          type="translate"
          dur="17s"
          begin="-4s"
          values="20 -60; 104 -108; 62 0; 138 -48; 12 -94; 20 -60"
          repeatCount="indefinite"
        />
        <path
          fill="url(#yellowGradient)"
          d="M548 548 C612 480 728 500 778 586 C828 674 770 772 672 792 C574 812 496 746 498 656 C500 604 516 580 548 548 Z"
        >
          <animate
            attributeName="d"
            dur="17s"
            begin="-4s"
            values="M548 548 C612 480 728 500 778 586 C828 674 770 772 672 792 C574 812 496 746 498 656 C500 604 516 580 548 548 Z; M578 510 C660 456 764 504 790 596 C816 688 744 760 646 760 C548 760 500 692 520 612 C532 566 544 536 578 510 Z; M532 568 C604 500 716 508 770 584 C828 666 782 754 688 790 C588 828 500 756 506 654 C510 616 506 592 532 568 Z; M596 520 C682 484 774 548 780 638 C786 730 708 786 610 758 C528 734 500 660 530 590 C546 556 560 536 596 520 Z; M566 504 C640 438 746 468 782 550 C822 642 760 724 666 742 C574 760 510 704 512 626 C516 574 532 536 566 504 Z; M548 548 C612 480 728 500 778 586 C828 674 770 772 672 792 C574 812 496 746 498 656 C500 604 516 580 548 548 Z"
            repeatCount="indefinite"
          />
          <animateTransform
            attributeName="transform"
            type="rotate"
            additive="sum"
            dur="17s"
            begin="-4s"
            values="0 650 650; -5 650 650; 6 650 650; -3 650 650; 4 650 650; 0 650 650"
            repeatCount="indefinite"
          />
          <animateTransform
            attributeName="transform"
            type="scale"
            additive="sum"
            dur="17s"
            begin="-4s"
            values="0.94; 1.08; 1.16; 1.04; 1.1; 0.94"
            repeatCount="indefinite"
          />
        </path>
      </g>
    </svg>
  );
}

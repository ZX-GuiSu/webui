import { Directive, ElementRef, Renderer2, OnChanges, Input } from '@angular/core';
import { tween, styler, keyframes } from 'popmotion';
import { TweenProps } from 'popmotion/src/animations/tween/types';
import { Value } from 'popmotion/src/reactions/value';
import { Subject } from 'rxjs/Subject';

@Directive({selector: '[animate]'})
export class AnimationDirective implements OnChanges{

  parent: any;
  //@Input() target:ElementRef; //May have to implement this later
  @Input() animation: string;
  @Input() reverse:boolean;

  // Use these for looped animations
  @Input() shake:boolean;
  @Input() shaking: any;
  @Input() colorLoop: string[];
  @Input() colorLoopActive:any;


  private elStyler: any;
  private motion: any; // Stores Tweens
  private inMotion: any; // Stores Tweens running in a loop

  constructor(private elRef: ElementRef, private renderer: Renderer2){ 
  }

  ngOnChanges(changes){
    this.parent = this.elRef.nativeElement;
    this.elStyler = styler(this.parent);

    if(changes.animation){
      this.animate();
    }
    if(changes.shake){
      this.shakeAnimation();
    }

    if(changes.colorLoop){
      //this.parent = this.elRef.nativeElement;
      //this.elStyler = styler(this.parent);
      this.colorLoopAnimation();
    }
  }

  // HELLO WORLD!
  animate(){
    console.log(this.animation);
    switch(this.animation){
      case 'stop':
        console.log("Stopping animations");
        if(this.inMotion){
          console.log(this.inMotion);
          this.inMotion.pause()
        }
      break;
      case 'flipV':
        this.motion = this.flipV();
        this.motion.start(this.elStyler.set);
      break;
      case 'unflipV':
        this.motion = this.flipV(true);
        this.motion.start(this.elStyler.set);
      break;
      case 'flipH':
        this.motion = this.flipH();
        this.motion.start(this.elStyler.set);
      break;
      case 'unflipH':
        this.motion = this.flipH(true);
        this.motion.start(this.elStyler.set);
      break;
      default:
      break;
    }
  }

  shakeAnimation(){
    const s = tween({
      from: { rotate: -1.25, scale:1},
      to: { rotate: 1.25, scale: 1 },
      //ease: easing.easeInOut,
      flip: Infinity,
      duration: 100
    });

    const startShaking = () => { 
      const a = s.start({
        update:this.elStyler.set
      });
      return a;
    }

    if(!this.shaking){
      this.shaking  = startShaking();
    }

    const reset = () => {
      this.shaking.stop();
      this.elStyler.set({rotate:0,scale:1})
    }
    reset();

    if(this.shake){
      console.log("Starting the shaking");
      this.shaking.resume();
    } else if(!this.shake){
      console.log("Stopping the shaking");
      reset();
    }
     //return s;
  }
  
  flipV(reverse?:boolean){
    console.log("**** FLIP ANIMATION ****");

    let start: number;
    let finish: number;

    if(!reverse){
      start = 0;
      finish = -180;
    } else {
      start = -180;
      finish = 0;
    }
    let s = tween({
      from: { rotateX: start, scale:1},
      to: { rotateX: finish, scale: 1 },
      //ease: easing.easeInOut,
      //flip: 0,
      duration: 500
    })
     return s;
  }

  flipH(reverse?:boolean){
    console.log("**** FLIP ANIMATION ****");

    let start: number;
    let finish: number;

    if(!reverse){
      start = 0;
      finish = -180;
    } else {
      start = -180;
      finish = 0;
    }
    let s = tween({
      from: { rotateY: start, scale:1},
      to: { rotateY: finish, scale: 1 },
      //ease: easing.easeInOut,
      //flip: 0,
      duration: 500
    })
     return s;
  }

  colorLoopAnimation(){
    const s = keyframes({
      values: this.colorLoop,
      duration: 60000,
      //ease: easing.linear,
      loop: Infinity,
    });

    const startColorLoop = () => { 
      const a = s.start(this.elStyler.set('background-color'));
      return a;
    }

    if(!this.colorLoopActive && this.colorLoop.length > 0){
      this.colorLoopActive  = startColorLoop();
    }

    const reset = () => {
      this.colorLoopActive.stop();
      this.elStyler.set({'background-color':'rgba(0,0,0,0.15)'})
    }
    reset();

    if(this.colorLoop){
      console.log("Starting the Color Loop");
      this.colorLoopActive.resume();
    } else if(!this.colorLoop){
      console.log("Stopping the Color Loop");
      reset();
    }
     //return s;
  }
}


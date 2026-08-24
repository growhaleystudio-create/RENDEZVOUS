'use client';

import { useEffect, useRef } from 'react';

export default function CustomCursor() {
  const cursorDotRef = useRef(null);
  const cursorFollowerRef = useRef(null);
  const cursorTextRef = useRef(null);

  useEffect(() => {
    // Only run on desktop with fine pointers
    if (typeof window === 'undefined' || window.matchMedia('(pointer: coarse)').matches) {
      return;
    }

    const dot = cursorDotRef.current;
    const follower = cursorFollowerRef.current;
    const cursorText = cursorTextRef.current;
    if (!dot || !follower) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let followerX = mouseX;
    let followerY = mouseY;
    let animationFrameId;

    const onMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
    };

    const render = () => {
      followerX += (mouseX - followerX) * 0.16;
      followerY += (mouseY - followerY) * 0.16;
      follower.style.transform = `translate3d(${followerX}px, ${followerY}px, 0)`;
      animationFrameId = requestAnimationFrame(render);
    };

    window.addEventListener('mousemove', onMouseMove);
    animationFrameId = requestAnimationFrame(render);

    const handleMouseOver = (e) => {
      const target = e.target.closest('[data-cursor], button, a, input, select');
      if (!target) {
        dot.classList.remove('hover');
        follower.classList.remove('hover');
        if (cursorText) cursorText.textContent = '';
        return;
      }

      dot.classList.add('hover');
      follower.classList.add('hover');

      const customText = target.getAttribute('data-cursor');
      if (customText && cursorText) {
        cursorText.textContent = customText;
      }
    };

    document.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseover', handleMouseOver);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <>
      <div className="custom-cursor" ref={cursorDotRef}>
        <span className="custom-cursor-text" ref={cursorTextRef}></span>
      </div>
      <div className="custom-cursor-follower" ref={cursorFollowerRef}></div>
    </>
  );
}

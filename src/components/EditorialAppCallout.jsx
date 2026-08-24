'use client';

import { soundManager } from '@/lib/sounds';

export default function EditorialAppCallout({ onOpenBooking }) {
  return (
    <section className="editorial-giant-statement-section dark-canvas" aria-label="Book via App">
      <div className="container">
        <div className="statement-editorial-inner">
          <h2 className="giant-statement-text-dark">
            <span className="statement-line-italic">or via app</span>
          </h2>

          <div className="editorial-app-callout-grid">
            <div className="editorial-app-badges-group">
              <button
                className="app-store-pill-btn"
                data-cursor="PESAN"
                onClick={() => {
                  soundManager.playClick();
                  onOpenBooking();
                }}
              >
                <i className="fa-solid fa-calendar-check"></i>
                <span>BOOK APPOINTMENT</span>
              </button>
              <a
                href="#locations"
                className="app-store-pill-btn secondary"
                data-cursor="CABANG"
                onClick={() => soundManager.playClick()}
              >
                <i className="fa-solid fa-location-dot"></i>
                <span>5 TORONTO SHOPS</span>
              </a>
            </div>

            <div className="editorial-mono-block">
              <p>
                YOU CAN ALSO FOLLOW THE SAME PROCESS THROUGH OUR BRANDED WEB PORTAL & APP, WHICH KEEPS YOU LOGGED IN SO YOU DON&apos;T HAVE TO ENTER YOUR PERSONAL DETAILS EACH TIME YOU BOOK. ALL APPOINTMENT HISTORY AND DETAILS WILL BE STORED IN ONE EASILY ACCESSIBLE PLACE.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

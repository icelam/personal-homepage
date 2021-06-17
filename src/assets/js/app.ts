import SimpleBar from 'simplebar';
import { getFormattedTime } from '@js/utils/formats';
import typewriterEffect from '@js/typewriterEffect';

/*
 * Elements / Classes
 */
const TIME_DIV_ELEMENT = document.getElementById('time');
const OPTION_PANEL_ELEMENT = document.getElementById('options');
const CREDIT_MODAL_ELEMENT = document.getElementById('credits-modal');
const CREDIT_MODAL_SCROLLABLE_ELEMENT = CREDIT_MODAL_ELEMENT?.querySelector<HTMLElement>('.modal__content');
const CREDIT_MODAL_OPEN_BUTTON = document.getElementById('credits-open-button');
const CREDIT_MODAL_CLOSE_BUTTON = document.getElementById('credits-close-button');

const MODAL_OPEN_CLASS = 'modal--open';

let creditModalScrollBar;

/*
 * Show current time
 */
const showCurrentTime = (): void => {
  const currentDateTime = new Date();
  const newDisplayTime = getFormattedTime(currentDateTime);
  if (TIME_DIV_ELEMENT && newDisplayTime !== TIME_DIV_ELEMENT.innerHTML) {
    TIME_DIV_ELEMENT.innerHTML = newDisplayTime;
  }
};

showCurrentTime();

let showCurrentTimeTimeout: number = window.setInterval(showCurrentTime, 1000);

// Use visibility API to prevent delay of setInterval when page is in background
const onVisibilityChange = (): void => {
  if (document.hidden) {
    window.clearInterval(showCurrentTimeTimeout);
    return;
  }

  showCurrentTime();
  showCurrentTimeTimeout = window.setInterval(showCurrentTime, 1000);
};

document.addEventListener('visibilitychange', onVisibilityChange, false);

/*
 * Modal toggle
 */
const creditModalToggleHandler = () => {
  const shouldCloseCreditModal = CREDIT_MODAL_ELEMENT?.classList.contains(MODAL_OPEN_CLASS);
  CREDIT_MODAL_ELEMENT?.setAttribute('aria-hidden', shouldCloseCreditModal ? 'false' : 'true');

  const creditModalScrollElement = creditModalScrollBar?.getScrollElement();
  if (!shouldCloseCreditModal && creditModalScrollElement) {
    creditModalScrollElement.scrollTop = 0;
  }

  window.document.body.style.overflow = shouldCloseCreditModal ? 'auto' : 'hidden';

  CREDIT_MODAL_ELEMENT?.classList.toggle(MODAL_OPEN_CLASS);
};

[CREDIT_MODAL_OPEN_BUTTON, CREDIT_MODAL_CLOSE_BUTTON].forEach((element) => {
  element?.addEventListener('click', creditModalToggleHandler);
});

/**
 * On app ready
 */
window.addEventListener('load', () => {
  // Remove preload class which blocks css transitions
  window.document.body.classList.remove('preload');

  // Display styled scroll bar
  if (OPTION_PANEL_ELEMENT) {
    // eslint-disable-next-line no-new
    new SimpleBar(
      OPTION_PANEL_ELEMENT,
      { autoHide: false }
    );
  }

  if (CREDIT_MODAL_SCROLLABLE_ELEMENT) {
    creditModalScrollBar = new SimpleBar(
      CREDIT_MODAL_SCROLLABLE_ELEMENT,
      { autoHide: false }
    );
  }

  // Animation: Dialog typewriter + Option panel fade in
  const dialogContent = document.getElementById('dialog-content');
  if (dialogContent) {
    typewriterEffect(dialogContent);
  }
});

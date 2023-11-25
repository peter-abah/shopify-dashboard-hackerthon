function app() {
  // CONSTANTS
  const HIDDEN_CLASS = "hidden";
  const ACTIVE_CLASS = "active";
  const ALERT_INDEX = 0;
  const MENU_INDEX = 1;

  // DOM elements related with the alerts and menu
  const alertsBtn = document.getElementById("alerts-btn");
  const alertsContainer = document.getElementById("alerts");
  const menuBtn = document.getElementById("menu-btn");
  const menu = document.getElementById("menu");
  const menuItems = document.querySelectorAll('[role="menuitem"]');
  const popups = [alertsContainer, menu];
  const popupBtns = [alertsBtn, menuBtn];

  // DOM elements for the callout section
  const callout = document.getElementById("callout");
  const calloutCloseBtn = document.getElementById("callout-close-btn");
  const calloutNotify = document.getElementById("callout-notify");

  // DOM elements for the onboarding steps section
  const toggleSetupBtn = document.getElementById("toggle-setup-btn");
  const setup = document.getElementById("onboarding-steps");
  const toggleSetupNotify = document.getElementById('toggle-setup-notify')

  const toggleOnboardingStepVisibiltyBtns = document.querySelectorAll(".onboarding-step-toggle");
  const onboardingSteps = [...document.querySelectorAll(".onboarding-steps li")];

  const toggleOnboardingStepCompleteBtns = document.querySelectorAll(".check-step-btn");
  const progressbar = document.getElementById("progess-bar");
  const progressCount = document.getElementById("progress-count");

  // Remove all popups from view
  function hidePopups() {
    popups.forEach((popup, index) => {
      popup.classList.add(HIDDEN_CLASS);
      popupBtns[index].setAttribute("aria-expanded", false);
    });
  }

  // Toggle popup visibility
  function togglePopup(event, popupIndex) {
    const popup = popups[popupIndex];
    const popupBtn = popupBtns[popupIndex];
    const isPopupOpen = !popup.classList.contains(HIDDEN_CLASS);
    hidePopups();

    if (!isPopupOpen) {
      popup.classList.remove(HIDDEN_CLASS);
      popupBtn.setAttribute("aria-expanded", true);
      event.stopPropagation();
    }
  }

  // Hide popups when there is a click outside their element
  function hidePopupsOnClickOutside(event) {
    const isAnyPopupClicked = popups.some((popup) => {
      return popup.contains(event.target);
    });
    if (isAnyPopupClicked) {
      return;
    }

    hidePopups();
  }

  function focusFirstMenuItem() {
    menuItems.item(0).focus();
  }

  // Hide popup on escape key press
  function handleEscapeKeyPress(event) {
    if (event.key === "Escape") {
      hidePopups();
    }
  }

  // Move focus to next or previous menu item on arrow key press
  function handleMenuItemKeyPress(event, menuItemIndex) {
    let nextMenuItemIndex;

    if (event.key === "ArrowDown" || event.key === "ArrowRight") {
      // Move to next menu item
      nextMenuItemIndex = modNumber(menuItemIndex + 1, menuItems.length);
    } else if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
      // Move to previous menu item
      nextMenuItemIndex = modNumber(menuItemIndex - 1, menuItems.length);
    } else if (event.key === "Home") {
      // Move to first menu item
      nextMenuItemIndex = 0;
    } else if (event.key === "End") {
      // Move to last menu item
      nextMenuItemIndex = menuItems.length - 1;
    } else {
      // Do nothing on an other key press
      return;
    }

    menuItems.item(nextMenuItemIndex).focus();
  }

  // Toggle visibility of onboarding steps
  function toggleSetup() {
    setup.classList.toggle(HIDDEN_CLASS);

    const isOpen = !setup.classList.contains(HIDDEN_CLASS);
    if (isOpen) {
      toggleSetupNotify.setAttribute("aria-label", "Setup opened");
    } else {
      toggleSetupNotify.setAttribute("aria-label", "Setup closed");
    }

    toggleSetupBtn.setAttribute("aria-expanded", isOpen);
    toggleSetupBtn.dataset.isOpen = isOpen ? "" : true;
  }

  // Hide other onboarding steps and show active one
  function showOnboardingStep(onboardingStepIndex) {
    hideOnboardingSteps();
    onboardingSteps[onboardingStepIndex].classList.add(ACTIVE_CLASS);
    toggleOnboardingStepVisibiltyBtns.item(onboardingStepIndex).setAttribute("aria-expanded", true);
  }

  // Hide other onboarding steps
  function hideOnboardingSteps() {
    onboardingSteps.forEach((el) => el.classList.remove(ACTIVE_CLASS));
    toggleOnboardingStepVisibiltyBtns.forEach((btn) => btn.setAttribute("aria-expanded", false));
  }

  // Update aria attributes for check button for onboarding steps
  function updateARIAForToggleCompleteBtn(toggleBtnIndex) {
    const onboardingStep = onboardingSteps[toggleBtnIndex];
    const isOnboardingStepComplete = !!onboardingStep.dataset.isCompleted;
    const toggleBtn = toggleOnboardingStepCompleteBtns[toggleBtnIndex];
    const toggleNotify = toggleBtn.querySelector(".check-step-btn-notify");

    if (isOnboardingStepComplete) {
      toggleBtn.setAttribute("aria-label", "Mark step incomplete");
      toggleNotify.setAttribute("aria-label", "Setup step marked complete");
    } else {
      toggleNotify.setAttribute("aria-label", "Setup step marked incomplete");
      toggleBtn.setAttribute("aria-label", "Mark step complete");
    }
  }

  // Toggle onboarding step complete, update progress indicator and open next
  // uncompleted onboarding step
  function toggleOnboardingStepComplete(toggleBtnIndex) {
    const onboardingStep = onboardingSteps[toggleBtnIndex];
    const isOnboardingStepComplete = !!onboardingStep.dataset.isCompleted;
    onboardingStep.dataset.isCompleted = isOnboardingStepComplete ? "" : true;

    updateProgressBar();
    updateARIAForToggleCompleteBtn(toggleBtnIndex);

    const nextStepIndex = findNextUncompletedStepIndex(onboardingSteps);
    if (nextStepIndex !== -1) {
      showOnboardingStep(nextStepIndex);
    }
  }

  // Return index of next uncompleted onboarding step
  function findNextUncompletedStepIndex(onboardingSteps) {
    const nextStepIndex = onboardingSteps.findIndex((step) => !step.dataset.isCompleted);
    return nextStepIndex;
  }

  // Update progress count and indicator
  function updateProgressBar() {
    const completedStepsNo = onboardingSteps.filter((step) => step.dataset.isCompleted).length;
    progressbar.style.width = `${completedStepsNo * 20}%`;
    progressCount.innerText = completedStepsNo;
  }

  // Modulus function that works with negative numbers
  function modNumber(num, n) {
    return ((num % n) + n) % n;
  }

  // Toggle alerts visibility on alerts button click
  alertsBtn.addEventListener("click", (event) => {
    togglePopup(event, ALERT_INDEX);
  });

  // Toggle menu visibility on menu button click
  menuBtn.addEventListener("click", (event) => {
    togglePopup(event, MENU_INDEX);

    const isMenuOpen = !menu.classList.contains(HIDDEN_CLASS);
    if (isMenuOpen) {
      focusFirstMenuItem();
    }
  });

  // Close popups on escape key press
  popups.forEach((popup) => {
    popup.addEventListener("keyup", handleEscapeKeyPress);
  });
  alertsBtn.addEventListener("keyup", handleEscapeKeyPress);

  // Handle menu item focus on key press
  menuItems.forEach((menuItem, index) =>
    menuItem.addEventListener("keyup", (event) => handleMenuItemKeyPress(event, index))
  );

  document.addEventListener("click", hidePopupsOnClickOutside);

  // Hide callout
  calloutCloseBtn.addEventListener("click", () => {
    callout.classList.add(HIDDEN_CLASS);
    calloutNotify.setAttribute("aria-label", "Callout removed");
  });

  toggleSetupBtn.addEventListener("click", toggleSetup);
  toggleOnboardingStepVisibiltyBtns.forEach((btn, btnIndex) => {
    btn.addEventListener("click", () => showOnboardingStep(btnIndex));
  });

  toggleOnboardingStepCompleteBtns.forEach((btn, btnIndex) => {
    btn.addEventListener("click", () => toggleOnboardingStepComplete(btnIndex));
  });
}

app();

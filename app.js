function app() {
  // CONSTANTS
  const HIDDEN_CLASS = "hidden";
  const ACTIVE_CLASS = "active";
  const ALERT_INDEX = 0;
  const MENU_INDEX = 1;

  // DOM elements related with the alerts and menu
  const alertsBtn = document.getElementById("alerts-btn");
  const alertsContainer = document.getElementById("alerts");
  const alertsARIANotification = document.getElementById("alerts-notify");

  const menuBtn = document.getElementById("menu-btn");
  const menu = document.getElementById("menu");
  const menuItems = document.querySelectorAll('[role="menuitem"]');
  const menuARIANotification = document.getElementById("menu-notify");

  const popups = [alertsContainer, menu];
  const popupBtns = [alertsBtn, menuBtn];
  const popupsARIANotification = [alertsARIANotification, menuARIANotification];

  // DOM elements for the callout section
  const callout = document.getElementById("callout");
  const calloutCloseBtn = document.getElementById("callout-close-btn");
  const calloutARIANotification = document.getElementById("callout-notify");

  // DOM elements for the setup steps section
  const toggleSetupBtn = document.getElementById("toggle-setup-btn");
  const setup = document.getElementById("setup");
  const toggleSetupARIANotification = document.getElementById("toggle-setup-notify");

  const toggleSetupStepVisibiltyBtns = document.querySelectorAll(".setup-step-toggle");
  const setupSteps = [...document.querySelectorAll(".setup-step")];
  const setupStepsARIANotifications = document.querySelectorAll(".setup-step-notify");

  const toggleSetupStepCompleteBtns = document.querySelectorAll(".check-step-btn");
  const toggleCompleteARIANotifications = document.querySelectorAll(".check-step-btn-notify");
  const progressbar = document.getElementById("progess-bar");
  const progressCount = document.getElementById("progress-count");

  // Remove all popups from view
  function hidePopups() {
    popups.forEach((popup, index) => {
      const isPopupOpen = !popup.classList.contains(HIDDEN_CLASS);
      if (!isPopupOpen) {
        return;
      }

      popup.classList.add(HIDDEN_CLASS);
      popupBtns[index].setAttribute("aria-expanded", false);
      const popupARIANotification = popupsARIANotification[index];
      popupARIANotification.setAttribute("aria-label", popupARIANotification.dataset.closeLabel);
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
      const popupARIANotification = popupsARIANotification[popupIndex];
      popupARIANotification.setAttribute("aria-label", popupARIANotification.dataset.openLabel);
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

  // Toggle visibility of setup steps
  function toggleSetup() {
    setup.classList.toggle(HIDDEN_CLASS);

    const isOpen = !setup.classList.contains(HIDDEN_CLASS);
    if (isOpen) {
      toggleSetupARIANotification.setAttribute("aria-label", "Setup opened");
    } else {
      toggleSetupARIANotification.setAttribute("aria-label", "Setup closed");
    }

    toggleSetupBtn.setAttribute("aria-expanded", isOpen);
    toggleSetupBtn.dataset.isOpen = isOpen ? "" : true;
  }

  // Hide other setup steps and show active one
  function showSetupStep(setupStepIndex) {
    hideSetupSteps();
    setupSteps[setupStepIndex].classList.add(ACTIVE_CLASS);

    const setupStepARIANotification = setupStepsARIANotifications.item(setupStepIndex);
    setupStepARIANotification.setAttribute("aria-label", `Setup step ${setupStepIndex + 1} opened`);

    toggleSetupStepVisibiltyBtns.item(setupStepIndex).setAttribute("aria-expanded", true);
  }

  // Hide other setup steps
  function hideSetupSteps() {
    setupSteps.forEach((el, index) => {
      const isClosed = !el.classList.contains(ACTIVE_CLASS);
      if (isClosed) {
        return;
      }

      el.classList.remove(ACTIVE_CLASS);
      setupStepsARIANotifications
        .item(index)
        .setAttribute("aria-label", `Setup step ${index + 1} closed`);
    });

    toggleSetupStepVisibiltyBtns.forEach((btn) => btn.setAttribute("aria-expanded", false));
  }

  // Update aria attributes for check button for setup steps
  function updateARIAForToggleCompleteBtn(toggleBtnIndex) {
    const setupStep = setupSteps[toggleBtnIndex];
    const isSetupStepComplete = !!setupStep.dataset.isCompleted;
    const toggleBtn = toggleSetupStepCompleteBtns[toggleBtnIndex];
    const toggleCompleteARIANotification = toggleCompleteARIANotifications.item(toggleBtnIndex);

    if (isSetupStepComplete) {
      toggleBtn.setAttribute("aria-label", "Mark step incomplete");
      toggleCompleteARIANotification.setAttribute("aria-label", "Setup step marked complete");
    } else {
      toggleCompleteARIANotification.setAttribute("aria-label", "Setup step marked incomplete");
      toggleBtn.setAttribute("aria-label", "Mark step complete");
    }
  }

  // Toggle setup step complete, update progress indicator and open next
  // uncompleted setup step
  function toggleSetupStepComplete(toggleBtnIndex) {
    const setupStep = setupSteps[toggleBtnIndex];
    const isSetupStepComplete = !!setupStep.dataset.isCompleted;
    setupStep.dataset.isCompleted = isSetupStepComplete ? "" : true;

    updateProgressBar();
    updateARIAForToggleCompleteBtn(toggleBtnIndex);

    const nextStepIndex = findNextUncompletedStepIndex(setupSteps);
    if (nextStepIndex !== -1) {
      showSetupStep(nextStepIndex);
    }
  }

  // Return index of next uncompleted setup step
  function findNextUncompletedStepIndex(setupSteps) {
    const nextStepIndex = setupSteps.findIndex((step) => !step.dataset.isCompleted);
    return nextStepIndex;
  }

  // Update progress count and indicator
  function updateProgressBar() {
    const completedStepsNo = setupSteps.filter((step) => step.dataset.isCompleted).length;
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
    calloutARIANotification.setAttribute("aria-label", "Callout removed");
  });

  toggleSetupBtn.addEventListener("click", toggleSetup);
  toggleSetupStepVisibiltyBtns.forEach((btn, btnIndex) => {
    btn.addEventListener("click", () => showSetupStep(btnIndex));
  });

  toggleSetupStepCompleteBtns.forEach((btn, btnIndex) => {
    btn.addEventListener("click", () => toggleSetupStepComplete(btnIndex));
  });
}

app();
